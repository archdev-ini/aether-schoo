
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { submitJoinForm } from './actions';
import { Textarea } from '@/components/ui/textarea';


const FormSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  location: z.string().min(3, { message: 'Please enter your city and country.' }),
  reasonToJoin: z.string().min(10, "Please tell us a bit about what you'd like to achieve.").optional(),
  portfolioUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

export type FormValues = z.infer<typeof FormSchema>;

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        fullName: '',
        email: '',
        location: '',
        reasonToJoin: '',
        portfolioUrl: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
        const result = await submitJoinForm(data);
        if (result.success) {
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
        <div className="text-center max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <MailCheck className="w-16 h-16 mx-auto text-primary" />
              <CardTitle className="text-3xl font-bold mt-4">Check Your Inbox!</CardTitle>
              <CardDescription>
                We've sent a welcome email with your new Aether ID and a special link to activate your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Didn't receive an email? Check your spam folder or try signing up again.
                </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Join the Aether Ecosystem</h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
                Create your Aether account to receive your unique ID and access the ecosystem.
            </p>
        </div>
        <Card>
            <CardContent className="p-6 md:p-8">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem><FormLabel>City, Country</FormLabel><FormControl><Input placeholder="e.g. Lagos, Nigeria" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={form.control} name="reasonToJoin" render={({ field }) => (
                            <FormItem>
                                <FormLabel>What do you hope to achieve with Aether?</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="e.g., Collaborate on innovative projects, learn new design skills, find a mentor..." {...field} />
                                </FormControl>
                                 <FormDescription>This helps us recommend the right programs for you.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="portfolioUrl" render={({ field }) => (
                            <FormItem><FormLabel>LinkedIn / Portfolio URL <span className="text-muted-foreground">(Optional)</span></FormLabel><FormControl><Input placeholder="https://linkedin.com/in/yourprofile" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>


                        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Create My Account & Get ID
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
