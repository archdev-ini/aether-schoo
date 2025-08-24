
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
import { useEffect, useState, useMemo } from "react";
import { type Course } from '@/components/common/CourseCard';
import { getCourses } from "./courses/actions";
import { Skeleton } from "@/components/ui/skeleton";


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

function NewContentCarousel() {
    const [newContent, setNewContent] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchContent() {
            try {
                const allContent = await getCourses();
                const sortedContent = [...allContent].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
                setNewContent(sortedContent.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch new content", error);
                toast({ title: "Error", description: "Could not load new content.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        }
        fetchContent();
    }, [toast]);
    
    const handleVote = (e: React.MouseEvent, title: string) => {
        e.preventDefault();
        e.stopPropagation();
        toast({
            title: "Vote Counted!",
            description: `You voted for "${title}" as Drop of the Week.`,
        })
    }

    if (isLoading) {
        return (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="overflow-hidden h-full flex flex-col">
                        <Skeleton className="h-48 w-full" />
                        <CardHeader>
                            <Skeleton className="h-4 w-16 mb-2" />
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                            <div className="flex-grow" />
                            <Skeleton className="h-10 w-full mt-4" />
                        </CardContent>
                    </Card>
                ))}
             </div>
        )
    }

    return (
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
                                src={item.imageUrl || `https://placehold.co/600x400.png`}
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
    )
}

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
                <h2 className="text-3xl font-bold tracking-tight text-center font-headline mb-12">This Week's Drops</h2>
                <NewContentCarousel />
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
