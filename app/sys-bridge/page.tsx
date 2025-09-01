
'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import NotFoundPage from '../not-found';


function BridgePageContent() {
    const router = useRouter();

    useEffect(() => {
        // This component is no longer needed for login, so we redirect.
        // It's kept in case it's needed for other bridging purposes later.
        router.replace('/login');
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Redirecting...</p>
            </div>
        </div>
    );
}


export default function SysBridgePage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <BridgePageContent />
    </Suspense>
  )
}
