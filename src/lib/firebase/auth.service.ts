// Firebase Auth Service - Direct Firebase Authentication
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export interface AtlasUser {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'premium' | 'admin';
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  dataSharing: boolean;
  analytics: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  acceptTerms: boolean;
}

class FirebaseAuthService {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');
  }

  // Sign in with email and password
  async signInWithEmail(credentials: SignInCredentials): Promise<{ success: boolean; user?: AtlasUser; error?: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );

      const atlasUser = await this.getUserData(userCredential.user.uid);
      return { success: true, user: atlasUser };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Sign up with email and password
  async signUpWithEmail(credentials: SignUpCredentials): Promise<{ success: boolean; user?: AtlasUser; error?: string }> {
    try {
      if (credentials.password !== credentials.confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: credentials.name
      });

      // Create user document in Firestore
      const atlasUser = await this.createUserDocument(userCredential.user, credentials.name);
      
      return { success: true, user: atlasUser };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<{ success: boolean; user?: AtlasUser; error?: string }> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      const user = result.user;

      // Check if user document exists, create if not
      let atlasUser = await this.getUserData(user.uid);
      if (!atlasUser) {
        atlasUser = await this.createUserDocument(user, user.displayName || user.email || 'User');
      }

      return { success: true, user: atlasUser };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Sign out
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Get user data from Firestore
  async getUserData(uid: string): Promise<AtlasUser | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid,
          email: data.email,
          name: data.name,
          role: data.role || 'user',
          preferences: data.preferences || this.getDefaultPreferences(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Create user document in Firestore
  async createUserDocument(user: User, name: string): Promise<AtlasUser> {
    const atlasUser: AtlasUser = {
      uid: user.uid,
      email: user.email || '',
      name: name,
      role: 'user',
      preferences: this.getDefaultPreferences(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: atlasUser.email,
        name: atlasUser.name,
        role: atlasUser.role,
        preferences: atlasUser.preferences,
        createdAt: atlasUser.createdAt,
        updatedAt: atlasUser.updatedAt,
      });
    } catch (error) {
      console.error('Error creating user document:', error);
    }

    return atlasUser;
  }

  // Get default user preferences
  private getDefaultPreferences(): UserPreferences {
    return {
      language: 'en',
      currency: 'USD',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false,
      },
      privacy: {
        profileVisibility: 'private',
        dataSharing: false,
        analytics: true,
      },
    };
  }

  // Convert Firebase error codes to user-friendly messages
  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<AtlasUser>): Promise<{ success: boolean; error?: string }> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }
}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
