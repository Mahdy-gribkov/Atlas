import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Noto_Sans_Hebrew } from 'next/font/google';
import './globals.css';
import { AtlasThemeProvider } from '@/components/theme/theme-provider';
import { ToastProvider, Toaster } from '@/components/ui/feedback';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  variable: '--font-noto-sans-hebrew',
});

export const metadata: Metadata = {
  title: 'Atlas - AI-Powered Travel Planning',
  description: 'Your intelligent travel planning companion powered by AI. Discover destinations, plan itineraries, and book your perfect trip with Atlas.',
  keywords: ['travel', 'AI', 'itinerary', 'planning', 'assistant', 'Atlas', 'travel planning', 'vacation', 'trip planning'],
  authors: [{ name: 'Atlas Team' }],
  creator: 'Atlas',
  publisher: 'Atlas',
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
    title: 'Atlas - AI-Powered Travel Planning',
    description: 'Your intelligent travel planning companion powered by AI. Discover destinations, plan itineraries, and book your perfect trip with Atlas.',
    siteName: 'Atlas',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atlas - AI-Powered Travel Planning',
    description: 'Your intelligent travel planning companion powered by AI. Discover destinations, plan itineraries, and book your perfect trip with Atlas.',
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.variable} ${notoSansHebrew.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AtlasThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </AtlasThemeProvider>
      </body>
    </html>
  );
}