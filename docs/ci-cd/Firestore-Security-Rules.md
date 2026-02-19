# Firestore Security Rules

This document outlines the security rules for the Farm-Link Zambia Firestore database.

## Development Rules (Test Mode)

During development, use these permissive rules (NOT FOR PRODUCTION):

```firestore-rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Production Rules (Recommended)

For production, implement these security rules:

```firestore-rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId &&
                      isValidUser(request.resource.data);
    }

    // Anyone can read crops (public data), only admin can write
    match /crops/{cropId} {
      allow read: if true;
      allow write: if request.auth.token.admin == true &&
                      isValidCrop(request.resource.data);
    }

    // Users can only read their own advice history
    match /advice/{docId} {
      allow read: if request.auth.uid == resource.data.uid;
      allow write: if request.auth.uid == resource.data.uid &&
                      isValidAdvice(request.resource.data);
    }

    // Anyone can read pests/diseases (public data), only admin can write
    match /pests/{pestId} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    match /diseases/{diseaseId} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    // Anyone can read weather data, server writes only
    match /weatherData/{weatherId} {
      allow read: if true;
      allow write: if false; // Only backend (via service account) can write
    }

    // Anyone can read market prices, server writes only
    match /marketPrices/{priceId} {
      allow read: if true;
      allow write: if false; // Only backend (via service account) can write
    }
  }

  // Helper functions for validation
  function isValidUser(data) {
    return data.size() > 0 &&
           data.email is string &&
           data.email.size() > 0;
  }

  function isValidCrop(data) {
    return data.size() > 0 &&
           data.name is string &&
           data.name.size() > 0;
  }

  function isValidAdvice(data) {
    return data.size() > 0 &&
           data.queryText is string &&
           data.responseText is string &&
           data.uid is string;
  }
}
```

## Deploy Rules

### Using Firebase CLI

```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy specific rules file
firebase deploy --only firestore:rules --project staging

# Validate rules before deploying
firebase deploy --only firestore:rules --dry-run
```

### Using Firebase Console

1. Go to **Firestore Database** > **Rules** tab
2. Edit rules in the editor
3. Click **Publish** to deploy

## Admin Setup

To set up admin privileges:

1. Go to **Authentication** in Firebase Console
2. Click on a user
3. Go to **Custom Claims**
4. Add: `{ "admin": true }`

Or programmatically from Cloud Functions:

```typescript
import * as admin from 'firebase-admin'

export async function setAdminClaim(userId: string) {
  await admin.auth().setCustomUserClaims(userId, { admin: true })
}
```

## Testing Rules

Use the Firestore Rules Playground:

```bash
firebase emulators:start

# The emulator UI will be available at http://localhost:4000
```

In the emulator:

1. Go to **Firestore** emulator
2. Test read/write operations
3. Switch auth context to test as different users

---

## Rule Breakdown

### Public Collections

- **crops**: Anyone can read, admins write
- **pests**: Anyone can read, admins write
- **diseases**: Anyone can read, admins write
- **weatherData**: Anyone can read, backend writes
- **marketPrices**: Anyone can read, backend writes

### User-Specific Collections

- **users**: Users can only access their own profile
- **advice**: Users can only access their own advice history

### Backend-Only Writes

- **weatherData** and **marketPrices** are updated by backend Cloud Functions only
- This ensures data integrity and prevents unauthorized modifications

---

## Adding More Granular Permissions

For future features, you can add:

```firestore-rules
// Premium features
match /premiumFeatures/{featureId} {
  allow read: if request.auth.token.premiumUser == true;
  allow write: if request.auth.token.admin == true;
}

// Admin logs
match /adminLogs/{logId} {
  allow read: if request.auth.token.admin == true;
  allow write: if false; // Write via service account only
}

// Feedback collection
match /feedback/{feedbackId} {
  allow read: if request.auth.token.admin == true;
  allow create: if request.auth.uid != null && isValidFeedback(request.resource.data);
  allow update: if false;
  allow delete: if request.auth.token.admin == true;
}
```

---

## Monitoring and Alerts

Monitor Firestore usage and set up alerts:

1. Go to **Cloud Console** > **Monitoring**
2. Create alerts for:
   - High read/write operations
   - Security rule violations
   - Quota usage

---

## References

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/start)
- [Security Rules Best Practices](https://firebase.google.com/docs/firestore/security/rules-query)
- [Custom Claims](https://firebase.google.com/docs/auth/admin-sdk-setup#setting_additional_claims_on_an_existing_user)
