
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'aether_cookie_consent';

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 border-t border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-4 px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            We use cookies to understand how our site is used and improve your experience. By continuing to use Aether, you agree to our {' '}
            <Link href="/privacy-policy" className="underline hover:text-foreground">
             Privacy Policy
            </Link>
            .
          </p>
          <div className="flex items-center gap-2">
            <Button onClick={handleAccept} size="sm">
              Accept
            </Button>
            <Button variant="link" size="sm" asChild>
                <Link href="/privacy-policy">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
