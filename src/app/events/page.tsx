
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Mic, User, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const upcomingEvents = [
    {
        title: "Workshop: AI for Architectural Visualization",
        date: "November 12, 2024",
        time: "4:00 PM WAT",
        description: "Learn how to use Midjourney and other AI tools to create stunning architectural renders in a fraction of the time.",
        speaker: "David Tetteh",
        eventbriteUrl: "https://www.eventbrite.com/e/tickets-901339178207",
        image: "https://images.unsplash.com/photo-1698661033580-779d7d117a59?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "computer vision city",
    },
    {
        title: "Q&A: The Business of Architecture",
        date: "November 19, 2024",
        time: "5:00 PM WAT",
        description: "Join a live Q&A with seasoned professionals on how to start, manage, and grow a design practice.",
        speaker: "Dr. Adanna Okoye",
        eventbriteUrl: "https://www.eventbrite.com/e/tickets-901339178207",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "teamwork collaboration",
    },
    {
        title: "Horizon Studio: Design Challenge Kickoff",
        date: "November 26, 2024",
        time: "3:00 PM WAT",
        description: "An introduction to our first community-wide design competition. Details of the brief will be revealed live.",
        speaker: "Aether Team",
        eventbriteUrl: "https://www.eventbrite.com/e/tickets-901339178207",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "architects planning",
    }
]

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
                        {upcomingEvents.map((event) => (
                            <Card key={event.title} className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="relative h-56">
                                    <Image
                                        src={event.image}
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
                                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {event.date} - {event.time}</div>
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
