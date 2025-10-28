"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { firebaseAuthService, AtlasUser } from '@/lib/firebase/auth.service';

interface AuthContextType {
  user: AtlasUser | null;
  firebaseUser: User | null;
  loading: boolean;
  signInWithEmail: (credentials: { email: string; password: string }) => Promise<{ success: boolean; user?: AtlasUser; error?: string }>;
  signUpWithEmail: (credentials: { email: string; password: string; confirmPassword: string; name: string; acceptTerms: boolean }) => Promise<{ success: boolean; user?: AtlasUser; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; user?: AtlasUser; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<AtlasUser>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AtlasUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Get user data from Firestore
        const atlasUser = await firebaseAuthService.getUserData(firebaseUser.uid);
        setUser(atlasUser);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (credentials: { email: string; password: string }) => {
    return await firebaseAuthService.signInWithEmail(credentials);
  };

  const signUpWithEmail = async (credentials: { email: string; password: string; confirmPassword: string; name: string; acceptTerms: boolean }) => {
    return await firebaseAuthService.signUpWithEmail(credentials);
  };

  const signInWithGoogle = async () => {
    return await firebaseAuthService.signInWithGoogle();
  };

  const signOut = async () => {
    return await firebaseAuthService.signOut();
  };

  const resetPassword = async (email: string) => {
    return await firebaseAuthService.resetPassword(email);
  };

  const updateProfile = async (updates: Partial<AtlasUser>) => {
    if (!firebaseUser) {
      return { success: false, error: 'No user logged in' };
    }
    return await firebaseAuthService.updateUserProfile(firebaseUser.uid, updates);
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth() {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to sign in page
      window.location.href = '/signin';
    }
  }, [user, loading]);

  return { user, loading };
}
