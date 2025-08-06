import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Tag, User } from "lucide-react";
import Link from "next/link";
import { getEvents, Event } from './actions';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

function formatEventTime(dateStr: string) {
    const date = new Date(dateStr);
    const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' };
    
    return {
        date: date.toLocaleDateString('en-US', dateOptions),
        time: date.toLocaleTimeString('en-US', timeOptions)
    }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Events & Sessions</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Join live workshops, Q&As with industry leaders, and community meetups.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {events.length === 0 && (
            <Card className="text-center p-8">
                <CardTitle>No Upcoming Events</CardTitle>
                <CardDescription className="mt-2">
                    Please check back later, or follow our community channels for updates.
                </CardDescription>
            </Card>
        )}
        {events.map((event) => {
          const { date, time } = formatEventTime(event.date);
          return (
            <Card key={event.id} className="grid md:grid-cols-[250px_1fr] overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-48 md:h-full">
                    <Image
                        src={event.coverImage || 'https://placehold.co/600x400.png'}
                        alt={event.title}
                        fill
                        data-ai-hint="event cover"
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <div className="p-6 flex-1">
                        <CardHeader className="p-0 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">{event.type}</Badge>
                                <Badge variant="outline">{event.status}</Badge>
                            </div>
                            <CardTitle className="text-2xl font-headline">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-4">
                            <p className="text-muted-foreground line-clamp-3">{event.description}</p>
                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><User className="w-4 h-4 flex-shrink-0" /> <span>Speaker: <strong>{event.speaker}</strong></span></div>
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 flex-shrink-0" /> <span>{date}</span></div>
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 flex-shrink-0" /> <span>{time}</span></div>
                            </div>
                        </CardContent>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <Button asChild className="w-full" disabled={!event.registrationUrl}>
                            <Link href={event.registrationUrl || '#'} target="_blank">
                                {event.registrationUrl ? 'Register Now' : 'Registration Closed'}
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
          )
        })}
         <div className="text-center pt-8">
            <p className="text-muted-foreground">Follow our community channels to stay updated!</p>
        </div>
      </div>
    </main>
  );
}