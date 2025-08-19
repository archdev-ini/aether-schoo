
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCheck, Search, ShieldX, MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { verifyMember } from './actions';

const FormSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  aetherId: z.string().min(5, { message: 'Please enter a valid Aether ID.' }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ConfirmIdPage() {
  const [verified, setVerified] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: '',
      aetherId: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setVerified(false);
    setErrorState(false);
    try {
      const result = await verifyMember({ 
          fullName: data.fullName, 
          aetherId: data.aetherId.toUpperCase() 
      });
      if (result.success && result.data) {
        setVerified(true);
        setVerifiedName(result.data.fullName);
      } else {
        setErrorState(true);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'There was a problem confirming your ID.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchAgain = () => {
    setVerified(false);
    setErrorState(false);
    form.reset();
  }

  if (verified) {
     return (
        <main className="container py-12 md:py-24 animate-in fade-in duration-500">
            <div className="max-w-lg mx-auto">
                <Card className="text-center animate-in fade-in duration-300">
                    <CardHeader>
                        <UserCheck className="w-16 h-16 mx-auto text-primary" />
                        <CardTitle className="text-3xl font-bold mt-4">You're Verified, {verifiedName.split(' ')[0]}!</CardTitle>
                        <CardDescription>Welcome to the inner circle. Use the links below to join our private community spaces and get involved.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button asChild size="lg" variant="outline">
                                <Link href="https://discord.gg/D8g8dSf7GE" target="_blank">
                                    <MessageCircle className="mr-2" />
                                    Join Discord
                                </Link>
                            </Button>
                             <Button asChild size="lg" variant="outline">
                                <Link href="https://t.me/+MdYqlhI_Z2g2ZDA0" target="_blank">
                                    <Send className="mr-2" />
                                    Join Telegram
                                </Link>
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground pt-4">You now have access to all community features. Introduce yourself!</p>
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
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Already have your Aether ID?</h1>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Confirm your details below to get access.
          </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Verify Your ID</CardTitle>
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
                            <FormLabel>Aether ID</FormLabel>
                            <FormControl>
                                <Input placeholder="AETH-A2DQ0-X7" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Verifying...' : 'Verify ID'}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>

        {errorState && (
             <Card className="text-center animate-in fade-in duration-300 border-destructive mt-8">
                <CardHeader>
                    <ShieldX className="w-16 h-16 mx-auto text-destructive" />
                    <CardTitle className="text-2xl font-bold mt-4">Verification Failed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-muted-foreground">We couldn't find a matching record. Please check your details and try again.</p>
                     <Button onClick={handleSearchAgain} className="mt-4">
                        <Search className="mr-2"/>
                        Try Again
                     </Button>
                </CardContent>
            </Card>
        )}

      </div>
    </main>
  );
}
