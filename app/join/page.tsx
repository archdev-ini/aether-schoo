
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from "@/components/ui/progress"
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, ArrowLeft, Fingerprint, Sparkles, Target } from 'lucide-react';
import { generateAetherIdForUser, submitJoinForm } from './actions';
import { WelcomeCard } from '@/components/common/WelcomeCard';

const steps = [
  { id: 'Step 1', name: 'Account Basics', fields: ['fullName', 'username', 'email'] },
  { id: 'Step 2', name: 'Background', fields: ['location', 'workplace', 'role'] },
  { id: 'Step 3', name: 'Your Goals', fields: ['interests', 'portfolioUrl'] },
  { id: 'Step 4', name: 'Your Aether ID' },
  { id: 'Step 5', name: 'Confirmation' },
]

const FormSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  location: z.string().min(3, { message: 'Please enter your city and country.' }),
  workplace: z.string().optional(),
  role: z.string({ required_error: 'Please select an area of focus.' }),
  interests: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one interest.',
  }),
  portfolioUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

export type FormValues = z.infer<typeof FormSchema>;

const interestsList = [
    { id: 'Learn new skills', label: 'Learn new skills' },
    { id: 'Build portfolio projects', label: 'Build portfolio projects' },
    { id: 'Join competitions', label: 'Join competitions' },
    { id: 'Find mentors & peers', label: 'Find mentors & peers' },
    { id: 'Access resources & archives', label: 'Access resources & archives' },
];

const rolesList = [
    'Architecture Student',
    'Young Architect',
    'Designer',
    'Educator / Researcher',
    'Enthusiast / Other',
];

export default function JoinPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [aetherId, setAetherId] = useState('');
  const [entryNumber, setEntryNumber] = useState(0);
  const [submittedData, setSubmittedData] = useState<{fullName: string, aetherId: string} | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        fullName: '', username: '', email: '', location: '', workplace: '', role: '', interests: [], portfolioUrl: '',
    },
  });

  const { trigger } = form;

  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as (keyof FormValues)[], { shouldFocus: true });

    if (!output) return;

    if (currentStep === 2) { // After Goals step, before showing ID
        setIsLoading(true);
        try {
            const { aetherId, entryNumber } = await generateAetherIdForUser();
            setAetherId(aetherId);
            setEntryNumber(entryNumber);
        } catch (error: any) {
             toast({ title: 'Error', description: 'Could not generate an Aether ID. Please try again.', variant: 'destructive' });
             setIsLoading(false);
             return;
        }
        setIsLoading(false);
    }
    
    if (currentStep < steps.length - 1) {
       setCurrentStep(step => step + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
        const result = await submitJoinForm(data, aetherId, entryNumber);
        if (result.success) {
            setSubmittedData({ fullName: result.fullName!, aetherId: result.aetherId! });
            setCurrentStep(steps.length - 1);
        } else {
            throw new Error(result.error || 'An unexpected error occurred.');
        }
    } catch(error: any) {
         toast({ title: 'Error', description: error.message || 'There was a problem. Please try again.', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Join the Aether Ecosystem</h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
                Create your Aether account to receive your unique ID and access the ecosystem.
            </p>
        </div>
        <Card>
            <CardHeader>
                <Progress value={(currentStep + 1) / steps.length * 100} className="mb-4" />
                <CardTitle>{steps[currentStep].name}</CardTitle>
                 {currentStep === 0 && <CardDescription>✨ Let’s Get Started</CardDescription>}
                 {currentStep === 1 && <CardDescription>🌍 Tell Us About You</CardDescription>}
                 {currentStep === 2 && <CardDescription>🎯 Why Join Aether?</CardDescription>}
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        {currentStep === 0 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                                        <FormDescription>Use your real name. This helps us personalize your Aether ID.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="username" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl><Input placeholder="yourusername" {...field} /></FormControl>
                                         <FormDescription>This is your public name inside Aether. Choose something short & recognizable.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                                         <FormDescription>We’ll send your magic link here to activate your account.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        )}

                        {currentStep === 1 && (
                             <div className="space-y-6 animate-in fade-in duration-300">
                                <FormField control={form.control} name="location" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country / Location</FormLabel>
                                        <FormControl><Input placeholder="e.g. Lagos, Nigeria" {...field} /></FormControl>
                                        <FormDescription>Where you’re based (city or country). Helps us connect you to regional opportunities.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="workplace" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>University / Workplace <span className="text-muted-foreground">(Optional)</span></FormLabel>
                                        <FormControl><Input placeholder="e.g. University of Lagos" {...field} /></FormControl>
                                        <FormDescription>If you’re currently studying or practicing, let us know.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="role" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Area of Focus</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select your status" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {rolesList.map(role => (
                                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Pick the one that best describes you.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        )}

                        {currentStep === 2 && (
                             <div className="space-y-6 animate-in fade-in duration-300">
                                <FormField control={form.control} name="interests" render={() => (
                                    <FormItem>
                                        <div className="space-y-2">
                                            {interestsList.map((item) => (
                                                <FormField key={item.id} control={form.control} name="interests" render={({ field }) => (
                                                    <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:bg-muted/50">
                                                        <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                                            return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                                        }} /></FormControl>
                                                        <FormLabel className="font-normal w-full cursor-pointer">{item.label}</FormLabel>
                                                    </FormItem>
                                                ))}
                                            />))}
                                        </div>
                                         <FormDescription>Your choices help us tailor early access invites and recommendations.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="portfolioUrl" render={({ field }) => (
                                    <FormItem><FormLabel>LinkedIn / Portfolio URL <span className="text-muted-foreground">(Optional)</span></FormLabel><FormControl><Input placeholder="https://linkedin.com/in/yourprofile" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                        )}
                        
                        {currentStep === 3 && (
                            <div className="text-center space-y-6 animate-in fade-in duration-300">
                                <Fingerprint className="w-16 h-16 mx-auto text-primary" />
                                <div>
                                    <h3 className="text-2xl font-bold font-headline">Your Passport to the Creative Future</h3>
                                    <p className="text-muted-foreground mt-2">This is your permanent, unique ID in the Aether ecosystem. We've generated one for you.</p>
                                </div>
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="font-mono text-2xl font-bold text-primary tracking-widest">{aetherId}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">Click next to lock in this ID and continue.</p>
                            </div>
                        )}
                        
                        {currentStep === 4 && submittedData && (
                            <div className="text-center space-y-6 animate-in fade-in duration-300">
                                <Sparkles className="w-16 h-16 mx-auto text-primary" />
                                 <div>
                                    <h3 className="text-2xl font-bold font-headline">Congrats, {submittedData.fullName.split(' ')[0]}! You’re a Founding Member.</h3>
                                    <p className="text-muted-foreground mt-2">Welcome to the ecosystem. Your confirmation email is on its way. Here is your permanent Aether ID card.</p>
                                </div>
                                <WelcomeCard fullName={submittedData.fullName} aetherId={submittedData.aetherId} />
                            </div>
                        )}

                        <div className="mt-8 flex justify-between">
                            {currentStep > 0 && currentStep < steps.length - 1 && (
                                <Button type="button" variant="outline" onClick={handlePrev} disabled={isLoading}>
                                    <ArrowLeft className="mr-2" /> Back
                                </Button>
                            )}
                            
                            {(currentStep === 0) && <div/>}

                             {currentStep < 3 && (
                                <Button type="button" onClick={handleNext} disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    👉 Next
                                </Button>
                            )}

                             {currentStep === 3 && (
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Complete Registration
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}

    