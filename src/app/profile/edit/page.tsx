
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getMemberProfile, type MemberProfile } from '../actions';
import { updateMemberProfile, UpdateFormSchema, type UpdateFormValues } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

function EditProfileSkeleton() {
    return (
        <Card>
            <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                </div>
                <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-24 w-full" /></div>
                <Skeleton className="h-11 w-32" />
            </CardContent>
        </Card>
    );
}


export default function EditProfilePage() {
    const [aetherId, setAetherId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<UpdateFormValues>({
        resolver: zodResolver(UpdateFormSchema),
        defaultValues: {},
    });

    useEffect(() => {
        const storedAetherId = localStorage.getItem('aether_user_id');
        if (!storedAetherId) {
            router.push('/login');
            return;
        }
        setAetherId(storedAetherId);

        async function fetchProfile() {
            const result = await getMemberProfile(storedAetherId);
            if (result.success && result.data) {
                form.reset(result.data);
            } else {
                toast({ title: 'Error', description: 'Could not load your profile.', variant: 'destructive' });
                router.push('/profile');
            }
            setIsFetching(false);
        }
        fetchProfile();
    }, [router, toast, form]);

    const onSubmit: SubmitHandler<UpdateFormValues> = async (data) => {
        if (!aetherId) return;
        setIsLoading(true);
        try {
            const result = await updateMemberProfile(aetherId, data);
            if (result.success) {
                // Update local storage if name changed
                localStorage.setItem('aether_user_name', data.fullName);
                toast({
                    title: 'Profile Updated',
                    description: 'Your changes have been saved successfully.',
                });
                router.push('/profile');
                router.refresh(); // Tell Next.js to refresh server components
            } else {
                throw new Error(result.error || 'An unexpected error occurred.');
            }
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <main className="container py-12 md:py-24 animate-in fade-in duration-500">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Button variant="ghost" asChild>
                        <Link href="/profile">
                            <ArrowLeft className="mr-2" /> Back to Profile
                        </Link>
                    </Button>
                </div>
                 {isFetching ? <EditProfileSkeleton /> : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl">Edit Profile</CardTitle>
                            <CardDescription>Update your personal information. This will be visible to other members in the community.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField control={form.control} name="fullName" render={({ field }) => (
                                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="location" render={({ field }) => (
                                        <FormItem><FormLabel>City + Country</FormLabel><FormControl><Input placeholder="e.g. Lagos, Nigeria" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="ageRange" render={({ field }) => (
                                            <FormItem><FormLabel>Age Range</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select your age range" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="<18">&lt;18</SelectItem>
                                                    <SelectItem value="18-24">18-24</SelectItem>
                                                    <SelectItem value="25-34">25-34</SelectItem>
                                                    <SelectItem value="35-44">35-44</SelectItem>
                                                    <SelectItem value="45-60">45-60</SelectItem>
                                                </SelectContent>
                                            </Select><FormMessage /></FormItem>
                                        )} />
                                         <FormField control={form.control} name="role" render={({ field }) => (
                                            <FormItem><FormLabel>Current Role</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select your current role" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Student">Student</SelectItem>
                                                    <SelectItem value="Graduate">Graduate</SelectItem>
                                                    <SelectItem value="Professional">Professional</SelectItem>
                                                </SelectContent>
                                            </Select><FormMessage /></FormItem>
                                        )} />
                                    </div>

                                    <FormField control={form.control} name="mainInterest" render={({ field }) => (
                                        <FormItem><FormLabel>Main Interest</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select your main interest" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Courses">Courses & Learning</SelectItem>
                                                <SelectItem value="Studio">Studio Projects & Collaboration</SelectItem>
                                                <SelectItem value="Community">Community & Networking</SelectItem>
                                                <SelectItem value="Mentorship">Mentorship</SelectItem>
                                            </SelectContent>
                                        </Select><FormMessage /></FormItem>
                                    )} />

                                    <FormField control={form.control} name="reasonToJoin" render={({ field }) => (
                                        <FormItem><FormLabel>What do you hope to achieve with Aether? <span className="text-muted-foreground">(Optional)</span></FormLabel><FormControl><Textarea placeholder="e.g., 'To collaborate on innovative projects...'" className="resize-none" rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />

                                    <Button type="submit" disabled={isLoading} size="lg">
                                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                      Save Changes
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    )
}
