
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Bot, Archive, Users, Wind, Code } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge";

const newContent = [
    {
        title: "Primer: Parametric Design with Grasshopper",
        category: "Primers",
        imageUrl: "https://images.unsplash.com/photo-1632426986596-e366916892a4?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "parametric architecture",
        icon: Code
    },
    {
        title: "Course: Sustainable Materials in West Africa",
        category: "Courses",
        imageUrl: "https://images.unsplash.com/photo-1517602302339-38541c888f40?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "sustainable materials",
        icon: BookOpen
    },
    {
        title: "Archive: The Great Mosque of Djenné",
        category: "Archives",
        imageUrl: "https://images.unsplash.com/photo-1590483441839-a68b55500448?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "african architecture",
        icon: Archive
    },
    {
        title: "AI Workflow: Site Analysis with Computer Vision",
        category: "Workflows",
        imageUrl: "https://images.unsplash.com/photo-1698661033580-779d7d117a59?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "computer vision city",
        icon: Bot
    }
];

const contentSections = [
    {
        icon: BookOpen,
        title: "Courses",
        description: "Structured learning paths to master new skills, from BIM software to sustainable design theory.",
        cta: "Browse Courses"
    },
    {
        icon: Wind,
        title: "Primers",
        description: "Quick, focused introductions to core concepts. Get up to speed on a new topic in under an hour.",
        cta: "Explore Primers"
    },
    {
        icon: Archive,
        title: "Archives",
        description: "A community-curated library of historical documents, case studies, and architectural precedents.",
        cta: "Search Archives"
    },
    {
        icon: Users,
        title: "Community",
        description: "Connect with peers, join study groups, and get feedback from mentors in our private channels.",
        cta: "Join the Community"
    }
]

export default function SchoolPage() {
  return (
    <main className="animate-in fade-in duration-500">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-muted">
            <div className="container px-4 md:px-6 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                    An Open School for a New Generation of Architects.
                </h1>
                <p className="max-w-2xl mx-auto mt-6 text-muted-foreground md:text-xl">
                    Learn anytime, anywhere. Master real-world skills with courses, primers, and archives designed for a mobile-first world.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/join">
                           Start Learning for Free
                           <ArrowRight className="ml-2"/>
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* What's New Section */}
        <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tight text-center font-headline mb-12">What's New This Week</h2>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {newContent.map((item, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <Card className="overflow-hidden h-full flex flex-col">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    width={600}
                                    height={400}
                                    data-ai-hint={item.aiHint}
                                    className="w-full h-48 object-cover"
                                />
                                <CardHeader>
                                     <Badge variant="secondary" className="w-fit mb-2">{item.category}</Badge>
                                    <CardTitle>{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col">
                                    <div className="flex-grow" />
                                    <Button variant="outline" className="w-full mt-4">
                                        <item.icon className="mr-2 h-4 w-4" />
                                        Explore Now
                                    </Button>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                </Carousel>
            </div>
        </section>
        
        {/* Core Sections */}
        <section className="w-full py-16 md:py-24 bg-muted">
            <div className="container px-4 md:px-6">
                 <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">The Library</h2>
                    <p className="mt-4 text-muted-foreground md:text-lg">
                        Aether School is organized into four core areas, designed for flexible and focused learning.
                    </p>
                 </div>
                 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {contentSections.map((section) => (
                        <Card key={section.title} className="bg-background/50 p-6 rounded-lg text-center flex flex-col">
                             <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 text-primary p-4 rounded-full">
                                    <section.icon className="w-8 h-8"/>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-headline">{section.title}</h3>
                            <p className="mt-2 text-muted-foreground flex-grow">{section.description}</p>
                            <div className="mt-6">
                                 <Button variant="secondary" className="w-full">
                                    {section.cta}
                                 </Button>
                            </div>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>
        
        {/* Final CTA */}
        <section className="w-full py-16 md:py-24">
            <div className="container text-center bg-primary/5 rounded-lg p-10 md:p-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Ready to start learning?</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
                   Get your free Aether ID to access the school and join a global community of architects and designers.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/join">
                           Get Your Aether ID
                           <ArrowRight className="ml-2"/>
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    </main>
  );
}
