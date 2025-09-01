
import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getEvents, type Event } from './actions';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

function formatEventDate(dateStr: string) {
    const date = new Date(dateStr);
    return {
        month: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'Africa/Lagos' }).toUpperCase(),
        day: date.toLocaleDateString('en-US', { day: '2-digit', timeZone: 'Africa/Lagos' }),
    }
}

async function EventsList() {
    const events = await getEvents();
  
    if (events.length === 0) {
      return (
        <div className="text-center py-12 col-span-full">
            <h3 className="text-2xl font-semibold font-headline">No Upcoming Events</h3>
            <p className="text-muted-foreground mt-2">Please check back later for new events.</p>
        </div>
      );
    }
  
    return (
      <>
        {events.map((event) => {
          const { month, day } = formatEventDate(event.date);
          const canRsvp = event.status === 'Upcoming' && event.eventCode;
          const speakers = event.speaker.split(';').map(s => s.trim());

          return (
             <Link key={event.id} href={canRsvp ? `/events/${event.eventCode}` : '#'} className="group block">
                <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative aspect-[16/10] w-full">
                         <Image
                            src={event.coverImage || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop'}
                            alt={event.title}
                            fill
                            data-ai-hint="event cover"
                            className="object-cover"
                        />
                         <Badge variant={event.status === 'Upcoming' ? 'default' : 'secondary'} className="absolute top-3 right-3">
                            {event.status}
                        </Badge>
                    </div>
                    <div className="p-4 flex gap-4">
                        <div className="flex flex-col items-center justify-center text-center">
                            <p className="font-bold text-sm text-primary">{month}</p>
                            <p className="text-2xl font-bold font-headline">{day}</p>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">by {speakers.length > 0 && speakers[0] !== 'TBA' ? speakers.join(', ') : 'Aether'}</p>
                        </div>
                    </div>
                </div>
             </Link>
          )
        })}
      </>
    );
  }

function EventsSkeleton() {
    return (
        <>
            {[...Array(6)].map((_, i) => (
                <div key={i} className="border bg-card rounded-lg overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 flex gap-4 items-center">
                       <div className="flex flex-col gap-1 items-center">
                         <Skeleton className="h-4 w-8" />
                         <Skeleton className="h-8 w-10" />
                       </div>
                       <div className="flex-1 space-y-2">
                         <Skeleton className="h-5 w-3/4" />
                         <Skeleton className="h-4 w-1/2" />
                       </div>
                    </div>
                </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <Suspense fallback={<EventsSkeleton />}>
          <EventsList />
        </Suspense>
      </div>
    </main>
  );
}
