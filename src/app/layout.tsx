import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Noto_Sans_Hebrew } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  variable: '--font-noto-sans-hebrew',
});

export const metadata: Metadata = {
  title: 'AI Travel Agent',
  description: 'Your intelligent travel planning companion powered by AI',
  keywords: ['travel', 'AI', 'itinerary', 'planning', 'assistant'],
  authors: [{ name: 'AI Travel Agent Team' }],
  creator: 'AI Travel Agent',
  publisher: 'AI Travel Agent',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'AI Travel Agent',
    description: 'Your intelligent travel planning companion powered by AI',
    siteName: 'AI Travel Agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Travel Agent',
    description: 'Your intelligent travel planning companion powered by AI',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.variable} ${notoSansHebrew.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
