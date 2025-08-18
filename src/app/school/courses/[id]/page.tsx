
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, Film, Layers, MessageSquare, PlayCircle, Award, ThumbsUp, User, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Quiz } from '@/components/common/Quiz';

// --- MOCK DATA ---
const allCourseData = {
    "1": {
        id: "1",
        title: "Parametric Design with Grasshopper",
        author: "Dr. Elena Vance",
        tags: ["Parametrics", "Computational Design"],
        difficulty: "Intermediate",
        format: "Primer",
        releaseDate: "2024-08-15",
        description: "An in-depth guide to visual programming in Rhino for complex architectural forms. This primer covers the fundamental concepts, from data trees to custom scripting, enabling you to create dynamic and responsive designs.",
        imageUrl: "https://images.unsplash.com/photo-1632426986596-e366916892a4?q=80&w=1200&h=600&auto=format&fit=crop",
        aiHint: "parametric architecture",
        duration: "45 min read",
        communityNotes: [
             { id: 1, user: "John A.", text: "The explanation of data trees finally made it click for me. Highly recommended.", upvotes: 22 },
        ]
    },
    "2": {
        id: "2",
        title: "Sustainable Materials in West Africa",
        author: "Kwame Addo",
        tags: ["Sustainability", "Materials"],
        difficulty: "Beginner",
        format: "Video Course",
        releaseDate: "2024-09-01",
        description: "A comprehensive exploration into the use of laterite, bamboo, and recycled plastics in modern African construction. This course provides practical knowledge for designing buildings that are both environmentally friendly and culturally relevant.",
        imageUrl: "https://images.unsplash.com/photo-1517602302339-38541c888f40?q=80&w=1200&h=600&auto=format&fit=crop",
        aiHint: "sustainable materials",
        duration: "4 hours",
        lessons: [
            { id: 1, title: "Introduction to Sustainable Materials", type: "video", duration: "12 min", completed: true },
            { id: 2, title: "The Power of Laterite: From Earth to Wall", type: "video", duration: "25 min", completed: true },
            { id: 3, title: "Reading: The History of Earthen Architecture", type: "document", duration: "45 min", completed: false },
            { id: 4, title: "Knowledge Check: Earthen Materials", type: "quiz", duration: "10 min", completed: false },
            { id: 5, title: "Bamboo as a Structural Element", type: "video", duration: "30 min", completed: false },
            { id: 6, title: "Case Study: A Bamboo Pavilion in Accra", type: "document", duration: "20 min", completed: false },
            { id: 7, title: "Innovating with Recycled Plastics", type: "video", duration: "28 min", completed: false },
            { id: 8, title: "Final Project: Design Your Sustainable Kiosk", type: "project", duration: "90 min", completed: false },
        ],
        communityNotes: [
            { id: 1, user: "Amina E.", text: "The section on laterite stabilization techniques was a game-changer for my final year project.", upvotes: 12 },
            { id: 2, user: "David T.", text: "Anyone have good resources for sourcing treated bamboo in Nigeria? The case study was inspiring.", upvotes: 8 },
            { id: 3, user: "Sarah K.", text: "Tip: Pause the video at 15:32 in the plastics lesson. The diagram showing extrusion methods is super helpful.", upvotes: 19 },
        ]
    },
    "5": {
        id: "5",
        title: "The Great Mosque of Djenné: An Archive",
        author: "Community Curated",
        tags: ["History", "Vernacular"],
        difficulty: "All Levels",
        format: "Archive",
        releaseDate: "2024-06-10",
        description: "A deep dive into the history, construction, and cultural significance of this iconic landmark. This archive entry contains original manuscripts, photographs, and architectural drawings.",
        imageUrl: "https://images.unsplash.com/photo-1590483441839-a68b55500448?q=80&w=1200&h=600&auto=format&fit=crop",
        aiHint: "african architecture",
        duration: "Self-paced",
        communityNotes: [
            { id: 1, user: "Prof. Faye", text: "The high-resolution scans of the original 1907 blueprints are an invaluable resource for my research.", upvotes: 35 },
        ]
    }
};

const lessonIcons = {
    video: Film,
    document: FileText,
    quiz: CheckCircle,
    project: Layers,
};

