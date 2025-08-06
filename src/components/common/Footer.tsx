import { Rocket, Twitter, Book, MessageCircle, Camera } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
    { href: "#", icon: MessageCircle, name: "Discord" },
    { href: "#", icon: Camera, name: "Instagram" },
    { href: "#", icon: Twitter, name: "X" },
    { href: "#", icon: Book, name: "Facebook" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-6 w-6" />
            <span className="font-bold">Aether Ecosystem</span>
          </Link>
          <p className="hidden text-sm text-muted-foreground md:block">
            Part of the Buildr Africa Network
          </p>
        </div>
        <div className="flex items-center gap-4">
            <Link href="/join" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Join</Link>
            <Link href="/programs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Programs</Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">About</Link>
        </div>
        <div className="flex items-center gap-4">
            {socialLinks.map(link => (
                <Link key={link.name} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    <link.icon className="h-5 w-5" />
                    <span className="sr-only">{link.name}</span>
                </Link>
            ))}
        </div>
         <p className="text-sm text-muted-foreground md:hidden">
            Part of the Buildr Africa Network
          </p>
        <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Aether Ecosystem. All rights reserved.
        </p>
      </div>
    </footer>
  );
}