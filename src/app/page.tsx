import { Button } from "@/components/ui/button";
import { ArrowRight, School, Users, Waypoints } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
              <Image
                src="https://images.unsplash.com/photo-1519994548239-50239534547f?q=80&w=600&h=600&auto=format&fit=crop"
                width="600"
                height="600"
                alt="Hero"
                data-ai-hint="modern architecture building white"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
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
