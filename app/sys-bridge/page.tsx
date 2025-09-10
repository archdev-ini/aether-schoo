
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { sendLoginLink } from '../login/actions';
import NotFoundPage from '../not-found';

const FormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

type FormValues = z.infer<typeof FormSchema>;

function BridgePageContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();
    const searchParams = useSearchParams();

    const key = searchParams.get('key');
    const isKeyValid = key === 'aether-admin-731' || key === 'aether-member-portal';

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: { email: '' },
    });

     useEffect(() => {
        const error = searchParams.get('error');
        if (error === 'not_found') {
            toast({
                title: 'Session Error',
                description: 'Your login session was invalid. Please log in again.',
                variant: 'destructive',
            });
            localStorage.removeItem('aether_user_id');
            localStorage.removeItem('aether_user_name');
            localStorage.removeItem('aether_user_role');
            window.dispatchEvent(new Event('auth-change'));
            form.reset();
        }
    }, [searchParams, toast, form]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        setIsSubmitted(false);
        try {
            const result = await sendLoginLink({ email: data.email });
            if (result.success) {
                setIsSubmitted(true);
            } else {
                toast({
                title: 'Login Failed',
                description: result.error || 'Please check your email and try again.',
                variant: 'destructive',
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'There was a problem with your request.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isKeyValid) {
        return <NotFoundPage />;
    }

    if (isSubmitted) {
        return (
             <main className="container py-12 md:py-24 animate-in fade-in duration-500">
                <div className="max-w-md mx-auto">
                     <Card>
                        <CardHeader className="text-center">
                            <MailCheck className="w-16 h-16 mx-auto text-primary" />
                            <CardTitle className="text-3xl font-bold mt-4">Magic Link Sent!</CardTitle>
                            <CardDescription>
                                If an account exists for {form.getValues('email')}, you will receive a secure login link. Check your inbox (and spam folder).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button variant="link" onClick={() => {setIsSubmitted(false); form.reset();}}>
                                Use a different email
                            </Button>
                        </CardContent>
                    </Card>
                </div>
             </main>
        )
    }

    return (
        <main className="container py-12 md:py-24 animate-in fade-in duration-500">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-12">
                    <KeyRound className="w-12 h-12 mx-auto text-primary mb-4" />
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Welcome Back to Aether</h1>
                    <p className="mt-4 text-muted-foreground md:text-xl">
                        Enter your email to receive a secure login link.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Sending...' : 'Send Magic Link'}
                            </Button>
                        </form>
                        </Form>
                    </CardContent>
                </Card>
                <div className="text-center mt-8">
                    <p className="text-muted-foreground">
                        Don't have an account? <Link href="/join" className="text-primary underline">Join Aether now</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}


export default function SysBridgePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BridgePageContent />
    </Suspense>
  )
}
