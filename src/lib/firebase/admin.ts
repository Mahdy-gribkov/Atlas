import { initializeApp, getApps, cert, ServiceAccount, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let app: App;
let adminAuth: any;
let adminDb: any;

export async function initializeFirebaseAdmin(): Promise<{
  adminAuth: any;
  adminDb: any;
}> {
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID) {
    throw new Error('FIREBASE_ADMIN_PROJECT_ID is required');
  }
  
  if (!process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
    throw new Error('FIREBASE_ADMIN_CLIENT_EMAIL is required');
  }
  
  if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    throw new Error('FIREBASE_ADMIN_PRIVATE_KEY is required');
  }

  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };

  if (getApps().length === 0) {
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    });
  } else {
    app = getApps()[0]!;
  }

  adminAuth = getAuth(app);
  adminDb = getFirestore(app);

  return { adminAuth, adminDb };
}

// Initialize immediately if in production
if (process.env.NODE_ENV === 'production') {
  initializeFirebaseAdmin().catch((error) => {
    console.error('Failed to initialize Firebase Admin:', error);
    process.exit(1);
  });
}

export { adminAuth, adminDb };
