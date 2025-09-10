
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, type FormValues, submitJoinForm } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowDown, AtSign, ArrowLeft, Briefcase, MapPin, Sparkles, MailCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const focusAreas = [
    { id: 'student', label: 'Architecture Student' },
    { id: 'young-architect', label: 'Young Architect' },
    { id: 'designer', label: 'Designer' },
    { id: 'educator', label: 'Educator' },
    { id: 'enthusiast', label: 'Enthusiast' },
];

const goalsList = [
    { id: 'learn-skills', label: 'Learn new skills' },
    { id: 'build-portfolio', label: 'Build portfolio projects' },
    { id: 'join-competitions', label: 'Join competitions' },
    { id: 'find-mentors', label: 'Find mentors / peers' },
    { id: 'access-resources', label: 'Access resources & archives' },
]

export default function JoinPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { fullName: '', username: '', email: '', location: '', workplace: '', focusArea: undefined, goals: [] },
    mode: 'onChange',
  });

  const { trigger } = form;

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
        isValid = await trigger(['fullName', 'username', 'email']);
    } else if (currentStep === 2) {
        isValid = await trigger(['location', 'workplace', 'focusArea']);
    } else if (currentStep === 3) {
        isValid = await trigger(['goals']);
    }
    
    if (isValid) {
        if (currentStep < 4) {
             setCurrentStep(prev => prev + 1);
        }
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
        const result = await submitJoinForm(data);
        if (result.success) {
            setCurrentStep(4);
        } else {
             throw new Error(result.error || 'An unexpected error occurred.');
        }
    } catch (error: any) {
        toast({
            title: 'Error',
            description: error.message || 'There was a problem with your submission. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleScrollToForm = () => {
    document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  const progressValue = (currentStep / 3) * 100;
  const stepTitles = ["Account Basics", "Your Background", "Your Goals", "Success!"];


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
                        {currentStep < 4 ? <Progress value={progressValue} className="mb-4 h-2" /> : null}
                        <CardTitle className="text-2xl font-headline">
                            {currentStep < 4 ? `Step ${currentStep}: ${stepTitles[currentStep - 1]}` : stepTitles[3]}
                        </CardTitle>
                        {currentStep === 1 && <CardDescription>Let's get started with the essentials. This information will help us set up your Aether identity.</CardDescription>}
                        {currentStep === 2 && <CardDescription>Tell us a bit about your background to help us connect you with the right people.</CardDescription>}
                        {currentStep === 3 && <CardDescription>What are you hoping to achieve? Your answers help us shape the future of Aether.</CardDescription>}
                        {currentStep === 4 && <CardDescription>You're all set! We're excited to have you in the community.</CardDescription>}
                    </CardHeader>
                    <CardContent>
                       {currentStep < 4 ? (
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
                                <div className={cn(currentStep === 3 ? 'block' : 'hidden')}>
                                     <FormField
                                        control={form.control}
                                        name="goals"
                                        render={() => (
                                            <FormItem>
                                                <div className="mb-4">
                                                    <FormLabel className="text-base">Why are you joining Aether?</FormLabel>
                                                    <FormDescription>Select all that apply. This helps us tailor prelaunch access and recommendations.</FormDescription>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4 pt-2">
                                                {goalsList.map((item) => (
                                                    <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="goals"
                                                        render={({ field }) => {
                                                            return (
                                                            <FormItem
                                                                key={item.id}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item.label)}
                                                                    onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...(field.value || []), item.label])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                            (value) => value !== item.label
                                                                            )
                                                                        )
                                                                    }}
                                                                />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                                            </FormItem>
                                                            )
                                                        }}
                                                    />
                                                ))}
                                                </div>
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
                                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Sparkles className="mr-2 h-4 w-4" />Create Account</>}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </Form>
                       ) : (
                           <div className="text-center space-y-6 animate-in fade-in duration-500">
                                <MailCheck className="w-16 h-16 text-primary mx-auto"/>
                                <p className="text-lg text-muted-foreground">Thank you for joining! We've sent a magic link to your email address to activate your account. Please check your inbox (and spam folder).</p>
                           </div>
                       )}
                    </CardContent>
                </Card>
            </div>
        </section>
    </div>
  );
}
