'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LayoutDashboard, BookText, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin731', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin731/members', label: 'Members', icon: Users },
  { href: '/admin731/content', label: 'Content', icon: BookText },
  { href: '/admin731/create-member', label: 'Create Member', icon: UserPlus },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-muted/40 p-4 border-r hidden md:block">
      <div className="flex flex-col gap-2">
        <Link href="/" className="font-logo text-2xl font-bold mb-8 block">Aether<span className="text-primary">.admin</span></Link>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  isActive && 'bg-primary/10 text-primary font-semibold'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
