
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun, User, UserPlus, LogIn, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];

function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAetherId, setUserAetherId] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const updateLoginState = () => {
      const name = localStorage.getItem('aether_user_name');
      const id = localStorage.getItem('aether_user_id');
      if (name && id) {
          setIsLoggedIn(true);
          setUserName(name);
          setUserAetherId(id);
      } else {
          setIsLoggedIn(false);
          setUserName('');
          setUserAetherId('');
      }
    };

    updateLoginState();

    // Listen for the custom event to update login state immediately
    window.addEventListener('auth-change', updateLoginState);

    return () => {
      window.removeEventListener('auth-change', updateLoginState);
    };
  }, []);

  const handleLogout = async () => {
    // Client-side cleanup
    localStorage.removeItem('aether_user_id');
    localStorage.removeItem('aether_user_name');
    
    // Dispatch event to update UI immediately
    window.dispatchEvent(new CustomEvent('auth-change'));

    toast({ description: "You have been logged out." });
    router.push('/');
  }

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-logo text-lg font-medium sm:inline-block">Aether</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-6">
                <Link href="/" className="mb-8 flex items-center space-x-2">
                  <span className="font-logo text-xl font-medium">Aether</span>
                </Link>
                <div className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href + link.label}
                        href={link.href}
                        className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Separator className="my-2"/>
                    {isLoggedIn ? (
                       <>
                        <Link href="/profile" className="flex items-center gap-2 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                            <User className="w-5 h-5"/> Profile
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground text-left">
                            <LogOut className="w-5 h-5"/> Logout
                        </button>
                       </>
                    ) : (
                      <>
                        <Link href="/login" className="flex items-center gap-2 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                            <LogIn className="w-5 h-5"/> Login
                        </Link>
                        <Link href="/join" className="flex items-center gap-2 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                            <UserPlus className="w-5 h-5"/> Get Aether ID
                        </Link>
                      </>
                    )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-2">
             <ThemeToggle />
            {isLoggedIn ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                           <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userAetherId}`} alt={userName} />
                                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                           </Avatar>
                         </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <User className="mr-2" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2"/>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                    <Button asChild variant="outline" className="hidden sm:inline-flex">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild id="get-aether-id-header">
                        <Link href="/join">Get Your Aether ID</Link>
                    </Button>
                </>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
