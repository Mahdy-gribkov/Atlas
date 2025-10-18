import { render, screen } from '@testing-library/react';
import { LandingPage } from '@/components/pages/LandingPage';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('LandingPage', () => {
  it('renders the main heading', () => {
    render(<LandingPage />);
    expect(screen.getByText('Your Intelligent Travel Companion')).toBeInTheDocument();
  });

  it('renders sign in and sign up buttons', () => {
    render(<LandingPage />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<LandingPage />);
    expect(screen.getByText('AI-Powered Planning')).toBeInTheDocument();
    expect(screen.getByText('Smart Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Real-time Assistance')).toBeInTheDocument();
  });

  it('has proper navigation links', () => {
    render(<LandingPage />);
    const signInLink = screen.getByRole('link', { name: /sign in/i });
    const signUpLink = screen.getByRole('link', { name: /get started/i });
    
    expect(signInLink).toHaveAttribute('href', '/signin');
    expect(signUpLink).toHaveAttribute('href', '/signup');
  });
});
