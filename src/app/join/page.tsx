
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
import { Loader2, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { submitJoinForm } from './actions';
import { Checkbox } from '@/components/ui/checkbox';

const interestsList = [
    { id: 'BIM', label: 'BIM' },
    { id: 'Sustainability', label: 'Sustainability' },
    { id: 'African Design', label: 'African Design Traditions' },
    { id: 'Architecture', label: 'Architecture' },
    { id: 'Web3', label: 'Web3 & Decentralization' },
    { id: 'AI', label: 'AI in Design' },
    { id: 'Urbanism', label: 'Urbanism' },
    { id: 'Materials', label: 'Material Science' },
];

const FormSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  location: z.string().min(3, { message: 'Please enter your city and country.' }),
  interests: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one interest.',
  }),
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
        interests: [],
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

                        <FormField
                            control={form.control}
                            name="interests"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">What are your interests?</FormLabel>
                                        <p className="text-sm text-muted-foreground">Select all that apply. This helps us recommend content for you.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                    {interestsList.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="interests"
                                            render={({ field }) => {
                                                return (
                                                <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), item.id])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                (value) => value !== item.id
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
                         <FormField control={form.control} name="portfolioUrl" render={({ field }) => (
                            <FormItem><FormLabel>LinkedIn URL <span className="text-muted-foreground">(Optional)</span></FormLabel><FormControl><Input placeholder="https://linkedin.com/in/yourprofile" {...field} /></FormControl><FormMessage /></FormItem>
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
