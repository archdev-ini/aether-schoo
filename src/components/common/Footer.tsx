
import { Twitter, MessageCircle, Linkedin } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
    { href: "https://discord.gg/D8g8dSf7GE", icon: MessageCircle, name: "Discord" },
    { href: "https://www.linkedin.com/company/aether-ecosystem/", icon: Linkedin, name: "LinkedIn" },
    { href: "https://x.com/aethernwk?s=09", icon: Twitter, name: "X" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/40">
        <div className="container py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="text-center md:text-left">
                     <Link href="/" className="font-logo text-lg font-medium">Aether – Powered by Buildr Africa</Link>
                 </div>
                 <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <Link href="/events" className="hover:text-foreground">Events</Link>
                    <Link href="/about" className="hover:text-foreground">About</Link>
                    <a href="mailto:aether.ecosystem@gmail.com" className="hover:text-foreground">Contact</a>
                 </div>
                 <div className="flex items-center gap-4">
                    {socialLinks.map(link => (
                        <Link key={link.name} href={link.href} className="text-muted-foreground hover:text-foreground" target={link.href.startsWith('http') ? '_blank' : '_self'}>
                            <link.icon className="h-5 w-5" />
                            <span className="sr-only">{link.name}</span>
                        </Link>
                    ))}
                 </div>
            </div>
             <div className="mt-8 pt-6 border-t border-border/40 text-center md:text-left text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-2 text-center md:text-left">
                    <p>&copy; 2025 Aether by Buildr Africa. All rights reserved.</p>
                    <p>Platform launching soon!</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
                    <Link href="/terms-of-use" className="hover:text-foreground">Terms</Link>
                </div>
            </div>
        </div>
    </footer>
  );
}
