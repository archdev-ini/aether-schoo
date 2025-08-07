
import { Button } from "@/components/ui/button";
import { ArrowRight, School, Users, Waypoints } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function HeroImage() {
  return (
    <div className="relative aspect-square w-full h-full overflow-hidden rounded-xl bg-muted">
       <svg width="100%" height="100%" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.2)" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad1)" />
          <g stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" opacity="0.5">
            <path d="M100 100 Q 300 200 500 100" fill="none" />
            <path d="M100 200 Q 200 400 100 500" fill="none" />
            <path d="M500 200 Q 400 400 500 500" fill="none" />
            <path d="M200 100 Q 300 50 400 100" fill="none" />
            <path d="M200 500 Q 300 550 400 500" fill="none" />
          </g>
           <g stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.3">
                <path d="M 50,50 L 550,550" />
                <path d="M 550,50 L 50,550" />
            </g>
        </svg>
    </div>
  );
}


export default function Home() {
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Build the Future of African Design.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join a global ecosystem for ambitious architects and designers — free courses, immersive studios, and a vibrant creative community.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" id="join-ecosystem-hero">
                    <Link href="/join">
                      Join the Ecosystem <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto aspect-square overflow-hidden rounded-xl sm:w-full lg:order-last">
                <HeroImage />
              </div>
            </div>
          </div>
        </section>
        
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How It Works</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Aether is more than a platform—it's a three-part journey designed to take you from learner to leader.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3 mt-12">
              <Card>
                <CardHeader>
                    <School className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>1. Learn</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Start with free, open-access courses in Aether School to build foundational skills at your own pace.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <Users className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>2. Connect</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">Join our global community on Discord, WhatsApp, or Telegram to collaborate, share, and grow with peers.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <Waypoints className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>3. Build</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Apply your skills in Horizon Studio, our immersive cohort program for creating portfolio-worthy projects.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Aether Ecosystem</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed">Aether is a digital-first architecture and design school creating the next generation of African design leaders.</p>
                <div className="mt-6 space-y-4">
                   <p className="font-semibold">We offer:</p>
                   <ul className="list-disc list-inside space-y-2">
                        <li>Aether School – open access to skill-building</li>
                        <li>Horizon Studio – immersive studio learning</li>
                        <li>Aether Community – peer learning, events, and mentorship</li>
                   </ul>
                </div>
                 <p className="mt-6 text-sm text-muted-foreground">We’re backed by Buildr Africa and committed to decentralizing opportunity for African creatives.</p>
              </div>
               <Image
                src="https://images.unsplash.com/photo-1618221118493-9cfa1a1202c1?q=80&w=600&h=400&auto=format&fit=crop"
                width="600"
                height="400"
                alt="Ecosystem Diagram"
                data-ai-hint="modern architecture interior"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
