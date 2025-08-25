
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Airtable from 'airtable';

async function verifyTokenAndLogin(token: string): Promise<{ success: boolean; error?: string }> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;
    const AIRTABLE_MEMBERS_TABLE_ID = 'tblwPBMFhctPX82g4';

     if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Server configuration error in activation');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `{loginToken} = "${token}"`,
            maxRecords: 1,
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Invalid or expired activation link.' };
        }

        const record = records[0];
        const tokenCreatedAtStr = record.get('loginTokenCreatedAt') as string;
        const tokenDuration = record.get('loginTokenExpires') as number || 0; // Duration in seconds

        if (!tokenCreatedAtStr || tokenDuration === 0) {
             return { success: false, error: 'Invalid activation record. Please sign up again.' };
        }
        
        const tokenCreatedAt = new Date(tokenCreatedAtStr);
        const expiresAt = new Date(tokenCreatedAt.getTime() + tokenDuration * 1000);

        if (new Date() > expiresAt) {
            // Invalidate expired token
            await base(AIRTABLE_MEMBERS_TABLE_ID).update(record.id, { 'loginToken': null });
            return { success: false, error: 'Activation link has expired. Please try signing up again.' };
        }
        
        const fullName = record.get('fldcoLSWA6ntjtlYV') as string;
        const aetherId = record.get('fld7hoOSkHYaZrPr7') as string;
        const role = record.get('fld7rO1pQZ9sY2tB4') as string;
        
        // This part needs to be a server action to set cookies securely.
        // For now, using localStorage and signaling a change.
        localStorage.setItem('aether_user_id', aetherId);
        localStorage.setItem('aether_user_name', fullName);
        localStorage.setItem('aether_user_role', role);
        window.dispatchEvent(new Event('auth-change'));


        // Invalidate token after use
        await base(AIRTABLE_MEMBERS_TABLE_ID).update(record.id, {
            'loginToken': null,
            'loginTokenExpires': null,
        });

        return { success: true };
    } catch (error) {
        console.error('Activation error:', error);
        return { success: false, error: 'An unexpected error occurred during activation.' };
    }
}


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

        verifyTokenAndLogin(token).then(result => {
            if (result.success) {
                setStatus('success');
                setMessage('Your account has been activated! Redirecting you now...');
                
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

export default function ActivatePage() {
    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <ActivateContent />
            </Suspense>
        </main>
    );
}
