
import { Button } from "@/components/ui/button";
import { ArrowRight, School, Users, Waypoints, CheckCircle, Leaf, Cpu, Group, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CountdownTimer } from "@/components/common/CountdownTimer";

const featuredFaqs = [
  {
    question: "What exactly is Aether?",
    answer: "Aether is a global-facing, locally empowering platform for architects, designers, and students. We provide learning programs, project opportunities, and a vibrant community focused on culturally rooted, climate-conscious design.",
  },
  {
    question: "Who can join the Aether Community?",
    answer: "Anyone passionate about architecture, urban design, or creative problem-solving is welcome — whether you’re a student, practicing professional, or an enthusiast exploring the field.",
  },
  {
    question: "What’s the difference between Aether School and Horizon Studio?",
    answer: "Aether School is our learning arm, offering courses and workshops. Horizon Studio is our project lab, where members collaborate on real-world challenges.",
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
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none font-headline">
                    From Africa to the World — Building Architects Who Shape the Future
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Aether is a global architecture learning community — born in Africa — equipping the next generation to design spaces that are culturally rooted, climate-responsive, and globally relevant.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg" id="join-waitlist-hero">
                    <Link href="/join">
                      Join Now
                    </Link>
                  </Button>
                   <Button asChild size="lg" variant="outline">
                    <Link href="/about">
                      See How We’re Building the Future
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
                <ul className="grid gap-4 text-muted-foreground md:text-lg">
                    <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <span>Architecture education often ignores climate realities.</span>
                    </li>
                    <li className="flex items-start gap-3">
                         <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <span>Many schools push imported ideas over cultural heritage.</span>
                    </li>
                    <li className="flex items-start gap-3">
                         <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <span>Young designers lack global networks to grow.</span>
                    </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
         <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-4">
                 <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline">Aether: Learn. Collaborate. Build.</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                    Aether is more than a platform — it’s a studio without walls.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3 mt-12">
              <div className="grid gap-2 text-center p-6 bg-muted/50 rounded-lg">
                  <div className="flex justify-center"><School className="w-10 h-10 text-primary mb-2" /></div>
                  <h3 className="text-xl font-bold">Learn</h3>
                  <p className="text-muted-foreground">Practical design education for African realities.</p>
              </div>
              <div className="grid gap-2 text-center p-6 bg-muted/50 rounded-lg">
                  <div className="flex justify-center"><Users className="w-10 h-10 text-primary mb-2" /></div>
                  <h3 className="text-xl font-bold">Collaborate</h3>
                  <p className="text-muted-foreground">Connect with peers & mentors across the world.</p>
              </div>
              <div className="grid gap-2 text-center p-6 bg-muted/50 rounded-lg">
                  <div className="flex justify-center"><Waypoints className="w-10 h-10 text-primary mb-2" /></div>
                  <h3 className="text-xl font-bold">Build</h3>
                  <p className="text-muted-foreground">Work on projects. Earn credentials. Get opportunities.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="why-us" className="w-full py-12 md:py-24 lg:py-32 bg-muted animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                Why Aether?
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                We believe in learning that is rooted in culture, responsive to the climate, and connected to a global community of innovators.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex items-start gap-4">
                <Globe className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold">Africa-First, Global-Ready</h3>
                  <p className="text-muted-foreground">Curriculum designed in Africa, for the world.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Leaf className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold">Sustainable by Design</h3>
                  <p className="text-muted-foreground">Integrating climate-conscious principles in all we do.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Cpu className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold">Tech-Enabled Learning</h3>
                  <p className="text-muted-foreground">Using modern tools for real-world collaboration.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <div className="container text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">We Launch in 2 Phases</h2>
                <div className="relative mt-8 max-w-4xl mx-auto py-4">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-muted rounded-full" />
                  <div className="relative flex justify-between">
                      <div className="text-center">
                          <div className="w-4 h-4 bg-primary rounded-full mx-auto" />
                          <p className="mt-2 text-sm font-semibold">Oct 6, 2025</p>
                          <p className="text-xs text-muted-foreground">Pre-Launch Event</p>
                      </div>
                      <div className="text-center">
                           <div className="w-4 h-4 bg-primary rounded-full mx-auto" />
                          <p className="mt-2 text-sm font-semibold">Dec 8, 2025</p>
                           <p className="text-xs text-muted-foreground">Full Platform Rollout</p>
                      </div>
                  </div>
                </div>
                 <p className="mt-6 max-w-2xl mx-auto md:text-xl">Join the Founding 500 — the first architects and students shaping the community.</p>
                <div className="mt-8 max-w-4xl mx-auto">
                    <CountdownTimer targetDate={preLaunchDate} />
                </div>
            </div>
        </section>

        <section id="social-proof" className="w-full py-12 md:py-24 lg:py-32 bg-muted animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                 <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline">From Studio Desk to Global Vision</h2>
              </div>
            </div>
            <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_3fr] gap-8 md:gap-12 items-start">
                <div className="flex flex-col items-center text-center">
                     <Image
                        src="https://placehold.co/400x400.png"
                        width={150}
                        height={150}
                        alt="Inioluwa Oladipupo"
                        data-ai-hint="portrait man"
                        className="rounded-full object-cover mb-4 shadow-lg"
                    />
                    <h3 className="font-bold font-headline text-lg">Inioluwa Oladipupo</h3>
                    <p className="text-sm text-muted-foreground">Founder, Aether</p>
                </div>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p>“Hi, I’m Inioluwa — I started Aether because I believe architects from Africa deserve global platforms without losing our roots.”</p>
                    <p>Aether began as an idea during countless late nights in the studio — working on design briefs and wondering why so many buildings felt disconnected from their climate, culture, and community.</p>
                    <p>I realized the problem was deeper than individual projects. Many schools relied on foreign models that overlooked local genius, while young architects struggled to gain recognition beyond their borders.</p>
                    <p>Aether was created to change that — to give architects and designers a space to learn, collaborate, and prove their skills on the world stage, while staying connected to their roots.</p>
                    <p>Our journey starts in Africa, but our vision is global. We believe architecture can shape identity and community anywhere — if it’s grounded in the people and places it serves.</p>
                </div>
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
                   Founding spots are limited. Join now to shape the future of design.
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
