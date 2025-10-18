import { initializeApp, getApps, cert, ServiceAccount, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let app: App;
let adminAuth: any;
let adminDb: any;

// Skip Firebase Admin initialization during build
if (process.env.NODE_ENV !== 'production' && !process.env.FIREBASE_ADMIN_PROJECT_ID) {
  console.log('Skipping Firebase Admin initialization for development');
  adminAuth = null;
  adminDb = null;
} else {
  try {
    if (getApps().length === 0) {
      // Only initialize if we have valid credentials
      if (process.env.FIREBASE_ADMIN_PROJECT_ID && 
          process.env.FIREBASE_ADMIN_CLIENT_EMAIL && 
          process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
        const serviceAccount: ServiceAccount = {
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };

        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        });
      } else {
        // Create a mock app for development
        app = initializeApp({
          projectId: 'demo-project',
        });
      }
    } else {
      app = getApps()[0]!;
    }

    adminAuth = getAuth(app);
    adminDb = getFirestore(app);
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error);
    // Create mock services for development
    adminAuth = null;
    adminDb = null;
  }
}

export { adminAuth, adminDb };
