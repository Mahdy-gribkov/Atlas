import { NextAuthOptions } from 'next-auth';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { UserService } from '@/services/user.service';
import { isDemoMode } from '@/lib/firebase/config';

const userService = new UserService();

export const authOptions: NextAuthOptions = {
  adapter: isDemoMode ? undefined : FirestoreAdapter({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  }),
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // In demo mode, allow any email/password combination
        if (isDemoMode) {
          return {
            id: 'demo-user',
            email: credentials.email,
            name: credentials.email.split('@')[0],
            role: 'user',
          };
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          if (userCredential.user) {
            // Get or create user in our database
            let user = await userService.getUserByEmail(userCredential.user.email!);
            if (!user) {
              user = await userService.createUser({
                email: userCredential.user.email!,
                name: userCredential.user.displayName || userCredential.user.email!,
                role: 'user',
              });
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name || null,
              role: user.role,
            };
          }
        } catch (error) {
          console.error('Authentication error:', error);
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as any).role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.uid as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email) {
        try {
          // Check if user exists in our database
          let dbUser = await userService.getUserByEmail(user.email);
          if (!dbUser) {
            // Create new user
            await userService.createUser({
              email: user.email,
              name: user.name || user.email,
              role: 'user',
            });
          }
          return true;
        } catch (error) {
          console.error('Error creating user:', error);
          return false;
        }
      }
      return true;
    },
  },
};
