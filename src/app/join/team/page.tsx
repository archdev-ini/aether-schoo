
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, MailCheck, ShieldQuestion } from 'lucide-react';
import { submitTeamRequest } from './actions';
import Link from 'next/link';

const FormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('A valid email is required.'),
  telegramHandle: z.string().optional(),
  existingAetherId: z.string().optional(),
  team: z.string({ required_error: 'Please select a team.' }),
  teamRole: z.string().min(2, 'Team role is required.'),
  secretPassphrase: z.string().min(8, 'Passphrase must be at least 8 characters.'),
  supervisor: z.string({ required_error: 'Please select your supervisor/approver.' }),
  confirmInfo: z.boolean().default(false).refine(val => val === true, { message: 'You must confirm your information is correct.' }),
  confirmTerms: z.boolean().default(false).refine(val => val === true, { message: 'You must agree to the terms.' }),
});

export type FormValues = z.infer<typeof FormSchema>;

// Mock data for dropdowns
const TEAMS = ["Design", "Operations", "Development", "Community", "Research"];
const SUPERVISORS = ["Team Lead", "Ecosystem Admin", "Super Admin"];

export default function TeamJoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      telegramHandle: '',
      existingAetherId: '',
      teamRole: '',
      secretPassphrase: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
        const result = await submitTeamRequest(data);
        if (result.success) {
            setSubmitted(true);
        } else {
            throw new Error(result.error || 'An unexpected error occurred.');
        }
    } catch(error: any) {
         toast({
            title: 'Error',
            description: error.message || 'There was a problem with your submission.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  if (submitted) {
    return (
        <main className="container py-12 md:py-24 animate-in fade-in duration-500">
            <div className="max-w-2xl mx-auto text-center">
                <Card>
                    <CardHeader className="items-center">
                        <MailCheck className="w-16 h-16 text-primary" />
                        <CardTitle className="text-3xl font-bold mt-4">Request Submitted!</CardTitle>
                        <CardDescription>
                            Thank you. Your request for a Team Member ID has been sent for approval. You will be notified by email once it has been processed.
                        </CardDescription>
                    </CardHeader>
                     <CardContent>
                        <Button asChild>
                            <Link href="/">Return to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
  }

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
            <ShieldCheck className="w-12 h-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Team Member ID Request</h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
                Fill out this form to request your official Aether Team ID (ATM-...).
            </p>
        </div>
        <Card>
            <CardContent className="p-6 md:p-8">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        {/* Section 1: Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                             <FormField control={form.control} name="fullName" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="your.name@aether.build" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="telegramHandle" render={({ field }) => (
                                    <FormItem><FormLabel>Phone / Telegram Handle</FormLabel><FormControl><Input placeholder="@yourhandle (Optional)" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="existingAetherId" render={({ field }) => (
                                    <FormItem><FormLabel>Existing Aether ID</FormLabel><FormControl><Input placeholder="AETH-... (Optional)" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                        </div>

                        {/* Section 2: Team Assignment */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Team Assignment</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                 <FormField control={form.control} name="team" render={({ field }) => (
                                    <FormItem><FormLabel>Select Team</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Choose your team" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {TEAMS.map(team => <SelectItem key={team} value={team}>{team}</SelectItem>)}
                                        </SelectContent>
                                    </Select><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="teamRole" render={({ field }) => (
                                    <FormItem><FormLabel>Team Role</FormLabel><FormControl><Input placeholder="e.g., Lead Designer" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                        </div>

                         {/* Section 3: Security */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Security & Verification</h3>
                             <div className="grid md:grid-cols-2 gap-6">
                                 <FormField control={form.control} name="secretPassphrase" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Secret Passphrase</FormLabel>
                                        <FormControl><Input type="password" placeholder="Choose a memorable phrase" {...field} /></FormControl>
                                        <FormDescription>Used for account recovery. Keep it safe.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="supervisor" render={({ field }) => (
                                    <FormItem><FormLabel>Supervisor / Approver</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select an approver" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                             {SUPERVISORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                     <FormDescription>Your request will be sent here for approval.</FormDescription>
                                    <FormMessage /></FormItem>
                                )}/>
                            </div>
                        </div>

                         {/* Section 4: Confirmation */}
                        <div className="space-y-4">
                             <h3 className="text-lg font-semibold border-b pb-2">Confirmation</h3>
                             <FormField control={form.control} name="confirmInfo" render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>I confirm that all information provided is correct.</FormLabel>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}/>
                              <FormField control={form.control} name="confirmTerms" render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>I understand my Team Member ID is unique, non-transferable, and subject to Aether's terms of use.</FormLabel>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}/>
                        </div>

                        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldQuestion className="mr-2 h-4 w-4" />}
                          Submit Request for Approval
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
