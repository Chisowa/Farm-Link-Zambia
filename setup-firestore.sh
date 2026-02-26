#!/bin/bash
# Farm-Link Zambia - Firestore Complete Setup Script
# This script initializes Firestore and seeds the initial data

set -e  # Exit on any error

echo "🌾 Farm-Link Zambia - Firestore Setup"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if firebase CLI is available
echo -e "${YELLOW}Step 1: Checking Firebase CLI...${NC}"
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found. Installing...${NC}"
    npm install -g firebase-tools
else
    FIREBASE_VERSION=$(firebase --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✅ Firebase CLI found: $FIREBASE_VERSION${NC}"
fi

echo ""

# Step 2: Verify Firebase project
echo -e "${YELLOW}Step 2: Verifying Firebase project...${NC}"
CURRENT_PROJECT=$(firebase use 2>/dev/null | grep -o "farmlink-zambia" || echo "")
if [ "$CURRENT_PROJECT" = "farmlink-zambia" ]; then
    echo -e "${GREEN}✅ Connected to farmlink-zambia${NC}"
else
    echo -e "${YELLOW}Setting Firebase project to farmlink-zambia...${NC}"
    firebase use farmlink-zambia || echo "Could not auto-select project - you may need to select it manually"
fi

echo ""

# Step 3: Initialize dependencies
echo -e "${YELLOW}Step 3: Installing Node dependencies...${NC}"
cd "$(dirname "$0")/apps/functions"
npm install --save firebase-admin 2>/dev/null || echo "Firebase-admin already installed"
cd - > /dev/null
echo -e "${GREEN}✅ Dependencies ready${NC}"

echo ""

# Step 4: Deploy Firestore rules
echo -e "${YELLOW}Step 4: Deploying Firestore Security Rules...${NC}"
cd "$(dirname "$0")"
if [ -f "firestore.rules" ]; then
    firebase deploy --only firestore:rules 2>/dev/null && echo -e "${GREEN}✅ Rules deployed${NC}" || echo -e "${YELLOW}⚠️ Rules deployment may need manual review${NC}"
else
    echo -e "${RED}❌ firestore.rules not found${NC}"
fi

echo ""

# Step 5: Run initialization script
echo -e "${YELLOW}Step 5: Seeding initial crop data...${NC}"
cd "$(dirname "$0")/apps/functions"

# Check if we have a service account key
if [ ! -f "../../firebase-service-key.json" ] && [ ! -f "/.firebase/firebase-key.json" ]; then
    echo -e "${YELLOW}⚠️ Firebase service account key not found${NC}"
    echo "You have two options:"
    echo "1. Download the service account key from Firebase Console:"
    echo "   - Go to Firebase Console > Settings > Service Accounts"
    echo "   - Click 'Generate New Private Key'"
    echo "   - Save as 'firebase-service-key.json' in project root"
    echo ""
    echo "2. Use Firebase Emulator for local development:"
    echo "   - Run: firebase emulators:start"
    echo ""
    echo "For now, continuing with direct authentication..."
fi

# Run the init script with npx (using ts-node)
npx ts-node src/scripts/firestore-init.ts 2>&1 || {
    echo -e "${RED}❌ Initialization failed${NC}"
    echo "Troubleshooting: Make sure you're authenticated with Firebase:"
    echo "  firebase login"
    exit 1
}

cd - > /dev/null

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Sign in to your app with a test account"
echo "2. Go to Dashboard > Profile"  
echo "3. Edit your name and click 'Save Changes'"
echo "4. Verify the changes save (should no longer show loading forever)"
echo "5. Refresh the page - you should stay on dashboard (not go to landing)"
echo ""
echo "If you encounter issues, check:"
echo "- Firebase Console > Firestore > Collections (should see 'crops' collection)"
echo "- Browser DevTools > Console for error messages"
echo ""
