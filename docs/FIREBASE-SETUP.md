# Firebase Authentication Setup & Next Steps

## ✅ What Was Just Enabled

1. **Firebase SDK Integration** - Firebase Auth, Firestore, and Storage configured
2. **Real Authentication** - Login and signup now work with Firebase
3. **User Profile Data** - User profiles are saved in Firestore
4. **Error Handling** - Firebase errors are caught and displayed to users

---

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd apps/web
pnpm install
```

This installs the Firebase SDK that was added to package.json.

### 2. Run Your App

```bash
# From root directory
pnpm dev
```

Your app will be available at `http://localhost:5173`

### 3. Test Authentication

- Go to the landing page
- Click "Get Started Free" to sign up
- Create a new account
- Check your Firestore console - you should see a new user!

---

## 📝 Firebase Console Access

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **farm-link-zambia**
3. Navigate to:
   - **Authentication** - See registered users
   - **Firestore** - See user profiles being saved
   - **Emulator Suite** (optional) - Use for local testing

### Expected Firestore Structure After Signup

```
users/
  └── {uid}  # Firebase user ID
      ├── id: string (same as uid)
      ├── email: "user@example.com"
      ├── name: "User Name"
      └── location: ""
```

---

## 🛠️ What to Work On Next

### **Priority 1: Static Data** (Start This Week)

Populate Firestore with static data while RAG is being built:

1. **Create Firestore seed data** - Crops, pests, diseases info
2. **Implement crop/pest/disease tRPC procedures** - Replace dummy data with real queries
3. **Connect frontend pages** - Update CropsPage to use real data

See [PARALLEL-WORK.md](./PARALLEL-WORK.md) for detailed roadmap.

### **Priority 2: Data Collection** (Week 2-3)

- Create `scripts/seedFirestore.ts` to populate initial data
- Define Firestore collections structure
- Add search/filter features

### **Priority 3: Weather Integration** (Week 3)

- Choose weather API (Open-Meteo recommended - free)
- Create Cloud Function for weather.getForecast
- Connect WeatherPage to real data

### **Priority 4: Testing** (Week 4+)

- Write unit tests for authentication flows
- Component tests for login/signup pages
- E2E tests with Playwright

---

## 🔗 Connected Features

These features are now fully working with Firebase:

✅ **Sign Up**

- Creates Firebase Auth account
- Saves user profile to Firestore
- Logs them in automatically

✅ **Log In**

- Verifies credentials with Firebase
- Fetches user profile from Firestore
- Persistent login (survives page refresh)

✅ **Update Profile**

- Updates user info in Firestore
- Changes reflected immediately in app

✅ **Log Out**

- Signs out from Firebase
- Returns to landing page

---

## 📋 Still Using Placeholder Data

These pages/features still have mock data until backend integration:

⚠️ **AI Advisory** - Waiting for RAG engine (teammate is building)
⚠️ **Crops Page** - Using 6 mock crops
⚠️ **Weather Page** - Using mock forecast data
⚠️ **Pest/Disease Pages** - Not yet created

---

## 🐛 Troubleshooting

### "Cannot find module 'firebase/...'"

```bash
# Run install again
pnpm install

# If still broken, clear cache
pnpm install --force
```

### Login works but no user profile appears

1. Check Firebase console - User should exist in Authentication
2. Check Firestore - Look in `users` collection
3. Check browser console for errors (F12)
4. Recreate account and watch for errors

### Emulator connection errors

The auth context will auto-connect to Firebase emulator in dev mode if running:

```bash
firebase emulators:start
```

If you get "Emulator already connected" messages, that's fine - it just means it tried to connect twice.

---

## 📚 Useful Links

- [Firebase Admin Console](https://console.firebase.google.com/)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [tRPC Docs](https://trpc.io/docs)
- [React Query Docs](https://tanstack.com/query/latest)

---

## 💾 Environment Variables

Your Firebase configuration is hardcoded in `src/lib/firebase.ts` (for development).

When ready to deploy:

1. Move credentials to `.env.local`:

```env
VITE_FIREBASE_API_KEY=AIzaSyDgyiSY...
VITE_FIREBASE_PROJECT_ID=farmlink-zambia
# etc.
```

2. Update `src/lib/firebase.ts` to use `import.meta.env.VITE_*`

---

## 🎯 Success Indicators

You'll know everything is working when:

1. ✅ Can sign up with new email/password
2. ✅ User appears in Firebase Authentication tab
3. ✅ User profile appears in Firestore `users` collection
4. ✅ Can log in with same credentials
5. ✅ Profile persists when you refresh page
6. ✅ Can update location in profile page
7. ✅ Can log out and go back to login page

---

## 🤔 Next Meeting Topics

Discuss with your teammate:

1. **RAG Engine Timeline** - When will advice.askAI be ready?
2. **Firestore Structure** - Agree on crops/pests/diseases schemas
3. **Farmers API** - Any weather API to integrate?
4. **Testing Strategy** - How to test with mocked tRPC?

---

**Ready to build static data collections?** → See [PARALLEL-WORK.md](./PARALLEL-WORK.md)

Good luck! 🌾
