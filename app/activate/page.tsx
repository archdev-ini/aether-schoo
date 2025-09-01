
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, CheckCircle, Archive, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { verifyTokenAndLogin } from './actions';
import { WelcomeCard } from '@/components/common/WelcomeCard';


function ActivateContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your account...');
    const [userData, setUserData] = useState<{ aetherId: string; fullName: string; role: string; } | null>(null);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No activation token provided. The link may be incomplete.');
            return;
        }

        const processVerification = async () => {
            const result = await verifyTokenAndLogin(token);
            if (result.success) {
                setStatus('success');
                
                const res = await fetch('/api/user');
                const newUserData = await res.json();

                if (newUserData.aetherId) {
                    localStorage.setItem('aether_user_id', newUserData.aetherId);
                    localStorage.setItem('aether_user_name', newUserData.fullName);
                    localStorage.setItem('aether_user_role', newUserData.role);
                    setUserData(newUserData);
                    setMessage(`Your Aether ID ${newUserData.aetherId} is now active. You’re officially a founding member.`);
                    window.dispatchEvent(new Event('auth-change'));
                } else {
                     setStatus('error');
                     setMessage('Could not retrieve your user data after activation.');
                }
            } else {
                setStatus('error');
                setMessage(result.error || 'An unknown error occurred.');
            }
        };
        
        processVerification();

    }, [token, router]);

    if (status === 'loading') {
        return (
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">Account Activation</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground">{message}</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (status === 'error') {
         return (
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">Activation Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-4">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                        <p className="font-semibold text-destructive">{message}</p>
                        <Button asChild variant="outline" className="mt-4">
                            <Link href="/join">Return to Signup</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }
    
    // Success State
    return (
        <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in duration-500">
            <div>
                 <h1 className="text-3xl font-bold font-headline">🎉 Welcome to Aether!</h1>
                 <p className="text-muted-foreground mt-2">{message}</p>
            </div>
            {userData && (
                <WelcomeCard fullName={userData.fullName} aetherId={userData.aetherId} />
            )}
             <div className="space-y-4">
                 <Button asChild size="lg" className="w-full">
                    <Link href="/profile">
                        Go to My Dashboard
                    </Link>
                </Button>
                <div className="grid grid-cols-2 gap-4">
                     <Button asChild variant="outline">
                        <Link href="/events">
                            <Calendar className="mr-2 h-4 w-4" /> Join Events
                        </Link>
                    </Button>
                     <Button asChild variant="outline">
                        <Link href="/community">
                            <Users className="mr-2 h-4 w-4" /> Explore Community
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
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
