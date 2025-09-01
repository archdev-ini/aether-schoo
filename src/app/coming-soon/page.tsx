
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HardHat } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12 text-center animate-in fade-in duration-500">
      <div className="space-y-6">
        <div className="flex justify-center">
            <div className="bg-primary/10 text-primary p-4 rounded-full">
                <HardHat className="w-12 h-12"/>
            </div>
        </div>
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Under Construction</h1>
            <p className="text-muted-foreground md:text-lg max-w-md mx-auto">
                This part of the Aether ecosystem is still being drafted. Check back soon for exciting updates!
            </p>
        </div>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
