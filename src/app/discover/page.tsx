'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { discoverInterests, type DiscoverInterestsOutput } from '@/ai/flows/discover-interests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const FormSchema = z.object({
  keywords: z.string().min(10, {
    message: 'Please tell us a bit more about your interests (at least 10 characters).',
  }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function DiscoverPage() {
  const [result, setResult] = useState<DiscoverInterestsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      keywords: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await discoverInterests({ keywords: data.keywords });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to discover interests. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Discover Your Path</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Use our AI tool to find the programs and resources that align with your passions.
        </p>
      </div>

      <div className="max-w-2xl mx-auto grid gap-12">
        <Card>
          <CardHeader>
            <CardTitle>What are your interests?</CardTitle>
            <CardDescription>
              Describe your interests, skills, or project ideas. For example, "I'm interested in using machine learning for climate change solutions" or "decentralized finance and building DAOs".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Your Interests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us what you're passionate about..."
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Discover
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
            <Card>
                <CardHeader>
                    <CardTitle>Analyzing your interests...</CardTitle>
                    <CardDescription>Our AI is finding the best matches for you in the Aether Ecosystem.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-4 bg-muted rounded-full w-full animate-pulse"></div>
                    <div className="h-4 bg-muted rounded-full w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded-full w-3/4 animate-pulse"></div>
                </CardContent>
            </Card>
        )}

        {result && (
          <Card className="bg-accent/50 border-primary/20">
            <CardHeader>
              <CardTitle>Your Personalized Recommendations</CardTitle>
              <CardDescription>Based on your interests, here are some parts of the Aether Ecosystem you might find exciting:</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap font-medium text-accent-foreground">{result.relevantPrograms}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
