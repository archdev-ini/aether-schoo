
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { CookieConsentBanner } from '@/components/common/CookieConsentBanner';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Aether | Architecture School & Creative Ecosystem',
  description: 'Aether is a global-facing, Africa-rooted architecture learning ecosystem. Join courses, studios, and community spaces built for future designers.',
  openGraph: {
    title: 'Aether Ecosystem – Learn. Build. Belong.',
    description: 'Explore a creative architecture school and studio space rooted in Africa, open to the world.',
    images: [{
      url: 'https://images.unsplash.com/photo-1581351639996-f9fd9b45e2a2?q=80&w=1200&h=630&auto=format&fit=crop',
      width: 1200,
      height: 630,
      alt: 'Aether Ecosystem Hero Image',
    }],
    url: 'https://aether.build',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aether Ecosystem – Learn. Build. Belong.',
    description: 'A digital-first architecture school and creative community for the future.',
    images: ['https://images.unsplash.com/photo-1581351639996-f9fd9b45e2a2?q=80&w=1200&h=600&auto=format&fit=crop'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const userName = cookieStore.get('aether_user_name')?.value;
  const aetherId = cookieStore.get('aether_user_id')?.value;
  
  const user = (userName && aetherId) ? { name: userName, id: aetherId } : null;

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="relative flex min-h-screen flex-col">
              <Header user={user} />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
