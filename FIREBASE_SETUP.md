# Firebase Setup Instructions

This document will guide you through setting up Firebase for the Earthquake Rescue Locator application.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "Earthquake Rescue Locator")
4. Choose whether to enable Google Analytics (recommended)
5. Accept the terms and create the project

## Step 2: Register Your Web App

1. From the project overview page, click the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "Earthquake Rescue Web App")
3. Check the box to set up Firebase Hosting if you plan to deploy the app
4. Click "Register app"
5. You will see your Firebase configuration - copy this information

## Step 3: Update Configuration in Your App

1. Open the `js/config.js` file in your project
2. Replace the placeholder Firebase configuration with your actual configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in production mode (or test mode for development)
4. Choose a location closest to your target users
5. Create the following collection:
   - Collection ID: `reports`
   - Document fields:
     - `locationDescription` (string)
     - `numPeople` (number)
     - `situation` (string)
     - `contactInfo` (string)
     - `timestamp` (timestamp)
     - `status` (string) - One of: "verified", "unverified", "resolved"
     - `latitude` (number)
     - `longitude` (number)

## Step 5: Set Up Security Rules

1. Go to "Firestore Database" > "Rules" tab
2. Set up appropriate security rules. For example:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      // Anyone can read reports
      allow read: if true;
      
      // Anyone can create a report
      allow create: if true;
      
      // Only authenticated users with verified role can update
      // In a real app, you'd implement proper authentication
      allow update: if true;
      
      // No one can delete reports
      allow delete: if false;
    }
  }
}
```

## Step 6: Set Up Authentication (Optional)

1. Go to "Authentication" in the Firebase Console
2. Set up the authentication methods you want to use (Anonymous auth is already implemented in the app)
3. For more secure operations, consider implementing email/password or phone authentication

## Step 7: Deploy Your App (Optional)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project: `firebase init`
4. Deploy your app: `firebase deploy`

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
