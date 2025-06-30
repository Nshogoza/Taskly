# Taskly Backend (Firebase)

## Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Enable Authentication (Email/Password) and Firestore Database.

2. **Set Environment Variables**
   Add the following to your `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Deploy Firestore Security Rules**
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Initialize (if not done): `firebase init`
   - Deploy rules: `firebase deploy --only firestore:rules`

4. **Using the Backend Modules**
   - `backend/firebase.ts`: Firebase initialization
   - `backend/auth.ts`: User authentication (sign up, sign in, sign out, user state)
   - `backend/tasks.ts`: Task CRUD and real-time sync

## Features
- User authentication (Email/Password)
- Task CRUD operations (Create, Read, Update, Delete)
- Real-time updates and offline sync
- Secure Firestore access rules

## Notes
- Make sure to use the exported functions in your frontend for all backend operations.
- Offline sync is enabled by default in Firestore setup. 