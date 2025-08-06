import { Rocket } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-6 w-6" />
            <span className="font-bold">Aether Space</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Aether Industries. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
             <Link href="/projects" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Projects</Link>
             <Link href="/programs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Programs</Link>
             <Link href="/faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">FAQ</Link>
             <Link href="/discover" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Discover</Link>
        </div>
      </div>
    </footer>
  );
}
