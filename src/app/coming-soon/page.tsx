
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import Link from 'next/link';

export default function ComingSoonPage() {
  return (
    <main className="container flex items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <Construction className="w-16 h-16 mx-auto text-primary" />
          <CardTitle className="text-3xl font-bold mt-4 font-headline">This Area is Under Construction</CardTitle>
          <CardDescription>
            This feature is being built and will be available with our full platform launch.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="bg-muted p-4 rounded-lg">
                <p className="font-bold text-lg">Full Platform Launch: December 8, 2025</p>
            </div>
          <Button asChild className="mt-6" size="lg">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
