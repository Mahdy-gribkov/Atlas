export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
};

// Check if we're in development mode and using demo config
export const isDemoMode = process.env.NODE_ENV === 'development' && 
  (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'demo-api-key');

// Only validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'demo-api-key') {
    throw new Error('NEXT_PUBLIC_FIREBASE_API_KEY is required in production');
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN === 'demo-project.firebaseapp.com') {
    throw new Error('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required in production');
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'demo-project') {
    throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is required in production');
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET === 'demo-project.appspot.com') {
    throw new Error('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is required in production');
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID === '123456789') {
    throw new Error('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is required in production');
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID === '1:123456789:web:abcdef123456') {
    throw new Error('NEXT_PUBLIC_FIREBASE_APP_ID is required in production');
  }
}

export const useEmulator = process.env.NODE_ENV === 'development' && 
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';