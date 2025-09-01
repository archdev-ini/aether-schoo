
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Pencil, MapPin, Briefcase, Heart, LogOut, Download, Bot, Star, HardHat, Bell, Calendar, GraduationCap, Archive, School, Users, Trophy, Copy } from "lucide-react";
import { getMemberProfile, type MemberProfile } from './actions';
import { getEvents } from '../events/actions';
import Link from 'next/link';
import { CommunityAccessHub } from '@/components/common/CommunityAccessHub';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from '@/components/common/CountdownTimer';
import { CopyToClipboardButton } from '@/components/common/CopyToClipboardButton';


async function ProfileDashboard() {
    const cookieStore = cookies();
    const aetherId = cookieStore.get('aether_user_id')?.value;

    if (!aetherId) {
        redirect('/login');
    }

    const profileResult = await getMemberProfile(aetherId);

    if (!profileResult.success || !profileResult.data) {
        (await cookies()).delete('aether_user_id');
        (await cookies()).delete('aether_user_name');
        (await cookies()).delete('aether_user_role');
        redirect('/login?error=not_found');
    }
    
    const { fullName, entryNumber } = profileResult.data;

    const allEvents = await getEvents();
    const nextEvent = allEvents.find(e => e.status === 'Upcoming');

    const handleLogout = async () => {
        'use server';
        (await cookies()).delete('aether_user_id');
        (await cookies()).delete('aether_user_name');
        (await cookies()).delete('aether_user_role');
        redirect('/login');
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center md:text-left md:flex md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold font-headline">Welcome back, {fullName.split(' ')[0]} ✨</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-muted-foreground">
                        <span>Your Aether ID:</span>
                        <CopyToClipboardButton textToCopy={aetherId} />
                    </div>
                </div>
                 <div className="hidden md:block">
                    <p className="font-mono font-bold text-lg tracking-wider text-primary">FOUNDING MEMBER #{entryNumber}</p>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Archive Card */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2"><Archive /> Archive</CardTitle>
                            <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/30">LIVE</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">Access the first 30 resources: books, case studies, and lectures. New drops every week.</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button asChild className="w-full" variant="outline"><Link href="/school/courses?format=Archive">Browse Archive</Link></Button>
                    </div>
                </Card>

                {/* School Card */}
                 <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2"><School /> Aether School</CardTitle>
                             <Badge variant="secondary">PREVIEW</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">Trial sessions are happening in Oct–Nov. Full launch starts Dec 8.</p>
                    </CardContent>
                    <div className="p-6 pt-0 grid grid-cols-2 gap-2">
                        <Button asChild className="w-full"><Link href="/events">View Calendar</Link></Button>
                        <Button asChild variant="secondary" className="w-full"><Link href="/join">Join Waitlist</Link></Button>
                    </div>
                </Card>

                {/* Events Card */}
                <Card className="flex flex-col">
                    <CardHeader>
                         <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2"><Calendar /> Upcoming Events</CardTitle>
                            <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/30">LIVE</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        {nextEvent ? (
                            <div>
                                <p className="text-muted-foreground">Next: <strong>{nextEvent.title}</strong></p>
                                <div className="mt-2 text-sm">
                                    <CountdownTimer targetDate={nextEvent.date} simple />
                                </div>
                            </div>
                        ) : (
                             <p className="text-muted-foreground">No upcoming events. Check back soon!</p>
                        )}
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button asChild className="w-full" variant="outline"><Link href="/events">See Full Schedule</Link></Button>
                    </div>
                </Card>

                {/* Competitions Card */}
                <Card className="flex flex-col bg-muted/50">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2 text-muted-foreground"><Trophy /> Competitions</CardTitle>
                             <Badge variant="outline">COMING SOON</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">The Aether Creative Challenge launches Dec 8. Theme reveal at the Prelaunch Finale.</p>
                    </CardContent>
                     <div className="p-6 pt-0">
                        <Button disabled className="w-full">Coming Soon</Button>
                    </div>
                </Card>

                {/* Community Card */}
                 <Card className="flex flex-col col-span-1 md:col-span-2">
                     <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2"><Users /> Community</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground mb-4">Connect with peers, share ideas, and grow with us.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                             <CommunityAccessHub aetherId={aetherId} />
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Footer Tools */}
            <div className="flex justify-center items-center gap-4 mt-8">
                 <Button asChild variant="outline">
                    <Link href="/profile/edit"><Pencil className="mr-2" /> Update Profile</Link>
                </Button>
                <form action={handleLogout}>
                    <Button variant="ghost" type="submit"><LogOut className="mr-2"/> Logout</Button>
                </form>
            </div>
        </div>
    )
}

export default async function ProfilePage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <ProfileDashboard />
    </main>
  );
}
