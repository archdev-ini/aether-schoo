
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Linkedin, MessageCircle, Twitter } from 'lucide-react';

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "#", label: "Discord", icon: MessageCircle },
  { href: "#", label: "LinkedIn", icon: Linkedin },
  { href: "#", label: "X", icon: Twitter },
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


export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Logo & Branding */}
            <div className="flex flex-col space-y-4">
                <AetherLogo />
                <p className="text-sm text-muted-foreground">Powered by Buildr Africa</p>
                <div className="flex space-x-2">
                    {socialLinks.map(link => (
                        <Link key={link.label} href={link.href} className="text-muted-foreground hover:text-foreground" aria-label={link.label}>
                            <link.icon className="h-5 w-5" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Empty columns for spacing */}
            <div className="hidden md:block"></div>
            <div className="hidden md:block"></div>

            {/* Column 4: Links */}
            <div className="flex flex-col space-y-4 text-sm">
                {footerLinks.map(link => (
                    <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Aether by Buildr Africa. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-foreground">Terms</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
