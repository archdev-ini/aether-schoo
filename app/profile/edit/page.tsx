
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getMemberProfile } from '../actions';
import { updateMemberProfile, UpdateFormSchema, type UpdateFormValues } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

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
];

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
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<UpdateFormValues>({
        resolver: zodResolver(UpdateFormSchema),
        defaultValues: {},
    });

    useEffect(() => {
        async function fetchProfile() {
            const result = await getMemberProfile();
            if (result.success && result.data) {
                form.reset({
                    fullName: result.data.fullName || '',
                    username: result.data.username || '',
                    location: result.data.location || '',
                    workplace: result.data.workplace || '',
                    focusArea: result.data.focusArea || '',
                    goals: result.data.goals || [],
                });
            } else {
                toast({ title: 'Error', description: 'Could not load your profile.', variant: 'destructive' });
                router.push('/profile');
            }
            setIsFetching(false);
        }
        fetchProfile();
    }, [router, toast, form]);

    const onSubmit: SubmitHandler<UpdateFormValues> = async (data) => {
        setIsLoading(true);
        try {
            const result = await updateMemberProfile(data);
            if (result.success) {
                localStorage.setItem('aether_user_name', data.fullName);
                window.dispatchEvent(new Event('auth-change'));
                toast({
                    title: 'Profile Updated',
                    description: 'Your changes have been saved successfully.',
                });
                router.push('/profile');
                router.refresh(); 
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
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline text-2xl">Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                     <FormField control={form.control} name="fullName" render={({ field }) => (
                                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="username" render={({ field }) => (
                                        <FormItem><FormLabel>Username</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>This will be visible to other members.</FormDescription><FormMessage /></FormItem>
                                    )} />
                                    <div className="grid md:grid-cols-2 gap-6">
                                         <FormField control={form.control} name="location" render={({ field }) => (
                                            <FormItem><FormLabel>Country / City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                         <FormField control={form.control} name="workplace" render={({ field }) => (
                                            <FormItem><FormLabel>University / Workplace</FormLabel><FormControl><Input placeholder="(Optional)" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField name="email" render={() => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input disabled value={form.getValues('email' as any)} /></FormControl><FormDescription>Your email is used for login and cannot be changed.</FormDescription></FormItem>
                                    )} />
                                </CardContent>
                            </Card>

                             <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline text-2xl">Interests & Goals</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                      <FormField
                                        control={form.control}
                                        name="goals"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel className="text-base">What are your goals?</FormLabel>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                                {goalsList.map((item) => (
                                                    <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="goals"
                                                        render={({ field }) => {
                                                            return (
                                                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
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
                                </CardContent>
                            </Card>

                            <Button type="submit" disabled={isLoading || !form.formState.isDirty} size="lg">
                              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Save Changes
                            </Button>
                        </form>
                    </Form>
                )}
            </div>
        </main>
    )
}
