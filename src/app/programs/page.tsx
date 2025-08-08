
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, GraduationCap, Lightbulb, Users, ArrowRight, BookOpen, Clock, Bot } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const schoolCourses = [
  {
    title: "Design for Climate Resilience",
    description: "Master passive cooling, water harvesting, and sustainable material selection for African climates.",
  },
  {
    title: "Vernacular Innovation Studio",
    description: "Deconstruct traditional building techniques and adapt them for contemporary urban contexts.",
  },
  {
    title: "Digital Fabrication for Africa",
    description: "From 3D printing with local composites to parametric design inspired by nature.",
  },
];

const studioInstructors = [
    {
        name: "Dr. Adanna Okoye",
        title: "Lead, Urban Futures Lab",
        imageUrl: "https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=400&h=400&auto=format&fit=crop",
        aiHint: "professional woman portrait",
    },
    {
        name: "David Tetteh",
        title: "Principal, Sustainable Structures",
        imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&h=400&auto=format&fit=crop",
        aiHint: "professional man portrait",
    }
]


export default function ProgramsPage() {
    return (
      <main className="animate-in fade-in duration-500">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 bg-muted">
            <div className="container px-4 md:px-6 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                    Two Paths. One Mission.
                </h1>
                <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl">
                    Whether you're building foundational knowledge or collaborating on real-world projects, Aether provides the tools and community to accelerate your growth as an architect.
                </p>
            </div>
        </section>

        {/* Aether School Section */}
        <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6">
                 <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <GraduationCap className="w-10 h-10 text-primary" />
                            <h2 className="text-3xl font-bold font-headline">Aether School</h2>
                        </div>
                        <p className="text-lg text-muted-foreground">
                            Aether School is our structured learning arm, providing an Africa-centered architectural curriculum through self-paced courses, workshops, and skill-based learning paths. It’s where you build your foundation.
                        </p>
                        <div className="space-y-3 pt-4">
                            <h4 className="font-semibold text-lg">Curriculum Sneak Peek:</h4>
                            {schoolCourses.map(course => (
                                <Card key={course.title} className="bg-muted/50 p-4">
                                    <p className="font-bold">{course.title}</p>
                                    <p className="text-sm text-muted-foreground">{course.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                     <Card className="p-8 bg-background shadow-lg">
                        <CardHeader className="p-0">
                            <CardTitle className="font-headline text-2xl">A Day in Aether School</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 pt-4 space-y-4 text-muted-foreground">
                            <p><strong className="text-foreground">Morning:</strong> You log in and start a lesson on rainwater harvesting systems. The course blends video tutorials with case studies of projects in Accra and Kigali.</p>
                            <p><strong className="text-foreground">Afternoon:</strong> You complete a quiz and earn a new skill badge. In the community #materials channel, you ask for advice on sourcing sustainable timber and get three replies within an hour.</p>
                            <p><strong className="text-foreground">Evening:</strong> You join a live, optional Q&A with a guest lecturer on passive cooling techniques, connecting with 50 other members from across the continent.</p>
                        </CardContent>
                        <div className="mt-6">
                            <Button asChild className="w-full" size="lg">
                                <Link href="/school">
                                    Explore School Features
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

        {/* Horizon Studio Section */}
        <section className="w-full py-16 md:py-24 bg-muted">
            <div className="container px-4 md:px-6">
                 <div className="grid md:grid-cols-2 gap-12 items-center">
                     <Card className="p-8 bg-background shadow-lg order-last md:order-first">
                        <CardHeader className="p-0">
                            <CardTitle className="font-headline text-2xl">A Day in Horizon Studio</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 pt-4 space-y-4 text-muted-foreground">
                            <p><strong className="text-foreground">Morning:</strong> Your cohort kicks off with a new brief: design a modular, eco-friendly community kiosk. Your team of four—from Nigeria, Kenya, and Egypt—brainstorms on a shared digital whiteboard.</p>
                            <p><strong className="text-foreground">Afternoon:</strong> You present your initial concepts to your mentor, who challenges you to rethink your material choices for better local sourcing. The feedback is tough but constructive.</p>
                            <p><strong className="text-foreground">Evening:</strong> Your team refines the 3D model. The final project will be added to your Aether portfolio, a verifiable proof-of-skill you can show to future employers.</p>
                        </CardContent>
                        <div className="mt-6">
                             <Button asChild className="w-full" variant="outline" size="lg">
                                <Link href="/join">
                                    Apply to the Next Studio Cohort
                                </Link>
                            </Button>
                        </div>
                    </Card>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Lightbulb className="w-10 h-10 text-primary" />
                            <h2 className="text-3xl font-bold font-headline">Horizon Studio</h2>
                        </div>
                        <p className="text-lg text-muted-foreground">
                           Horizon Studio is our practical project lab. Here, you join live, cohort-based collaborations, tackle real-world design challenges, and build portfolio-worthy projects under the guidance of expert mentors.
                        </p>
                        <div className="space-y-3 pt-4">
                            <h4 className="font-semibold text-lg">Mentors & Instructors:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {studioInstructors.map(instructor => (
                                    <div key={instructor.name} className="flex items-center gap-4">
                                        <Image src={instructor.imageUrl} alt={instructor.name} data-ai-hint={instructor.aiHint} width={68} height={68} className="rounded-full object-cover w-[68px] h-[68px]" />
                                        <div>
                                            <p className="font-bold">{instructor.name}</p>
                                            <p className="text-sm text-muted-foreground">{instructor.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-16 md:py-24">
            <div className="container text-center bg-primary/5 rounded-lg p-10 md:p-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Ready to start building your future?</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
                   Your Aether ID is your key to our global studio. Get yours and choose your path today.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/join">
                           Join the Founding 500
                           <ArrowRight className="ml-2"/>
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
    )
}
