import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-atlas-primary-lighter to-atlas-secondary-lighter dark:from-atlas-primary-darkest dark:to-atlas-primary-dark">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-atlas-text-primary">
            Welcome Back to Atlas
          </h1>
          <p className="mt-2 text-sm text-atlas-text-secondary">
            Sign in to your Atlas account and start planning your next adventure
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
