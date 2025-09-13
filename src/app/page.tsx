

import { Button } from "@/components/ui/button";
import { ArrowRight, Archive, Users, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const whyAether = [
    {
        icon: Calendar,
        title: "Events First",
        description: "From intimate workshops to flagship gatherings, Aether is built around experiences that matter.",
    },
    {
        icon: Users,
        title: "Community Powered",
        description: "Architects, designers, and creators — connected through shared conversations.",
    },
    {
        icon: Archive,
        title: "The Archive",
        description: "Every event leaves a trace. Revisit talks, insights, and debates through the Aether Archive.",
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
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <BlueprintBackground />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none font-headline">
                    The Home of Architecture & Design Events
                </h1>
                <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl">
                    Conversations, workshops, and gatherings shaping the future of design in Africa and beyond.
                </p>
                <div className="flex flex-col gap-4 mt-8 min-[400px]:flex-row justify-center">
                  <Button asChild size="lg" id="join-waitlist-hero">
                    <Link href="/join">
                      Join the Community
                    </Link>
                  </Button>
                </div>
            </div>
          </div>
        </section>

        {/* Prelaunch Phase Section */}
        <section className="w-full py-16 md:py-24">
           <div className="container text-center rounded-lg p-10 md:p-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">We’re Building Something New</h2>
                <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-xl">
                   This November, Aether goes live as the dedicated home of architectural events — a place where designers, students, and professionals come together to connect, exchange ideas, and shape the future.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg" variant="outline">
                        <Link href="/join">
                           Stay Updated
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
        
        {/* Why Aether Section */}
        <section id="why-aether" className="w-full py-16 md:py-24 bg-muted">
             <div className="container px-4 md:px-6">
                 <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3">
                    {whyAether.map((pillar) => (
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

        {/* Join Us Section */}
        <section className="w-full py-16 md:py-24">
           <div className="container text-center bg-background rounded-lg p-10 md:p-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Join Us</h2>
                <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-xl">
                   Be the first to know when we launch. Join the community today and get exclusive access to our inaugural events this November.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/join">
                           Join the Community
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
