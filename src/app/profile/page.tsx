
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Award, Flame, MessageSquare, Pencil, CheckCircle, BookOpen } from "lucide-react";
import Link from 'next/link';

const user = {
    name: "Amina E.",
    avatar: "https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=100&h=100&auto=format&fit=crop",
    aiHint: "professional woman",
    bio: "Architect & Urbanist passionate about sustainable design in West Africa. Exploring the intersection of tradition and technology.",
    streak: 5, // 5-day streak
    coursesInProgress: [
        { id: "2", title: "Sustainable Materials in West Africa", progress: 25 },
        { id: "3", title: "BIM Fundamentals with Revit", progress: 80 },
    ],
    achievements: [
        { icon: Award, title: "Top Contributor", date: "Aug 2024" },
        { icon: Flame, title: "Pioneer", description: "Joined the Founding 500" },
        { icon: CheckCircle, title: "Primer Pro", description: "Completed 5 primers" },
    ],
    recentActivity: [
        { type: "comment", content: "The section on laterite stabilization techniques was a game-changer for my final year project.", on: "Sustainable Materials in WA", href: "/school/courses/2" },
        { type: "suggestion", content: "Suggested a new Primer on 'Kinetic Facades'", on: "Community Suggestions", href: "/community/suggest" },
    ]
};

const streakDays = Array.from({ length: 7 }, (_, i) => {
  const day = new Date();
  day.setDate(day.getDate() - (6 - i));
  return {
    day: day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
    active: i < user.streak
  };
});

export default function ProfilePage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <Card className="overflow-hidden">
          <div className="bg-muted h-24 md:h-32" />
          <div className="flex flex-col md:flex-row items-center md:items-end p-6 gap-6 -mt-16 md:-mt-20">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background">
              <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.aiHint} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
              <p className="text-muted-foreground mt-1 max-w-lg">{user.bio}</p>
            </div>
            <Button variant="outline"><Pencil className="mr-2" /> Edit Profile</Button>
          </div>
        </Card>

        {/* Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column (Achievements & Streak) */}
            <aside className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Flame /> Learning Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{user.streak} days</p>
                        <p className="text-sm text-muted-foreground mb-4">Keep it up to build your habit!</p>
                        <div className="flex justify-between gap-1">
                            {streakDays.map((d, i) => (
                                <div key={i} className="text-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${d.active ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        {d.active ? <CheckCircle className="w-5 h-5" /> : null}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{d.day}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Award /> Achievements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {user.achievements.map((ach, i) => (
                         <div key={i} className="flex items-center gap-4">
                             <div className="p-2 bg-amber-500/10 text-amber-600 rounded-full">
                                <ach.icon className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="font-semibold">{ach.title}</p>
                                <p className="text-sm text-muted-foreground">{ach.description}</p>
                             </div>
                         </div>
                       ))}
                    </CardContent>
                </Card>
            </aside>

            {/* Right Column (Learning & Activity) */}
            <div className="lg:col-span-2">
                 <Tabs defaultValue="learning">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="learning"><BookOpen className="mr-2" /> My Learning</TabsTrigger>
                        <TabsTrigger value="activity"><MessageSquare className="mr-2" /> Recent Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="learning" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Courses in Progress</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {user.coursesInProgress.length > 0 ? user.coursesInProgress.map(course => (
                                    <div key={course.id}>
                                         <Link href={`/school/courses/${course.id}`} className="font-semibold hover:underline">{course.title}</Link>
                                         <Progress value={course.progress} className="mt-2" />
                                         <p className="text-xs text-muted-foreground mt-1">{course.progress}% complete</p>
                                    </div>
                                )) : (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">You haven't started any courses yet.</p>
                                        <Button asChild variant="secondary" className="mt-4">
                                            <Link href="/school/courses">Explore Courses</Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="activity" className="mt-6">
                         <Card>
                            <CardHeader>
                                <CardTitle>My Contributions</CardTitle>
                            </CardHeader>
                             <CardContent className="space-y-4">
                                {user.recentActivity.map((activity, i) => (
                                    <Link key={i} href={activity.href}>
                                        <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                            <p className="text-sm text-muted-foreground">
                                                <span className="capitalize">{activity.type}</span> on <span className="font-semibold text-foreground">{activity.on}</span>
                                            </p>
                                            <p className="mt-1">"{activity.content}"</p>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                         </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
      </div>
    </main>
  );
}
