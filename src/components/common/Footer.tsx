
import { Twitter, Book, MessageCircle, Camera } from 'lucide-react';
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
        <div className="container py-8">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-2">
                         <p className="font-bold">Aether Ecosystem</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        Part of the Buildr Africa Network
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                     <div>
                        <h3 className="font-semibold mb-2">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/join" className="text-sm text-muted-foreground hover:text-foreground">Join</Link></li>
                            <li><Link href="/programs" className="text-sm text-muted-foreground hover:text-foreground">Learn</Link></li>
                             <li><Link href="/programs" className="text-sm text-muted-foreground hover:text-foreground">Studio</Link></li>
                            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
                            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                         <h3 className="font-semibold mb-2">Community</h3>
                        <ul className="space-y-2">
                             {socialLinks.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
                                        <link.icon className="h-4 w-4" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold">Stay Updated</h3>
                    <p className="text-sm text-muted-foreground">Join our mailing list for the latest news and updates.</p>
                </div>
            </div>
             <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Aether Ecosystem. All rights reserved.</p>
            </div>
        </div>
    </footer>
  );
}
