
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        // This is a placeholder for the actual secret key which should be stored securely.
        const secretKey = process.env.NEXT_PUBLIC_SYS_BRIDGE_KEY || 'YOUR_FALLBACK_KEY';
        router.replace(`/sys-bridge?key=${secretKey}`);
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Redirecting to secure login...</p>
            </div>
        </div>
    );
}
