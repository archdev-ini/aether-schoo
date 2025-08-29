
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, LogIn, User, BookCopy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface BottomNavProps {
  user: { name: string; id: string } | null;
}

export function BottomNav({ user }: BottomNavProps) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // This effect runs on the client and can safely access localStorage.
    // It's used for quickly updating the UI. The source of truth is the server cookie.
    const updateLoginState = () => {
      const name = localStorage.getItem('aether_user_name');
      setIsLoggedIn(!!name);
    };

    updateLoginState();

    // Listen for storage changes to update UI across tabs
    window.addEventListener('storage', updateLoginState);
    
    // Also listen for a custom event that we can trigger after login/logout
    window.addEventListener('auth-change', updateLoginState);

    return () => {
      window.removeEventListener('storage', updateLoginState);
      window.removeEventListener('auth-change', updateLoginState);
    };
  }, [pathname]); // Re-run on pathname change to ensure it's up-to-date

  const navItems = [
    { href: '/', label: 'Home', icon: Home, show: 'always' },
    { href: '/events', label: 'Events', icon: Calendar, show: 'always' },
    { href: '/programs', label: 'Programs', icon: BookCopy, show: 'always' },
    { href: '/profile', label: 'Profile', icon: User, show: 'loggedIn' },
    { href: '/login', label: 'Login', icon: LogIn, show: 'loggedOut' },
  ];

  const visibleItems = navItems.filter(item => {
      if (item.show === 'always') return true;
      if (item.show === 'loggedIn' && isLoggedIn) return true;
      if (item.show === 'loggedOut' && !isLoggedIn) return true;
      return false;
  });

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 border-t border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex justify-around h-16 max-w-screen-2xl items-center">
        {visibleItems.map((item) => {
          const isActive = (pathname === '/' && item.href === '/') ||
                           (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center text-center text-muted-foreground w-full h-full transition-colors',
                isActive ? 'text-primary' : 'hover:text-foreground'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
