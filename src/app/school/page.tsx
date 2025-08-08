
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, BookOpen, Clock, BarChart, Users, Star, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { Quiz } from "@/components/common/Quiz";

const sampleCourses = [
  {
    title: "Climate-Responsive Design",
    description: "Learn sustainable design principles for African climates.",
    difficulty: "Intermediate",
    hours: "12",
    imageUrl: "https://images.unsplash.com/photo-1416339611164-9ce1b98d1212?q=80&w=600&h=400&auto=format&fit=crop",
    aiHint: "sustainable architecture",
  },
  {
    title: "Intro to Revit",
    description: "Master the fundamentals of Building Information Modeling (BIM).",
    difficulty: "Beginner",
    hours: "20",
    imageUrl: "https://images.unsplash.com/photo-1572023924949-b1d8b2a8f8e0?q=80&w=600&h=400&auto=format&fit=crop",
    aiHint: "architectural software",
  },
  {
    title: "Architecture of West Africa",
    description: "Explore the rich history and vernacular styles of the region.",
    difficulty: "Beginner",
    hours: "8",
    imageUrl: "https://images.unsplash.com/photo-1590483441839-a68b55500448?q=80&w=600&h=400&auto=format&fit=crop",
    aiHint: "african architecture",
  },
];

const studentWork = [
    {
        name: "Jide Adebayo",
        project: "Eco-Community Hub",
        imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "modern building interior",
    },
    {
        name: "Amina Okoro",
        project: "Vertical Urban Farm",
        imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&h=400&auto=format&fit=crop",
        aiHint: "futuristic architecture",
    },
]

export default function SchoolDemoPage() {
    const preLaunchDate = "2025-10-06T00:00:00Z";

  return (
    <div className="animate-in fade-in duration-500">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6 text-center">
                 <Badge variant="outline" className="mb-4">PREVIEW</Badge>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
                Explore Aether School
                </h1>
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
                A preview of the digital-first learning experience designed to empower the next generation of African architects and designers.
                </p>
            </div>
        </section>

        {/* Course Previews */}
        <section className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center font-headline mb-12">Featured Courses</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sampleCourses.map((course) => (
                    <Card key={course.title} className="flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <Image
                        src={course.imageUrl}
                        width={600}
                        height={400}
                        alt={course.title}
                        data-ai-hint={course.aiHint}
                        className="w-full h-48 object-cover"
                        />
                        <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                            <CardDescription>{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                           <div className="flex-grow" />
                            <div className="flex justify-between items-center text-sm text-muted-foreground pt-4">
                                <div className="flex items-center gap-1"><BarChart className="w-4 h-4" />{course.difficulty}</div>
                                <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.hours} Hours</div>
                            </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Learning Path */}
        <section className="w-full py-12 md:py-24 bg-muted">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl font-headline mb-12">Your Learning Journey</h2>
                <div className="relative max-w-5xl mx-auto">
                    <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-border -translate-x-1/2 hidden md:block" />
                    <div className="grid md:grid-cols-3 gap-y-12 md:gap-x-8">
                        {/* Step 1 */}
                        <div className="text-center space-y-3 relative">
                             <div className="mx-auto bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">1</div>
                            <h3 className="text-xl font-bold font-headline">Foundation</h3>
                            <p className="text-muted-foreground">Master core concepts and software skills with our open-access introductory courses.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="text-center space-y-3 relative">
                            <div className="mx-auto bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">2</div>
                            <h3 className="text-xl font-bold font-headline">Intermediate</h3>
                            <p className="text-muted-foreground">Apply your knowledge to complex problems and specialized design areas.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="text-center space-y-3 relative">
                            <div className="mx-auto bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">3</div>
                            <h3 className="text-xl font-bold font-headline">Studio Level</h3>
                            <p className="text-muted-foreground">Join Horizon Studio to work on real-world projects with expert mentorship.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        {/* Sample Lesson */}
        <section className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                 <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl font-headline mb-12">Try a Sample Lesson</h2>
                 <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
                     <div className="space-y-4">
                        <h3 className="text-2xl font-bold">Module 1: What is Climate-Responsive Design?</h3>
                        <p className="text-muted-foreground">Before we build, we must understand the environment. Climate-responsive design isn't just about sustainability; it's a philosophy of creating buildings that are in harmony with their natural surroundings.</p>
                        <p>This approach considers sun orientation, wind patterns, local materials, and seasonal changes to create structures that are energy-efficient, comfortable, and culturally relevant.</p>
                         <Image
                            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600&h=400&auto=format&fit=crop"
                            width={600}
                            height={400}
                            alt="Office with natural light"
                            data-ai-hint="sustainable office"
                            className="w-full rounded-lg object-cover"
                         />
                     </div>
                     <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4">Quick Quiz</h3>
                        <Quiz />
                     </Card>
                 </div>
            </div>
        </section>

        {/* Progress Tracker & Student Showcase */}
        <section className="w-full py-12 md:py-24 bg-muted">
            <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-16 items-center">
                 <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Track Your Growth</h2>
                    <p className="text-muted-foreground md:text-xl">Your Aether profile is your living portfolio. Earn skill badges and showcase your achievements as you complete courses and projects.</p>
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Badges</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4">
                            <div className="text-center space-y-2">
                                <div className="bg-primary/10 border-2 border-primary/20 rounded-full p-3 inline-block"><Star className="w-8 h-8 text-primary" /></div>
                                <p className="text-sm font-medium">BIM Fundamentals</p>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="bg-primary/10 border-2 border-primary/20 rounded-full p-3 inline-block"><Star className="w-8 h-8 text-primary" /></div>
                                <p className="text-sm font-medium">Sustainable Materials</p>
                            </div>
                             <div className="text-center space-y-2">
                                <div className="bg-muted border-2 border-dashed rounded-full p-3 inline-block"><Star className="w-8 h-8 text-muted-foreground" /></div>
                                <p className="text-sm font-medium text-muted-foreground">African Vernacular</p>
                            </div>
                        </CardContent>
                    </Card>
                 </div>
                 <div className="space-y-6">
                     <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl font-headline">Student Showcase</h2>
                     <div className="grid grid-cols-1 gap-6">
                        {studentWork.map(work => (
                            <Card key={work.name} className="overflow-hidden">
                                <Image src={work.imageUrl} alt={work.project} width={600} height={400} className="w-full h-40 object-cover" data-ai-hint={work.aiHint}/>
                                <CardContent className="p-4">
                                    <p className="font-bold">{work.project}</p>
                                    <p className="text-sm text-muted-foreground">by {work.name}</p>
                                </CardContent>
                            </Card>
                        ))}
                     </div>
                 </div>
            </div>
        </section>

        {/* Community Callout & CTA */}
         <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container text-center">
                <div className="max-w-2xl mx-auto">
                    <MessageSquare className="w-12 h-12 mx-auto text-primary mb-4" />
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Learning is a Team Sport</h2>
                    <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-xl">
                        Discuss course content, ask questions, and join study groups in our vibrant community spaces on Discord, Telegram, and WhatsApp.
                    </p>
                </div>

                <div className="mt-12 pt-12 border-t">
                    <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl font-headline">Ready to build the future?</h3>
                    <p className="max-w-2xl mx-auto mt-2 text-muted-foreground md:text-lg">
                        Our full ecosystem launches soon. Join the movement today.
                    </p>
                    <div className="mt-8">
                        <CountdownTimer targetDate={preLaunchDate} />
                    </div>
                    <div className="mt-8">
                        <Button asChild size="lg">
                            <Link href="/join">
                            Join the Ecosystem – Start Learning for Free
                            <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
}
