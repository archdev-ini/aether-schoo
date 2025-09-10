
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, type FormValues } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowDown, User, AtSign, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function JoinPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { fullName: '', username: '', email: '' },
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    // Here we'll call the server action to submit the form
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(data);
    setIsLoading(false);
    setCurrentStep(4); // Move to success step
  };
  
  const handleScrollToForm = () => {
    document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  const progressValue = (currentStep / 3) * 100;

  return (
    <div className="animate-in fade-in duration-500">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 bg-muted/50">
            <div className="container px-4 md:px-6 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                    ✨ Join Aether — Become a Founding Member
                </h1>
                <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl">
                    Secure your permanent Aether ID and get exclusive access to the Beta Archive, prelaunch events, trial school sessions, and our creative community. The full platform launches December 8, 2025.
                </p>
                 <div className="mt-8">
                    <Button size="lg" onClick={handleScrollToForm}>
                       Get My Aether ID
                       <ArrowDown className="ml-2" />
                    </Button>
                </div>
            </div>
        </section>

        {/* Form Section */}
        <section id="signup-form" className="w-full py-16 md:py-24">
            <div className="container max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <Progress value={progressValue} className="mb-4 h-2" />
                        <CardTitle className="text-2xl font-headline">
                            Step {currentStep}: Account Basics
                        </CardTitle>
                         <CardDescription>
                            Let's get started with the essentials. This information will help us set up your Aether identity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Ada Lovelace" {...field} />
                                            </FormControl>
                                            <FormDescription>This helps us personalize your Aether ID.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                     <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                     <Input placeholder="your_unique_username" className="pl-9" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormDescription>Short, memorable, and unique. What others will see in the community.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="your@email.com" {...field} />
                                            </FormControl>
                                            <FormDescription>We’ll send your magic link here to activate your Aether ID.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <Button type="submit" disabled={isLoading || !form.formState.isValid} size="lg" className="w-full">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Next'}
                                    <ArrowDown className="ml-2" />
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </section>
    </div>
  );
}
