
import { Button } from "@/components/ui/button";
import { ArrowRight, School, Users, Waypoints, Zap, Milestone, CircleDot, Users2 } from "lucide-react";
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
      className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
    />
  );
}


export default function Home() {
  const launchDate = "2025-12-08T00:00:00Z";
  
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_800px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Aether Community: Empowering African Design Leaders
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Aether is a digital-first architecture and design school redefining education for African creatives. More than a platform, it’s a vibrant ecosystem fostering learning, collaboration, and creative empowerment. We believe architecture belongs to communities, cultures, and everyday life—not just institutions or studios.
                  </p>
                   <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our mission is to empower culturally grounded, globally connected designers who start where they are, with what they have. Join us to build the future of African design.
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
        
        <section className="w-full py-12 md:py-24 border-y bg-muted">
            <div className="container">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Ecosystem Launch: December 8, 2025</h2>
                    <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-xl">
                        Our full ecosystem launches soon. Join our pre-launch event on World Architecture Day, October 6, 2025.
                    </p>
                </div>
                <div className="mt-8 max-w-4xl mx-auto">
                    <CountdownTimer targetDate={launchDate} />
                </div>
            </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How It Works</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Aether is a three-step journey from learner to leader.
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
                    <p className="text-muted-foreground">Access free, self-paced courses through Aether School to build foundational design skills.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <Users className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>2. Connect</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">Join our global community on Telegram, Discord, or WhatsApp to collaborate, share ideas, and grow with peers.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <Waypoints className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>3. Build</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Apply your skills in Horizon Studio, our immersive cohort program for portfolio-worthy projects.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="why-now" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
               <Image
                src="https://images.unsplash.com/photo-1511285560921-5ae97823f663?q=80&w=600&h=400&auto=format&fit=crop"
                width="600"
                height="400"
                alt="A designer working"
                data-ai-hint="creative process design"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Why Now?</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed">Traditional architecture education often isolates young creatives, disconnects them from local contexts, and relies on rigid systems. Aether changes this by:</p>
                <ul className="mt-6 list-disc list-inside space-y-2">
                      <li>Embracing decentralized technologies for experimental learning.</li>
                      <li>Promoting peer-to-peer knowledge exchange.</li>
                      <li>Creating culturally rooted, globally relevant design opportunities.</li>
                </ul>
                <p className="mt-4 font-semibold">The world is ready for a new approach. Aether is here to lead the wave.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="whats-launching" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">What’s Coming: Pre-Launch on Oct 6</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    On World Architecture Day, you'll get access to the foundational pillars of our ecosystem.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 mt-12">
                <Card>
                    <CardHeader>
                        <Zap className="w-8 h-8 text-primary mb-2" />
                        <CardTitle>Community Hubs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Our Telegram & Discord servers will go live for conversations, collaborations, and challenges.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <School className="w-8 h-8 text-primary mb-2" />
                        <CardTitle>Aether School (Preview)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Get a first look at our asynchronous courses and creative challenges.</p>
                    </CardContent>
                </Card>
            </div>
          </div>
        </section>
        
        <section id="for-who" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Who We’re For</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    If you want to learn, build, and belong outside traditional systems, Aether is your home.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3 mt-12">
              <div className="text-center space-y-2">
                <CircleDot className="w-10 h-10 text-primary mx-auto"/>
                <h3 className="text-lg font-bold">Students & Creatives</h3>
                <p className="text-muted-foreground">Students of architecture, urbanism, design, and art looking for community and experimentation.</p>
              </div>
              <div className="text-center space-y-2">
                <Users2 className="w-10 h-10 text-primary mx-auto"/>
                <h3 className="text-lg font-bold">Educators & Thinkers</h3>
                <p className="text-muted-foreground">Those redefining design education and practice from the ground up.</p>
              </div>
              <div className="text-center space-y-2">
                <Waypoints className="w-10 h-10 text-primary mx-auto"/>
                <h3 className="text-lg font-bold">Local Builders</h3>
                <p className="text-muted-foreground">People deeply connected to their local contexts who want to create culturally-rooted work.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
