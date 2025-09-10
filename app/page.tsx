

import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Layers, Users, Calendar, Star, Mic } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getEvents } from "@/app/events/actions";

const pillars = [
    {
        icon: BookOpen,
        title: "Learn",
        description: "Access an Africa-first curriculum of courses, primers, and archives designed for the future of architecture.",
    },
    {
        icon: Layers,
        title: "Build",
        description: "Collaborate on real-world challenges, create portfolio-ready projects, and earn verifiable credentials in Horizon Studio.",
    },
    {
        icon: Users,
        title: "Connect",
        description: "Join a global network of peers, mentors, and industry leaders. Share knowledge, exchange ideas, and discover opportunities.",
    },
];

function BlueprintBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden opacity-5 dark:opacity-[0.03]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="blueprint" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="scale(1) rotate(0)">
                        <path d="M0 50 L50 50 L50 0" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1"/>
                        <path d="M40 50 L40 0 M30 50 L30 0 M20 50 L20 0 M10 50 L10 0" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
                         <path d="M50 40 L0 40 M50 30 L0 30 M50 20 L0 20 M50 10 L0 10" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#blueprint)" />
            </svg>
        </div>
    )
}

export default async function Home() {
  const allEvents = await getEvents();
  const upcomingEvents = allEvents.filter(e => e.status === 'Upcoming').slice(0, 3);

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <BlueprintBackground />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
                 <Badge variant="outline" className="text-base py-2 px-4 border-primary/50 text-primary mb-6">
                    <span className="mr-2">🌍</span> World Architecture Day Prelaunch is Live!
                  </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none font-headline">
                    The Creative Ecosystem for Architects & Designers
                </h1>
                <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl">
                    A global-facing, Africa-rooted community for learning, building, and connecting.
                </p>
                 <p className="max-w-3xl mx-auto mt-4 text-muted-foreground">
                    ✨ Access prelaunch events and join the network shaping the future of design.
                </p>
                <div className="flex flex-col gap-4 mt-8 min-[400px]:flex-row justify-center">
                  <Button asChild size="lg" id="join-waitlist-hero">
                    <Link href="/events">
                      Explore Events
                    </Link>
                  </Button>
                </div>
            </div>
          </div>
        </section>

        {/* 3 Pillars Section */}
        <section id="pillars" className="w-full py-16 md:py-24 bg-muted">
             <div className="container px-4 md:px-6">
                 <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3">
                    {pillars.map((pillar) => (
                         <div key={pillar.title} className="grid gap-4 text-center">
                            <div className="flex justify-center">
                                <div className="bg-background border-2 border-primary/10 text-primary p-4 rounded-full">
                                    <pillar.icon className="w-8 h-8"/>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold font-headline">{pillar.title}</h3>
                            <p className="text-muted-foreground">{pillar.description}</p>
                        </div>
                    ))}
                 </div>
             </div>
        </section>
        
        {/* Prelaunch Events Teaser */}
        <section id="prelaunch-events" className="w-full py-16 md:py-24">
           <div className="container grid items-center justify-center gap-8 px-4 text-center md:px-6">
             <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-headline">
                    <span className="mr-2">🎤</span> Prelaunch Events Are Here
                </h2>
                <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl/relaxed">
                    Exclusive workshops, Q&As, and community sessions throughout October + November.
                </p>
             </div>
             <div className="mt-6">
                <Button asChild>
                    <Link href="/events">
                        See the Full Schedule
                    </Link>
                </Button>
             </div>
           </div>
        </section>

        {/* Countdown Section */}
        <section className="w-full py-16 md:py-24 bg-muted">
           <div className="container text-center bg-background rounded-lg p-10 md:p-16 border">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">⏳ Design the Future. Starting Now.</h2>
                <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-xl">
                   The full Aether platform launches December 8, 2025.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/join">
                           Become a Founding Member
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
