
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Users, Calendar, Archive } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MemberFormSchema, MemberFormValues } from '@/types/member';
import { createMember } from './actions';
import { Form, FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form';

const benefits = [
    {
        icon: Calendar,
        title: "Event Access",
        description: "Use your ID to register and attend Aether events.",
    },
    {
        icon: Users,
        title: "Community Entry",
        description: "IDs verify you inside our Discord, Telegram, and WhatsApp spaces.",
    },
    {
        icon: Archive,
        title: "Future-Ready",
        description: "Your ID will connect you to the Aether Archive and partner experiences.",
    },
];

export default function JoinPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const { toast } = useToast();

    const form = useForm<MemberFormValues>({
        resolver: zodResolver(MemberFormSchema),
        defaultValues: {
            fullName: '',
            email: '',
            institution: '',
            location: '',
        },
    });

    const onSubmit = async (data: MemberFormValues) => {
        setIsSubmitting(true);
        try {
            const result = await createMember(data);
            if (result.success) {
                setSubmissionSuccess(true);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Something went wrong.',
                    description: result.error || 'Could not create your Aether ID.',
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Something went wrong.',
                description: 'Could not create your Aether ID.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submissionSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center animate-in fade-in duration-500">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Your Aether ID has been created!</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Check your email for your new ID and exclusive community invite links. Welcome to Aether.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container py-20 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold tracking-tight mb-4">Get Your Aether ID</h1>
                    <p className="text-xl text-muted-foreground">
                        Your ID is the key to Aether — access events, connect with the community, and explore the Archive.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-start">
                    {/* Benefits Section */}
                    <div className="space-y-10">
                         <h2 className="text-3xl font-bold">Why Create an ID?</h2>
                         <div className="space-y-8">
                            {benefits.map((benefit) => (
                                <div key={benefit.title} className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="bg-muted p-3 rounded-lg">
                                            <benefit.icon className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1">{benefit.title}</h3>
                                        <p className="text-muted-foreground">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="bg-card p-8 border rounded-lg shadow-sm">
                         <h2 className="text-3xl font-bold mb-6">Create Your Aether ID</h2>
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="fullName">Full Name</Label>
                                            <FormControl>
                                                <Input id="fullName" placeholder="Jane Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="email">Email Address</Label>
                                            <FormControl>
                                                <Input id="email" type="email" placeholder="jane@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="institution"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="institution">Institution / Organization (Optional)</Label>
                                            <FormControl>
                                                <Input id="institution" placeholder="University of Architecture" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                               <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="location">Country / Location</Label>
                                            <FormControl>
                                                <Input id="location" placeholder="Lagos, Nigeria" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Generating...' : 'Get My ID'}
                                    {!isSubmitting && <ArrowRight className="ml-2" />}
                                </Button>
                            </form>
                         </Form>
                    </div>
                </div>

                 {/* Closing Line */}
                <div className="text-center mt-20">
                    <p className="text-lg text-muted-foreground">
                        Your Aether journey starts here. Claim your ID today — and be ready for our launch this November.
                    </p>
                </div>
            </div>
        </div>
    );
}
