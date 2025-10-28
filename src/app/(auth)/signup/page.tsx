import { SignUpForm } from './components/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-atlas-primary-lighter to-atlas-secondary-lighter dark:from-atlas-primary-darkest dark:to-atlas-primary-dark">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-atlas-text-primary">
            Join Atlas
          </h1>
          <p className="mt-2 text-sm text-atlas-text-secondary">
            Create your account and let AI help you plan the perfect trip
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
