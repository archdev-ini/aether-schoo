
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
import { Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '../login/actions';
import NotFoundPage from '../not-found';

const FormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Please enter your password.' }),
});

type FormValues = z.infer<typeof FormSchema>;

function BridgePageContent() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const key = searchParams.get('key');
    const isKeyValid = key === process.env.NEXT_PUBLIC_SYS_BRIDGE_KEY;

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: { email: '', password: '' },
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
            window.dispatchEvent(new Event('auth-change'));
            form.reset();
        }
    }, [searchParams, toast, form]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        try {
            const result = await loginUser({ email: data.email, password: data.password });
            if (result.success && result.data) {
                localStorage.setItem('aether_user_id', result.data.aetherId);
                localStorage.setItem('aether_user_name', result.data.fullName);
                window.dispatchEvent(new Event('auth-change'));
                
                toast({
                title: 'Login Successful!',
                description: `Welcome back, ${result.data.fullName.split(' ')[0]}.`,
                });

                router.replace('/profile');
                router.refresh(); 
            } else {
                toast({
                title: 'Login Failed',
                description: result.error || 'Please check your details and try again.',
                variant: 'destructive',
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'There was a problem logging you in.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isKeyValid) {
        return <NotFoundPage />;
    }

    return (
        <main className="container py-12 md:py-24 animate-in fade-in duration-500">
        <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
                <KeyRound className="w-12 h-12 mx-auto text-primary mb-4" />
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Member Portal</h1>
                <p className="mt-4 text-muted-foreground md:text-xl">
                    Enter your credentials to access your profile and learning dashboard.
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
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Your password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Verifying...' : 'Enter Portal'}
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
