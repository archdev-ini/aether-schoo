

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, KeyRound, Paintbrush } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CountdownTimer } from "@/components/common/CountdownTimer";

const pillars = [
    {
        icon: Paintbrush,
        title: "Learn",
        description: "Dive into an Africa-first curriculum of courses, primers, and archives built for the future of architecture.",
    },
    {
        icon: Code,
        title: "Build",
        description: "Collaborate on real-world challenges, create portfolio-ready projects, and earn verifiable credentials in Horizon Studio.",
    },
    {
        icon: KeyRound,
        title: "Connect",
        description: "Join a global network of peers, mentors, and industry leaders. Share knowledge, exchange ideas, and unlock opportunities.",
    },
];

export default async function Home() {
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
             <Image 
                src="https://images.unsplash.com/photo-1511285560922-38b32e8a448c?q=80&w=2070&auto=format&fit=crop"
                alt="Blueprint background"
                fill
                style={{ objectFit: 'cover' }}
                priority
             />
             <div className="absolute inset-0 bg-background/80 dark:bg-background/90"></div>
          </div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
                <Badge variant="outline" className="mb-4 py-2 px-4 border-primary/50 text-primary animate-in fade-in slide-in-from-bottom-4 duration-500">
                   🚀 Prelaunch is live — Full platform launches December 8, 2025
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none font-headline animate-in fade-in slide-in-from-bottom-6 duration-700">
                    The Creative Ecosystem for Architects & Designers
                </h1>
                <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl animate-in fade-in slide-in-from-bottom-8 duration-900">
                    A global-facing, Africa-rooted community for learning, building, and connecting.
                </p>
                <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-lg animate-in fade-in slide-in-from-bottom-10 duration-1000">
                  ✨ Explore prelaunch resources and join the network shaping the future of design.
                </p>
                <div className="flex flex-col gap-4 mt-8 min-[400px]:flex-row justify-center animate-in fade-in slide-in-from-bottom-12 duration-1200">
                  <Button asChild size="lg" id="join-waitlist-hero">
                    <Link href="/join">
                      Become a Founding Member <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
            </div>
          </div>
        </section>

        {/* Pillars Section */}
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

        {/* Countdown Section */}
        <section className="w-full py-20 md:py-32">
            <div className="container px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">⏳ Design the Future. Start Today.</h2>
                    <div className="max-w-3xl mx-auto my-8">
                       <CountdownTimer targetDate="2025-12-08T00:00:00" />
                    </div>
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
