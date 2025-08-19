
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/confirm-id', label: 'Verify ID', icon: ShieldCheck },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 border-t border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex justify-around h-16 max-w-screen-2xl items-center">
        {navItems.map((item) => {
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
