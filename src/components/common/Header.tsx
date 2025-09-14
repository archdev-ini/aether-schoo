
'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from 'react';

const navLinks = [
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
];

function AetherLogo() {
    return (
      <Link href="/" className="flex items-center space-x-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-bold text-lg font-headline">Aether</span>
      </Link>
    )
}

function ThemeToggleButton() {
    const { theme, setTheme } = useTheme();
    
    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    )
}

export function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <AetherLogo />
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden">
           <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="p-4">
                  <AetherLogo />
                  <nav className="mt-8 flex flex-col space-y-4">
                      {navLinks.map(link => (
                          <Link 
                            key={link.href} 
                            href={link.href} 
                            className="text-lg font-medium text-foreground/80 hover:text-foreground"
                            onClick={() => setMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                      ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
        </div>

        {/* Centered Logo on Mobile */}
        <div className="flex-1 flex justify-center md:hidden">
            <AetherLogo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-foreground/60 transition-colors hover:text-foreground/80">
                    {link.label}
                </Link>
            ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>
            <ThemeToggleButton />
            <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/join">Join</Link>
                </Button>
            </div>
        </div>
      </div>
    </header>
  );
}
