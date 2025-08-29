
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { verifyTokenAndLogin } from './actions';


function ActivateContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your account...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No activation token provided. The link may be incomplete.');
            return;
        }

        verifyTokenAndLogin(token).then(async (result) => {
            if (result.success) {
                setStatus('success');
                setMessage('Your account has been activated! Redirecting you now...');
                
                // We still need to notify the client-side components like the header to update immediately
                // This will be done by fetching the user data from a new endpoint after setting the cookie
                const res = await fetch('/api/user');
                const userData = await res.json();

                if (userData.aetherId) {
                    localStorage.setItem('aether_user_id', userData.aetherId);
                    localStorage.setItem('aether_user_name', userData.fullName);
                    localStorage.setItem('aether_user_role', userData.role);
                    window.dispatchEvent(new Event('auth-change'));
                }
                
                setTimeout(() => {
                    router.replace('/profile');
                }, 2000);
            } else {
                setStatus('error');
                setMessage(result.error || 'An unknown error occurred.');
            }
        });
    }, [token, router]);

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Account Activation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground">{message}</p>
                    </div>
                )}
                 {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                        <p className="font-semibold text-green-500">{message}</p>
                    </div>
                )}
                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                        <p className="font-semibold text-destructive">{message}</p>
                        <Button asChild variant="outline" className="mt-4">
                            <Link href="/join">Return to Signup</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// We need an API route to securely get cookie data on the client
function UserApiRoute() {
    return null;
}

export default function ActivatePage() {
    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <ActivateContent />
            </Suspense>
        </main>
    );
}
