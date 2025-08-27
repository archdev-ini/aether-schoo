
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { notFound, useRouter } from 'next/navigation';
import { getEventDetails, submitRsvp, type EventDetail } from './actions';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Calendar, User, Clock, Users, Ticket, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function formatEventTime(dateStr: string) {
    const date = new Date(dateStr);
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Lagos' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', timeZoneName: 'short', timeZone: 'Africa/Lagos' };
    return {
        date: date.toLocaleDateString('en-US', dateOptions),
        time: date.toLocaleTimeString('en-US', timeOptions)
    }
}

function RsvpButton({ hasRsvpd, eventStatus, onRsvpSubmit }: { hasRsvpd: boolean, eventStatus: string, onRsvpSubmit: () => Promise<void> }) {
    const [isPending, setIsPending] = useState(false);

    const handleClick = async () => {
        setIsPending(true);
        await onRsvpSubmit();
        setIsPending(false);
    };

    if (eventStatus === 'Past') {
        return <Button size="lg" className="w-full" disabled>This event has ended</Button>;
    }
    
    if (hasRsvpd) {
        return (
            <Button size="lg" className="w-full" disabled variant="secondary">
                <CheckCircle className="mr-2" /> You're Going!
            </Button>
        );
    }
    
    return (
        <Button onClick={handleClick} size="lg" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            RSVP Now
        </Button>
    );
}

function RsvpForm({ event, isLoggedIn }: { event: EventDetail, isLoggedIn: boolean }) {
    const { toast } = useToast();
    const router = useRouter();

    const handleRsvpSubmit = async () => {
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
    };
    
    if (!isLoggedIn) {
        return (
             <Button asChild size="lg" className="w-full">
                <Link href={`/login?redirect=/events/${event.eventCode}`}>
                    Login to RSVP
                </Link>
            </Button>
        )
    }
    
    return <RsvpButton hasRsvpd={event.hasRsvpd} eventStatus={event.status} onRsvpSubmit={handleRsvpSubmit} />;
}


function EventPageContent({ event, isLoggedIn }: { event: EventDetail, isLoggedIn: boolean}) {
    const { date, time } = formatEventTime(event.date);
    const speakers = event.speaker.split(';').map(s => s.trim());
    
    return (
      <div className="grid lg:grid-cols-[1fr_380px] gap-12">
        {/* Main Content */}
        <div className="space-y-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={event.coverImage || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop'}
              alt={event.title}
              fill
              className="object-cover"
              data-ai-hint="event cover"
            />
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="font-headline">About This Event</h2>
            <p className="whitespace-pre-line">{event.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
            <Card>
                <CardHeader>
                    <Badge variant="outline" className="mb-2 w-fit">{event.type}</Badge>
                    <CardTitle className="font-headline text-3xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-start gap-3"><User className="w-4 h-4 text-primary mt-1" /> <span>Speaker{speakers.length > 1 ? 's' : ''}: <strong>{speakers.length > 0 && speakers[0] !== 'TBA' ? speakers.join(', ') : 'TBA'}</strong></span></div>
                     <div className="flex items-start gap-3"><Calendar className="w-4 h-4 text-primary mt-1" /> <span>{date}</span></div>
                     <div className="flex items-start gap-3"><Clock className="w-4 h-4 text-primary mt-1" /> <span>{time}</span></div>
                     <div className="flex items-start gap-3"><Users className="w-4 h-4 text-primary mt-1" /> <span><strong>{event.rsvpCount}</strong> attending</span></div>
                </CardContent>
            </Card>

            <Card className="p-6">
                <RsvpForm event={event} isLoggedIn={isLoggedIn} />
            </Card>
        </aside>
      </div>
    );
}

function EventPageSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-12">
      <div className="space-y-8">
        <Skeleton className="aspect-video w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
        </div>
      </div>
      <aside className="space-y-6">
        <Card>
          <CardHeader><Skeleton className="h-6 w-24" /><Skeleton className="h-10 w-full mt-2" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-2/3" />
          </CardContent>
        </Card>
        <Card className="p-6"><Skeleton className="h-12 w-full" /></Card>
      </aside>
    </div>
  );
}


export default function EventDetailPage({ params }: { params: { eventCode: string } }) {
    const [event, setEvent] = useState<EventDetail | null | undefined>(undefined);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('aether_user_id'));
        
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
            <EventPageContent event={event} isLoggedIn={isLoggedIn} />
        </main>
    );
}
