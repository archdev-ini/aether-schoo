
'use client';

import { Suspense, useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getEventDetails, submitRsvp, submitGuestRsvp, type EventDetail } from './actions';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User, Clock, Users, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function formatEventTime(dateStr: string) {
    const date = new Date(dateStr);
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Africa/Lagos' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', timeZoneName: 'short', timeZone: 'Africa/Lagos' };
    return {
        date: date.toLocaleDateString('en-US', dateOptions),
        time: date.toLocaleTimeString('en-US', timeOptions)
    }
}

function GuestRsvpForm({ eventId }: { eventId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const formAction = async (formData: FormData) => {
        setIsLoading(true);
        const result = await submitGuestRsvp(eventId, formData);
        if (result.success) {
            toast({
                title: 'Success!',
                description: "You've successfully RSVP'd for this event.",
            });
            router.refresh();
        } else {
            toast({
                title: 'Error',
                description: result.error || 'Could not process your RSVP.',
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    };

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" placeholder="Ada Lovelace" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="ada@example.com" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm RSVP'}
            </Button>
        </form>
    );
}


function RsvpButton({ hasRsvpd, event }: { hasRsvpd: boolean; event: EventDetail }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const isLoggedIn = !!document.cookie.includes('aether_user_id');

    const handleLoggedInRsvp = async () => {
        setIsSubmitting(true);
        const result = await submitRsvp(event.id);
        if (result.success) {
            toast({
                title: 'Success!',
                description: "You've successfully RSVP'd for this event.",
            });
            router.refresh();
        } else {
            toast({
                title: 'Error',
                description: result.error || 'Could not process your RSVP.',
                variant: 'destructive',
            });
        }
        setIsSubmitting(false);
    };

    if (event.status === 'Past') {
        return <Button size="lg" className="w-full" disabled>This event has ended</Button>;
    }
    
    if (hasRsvpd) {
        return (
            <Button size="lg" className="w-full" disabled variant="secondary">
                <CheckCircle className="mr-2" /> You're Going!
            </Button>
        );
    }
    
    if (isLoggedIn) {
        return (
             <Button onClick={handleLoggedInRsvp} size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'RSVP - It\'s Free'}
            </Button>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full">RSVP - It's Free</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>RSVP for {event.title}</DialogTitle>
                    <DialogDescription>
                        Enter your details to confirm your attendance. If you have an account, please <Link href={`/join?redirect=/events/${event.eventCode}`} className="underline text-primary">log in</Link> first.
                    </DialogDescription>
                </DialogHeader>
                <GuestRsvpForm eventId={event.id} />
            </DialogContent>
        </Dialog>
    );
}

function AttendeeAvatars({ attendees }: { attendees: EventDetail['attendees'] }) {
    if (!attendees || attendees.length === 0) return null;

    const visibleAttendees = attendees.slice(0, 5);
    const hiddenCount = attendees.length - visibleAttendees.length;

    return (
        <div className="flex items-center">
            <div className="flex -space-x-2 overflow-hidden">
                {visibleAttendees.map(attendee => (
                    <Avatar key={attendee.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                         <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${attendee.aetherId}`} alt={attendee.name} />
                         <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
            {hiddenCount > 0 && (
                <span className="pl-3 text-sm font-medium text-muted-foreground">
                    + {hiddenCount} more
                </span>
            )}
        </div>
    )
}


function EventPageContent({ event }: { event: EventDetail }) {
    const { date, time } = formatEventTime(event.date);
    const speakers = event.speaker.split(';').map(s => s.trim());
    
    return (
      <>
        <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={event.coverImage || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop'}
              alt={event.title}
              fill
              className="object-cover"
              data-ai-hint="event cover"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 -mt-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg">
                    <Badge variant="outline" className="mb-2 w-fit">{event.type}</Badge>
                    <h1 className="text-3xl md:text-4xl font-bold font-headline">{event.title}</h1>
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> <span>Hosted by <strong>{speakers.length > 0 && speakers[0] !== 'TBA' ? speakers.join(', ') : 'Aether'}</strong></span></div>
                    </div>
                </div>
            
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h2 className="font-headline">About This Event</h2>
                    <p className="whitespace-pre-line">{event.description}</p>
                </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 self-start lg:sticky lg:top-24">
                <Card className="overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-start gap-4 text-sm">
                            <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">{date}</p>
                                <p className="text-muted-foreground">{time}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 text-sm">
                             <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">{event.rsvpCount} Attending</p>
                                <div className="mt-2">
                                   <AttendeeAvatars attendees={event.attendees}/>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <div className="bg-muted/50 p-6">
                       <RsvpButton hasRsvpd={event.hasRsvpd} event={event} />
                    </div>
                </Card>
            </aside>
        </div>
      </>
    );
}

function EventPageSkeleton() {
  return (
    <>
        <Skeleton className="h-64 md:h-96 w-full rounded-lg" />
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 -mt-12">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-background/80 p-6 rounded-lg">
                    <Skeleton className="h-6 w-20 mb-2" />
                    <Skeleton className="h-10 w-full md:w-3/4" />
                    <Skeleton className="h-5 w-1/2 mt-4" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                </div>
            </div>
            <aside className="space-y-6 lg:sticky lg:top-24 self-start">
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                     <div className="bg-muted/50 p-6">
                        <Skeleton className="h-12 w-full" />
                    </div>
                </Card>
            </aside>
        </div>
    </>
  );
}


export default function EventDetailPage({ params }: { params: { eventCode: string } }) {
    const [event, setEvent] = useState<EventDetail | null | undefined>(undefined);
    
    useEffect(() => {
        getEventDetails(params.eventCode).then(setEvent);
    }, [params.eventCode]);

    if (event === undefined) {
        return (
            <main className="container py-12 md:py-16">
                 <div className="mb-8">
                    <Button variant="ghost" asChild>
                        <Link href="/events"><ArrowLeft className="mr-2" /> Back to All Events</Link>
                    </Button>
                </div>
                <EventPageSkeleton />
            </main>
        );
    }
    
    if (event === null) {
        notFound();
    }

    return (
        <main className="container py-12 md:py-16 animate-in fade-in duration-500">
            <div className="mb-8">
                <Button variant="ghost" asChild>
                    <Link href="/events"><ArrowLeft className="mr-2" /> Back to All Events</Link>
                </Button>
            </div>
            <EventPageContent event={event} />
        </main>
    );
}
