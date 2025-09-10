
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
import { Loader2, ArrowDown, User, AtSign, Check, ArrowLeft, Building, MapPin, Briefcase } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const focusAreas = [
    { id: 'student', label: 'Architecture Student' },
    { id: 'young-architect', label: 'Young Architect' },
    { id: 'designer', label: 'Designer' },
    { id: 'educator', label: 'Educator' },
    { id: 'enthusiast', label: 'Enthusiast' },
];

export default function JoinPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { fullName: '', username: '', email: '', location: '', workplace: '', focusArea: undefined },
    mode: 'onChange',
  });

  const { trigger } = form;

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
        isValid = await trigger(['fullName', 'username', 'email']);
    } else if (currentStep === 2) {
        isValid = await trigger(['location', 'workplace', 'focusArea']);
    }
    
    if (isValid) {
        setCurrentStep(prev => prev + 1);
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  }

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
  const stepTitles = ["Account Basics", "Your Background", "Final Touches"];


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
                             Step {currentStep}: {stepTitles[currentStep - 1]}
                        </CardTitle>
                         <CardDescription>
                            Let's get started with the essentials. This information will help us set up your Aether identity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                               <div className={cn(currentStep === 1 ? 'block' : 'hidden')}>
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
                                            <FormItem className="mt-6">
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
                                            <FormItem className="mt-6">
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="your@email.com" {...field} />
                                                </FormControl>
                                                <FormDescription>We’ll send your magic link here to activate your Aether ID.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className={cn(currentStep === 2 ? 'block' : 'hidden')}>
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country / City</FormLabel>
                                                <FormControl>
                                                     <div className="relative">
                                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="e.g., Lagos, Nigeria" className="pl-9" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>Where you’re based — helps us connect you locally.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="workplace"
                                        render={({ field }) => (
                                            <FormItem className="mt-6">
                                                <FormLabel>University / Workplace</FormLabel>
                                                <FormControl>
                                                     <div className="relative">
                                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="e.g., University of Lagos (Optional)" className="pl-9" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>Optional — tell us where you study or work.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="focusArea"
                                        render={({ field }) => (
                                            <FormItem className="mt-6">
                                                <FormLabel>Area of Focus</FormLabel>
                                                 <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                                                    >
                                                        {focusAreas.map(area => (
                                                            <FormItem key={area.id} className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                     <RadioGroupItem value={area.label} id={area.id} />
                                                                </FormControl>
                                                                <FormLabel htmlFor={area.id} className="font-normal">{area.label}</FormLabel>
                                                            </FormItem>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                

                                <div className="flex gap-4 pt-4">
                                    {currentStep > 1 && (
                                        <Button onClick={handlePrevStep} type="button" variant="outline" className="w-full">
                                            <ArrowLeft className="mr-2" />
                                            Back
                                        </Button>
                                    )}
                                    {currentStep < 3 ? (
                                        <Button onClick={handleNextStep} type="button" size="lg" className="w-full">
                                            Next
                                            <ArrowDown className="ml-2" />
                                        </Button>
                                    ) : (
                                         <Button type="submit" disabled={isLoading || !form.formState.isValid} size="lg" className="w-full">
                                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </section>
    </div>
  );
}

