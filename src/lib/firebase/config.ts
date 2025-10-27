export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate required environment variables
if (!firebaseConfig.apiKey) {
  throw new Error('NEXT_PUBLIC_FIREBASE_API_KEY is required');
}
if (!firebaseConfig.authDomain) {
  throw new Error('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required');
}
if (!firebaseConfig.projectId) {
  throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is required');
}
if (!firebaseConfig.storageBucket) {
  throw new Error('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is required');
}
if (!firebaseConfig.messagingSenderId) {
  throw new Error('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is required');
}
if (!firebaseConfig.appId) {
  throw new Error('NEXT_PUBLIC_FIREBASE_APP_ID is required');
}

export const useEmulator = process.env.NODE_ENV === 'development' && 
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';