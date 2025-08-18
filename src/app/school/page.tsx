
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Bot, Archive, Users, Wind, Code, ThumbsUp } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";
import { type Course } from '@/components/common/CourseCard';

// Mock Data representing all available content
const allContent: Course[] = [
    { id: "1", title: "Parametric Design with Grasshopper", author: "Dr. Elena Vance", tags: ["Parametrics", "Computational Design"], difficulty: "Intermediate", format: "Primer", releaseDate: "2024-08-15", description: "An in-depth guide to visual programming in Rhino for complex architectural forms.", imageUrl: "https://images.unsplash.com/photo-1632426986596-e366916892a4?q=80&w=600&h=400&auto=format&fit=crop", aiHint: "parametric architecture" },
    { id: "2", title: "Sustainable Materials in West Africa", author: "Kwame Addo", tags: ["Sustainability", "Materials"], difficulty: "Beginner", format: "Video Course", releaseDate: "2024-09-01", description: "Explore the use of laterite, bamboo, and recycled plastics in modern African construction.", imageUrl: "https://images.unsplash.com/photo-1517602302339-38541c888f40?q=80&w=600&h=400&auto=format&fit=crop", aiHint: "sustainable materials" },
    { id: "5", title: "The Great Mosque of Djenné: An Archive", author: "Community Curated", tags: ["History", "Vernacular"], difficulty: "All Levels", format: "Archive", releaseDate: "2024-06-10", description: "A deep dive into the history, construction, and cultural significance of this iconic landmark.", imageUrl: "https://images.unsplash.com/photo-1590483441839-a68b55500448?q=80&w=600&h=400&auto=format&fit=crop", aiHint: "african architecture" },
    { id: "4", title: "AI for Site Analysis", author: "Aether AI", tags: ["AI", "Urbanism"], difficulty: "Advanced", format: "Primer", releaseDate: "2024-08-22", description: "Use computer vision and data analysis to conduct comprehensive site studies.", imageUrl: "https://images.unsplash.com/photo-1698661033580-779d7d117a59?q=80&w=600&h=400&auto=format&fit=crop", aiHint: "computer vision city" },
    { id: "6", title: "Design Thinking for Architects", author: "Inioluwa Oladipupo", tags: ["Design Theory"], difficulty: "Beginner", format: "Primer", releaseDate: "2024-09-05", description: "A framework for creative problem-solving tailored to architectural challenges.", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&h=400&auto=format&fit=crop", aiHint: "team collaboration" },
    { id: "8", title: "Intro to Urban Planning", author: "Amina El-Sayed", tags: ["Urbanism"], difficulty: "Beginner", format: "Video Course", releaseDate: "2024-09-10", description: "Understand the principles that shape our cities, from zoning to public space.", imageUrl: "https://images.unsplash.com/photo-1549472539-b2760b2f45b7?q=80&w=600&h=400&auto=format&fit=crop", aiHint: "city map" },
];

const contentSections = [
    {
        icon: BookOpen,
        title: "Courses",
        description: "Structured learning paths to master new skills, from BIM software to sustainable design theory.",
        cta: "Browse Courses",
        href: "/school/courses"
    },
    {
        icon: Wind,
        title: "Primers",
        description: "Quick, focused introductions to core concepts. Get up to speed on a new topic in under an hour.",
        cta: "Explore Primers",
        href: "/school/courses?format=Primer"
    },
    {
        icon: Archive,
        title: "Archives",
        description: "A community-curated library of historical documents, case studies, and architectural precedents.",
        cta: "Search Archives",
        href: "/school/courses?format=Archive"
    },
    {
        icon: Users,
        title: "Community",
        description: "Connect with peers, join study groups, and get feedback from mentors in our private channels.",
        cta: "Join the Community",
        href: "/community"
    }
]

export default function SchoolPage() {
  const { toast } = useToast();

  const handleVote = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
        title: "Vote Counted!",
        description: `You voted for "${title}" as Drop of the Week.`,
    })
  }
  
  const newContent = useMemo(() => {
    const sortedContent = [...allContent].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    return sortedContent.slice(0, 4); // Get the 4 most recent items
  }, []);


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
                <h2 className="text-3xl font-bold tracking-tight text-center font-headline mb-12">This Week's Drops</h2>
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
                            <Link href={`/school/courses/${item.id}`} className="group block h-full">
                                <Card className="overflow-hidden h-full flex flex-col hover:border-primary/50 transition-colors duration-300">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        width={600}
                                        height={400}
                                        data-ai-hint={item.aiHint}
                                        className="w-full h-48 object-cover"
                                    />
                                    <CardHeader>
                                        <Badge variant="secondary" className="w-fit mb-2">{item.format}</Badge>
                                        <CardTitle className="group-hover:text-primary transition-colors">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow flex flex-col">
                                        <div className="flex-grow" />
                                        <Button 
                                            variant="outline" 
                                            className="w-full mt-4" 
                                            onClick={(e) => handleVote(e, item.title)}
                                        >
                                            <ThumbsUp className="mr-2 h-4 w-4" />
                                            Vote for Drop of the Week
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
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
                                 <Button asChild variant="secondary" className="w-full">
                                    <Link href={section.href}>
                                        {section.cta}
                                    </Link>
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
