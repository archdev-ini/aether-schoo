
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const FormSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  ageRange: z.string().min(1, { message: 'Please select your age range.' }),
  location: z.string().min(3, { message: 'Please enter your city and country.' }),
  role: z.enum(['Student', 'Graduate', 'Professional'], { required_error: 'Please select your role.' }),
  mainInterest: z.enum(['Courses', 'Studio', 'Community', 'Mentorship'], { required_error: 'Please select your main interest.' }),
  preferredPlatform: z.enum(['Discord', 'WhatsApp', 'Telegram'], { required_error: 'Please select a platform.' }),
  socialHandle: z.string().optional(),
  reason: z.string().min(10, { message: 'Please tell us why you want to join (at least 10 characters).' }),
  referralCode: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

function generateAetherId() {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AETH-${result}`;
}

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [aetherId, setAetherId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        fullName: '',
        email: '',
        location: '',
        socialHandle: '',
        reason: '',
        referralCode: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    // Here you would typically send the data to your backend.
    // For this prototype, we'll just simulate a successful submission.
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const newId = generateAetherId();
        setAetherId(newId);
        setSubmitted(true);
    } catch(error) {
         toast({
            title: 'Error',
            description: 'There was a problem with your submission. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  if (submitted) {
    return (
        <main className="container py-12 md:py-24 lg:py-32 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">You're in. Welcome to Aether.</CardTitle>
                        <CardDescription>Your unique Aether ID is:</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-muted p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold tracking-widest text-primary">{aetherId}</p>
                        </div>
                        <p className="text-muted-foreground">Use this ID to access courses, events, and more within the ecosystem.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button asChild><Link href="#">Join Discord</Link></Button>
                            <Button asChild><Link href="#">Join WhatsApp</Link></Button>
                            <Button asChild><Link href="#">Join Telegram</Link></Button>
                            <Button asChild variant="outline"><Link href="#">Follow on X & Instagram</Link></Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
  }

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto">
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
                            <FormField control={form.control} name="ageRange" render={({ field }) => (
                                <FormItem><FormLabel>Age Range</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your age range" /></SelectTrigger></FormControl><SelectContent><SelectItem value="<18">&lt;18</SelectItem><SelectItem value="18-24">18-24</SelectItem><SelectItem value="25-34">25-34</SelectItem><SelectItem value="35-44">35-44</SelectItem><SelectItem value="45+">45+</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem><FormLabel>City + Country</FormLabel><FormControl><Input placeholder="e.g. Lagos, Nigeria" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        
                        <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem><FormLabel>Which best describes you?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col md:flex-row gap-4 pt-2"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Student" id="r1" /></FormControl><FormLabel htmlFor="r1" className="font-normal">Student</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Graduate" id="r2" /></FormControl><FormLabel htmlFor="r2" className="font-normal">Graduate</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Professional" id="r3" /></FormControl><FormLabel htmlFor="r3" className="font-normal">Professional</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                        )}/>
                        
                        <FormField control={form.control} name="mainInterest" render={({ field }) => (
                            <FormItem><FormLabel>What are you most interested in?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Courses" id="i1" /></FormControl><FormLabel htmlFor="i1" className="font-normal">Courses</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Studio" id="i2" /></FormControl><FormLabel htmlFor="i2" className="font-normal">Studio</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Community" id="i3" /></FormControl><FormLabel htmlFor="i3" className="font-normal">Community</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Mentorship" id="i4" /></FormControl><FormLabel htmlFor="i4" className="font-normal">Mentorship</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                        )}/>

                        <FormField control={form.control} name="preferredPlatform" render={({ field }) => (
                            <FormItem><FormLabel>Preferred Community Platform</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col md:flex-row gap-4 pt-2"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Discord" id="p1" /></FormControl><FormLabel htmlFor="p1" className="font-normal">Discord</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="WhatsApp" id="p2" /></FormControl><FormLabel htmlFor="p2" className="font-normal">WhatsApp</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Telegram" id="p3" /></FormControl><FormLabel htmlFor="p3" className="font-normal">Telegram</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                        )}/>
                        
                        <FormField control={form.control} name="socialHandle" render={({ field }) => (
                            <FormItem><FormLabel>Social Handle <span className="text-muted-foreground">(Instagram or X, optional)</span></FormLabel><FormControl><Input placeholder="@yourhandle" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>

                         <FormField control={form.control} name="reason" render={({ field }) => (
                            <FormItem><FormLabel>Why do you want to join Aether?</FormLabel><FormControl><Textarea placeholder="Tell us about your goals, aspirations, and what you hope to achieve..." className="resize-none" rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>

                        <FormField control={form.control} name="referralCode" render={({ field }) => (
                            <FormItem><FormLabel>Referral Code <span className="text-muted-foreground">(optional)</span></FormLabel><FormControl><Input placeholder="Enter code if you have one" {...field} /></FormControl><FormMessage /></FormItem>
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
