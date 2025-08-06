'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck } from 'lucide-react';
import { submitContactForm } from './actions';

const FormSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Please enter a subject.' }),
  message: z.string().min(10, { message: 'Please enter a message (at least 10 characters).' }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      const result = await submitContactForm(data);
      if (result.success) {
        setSubmitted(true);
      } else {
        throw new Error(result.error || 'An unexpected error occurred.');
      }
    } catch (error: any) {
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
      <main className="container py-12 md:py-24 lg:py-32 animate-in fade-in duration-500">
        <div className="text-center max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <MailCheck className="w-16 h-16 mx-auto text-primary" />
              <CardTitle className="text-3xl font-bold mt-4">Message Sent!</CardTitle>
              <CardDescription>
                Thank you for reaching out. We've received your message and will get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Get in Touch</h1>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Have a question or want to collaborate? We'd love to hear from you.
          </p>
        </div>
        <Card>
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="your@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="subject" render={({ field }) => (
                  <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="What is your message about?" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Your message..." className="resize-none" rows={6} {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Message
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
