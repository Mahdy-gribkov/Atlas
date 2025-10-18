'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from '@/lib/firebase/config';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
  loading: true,
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Initialize Firebase app
      let firebaseApp: FirebaseApp;
      if (getApps().length === 0) {
        firebaseApp = initializeApp(firebaseConfig);
      } else {
        const existingApp = getApps()[0];
        if (!existingApp) {
          firebaseApp = initializeApp(firebaseConfig);
        } else {
          firebaseApp = existingApp;
        }
      }

      // Initialize services
      const firebaseAuth = getAuth(firebaseApp);
      const firestore = getFirestore(firebaseApp);

      setApp(firebaseApp);
      setAuth(firebaseAuth);
      setDb(firestore);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, auth, db, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
