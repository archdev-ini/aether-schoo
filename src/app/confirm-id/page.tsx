
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
import { Loader2, UserCheck, Search, ShieldX } from 'lucide-react';
import { findMemberById, type MemberDetails } from './actions';

const FormSchema = z.object({
  aetherId: z.string().min(5, { message: 'Please enter a valid Aether ID.' }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ConfirmIdPage() {
  const [memberDetails, setMemberDetails] = useState<MemberDetails | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      aetherId: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setMemberDetails(null);
    setNotFound(false);
    try {
      const result = await findMemberById(data.aetherId.toUpperCase());
      if (result.success && result.data) {
        setMemberDetails(result.data);
      } else if (!result.success && result.error === 'Member not found.') {
        setNotFound(true);
      }
      else {
        throw new Error(result.error || 'An unexpected error occurred.');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'There was a problem confirming your ID.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchAgain = () => {
    setMemberDetails(null);
    setNotFound(false);
    form.reset();
  }

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Confirm Your Aether ID</h1>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Enter your ID to verify your membership and retrieve your details.
          </p>
        </div>

        {!memberDetails && !notFound && (
            <Card>
                <CardHeader>
                    <CardTitle>Enter your ID</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="aetherId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Aether ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="AETH-XX123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Searching...' : 'Confirm ID'}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>
        )}

        {isLoading && !memberDetails && !notFound && (
            <div className="text-center p-8 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Searching for your ID...</p>
            </div>
        )}

        {memberDetails && (
            <Card className="text-center animate-in fade-in duration-300">
                <CardHeader>
                    <UserCheck className="w-16 h-16 mx-auto text-primary" />
                    <CardTitle className="text-3xl font-bold mt-4">ID Verified!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-xl font-semibold">{memberDetails.fullName}</p>
                     <p className="font-mono text-lg p-2 bg-muted rounded-md">{memberDetails.aetherId}</p>
                     <p className="text-muted-foreground text-sm">You can now use this ID to access community resources.</p>
                     <Button onClick={handleSearchAgain} variant="outline" className="mt-4">
                        <Search className="mr-2"/>
                        Search for another ID
                     </Button>
                </CardContent>
            </Card>
        )}

        {notFound && (
             <Card className="text-center animate-in fade-in duration-300 border-destructive">
                <CardHeader>
                    <ShieldX className="w-16 h-16 mx-auto text-destructive" />
                    <CardTitle className="text-3xl font-bold mt-4">ID Not Found</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-muted-foreground">We couldn't find an Aether ID matching what you entered. Please check the ID and try again.</p>
                     <Button onClick={handleSearchAgain} className="mt-4">
                        <Search className="mr-2"/>
                        Try Again
                     </Button>
                </CardContent>
            </Card>
        )}

      </div>
    </main>
  );
}
