
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Fingerprint, Sparkles, UserPlus } from 'lucide-react';
import { WelcomeCard } from '@/components/common/WelcomeCard';
import { generateIdForNewMember, NewMemberSchema, type NewMemberFormValues } from './actions';

export default function CreateMemberPage() {
  const [result, setResult] = useState<{ fullName: string; aetherId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<NewMemberFormValues>({
    resolver: zodResolver(NewMemberSchema),
    defaultValues: { fullName: '', email: '', role: 'Student' },
  });

  const onSubmit: SubmitHandler<NewMemberFormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateIdForNewMember(data);
      if (response.success && response.data) {
        setResult(response.data);
        form.reset(); // Clear the form on success
      } else {
        throw new Error(response.error || 'An unknown error occurred.');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Create New Member</h1>
        <p className="text-muted-foreground mt-1">Manually generate Aether and Team IDs for new members.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>New Member Details</CardTitle>
            <CardDescription>Fill out the form to create a new member and generate their unique ID.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Ada Lovelace" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="ada@example.com" type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem><FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Staff">Staff (Team ID)</SelectItem>
                        <SelectItem value="Superadmin">Superadmin (Team ID)</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Location <span className="text-muted-foreground">(Optional)</span></FormLabel><FormControl><Input placeholder="e.g., London, UK" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  Create Member & Generate ID
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div>
          {isLoading && (
            <Card className="flex flex-col items-center justify-center p-8 space-y-4 h-full">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground">Generating ID and creating member...</p>
            </Card>
          )}
          {result && (
            <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <Sparkles className="w-5 h-5"/>
                    <p>New Member Created Successfully!</p>
                </div>
                <WelcomeCard fullName={result.fullName} aetherId={result.aetherId} />
            </div>
          )}
           {!isLoading && !result && (
             <Card className="flex flex-col items-center justify-center p-8 space-y-4 h-full border-dashed">
                <Fingerprint className="w-12 h-12 text-muted-foreground/50" />
                <p className="text-muted-foreground text-center">The generated ID card will appear here once you submit the form.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
