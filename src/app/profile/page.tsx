
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Pencil, MapPin, Briefcase, Heart, LogOut, Download, Bot, Star, HardHat, Bell, Calendar, GraduationCap } from "lucide-react";
import { getMemberProfile, type MemberProfile, logout, getMemberLearningProgress } from './actions';
import Link from 'next/link';
import { CommunityAccessHub } from '@/components/common/CommunityAccessHub';
import { LearningProgress } from '@/components/common/LearningProgress';
import { Badge } from '@/components/ui/badge';

const starterKitItems = [
    { icon: Star, title: "Aether Onboarding PDF", description: "Your guide to the ecosystem.", href: "#" },
    { icon: Bot, title: "Access the AI toolkit", description: "Experiment with our AI design tools.", href: "#" },
    { icon: HardHat, title: "Figma Design System", description: "Templates for studio projects.", href: "#" },
]

const updatesFeedItems = [
    { icon: GraduationCap, title: "New Primer Dropped", description: "'Sustainable Materials in West Africa' is now available.", timestamp: "2h ago", href: "/school/courses/2" },
    { icon: Calendar, title: "Event Reminder", description: "Workshop: 'Intro to Parametric Design' starts tomorrow.", timestamp: "1d ago", href: "/events" },
    { icon: Star, title: "Community Highlight", description: "Amina E.'s project was featured in the weekly roundup.", timestamp: "3d ago", href: "/community" },
]

function StarterKit() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Knowledge &amp; Tools Starter Kit</CardTitle>
                <CardDescription>Essential resources to kickstart your journey in the ecosystem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {starterKitItems.map((item) => (
                    <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <item.icon className="w-6 h-6 text-primary flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                            <Download className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </a>
                ))}
            </CardContent>
        </Card>
    )
}


function UpdatesFeed() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell /> Notifications & Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 {updatesFeedItems.map((item, index) => (
                    <Link key={index} href={item.href} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="bg-background rounded-full p-2 border">
                           <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <time className="text-xs text-muted-foreground whitespace-nowrap">{item.timestamp}</time>
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}


async function ProfilePageContent({ profile, learningData }: { profile: MemberProfile, learningData: any }) {
  const { fullName, aetherId, email, role, location, mainInterest, reasonToJoin, entryNumber } = profile;
  const firstName = fullName.split(' ')[0];

  const handleLogout = async () => {
    'use server';
    await logout();
    redirect('/login');
  }
  
  function formatEventDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'Africa/Lagos' });
  }

  return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <Card className="overflow-hidden border-primary/20">
            <div className="p-6 md:p-8 bg-muted/50 grid md:grid-cols-[auto_1fr_auto] items-center gap-6">
                 <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-background shadow-md">
                    <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${aetherId}`} alt={fullName} />
                    <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl lg:text-4xl font-bold font-headline">Welcome, {firstName} 👋</h1>
                    <p className="text-muted-foreground mt-1">You’re part of the first wave shaping Aether. Let's build.</p>
                </div>
                 <div className="hidden md:flex flex-col items-end gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/profile/edit">
                            <Pencil className="mr-2" /> Edit Profile
                        </Link>
                    </Button>
                    <form action={logout}>
                        <Button variant="ghost" size="sm" type="submit"><LogOut className="mr-2"/> Logout</Button>
                    </form>
                </div>
            </div>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-background">
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-sm font-semibold text-muted-foreground">AETHER ID</p>
                    <p className="font-mono font-bold text-lg tracking-wider text-primary">{aetherId}</p>
                </div>
                 <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-sm font-semibold text-muted-foreground">STATUS</p>
                    <p className="font-mono font-bold text-lg tracking-wider text-primary">FOUNDING MEMBER #{entryNumber}</p>
                </div>
            </CardContent>
             <div className="p-6 border-t md:hidden">
                 <div className="flex justify-center gap-2">
                    <Button variant="outline" asChild className="flex-1">
                        <Link href="/profile/edit">
                            <Pencil className="mr-2" /> Edit Profile
                        </Link>
                    </Button>
                    <form action={logout} className="flex-1">
                        <Button variant="ghost" type="submit" className="w-full"><LogOut className="mr-2"/> Logout</Button>
                    </form>
                </div>
            </div>
        </Card>

        {/* Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column (Details & Community) */}
            <aside className="lg:col-span-1 space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Profile Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                            <span>{role}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                            <span>{location}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Heart className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                            <span>Interested in {mainInterest || 'exploring the ecosystem'}.</span>
                        </div>
                         {reasonToJoin && (
                             <blockquote className="border-l-2 border-primary/20 pl-3 italic text-muted-foreground text-xs pt-2">
                                "{reasonToJoin}"
                            </blockquote>
                        )}
                    </CardContent>
                </Card>

                <UpdatesFeed />
                <CommunityAccessHub aetherId={aetherId} />

            </aside>

            {/* Right Column (Learning & Onboarding) */}
            <div className="lg:col-span-2 space-y-8">
                <LearningProgress learningData={learningData} />
                <StarterKit />
            </div>
        </div>
      </div>
  )
}


export default async function ProfilePage() {
    const cookieStore = await cookies();
    const aetherId = cookieStore.get('aether_user_id')?.value;

    if (!aetherId) {
        redirect('/login');
    }

  const profileResult = await getMemberProfile(aetherId);

  if (!profileResult.success || !profileResult.data) {
    // This case handles if the cookie is stale or the user was deleted from Airtable
    // We clear the cookie and redirect to login
    (await
          // This case handles if the cookie is stale or the user was deleted from Airtable
          // We clear the cookie and redirect to login
          cookies()).delete('aether_user_id');
    (await cookies()).delete('aether_user_name');
    (await cookies()).delete('aether_user_role');
    redirect('/login?error=not_found');
  }

  const learningData = await getMemberLearningProgress(profileResult.data.aetherId);

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <ProfilePageContent profile={profileResult.data} learningData={learningData} />
    </main>
  );
}
