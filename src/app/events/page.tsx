
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getEvents, type Event } from './actions';
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function EventsList() {
    const events = await getEvents();

    if (events.length === 0) {
        return (
            <div className="text-center py-12 col-span-full">
                <h3 className="text-2xl font-semibold">No Upcoming Events</h3>
                <p className="text-muted-foreground mt-2">Check back soon for new workshops and Q&A sessions.</p>
            </div>
        )
    }

    return (
        <>
            {events.map((event) => (
                <Card key={event.id} className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-56">
                        <Image
                            src={event.image || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop'}
                            alt={event.title}
                            fill
                            data-ai-hint={event.aiHint}
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground pt-2">
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                            <div className="flex items-center gap-2"><User className="w-4 h-4" /> {event.speaker}</div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground text-sm line-clamp-3">{event.description}</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button asChild className="w-full">
                            <Link href={event.eventbriteUrl} target="_blank">
                                Reserve Spot on Eventbrite
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </Card>
            ))}
        </>
    );
}

function EventsListSkeleton() {
    return (
        <>
        {[...Array(3)].map((_, i) => (
            <Card key={i} className="group flex flex-col overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex gap-4 pt-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-5 w-1/3" />
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <div className="p-6 pt-0">
                    <Skeleton className="h-10 w-full" />
                </div>
            </Card>
        ))}
        </>
    )
}

export default function EventsPage() {
    
    const handleScrollToEvents = () => {
        document.getElementById('event-list')?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <main className="animate-in fade-in duration-500">
            {/* Hero Section */}
            <section className="w-full py-20 md:py-32 bg-muted">
                <div className="container px-4 md:px-6 text-center">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                       🎙️ Prelaunch Events – Workshops & Q&A
                    </h1>
                    <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl">
                        Join exclusive sessions with industry leaders. Access via your Aether ID only. All events hosted on Eventbrite.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" onClick={handleScrollToEvents}>
                           Reserve Your Spot
                        </Button>
                    </div>
                </div>
            </section>

            {/* Events List */}
            <section id="event-list" className="w-full py-16 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Suspense fallback={<EventsListSkeleton />}>
                            <EventsList />
                        </Suspense>
                    </div>
                </div>
            </section>

            {/* Access Message Section */}
            <section className="w-full pb-16 md:pb-24">
                <div className="container px-4 md:px-6">
                    <Card className="p-8 bg-muted/50 border-dashed text-center">
                        <Badge variant="secondary" className="mb-4">Prelaunch Access Only</Badge>
                        <h3 className="text-xl font-bold font-headline mb-2">Claim Your Aether ID to Join</h3>
                        <p className="max-w-2xl mx-auto text-muted-foreground">
                            Access to our prelaunch events is exclusively for users who have reserved their Aether ID. Please sign up to claim your ID, join events, and become a founding member of the ecosystem.
                        </p>
                        <div className="mt-6">
                            <Button asChild>
                                <Link href="/join">
                                    Join the Waitlist
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        </main>
    );
}
