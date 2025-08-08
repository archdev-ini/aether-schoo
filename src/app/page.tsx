
import { Button } from "@/components/ui/button";
import { ArrowRight, School, Users, Waypoints, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountdownTimer } from "@/components/common/CountdownTimer";

function HeroImage() {
  return (
    <Image
      src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&h=800&auto=format&fit=crop"
      width={800}
      height={800}
      alt="Abstract architectural design"
      data-ai-hint="modern architecture"
      className="mx-auto aspect-square overflow-hidden rounded-xl object-cover shadow-2xl"
    />
  );
}


export default function Home() {
  const preLaunchDate = "2025-10-06T00:00:00Z";
  
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none font-headline">
                    Africa’s Future is Built by Designers. We’re Building Them.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Aether is the first Africa-first design learning community — connecting creatives to skills, tools, and networks that power global impact.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg" id="join-waitlist-hero">
                    <Link href="/join">
                      Join the Pre-Launch Waitlist <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                   <Button asChild size="lg" variant="outline">
                    <Link href="/about">
                      Discover the Vision
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

        <section id="problem-pain-point" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
               <Image
                src="https://images.unsplash.com/photo-1511285560921-5ae97823f663?q=80&w=600&h=400&auto=format&fit=crop"
                width="600"
                height="400"
                alt="A designer working"
                data-ai-hint="creative process design"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-lg"
              />
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Africa is rich in creativity, but…</h2>
                <ul className="grid gap-4 text-muted-foreground md:text-lg">
                    <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <span>Access to world-class design training is limited.</span>
                    </li>
                    <li className="flex items-start gap-3">
                         <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <span>Our cultural context is missing in global design narratives.</span>
                    </li>
                    <li className="flex items-start gap-3">
                         <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <span>Young talent is disconnected from real opportunities.</span>
                    </li>
                </ul>
                <p className="mt-4 font-semibold text-xl">We’re changing that — permanently.</p>
              </div>
            </div>
          </div>
        </section>
        
         <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-4">
                 <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline">Aether: Learn. Connect. Build.</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                    This isn’t just a school. It’s a movement for design independence.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3 mt-12">
              <div className="grid gap-2 text-center p-6 bg-muted/50 rounded-lg">
                  <div className="flex justify-center"><School className="w-10 h-10 text-primary mb-2" /></div>
                  <h3 className="text-xl font-bold">Learn</h3>
                  <p className="text-muted-foreground">Culturally grounded, globally relevant design courses.</p>
              </div>
              <div className="grid gap-2 text-center p-6 bg-muted/50 rounded-lg">
                  <div className="flex justify-center"><Users className="w-10 h-10 text-primary mb-2" /></div>
                  <h3 className="text-xl font-bold">Connect</h3>
                  <p className="text-muted-foreground">A pan-African network of architects, designers, and builders.</p>
              </div>
              <div className="grid gap-2 text-center p-6 bg-muted/50 rounded-lg">
                  <div className="flex justify-center"><Waypoints className="w-10 h-10 text-primary mb-2" /></div>
                  <h3 className="text-xl font-bold">Build</h3>
                  <p className="text-muted-foreground">Apply skills in real projects, earn proof-of-skill credentials, and unlock global work.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="why-us" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6 text-center">
                 <div className="space-y-4 mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline">Other platforms teach skills.<br/>We build futures.</h2>
                </div>
                <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="text-center space-y-2 p-4">
                        <h3 className="text-lg font-bold">Africa-first curriculum</h3>
                    </div>
                    <div className="text-center space-y-2 p-4">
                        <h3 className="text-lg font-bold">Community-powered learning</h3>
                    </div>
                    <div className="text-center space-y-2 p-4">
                        <h3 className="text-lg font-bold">Decentralized credentials (proof-of-skill)</h3>
                    </div>
                     <div className="text-center space-y-2 p-4">
                        <h3 className="text-lg font-bold">Learn-to-earn opportunities</h3>
                    </div>
                     <div className="text-center space-y-2 p-4">
                        <h3 className="text-lg font-bold">Global exposure, local empowerment</h3>
                    </div>
                </div>
            </div>
        </section>

        <section className="w-full py-12 md:py-24 border-y">
            <div className="container text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">We Launch in 2 Waves</h2>
                <div className="mt-4 max-w-2xl mx-auto grid gap-2 text-muted-foreground md:text-lg">
                    <p>🚀 <span className="font-semibold text-foreground">October 6, 2025:</span> World Architecture Day Pre-Launch Event</p>
                    <p>🌐 <span className="font-semibold text-foreground">December 8, 2025:</span> Full Platform Rollout</p>
                </div>
                 <p className="mt-6 max-w-2xl mx-auto md:text-xl">Join now to be part of the Founding 500 — the first to access our community, courses, and collaborations.</p>
                <div className="mt-8 max-w-4xl mx-auto">
                    <CountdownTimer targetDate={preLaunchDate} />
                </div>
            </div>
        </section>

        <section id="social-proof" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline">Built by Designers, for Designers.</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                    Founded by African creatives, backed by global collaborators.
                </p>
              </div>
            </div>
             <div className="text-center mt-8 text-muted-foreground">[Founder story, partner logos, and testimonials will appear here]</div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
           <div className="container text-center bg-primary/5 rounded-lg p-10 md:p-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline">Your design journey doesn’t start someday. It starts now.</h2>
                <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-xl">
                    Be part of the next generation of African designers shaping the world.
                </p>
                 <p className="max-w-2xl mx-auto mt-2 text-muted-foreground md:text-xl">
                   Founding 500 spots are limited.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/join">
                           Join the Waitlist Now
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}

    