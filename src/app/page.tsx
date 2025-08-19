
import { Button } from "@/components/ui/button";
import { ArrowRight, Waypoints, CheckCircle, Rss, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { Badge } from "@/components/ui/badge";

const featuredFaqs = [
  {
    question: "What is the Aether Prelaunch?",
    answer: "This is an early-access phase for our founding members. It allows you to get your Aether ID, join our community channels, and get notified about our first events before the full platform launch on December 8, 2025.",
  },
  {
    question: "What can I do during the prelaunch?",
    answer: "You can create your Aether ID, verify it to get access to our private Discord and Telegram groups, and sign up for our upcoming events.",
  },
  {
    question: "When will courses and other features be available?",
    answer: "The Aether School, including all courses and primers, along with the Horizon Studio project lab, will go live on our full platform launch date: December 8, 2025.",
  },
   {
    question: "Do I need to be in Nigeria to join?",
    answer: "No. While our roots are in Nigeria and Africa, Aether is built to connect designers worldwide. Our community and programs are accessible online.",
  },
];

export default function Home() {
  const preLaunchDate = "2025-10-06T00:00:00Z";
  
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="text-base py-2 px-4 border-primary/50 text-primary">
                    <Star className="w-5 h-5 mr-2" />
                    World Architecture Day Prelaunch is Live!
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none font-headline">
                    From Africa to the World — The Future of Architecture Starts Here.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Welcome to the Aether prelaunch. Get your permanent Aether ID, join our global community, and be the first to know about our upcoming events. The full learning platform launches December 8, 2025.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg" id="join-waitlist-hero">
                    <Link href="/join">
                      Get Your Aether ID
                    </Link>
                  </Button>
                   <Button asChild size="lg" variant="outline">
                    <Link href="/events">
                      View Upcoming Events
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto aspect-square overflow-hidden rounded-xl sm:w-full lg:order-last">
                 <Image
                  src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&h=800&auto=format&fit=crop"
                  width={800}
                  height={800}
                  alt="Abstract architectural design"
                  data-ai-hint="modern architecture"
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="problem-pain-point" className="w-full py-12 md:py-24 lg:py-32 bg-muted animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
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
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">The world’s cities are expanding fast — but architecture education isn’t keeping pace.</h2>
                 <p className="text-muted-foreground md:text-lg">Aether was created to change that. We're building a new path for architecture education — one that is culturally grounded, climate-responsive, and globally connected.</p>
                 <Button asChild variant="link" className="p-0 h-auto text-lg">
                   <Link href="/about">
                      Read Our Mission
                      <ArrowRight className="ml-2"/>
                    </Link>
                 </Button>
              </div>
            </div>
          </div>
        </section>
        
         <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-4">
                 <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline">What You Can Do Now</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                    Join our prelaunch to become a founding member of the Aether ecosystem.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3 mt-12">
              <div className="grid gap-2 text-center p-6 bg-muted/50 rounded-lg">
                  <div className="flex justify-center"><Star className="w-10 h-10 text-primary mb-2" /></div>
                  <h3 className="text-xl font-bold">Get Your ID</h3>
                  <p className="text-muted-foreground">Claim your unique Aether ID to become a founding member.</p>
              </div>
              <div className="grid gap-2 text-center p-6 bg-muted/50 rounded-lg">
                  <div className="flex justify-center"><Rss className="w-10 h-10 text-primary mb-2" /></div>
                  <h3 className="text-xl font-bold">Join the Community</h3>
                  <p className="text-muted-foreground">Access private channels on Discord and Telegram.</p>
              </div>
              <div className="grid gap-2 text-center p-6 bg-muted/50 rounded-lg">
                  <div className="flex justify-center"><Waypoints className="w-10 h-10 text-primary mb-2" /></div>
                  <h3 className="text-xl font-bold">Access Events</h3>
                  <p className="text-muted-foreground">Get invites to exclusive prelaunch workshops and Q&As.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-primary/5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <div className="container text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Full Platform Launches December 8, 2025</h2>
                 <p className="mt-6 max-w-2xl mx-auto md:text-xl text-muted-foreground">Countdown to the Aether School and Horizon Studio launch.</p>
                <div className="mt-8 max-w-4xl mx-auto">
                    <CountdownTimer targetDate="2025-12-08T00:00:00Z" />
                </div>
            </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline">Frequently Asked Questions</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {featuredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
             <div className="text-center mt-12">
                <Button asChild variant="outline">
                  <Link href="/faq">
                    See All FAQs
                    <ArrowRight className="ml-2"/>
                  </Link>
                </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
           <div className="container text-center bg-primary/5 rounded-lg p-10 md:p-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline">🌍 Become a Founding Member</h2>
                <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-xl">
                   Founding spots are limited. Get your Aether ID now to shape the future of design.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/join">
                           Join Now
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