function ArticleStyleLayout({ courseData }: { courseData: any }) {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <Badge variant="outline" className="mb-2">{courseData.format}</Badge>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mt-2">{courseData.title}</h1>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-2"><User className="w-4 h-4" /> <span>{courseData.author}</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span>{courseData.duration}</span></div>
                </div>
            </div>
             <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                    src={courseData.imageUrl}
                    alt={courseData.title}
                    fill
                    data-ai-hint={courseData.aiHint}
                    className="object-cover"
                />
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>{courseData.description}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.</p>
                <h3>Subsection Title</h3>
                <p>Maecenas tincidunt, augue et rutrum condimentum, libero lectus mattis orci, ut commodo.",</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Community Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {courseData.communityNotes.map((note: any) => (
                       <Card key={note.id} className="p-4 text-sm bg-muted/50">
                           <p>{note.text}</p>
                           <div className="flex justify-between items-center mt-2">
                               <p className="text-xs text-muted-foreground font-medium">-- {note.user}</p>
                               <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-muted-foreground">
                                   <ThumbsUp className="w-4 h-4 mr-2" /> {note.upvotes}
                               </Button>
                           </div>
                       </Card>
                   ))}
                </CardContent>
            </Card>
        </div>
    )
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
    const courseData = allCourseData[params.id as keyof typeof allCourseData] || allCourseData["2"];
    const [lessons, setLessons] = useState(courseData.lessons || []);
    const [activeLessonId, setActiveLessonId] = useState(lessons.length > 0 ? lessons[0].id : 1);

    const completedLessons = lessons.filter(l => l.completed).length;
    const progress = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;
    
    const handleToggleLesson = (id: number) => {
        setLessons(prevLessons =>
            prevLessons.map(lesson =>
                lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson
            )
        );
    };
    
    const activeLesson = lessons.find(l => l.id === activeLessonId);

    // Conditional rendering based on format
    if (courseData.format === "Primer" || courseData.format === "Archive") {
        return (
            <main className="container py-12 md:py-16 animate-in fade-in duration-500">
                <ArticleStyleLayout courseData={courseData} />
            </main>
        );
    }

    // Default layout for Video Courses
    return (
      <main className="container py-12 md:py-16 animate-in fade-in duration-500">
        <div className="grid lg:grid-cols-[1fr_350px] gap-12">
            
            {/* Main Content */}
            <div className="space-y-8">
                {/* Course Header */}
                <div>
                    <p className="text-primary font-semibold">{courseData.difficulty}</p>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mt-2">{courseData.title}</h1>
                    <p className="text-lg text-muted-foreground mt-4">{courseData.description}</p>
                </div>
                
                <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                        src={courseData.imageUrl}
                        alt={courseData.title}
                        fill
                        data-ai-hint={courseData.aiHint}
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                        <Button size="lg" onClick={() => setActiveLessonId(lessons.find(l => !l.completed)?.id || 1)}>
                            <PlayCircle className="mr-2" />
                            {progress > 0 ? 'Continue Learning' : 'Start Course'}
                        </Button>
                    </div>
                </div>

                {/* Active Lesson Content */}
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>Current Lesson: {activeLesson?.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeLesson?.type === 'quiz' ? (
                            <Quiz />
                        ) : (
                            <p className="text-muted-foreground">
                                This is where the content for "{activeLesson?.title}" would be displayed. It could be an embedded video, a document viewer, or project instructions.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
                <Card className="sticky top-20">
                    <CardHeader>
                        <CardTitle>Course Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Progress value={progress} aria-label={`${Math.round(progress)}% complete`} />
                        <p className="text-sm text-muted-foreground text-center">{completedLessons} of {lessons.length} lessons completed</p>
                        
                        <div className="flex items-center gap-4 text-sm pt-2">
                             <User className="w-4 h-4 text-muted-foreground" />
                             <span>Instructor: <strong>{courseData.author}</strong></span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                             <Clock className="w-4 h-4 text-muted-foreground" />
                             <span>Estimated duration: <strong>{courseData.duration}</strong></span>
                        </div>
                        {progress === 100 && (
                            <div className="text-center pt-4 !mt-6">
                                <Award className="w-12 h-12 text-amber-500 mx-auto" />
                                <p className="font-bold mt-2">Course Completed!</p>
                                <Button variant="outline" size="sm" className="mt-2">Get Certificate</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold font-headline">Lessons</h3>
                    <div className="space-y-2">
                        {lessons.map(lesson => {
                            const Icon = lessonIcons[lesson.type as keyof typeof lessonIcons] || FileText;
                            const isSelected = lesson.id === activeLessonId;
                            return (
                                <button key={lesson.id} onClick={() => setActiveLessonId(lesson.id)} className={`w-full text-left p-3 rounded-md border transition-colors ${isSelected ? 'bg-primary/10 border-primary/20' : 'bg-muted/50 hover:bg-muted'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5 text-muted-foreground"/>
                                            <span className="font-medium">{lesson.title}</span>
                                        </div>
                                        <CheckCircle 
                                            onClick={(e) => { e.stopPropagation(); handleToggleLesson(lesson.id); }}
                                            className={`w-5 h-5 cursor-pointer ${lesson.completed ? 'text-green-500 fill-green-500/20' : 'text-muted-foreground/50 hover:text-muted-foreground'}`}
                                        />
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <h3 className="text-xl font-bold font-headline flex items-center gap-2"><MessageSquare className="w-5 h-5"/> Community Notes</h3>
                    <div className="space-y-3">
                       {courseData.communityNotes.map((note:any) => (
                           <Card key={note.id} className="p-3 text-sm bg-background">
                               <p>{note.text}</p>
                               <div className="flex justify-between items-center mt-2">
                                   <p className="text-xs text-muted-foreground font-medium">-- {note.user}</p>
                                   <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-muted-foreground">
                                       <ThumbsUp className="w-4 h-4 mr-2" /> {note.upvotes}
                                   </Button>
                               </div>
                           </Card>
                       ))}
                    </div>
                </div>

            </aside>
        </div>
      </main>
    )
}
