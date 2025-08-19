
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Layers, Lock, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CountdownTimer } from "@/components/common/CountdownTimer";

const featuredCourses = [
  {
    title: "Design for Climate Resilience",
    description: "Master passive cooling, water harvesting, and sustainable material selection for African climates.",
    imageUrl: "https://images.unsplash.com/photo-1616047006789-b7af52592bef?q=80&w=600&h=400&auto=format&fit=crop",
    aiHint: "sustainable home"
  },
  {
    title: "Vernacular Innovation Studio",
    description: "Deconstruct traditional building techniques and adapt them for contemporary urban contexts.",
    imageUrl: "https://images.unsplash.com/photo-1590483441839-a68b55500448?q=80&w=600&h=400&auto=format&fit=crop",
    aiHint: "african architecture"
  },
  {
    title: "Digital Fabrication for Africa",
    description: "From 3D printing with local composites to parametric design inspired by nature.",
    imageUrl: "https://images.unsplash.com/photo-1551884831-bbf327632454?q=80&w=600&h=400&auto=format&fit=crop",
    aiHint: "construction technology"
  },
];

export default function LobbyPage() {
  return (
    <main className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-muted">
        <div className="container px-4 md:px-6 text-center">
            <Badge variant="secondary" className="mb-4">PRE-LAUNCH LOBBY</Badge>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                The Blueprint is Being Drafted
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl">
                You're early. The full Aether platform launches on December 8, 2025. Until then, explore what's coming and join our live pre-launch events.
            </p>
        </div>
      </section>

       {/* Countdown Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-center font-headline mb-12">Countdown to Full Launch</h2>
            <CountdownTimer targetDate="2025-12-08T09:00:00" />
        </div>
      </section>

      {/* Content Teaser Section */}
      <section className="w-full py-16 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold tracking-tight font-headline">First Look: Courses Dropping December 8th</h2>
                <p className="mt-4 text-muted-foreground md:text-lg">
                   Here's a sneak peek of the foundational courses that will be available in Aether School at launch.
                </p>
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {featuredCourses.map((course) => (
                    <Card key={course.title} className="flex flex-col text-center border-t-4 border-primary/20 hover:border-primary transition-all duration-300">
                        <div className="relative h-48">
                            <Image
                                src={course.imageUrl}
                                alt={course.title}
                                fill
                                data-ai-hint={course.aiHint}
                                className="object-cover rounded-t-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <Lock className="absolute top-3 right-3 text-white/50" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">{course.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Platform Teaser */}
       <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6">
                    <Badge variant="outline">PLATFORM SNEAK PEEK</Badge>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">A Studio Designed for Learning</h2>
                    <p className="text-lg text-muted-foreground">The Aether platform is more than just courses. It's an integrated environment for learning, practice, and connection. Our dashboard will track your progress, showcase your portfolio, and connect you with peers.</p>
                     <div className="pt-4">
                        <Button asChild size="lg">
                            <Link href="/events">
                                <Calendar className="mr-2"/>
                                Attend a Pre-launch Event
                            </Link>
                        </Button>
                    </div>
                </div>
                <Card className="p-4 bg-muted/50 shadow-lg">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                       <Image
                            src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=1200&h=800&auto=format&fit=crop"
                            alt="A clean, modern user interface dashboard"
                            fill
                            data-ai-hint="dashboard ui"
                            className="object-cover"
                        />
                         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-full">
                               <Layers className="w-12 h-12 text-primary" />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    </main>
  );
}
