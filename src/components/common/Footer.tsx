import { Rocket } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-6 w-6" />
            <span className="font-bold">Aether Ecosystem</span>
          </Link>
           <div className="flex flex-col items-center gap-2 text-center md:items-start md:gap-0 md:text-left">
             <p className="text-sm text-muted-foreground">
                Part of the Buildr Africa Network
             </p>
             <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Aether Ecosystem. All rights reserved.
             </p>
           </div>
        </div>
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
                 <Link href="/join" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Join</Link>
                 <Link href="/programs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Learn</Link>
                 <Link href="/programs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Studio</Link>
                 <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">About</Link>
                 <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
            </div>
            <div className="flex gap-4">
                 <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Discord</Link>
                 <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">WhatsApp</Link>
                 <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Telegram</Link>
                 <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Instagram</Link>
                 <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">X</Link>
                 <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Facebook</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
