
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
import { Loader2, Lightbulb, MailCheck } from 'lucide-react';
import { submitSuggestion } from './actions';

const FormSchema = z.object({
  title: z.string().min(5, { message: 'Please provide a title for your idea.' }),
  description: z.string().min(20, { message: 'Please describe your idea in at least 20 characters.' }),
  fullName: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function SuggestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      description: '',
      fullName: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      const result = await submitSuggestion(data);
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
              <CardTitle className="text-3xl font-bold mt-4">Suggestion Submitted!</CardTitle>
              <CardDescription>
                Thank you for helping shape the future of Aether School. We've received your idea and our team will review it.
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
            <Lightbulb className="w-12 h-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Suggest Content for the Library</h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
                Have an idea for a course, primer, or archive we should create? Let us know! The best ideas come from the community.
            </p>
        </div>
        <Card>
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Suggestion Title</FormLabel><FormControl><Input placeholder="e.g., 'Primer on Traditional Yoruba Architecture'" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Why is this important?</FormLabel><FormControl><Textarea placeholder="Describe the topic and why it would be valuable for the Aether community..." className="resize-none" rows={6} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Your Name <span className="text-muted-foreground">(Optional)</span></FormLabel><FormControl><Input placeholder="Let us know who to credit!" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />

                <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Idea
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
