
'use client';

import { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import { loginUser } from './actions';

const FormSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  aetherId: z.string().min(5, { message: 'Please enter a valid Aether ID.' }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [rememberedUser, setRememberedUser] = useState<{ id: string; name: string } | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { fullName: '', aetherId: '' },
  });

  useEffect(() => {
    // Check for remembered user on mount
    const storedId = localStorage.getItem('aether_user_id');
    const storedName = localStorage.getItem('aether_user_name');
    if (storedId && storedName) {
      setRememberedUser({ id: storedId, name: storedName });
      form.setValue('aetherId', storedId);
      form.setValue('fullName', storedName);
    }
  }, [form]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    const aetherId = data.aetherId.toUpperCase();
    try {
      const result = await loginUser({ fullName: data.fullName, aetherId });
      if (result.success && result.data) {
        localStorage.setItem('aether_user_id', aetherId);
        localStorage.setItem('aether_user_name', result.data.fullName);
        
        toast({
          title: 'Login Successful!',
          description: `Welcome back, ${result.data.fullName.split(' ')[0]}.`,
        });
        router.push('/profile');
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

  const handleLogout = () => {
    localStorage.removeItem('aether_user_id');
    localStorage.removeItem('aether_user_name');
    setRememberedUser(null);
    form.reset();
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
                {rememberedUser && (
                     <CardDescription>
                        Welcome back, {rememberedUser.name.split(' ')[0]}!
                     </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="aetherId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Aether ID</FormLabel>
                            <FormControl>
                                <Input placeholder="AETH-A2DQ0-X7" {...field} />
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
                 {rememberedUser && (
                    <div className="text-center mt-4">
                        <Button variant="link" size="sm" onClick={handleLogout}>
                            Not you? Log in with a different ID
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
         <div className="text-center mt-8">
            <p className="text-muted-foreground">
                Don't have an ID? <Link href="/join" className="text-primary underline">Join Aether now</Link>
            </p>
        </div>
      </div>
    </main>
  );
}
