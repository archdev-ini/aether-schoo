
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
import { ArrowRight, Loader2, ShieldCheck, Eye, MessageCircle, Twitter } from 'lucide-react';
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

// Inline SVG for Discord Icon
const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.39 0 2.72-.28 3.96-.81.28.66.73 1.25 1.3 1.72.63.53 1.38.92 2.24 1.1.28.06.56.09.84.09.68 0 1.33-.21 1.88-.61.66-.48 1.15-1.16 1.4-1.95.29-.9.4-1.85.4-2.83 0-5.52-4.48-10-10-10zm-3.5 12.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
);
// Inline SVG for Telegram Icon
const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 2l-7 20-4-9-9-4Z"/><path d="M22 2L11 13"/></svg>
);
// Inline SVG for WhatsApp Icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.44 11.23c0 5.6-4.59 10.17-10.23 10.17-1.78 0-3.48-.46-4.96-1.29l-5.25 1.62 1.66-5.1c-.93-1.55-1.48-3.35-1.48-5.23C1.18 5.63 5.77 1.06 11.41 1.06c2.78 0 5.3.99 7.25 2.78 1.94 1.8 3.03 4.3 3.03 7.39z"/></svg>
);


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

                 <Button asChild variant="outline" size="lg">
                    <Link href="/lobby">
                        <Eye className="mr-2" />
                        See a Sneak Peek of the Platform
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Next Step: Join the Community</CardTitle>
                        <CardDescription>Your Aether ID is your key. Use it to introduce yourself in our community hubs.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-3 gap-4">
                        <Button asChild size="lg" className="w-full">
                            <Link href="https://discord.gg/D8g8dSf7GE" target="_blank">
                                <DiscordIcon className="mr-2" />
                                Join Discord
                            </Link>
                        </Button>
                         <Button asChild size="lg" className="w-full bg-[#2AABEE] hover:bg-[#2AABEE]/90">
                            <Link href="#" target="_blank">
                                <TelegramIcon className="mr-2" />
                                Join Telegram
                            </Link>
                        </Button>
                         <Button asChild size="lg" className="w-full bg-[#25D366] hover:bg-[#25D366]/90">
                            <Link href="#" target="_blank">
                                <WhatsAppIcon className="mr-2" />
                                Join WhatsApp
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
