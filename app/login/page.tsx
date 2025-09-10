
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        // This key is for community members. Admins will have a different key.
        const memberKey = 'aether-member-portal';
        router.replace(`/sys-bridge?key=${memberKey}`);
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
