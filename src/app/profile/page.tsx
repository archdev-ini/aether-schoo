
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Award, Flame, MessageSquare, Pencil, CheckCircle, MapPin, Briefcase, Heart, LogOut, BookOpen, Package, Calendar, Clock, ArrowRight, Target, Layers } from "lucide-react";
import { getMemberProfile, type MemberProfile, logout } from './actions';
import { getEvents, type Event as EventType } from '@/app/events/actions';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Inline SVG for Discord Icon
const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.39 0 2.72-.28 3.96-.81.28.66.73 1.25 1.3 1.72.63.53 1.38.92 2.24 1.1.28.06.56.09.84.09.68 0 1.33-.21 1.88-.61.66-.48 1.15-1.16 1.4-1.95.29-.9.4-1.85.4-2.83 0-5.52-4.48-10-10-10zm-3.5 12.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
);
// Inline SVG for Telegram Icon
const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 2l-7 20-4-9-9-4Z"/><path d="M22 2L11 13"/></svg>
);
// Inline SVG for WhatsApp Icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.44 11.23c0 5.6-4.59 10.17-10.23 10.17-1.78 0-3.48-.46-4.96-1.29l-5.25 1.62 1.66-5.1c-.93-1.55-1.48-3.35-1.48-5.23C1.18 5.63 5.77 1.06 11.41 1.06c2.78 0 5.3.99 7.25 2.78 1.94 1.8 3.03 4.3 3.03 7.39z"/></svg>
);


async function ProfilePageContent({ profile, upcomingEvents }: { profile: MemberProfile; upcomingEvents: EventType[] }) {
  const { fullName, aetherId, email, role, location, mainInterest, reasonToJoin } = profile;
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
        <Card className="overflow-hidden">
          <div className="bg-muted h-24 md:h-32" />
          <div className="flex flex-col md:flex-row items-center md:items-end p-6 gap-6 -mt-16 md:-mt-20">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background">
              <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${aetherId}`} alt={fullName} />
              <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold font-headline">{fullName}</h1>
              <p className="text-muted-foreground mt-1 max-w-lg">
                Member #{profile.entryNumber}. {role} from {location}.
              </p>
            </div>
             <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/profile/edit">
                    <Pencil className="mr-2" /> Edit Profile
                  </Link>
                </Button>
                <form action={handleLogout}>
                    <Button variant="ghost" size="icon" type="submit"><LogOut /></Button>
                </form>
             </div>
          </div>
        </Card>

        {/* Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column (Details) */}
            <aside className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Member Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            <span>{role}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Heart className="w-4 h-4 text-muted-foreground" />
                            <span>Interested in {mainInterest}</span>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Community Hub</CardTitle>
                        <CardDescription>Join the conversation on your favorite platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-2">
                        <Button asChild>
                            <Link href="https://discord.gg/D8g8dSf7GE" target="_blank">
                                <DiscordIcon className="mr-2" />
                                Join Discord
                            </Link>
                        </Button>
                         <Button asChild className="bg-[#2AABEE] hover:bg-[#2AABEE]/90">
                            <Link href="#" target="_blank">
                                <TelegramIcon className="mr-2" />
                                Join Telegram
                            </Link>
                        </Button>
                         <Button asChild className="bg-[#25D366] hover:bg-[#25D366]/90">
                            <Link href="#" target="_blank">
                                <WhatsAppIcon className="mr-2" />
                                Join WhatsApp
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Knowledge & Tools</CardTitle>
                        <CardDescription>Access our starter kit for essential guides and resources.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full" variant="outline">
                            <Link href="#" target="_blank">
                                <Package className="mr-2" />
                                Open Starter Kit
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </aside>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome, {firstName}!</CardTitle>
                        <CardDescription>A little about what you hope to achieve with Aether.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {reasonToJoin ? (
                             <blockquote className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground">
                                "{reasonToJoin}"
                            </blockquote>
                        ) : (
                            <p className="text-muted-foreground italic">You didn't specify a reason for joining, but we're excited to have you! You can add this by editing your profile.</p>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Progress Tracker (Lite)</CardTitle>
                        <CardDescription>Complete primers and join challenges to build your skills.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center p-3 rounded-lg bg-muted/50">
                            <Target className="w-6 h-6 mr-4 text-primary" />
                            <div>
                                <p className="font-semibold">Primers Completed</p>
                                <p className="text-lg font-bold">0/3</p>
                            </div>
                        </div>
                         <div className="flex items-center p-3 rounded-lg bg-muted/50">
                            <Layers className="w-6 h-6 mr-4 text-primary" />
                            <div>
                                <p className="font-semibold">Challenges Joined</p>
                                <p className="text-lg font-bold">0</p>
                            </div>
                        </div>

                        <Button asChild className="w-full">
                            <Link href="/school/courses?difficulty=Beginner&format=Primer">
                                <BookOpen className="mr-2" /> Start Your First Primer
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription>Join our live sessions and community calls.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.map(event => (
                                <div key={event.id} className="flex items-center justify-between gap-4 p-3 -m-3 rounded-lg hover:bg-muted/50">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-muted p-3 rounded-lg">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{event.title}</p>
                                            <p className="text-sm text-muted-foreground">{formatEventDate(event.date)}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">{event.type}</Badge>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No upcoming events right now. Check back soon!</p>
                        )}
                         <Button asChild className="w-full" variant="outline">
                            <Link href="/events">
                                View All Events <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
  )
}


export default async function ProfilePage() {
    const cookieStore = cookies();
    const aetherId = cookieStore.get('aether_user_id')?.value;

    if (!aetherId) {
        redirect('/login');
    }

    // Fetch profile and events in parallel
    const [profileResult, allEvents] = await Promise.all([
        getMemberProfile(aetherId),
        getEvents()
    ]);
    
    const upcomingEvents = allEvents.filter(e => e.status === 'Upcoming').slice(0, 3);

    if (!profileResult.success || !profileResult.data) {
        // Clear potentially invalid cookies and redirect
        cookies().delete('aether_user_id');
        cookies().delete('aether_user_name');
        redirect('/login?error=not_found');
    }
    
    return (
        <main className="container py-12 md:py-24 animate-in fade-in duration-500">
            <ProfilePageContent profile={profileResult.data} upcomingEvents={upcomingEvents} />
        </main>
    );
}
