
import { Button } from "@/components/ui/button";
import { ArrowRight, School, Users, Waypoints, Zap, Milestone, CircleDot, Users2, Calendar, MessageSquare, Eye } from "lucide-react";
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
  const preLaunchDate = "2025-10-06T00:00:00Z";
  
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_800px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Empowering the Next Generation of African Design Leaders
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Aether is a digital-first architecture and design school reimagining how African creatives learn, connect, and build. More than a platform, it’s a living ecosystem—where culture meets craft, and local ideas meet global relevance.
                  </p>
                   <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    We believe design belongs to communities, cultures, and everyday life—not just institutions or elite studios.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" id="join-ecosystem-hero">
                    <Link href="/join">
                      Join the Aether Community <ArrowRight className="ml-2" />
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

        <section id="why-aether" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
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
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">🌍 Why Aether?</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">Traditional design education often feels disconnected—isolated from real-world needs, local culture, and community. Aether changes that.</p>
                <p className="font-semibold">We’re building an ecosystem that:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Uses decentralized tools to enable experimental, accessible learning</li>
                    <li>Promotes peer-to-peer knowledge sharing</li>
                    <li>Fosters culturally grounded, globally conscious design practice</li>
                </ul>
                <p className="mt-4 font-semibold">If you're ready to lead from where you are, with what you have—Aether is for you.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 border-y">
            <div className="container text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">🚀 Launch Timeline</h2>
                <div className="mt-4 max-w-2xl mx-auto grid gap-2 text-muted-foreground md:text-lg">
                    <p>🌐 <span className="font-semibold text-foreground">Full Ecosystem Launch:</span> December 8, 2025</p>
                    <p>🎉 <span className="font-semibold text-foreground">Pre-Launch Event:</span> World Architecture Day — October 6, 2025</p>
                </div>
                 <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl font-headline mt-12">⏳ Countdown to Pre-Launch</h3>
                <div className="mt-8 max-w-4xl mx-auto">
                    <CountdownTimer targetDate={preLaunchDate} />
                </div>
            </div>
        </section>

        <section id="pre-launch" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">👀 Coming on October 6</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Join us on World Architecture Day for a virtual event that marks the beginning of the Aether movement.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3 mt-12">
                     <Card>
                        <CardHeader>
                            <Calendar className="w-8 h-8 text-primary mb-2" />
                            <CardTitle>Pre-Launch Virtual Event</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Celebrate with us as we share the Aether vision, connect across borders, and build momentum for what’s to come.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <MessageSquare className="w-8 h-8 text-primary mb-2" />
                            <CardTitle>Community Hubs Go Live</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Be among the first to join our Telegram and Discord communities—designed for meaningful dialogue, peer collaboration, and design challenges.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Eye className="w-8 h-8 text-primary mb-2" />
                            <CardTitle>Sneak Peek: Aether School</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Get a behind-the-scenes look at our upcoming self-paced courses and creative pathways. Full course access begins in December.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">🔁 How Aether Works</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Aether is a 3-step journey—from learner to leader:
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
                    <p className="text-muted-foreground">Explore free, self-paced courses in design, architecture, and creative tech through Aether School.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <Users className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>2. Connect</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">Join our Telegram, Discord, or WhatsApp spaces to collaborate, get feedback, and grow alongside a global peer network.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <Waypoints className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>3. Build</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Apply your skills through Horizon Studio, our immersive cohort program where you’ll work on real projects and build a standout portfolio.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section id="for-who" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">👥 Who Aether is For</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Aether is your home if you’re building outside the box.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3 mt-12">
              <div className="text-center space-y-2">
                <CircleDot className="w-10 h-10 text-primary mx-auto"/>
                <h3 className="text-lg font-bold">Students & Creatives</h3>
                <p className="text-muted-foreground">Those studying architecture, urbanism, design, or art—seeking experimentation and community.</p>
              </div>
              <div className="text-center space-y-2">
                <Users2 className="w-10 h-10 text-primary mx-auto"/>
                <h3 className="text-lg font-bold">Educators & Thinkers</h3>
                <p className="text-muted-foreground">Leaders and disruptors reimagining design education in Africa and beyond.</p>
              </div>
              <div className="text-center space-y-2">
                <Waypoints className="w-10 h-10 text-primary mx-auto"/>
                <h3 className="text-lg font-bold">Local Builders</h3>
                <p className="text-muted-foreground">Creatives deeply rooted in place—ready to design with cultural and contextual relevance.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">🌱 Join the Ecosystem</h2>
                <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-xl">
                    The future of African design is decentralized, collaborative, and culturally rooted.
                </p>
                <p className="max-w-2xl mx-auto mt-2 text-muted-foreground md:text-xl">
                   Be part of the movement from day one.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/join">
                           👉 Join the Aether Community
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
