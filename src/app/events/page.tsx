
import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { getEvents, Event } from './actions';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';

function formatEventTime(dateStr: string) {
    const date = new Date(dateStr);
    // Using a specific timezone like WAT (West Africa Time) for consistency
    const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Lagos' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', timeZoneName: 'short', timeZone: 'Africa/Lagos' };
    
    return {
        date: date.toLocaleDateString('en-US', dateOptions),
        time: date.toLocaleTimeString('en-US', timeOptions)
    }
}

async function EventsList() {
    const events = await getEvents();
  
    if (events.length === 0) {
      return (
        <Card className="text-center p-8">
            <CardTitle>No Upcoming Events</CardTitle>
            <CardDescription className="mt-2">
                Please check back later, or follow our community channels for updates.
            </CardDescription>
        </Card>
      );
    }
  
    return (
      <>
        {events.map((event) => {
          const { date, time } = formatEventTime(event.date);
          const speakers = event.speaker.split(';').map(s => s.trim());

          return (
            <Card key={event.id} className="grid md:grid-cols-[300px_1fr] overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                <div className="relative h-48 md:h-full">
                    <Image
                        src={event.coverImage || 'https://placehold.co/600x400.png'}
                        alt={event.title}
                        fill
                        data-ai-hint="event cover"
                        className="object-cover"
                    />
                     <Badge variant={event.status === 'Upcoming' ? 'default' : 'secondary'} className="absolute top-3 right-3">
                        {event.status}
                    </Badge>
                </div>
                <div className="flex flex-col">
                    <CardHeader className="p-6">
                        <Badge variant="outline" className="mb-2 w-fit">{event.type}</Badge>
                        <CardTitle className="text-2xl font-headline">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 space-y-4">
                        <p className="text-muted-foreground line-clamp-3">{event.description}</p>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground pt-2">
                            <div className="flex items-start gap-3">
                                <User className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" /> 
                                <div>
                                    Speaker{speakers.length > 1 ? 's' : ''}: <strong>{speakers.length > 0 && speakers[0] !== 'TBA' ? speakers.join(', ') : 'TBA'}</strong>
                                </div>
                            </div>
                            <div className="flex items-center gap-3"><Calendar className="w-4 h-4 flex-shrink-0 text-primary" /> <span>{date}</span></div>
                            <div className="flex items-center gap-3"><Clock className="w-4 h-4 flex-shrink-0 text-primary" /> <span>{time}</span></div>
                        </div>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                        <Button asChild className="w-full mt-4" size="lg" disabled={!event.registrationUrl || event.status === 'Past'}>
                            <Link href={event.registrationUrl || '#'} target="_blank">
                                {event.status === 'Upcoming' ? (event.registrationUrl ? 'Register Now' : 'Registration Opening Soon') : 'View Recording'}
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
          )
        })}
      </>
    );
  }

function EventsSkeleton() {
    return (
        <>
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="grid md:grid-cols-[300px_1fr] overflow-hidden">
                    <Skeleton className="h-48 md:h-full" />
                    <div className="flex flex-col p-6 space-y-4">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-8 w-3/4" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                        <div className="space-y-3 pt-4">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                        <div className="pt-4 mt-auto">
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </Card>
            ))}
        </>
    )
}

export default async function EventsPage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Events & Sessions</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Join live workshops, Q&As with industry leaders, and community meetups.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Suspense fallback={<EventsSkeleton />}>
          <EventsList />
        </Suspense>
      </div>
    </main>
  );
}
