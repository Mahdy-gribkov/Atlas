// Authentication Service
import { signIn, signOut, getSession } from 'next-auth/react';
import { SignInCredentials, SignUpCredentials, User } from '../types/auth';

export class AuthService {
  static async signIn(credentials: SignInCredentials) {
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return { success: true, user: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  }

  static async signUp(credentials: SignUpCredentials) {
    try {
      // TODO: Implement sign up logic with Firebase
      // This would typically involve creating a user account
      // and then signing them in automatically
      
      return { success: true, message: 'Account created successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }

  static async signOut() {
    try {
      await signOut({ redirect: false });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign out failed' 
      };
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const session = await getSession();
      return session?.user as User || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async updateProfile(userId: string, updates: Partial<User>) {
    try {
      // TODO: Implement profile update logic
      return { success: true, user: updates };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Profile update failed' 
      };
    }
  }
}
