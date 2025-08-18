
'use client';

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Star, Users } from "lucide-react";

export interface Course {
    id: string;
    title: string;
    description: string;
    author: string;
    tags: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
    format: 'Video Course' | 'Primer' | 'Archive';
    releaseDate: string;
    imageUrl: string;
    aiHint?: string;
    rating?: number;
    recommendations?: number;
}

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <Link href={`/school/courses/${course.id}`} className="group block">
            <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border-t-4 border-transparent group-hover:border-primary">
                <div className="relative h-48">
                    <Image
                        src={course.imageUrl || 'https://placehold.co/600x400.png'}
                        alt={course.title}
                        fill
                        data-ai-hint={course.aiHint || 'design course'}
                        className="object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                        <Badge variant="secondary">{course.difficulty}</Badge>
                        <Badge variant="secondary">{course.format}</Badge>
                    </div>
                </div>
                <CardHeader>
                    <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{course.title}</CardTitle>
                    <CardDescription>by {course.author}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm line-clamp-3">{course.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center text-sm text-muted-foreground pt-4">
                    <div className="flex items-center gap-4">
                         {course.recommendations && (
                            <div className="flex items-center gap-1" title={`${course.recommendations} recommendations`}>
                                <Users className="w-4 h-4 text-primary/70" />
                                <span>{course.recommendations}</span>
                            </div>
                        )}
                        {course.rating && (
                            <div className="flex items-center gap-1" title={`Rated ${course.rating} out of 5`}>
                                <Star className="w-4 h-4 text-amber-500/80" />
                                <span>{course.rating}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View <ArrowUpRight className="w-4 h-4" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
