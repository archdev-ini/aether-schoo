
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { submitJoinForm } from './actions';
import { WelcomeCard } from '@/components/common/WelcomeCard';

const FormSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  location: z.string().min(3, { message: 'Please enter your city and country.' }),
  mainInterest: z.enum(['Courses', 'Studio', 'Community', 'Mentorship'], { required_error: 'Please select your main interest.' }),
});

export type FormValues = z.infer<typeof FormSchema>;

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [aetherId, setAetherId] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        fullName: '',
        email: '',
        location: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
        const result = await submitJoinForm(data);
        if (result.success && result.aetherId) {
            setAetherId(result.aetherId);
            setFullName(data.fullName);
            setSubmitted(true);
        } else {
            throw new Error(result.error || 'An unexpected error occurred.');
        }
    } catch(error: any) {
         toast({
            title: 'Error',
            description: error.message || 'There was a problem with your submission. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  if (submitted) {
    return (
        <main className="container py-12 md:py-24 lg:py-32 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto space-y-8">
                 <div>
                    <h1 className="text-3xl font-bold font-headline">You're in. Welcome to Aether.</h1>
                    <p className="text-muted-foreground mt-2">Your journey into the future of design starts now. Here is your personalized Aether ID card.</p>
                </div>

                <WelcomeCard fullName={fullName} aetherId={aetherId} />

                <Card>
                    <CardHeader>
                        <ShieldCheck className="w-10 h-10 mx-auto text-primary" />
                        <CardTitle>Next Step: Verify Your ID</CardTitle>
                        <CardDescription>To unlock private community channels and get full access, you need to verify your new ID.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">Click the button below to complete the final step.</p>
                        <Button asChild size="lg" className="w-full">
                            <Link href="/confirm-id">
                                Verify My ID & Join Community
                                <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
  }

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Join the Aether Ecosystem</h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
                Get started with your Aether journey. Fill out this form to receive your unique Aether ID and access the ecosystem.
            </p>
        </div>
        <Card>
            <CardContent className="p-6 md:p-8">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="fullName" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="your@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem><FormLabel>City + Country</FormLabel><FormControl><Input placeholder="e.g. Lagos, Nigeria" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        
                        <FormField control={form.control} name="mainInterest" render={({ field }) => (
                            <FormItem><FormLabel>What are you most interested in?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select your main interest" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Courses">Courses & Learning</SelectItem>
                                    <SelectItem value="Studio">Studio Projects & Collaboration</SelectItem>
                                    <SelectItem value="Community">Community & Networking</SelectItem>
                                    <SelectItem value="Mentorship">Mentorship</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage /></FormItem>
                        )}/>

                        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Get My Aether ID
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
