
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
        redirect('/');
    }

    const profileResult = await getMemberProfile(aetherId);

    if (!profileResult.success || !profileResult.data) {
        // Clear cookies and redirect if profile not found
        const allCookies = cookieStore.getAll();
        allCookies.forEach(cookie => {
            cookies().delete(cookie.name);
        });
        redirect('/');
    }
    
    const { fullName, entryNumber, role, location, mainInterest, email } = profileResult.data;
    const interests = profileResult.data.interests || [];

    const handleLogout = async () => {
        'use server';
        const allCookies = cookies().getAll();
        allCookies.forEach(cookie => {
            cookies().delete(cookie.name);
        });
        redirect('/');
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-6">
                 <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                    <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${aetherId}`} alt={fullName} />
                    <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <h1 className="text-3xl lg:text-4xl font-bold font-headline">{fullName}</h1>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <span>Aether ID:</span>
                        <CopyToClipboardButton textToCopy={aetherId} />
                    </div>
                </div>
                 <Button asChild variant="outline">
                    <Link href="/profile/edit"><Pencil className="mr-2" /> Edit Profile</Link>
                </Button>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-start gap-3"><User className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" /><span>{fullName}</span></div>
                        <div className="flex items-start gap-3"><Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" /><span>{role || 'Not specified'}</span></div>
                        <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" /><span>{location}</span></div>
                        <div className="flex items-start gap-3"><span className="font-mono text-xs text-muted-foreground mt-1">EMAIL</span><span>{email} (used for login)</span></div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Interests & Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {interests.length > 0 ? (
                             <div className="flex flex-wrap gap-2">
                                {interests.map(interest => (
                                    <Badge key={interest} variant="secondary">{interest}</Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No interests specified yet. Edit your profile to add them.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            {/* Activity Overview */}
             <div>
                <h2 className="text-2xl font-bold font-headline mb-4">Activity Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-muted/50"><CardHeader><CardTitle>Archive</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Viewed resources coming soon.</p></CardContent></Card>
                    <Card className="bg-muted/50"><CardHeader><CardTitle>School Sessions</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Registered sessions coming soon.</p></CardContent></Card>
                    <Card className="bg-muted/50"><CardHeader><CardTitle>Events</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Event history coming soon.</p></CardContent></Card>
                </div>
            </div>

            {/* Community & Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Community</CardTitle>
                        <CardDescription>Connect with the ecosystem.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-2">
                        <CommunityAccessHub aetherId={aetherId} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Manage your session.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">You log in via Magic Link. No password is required.</p>
                         <form action={handleLogout}>
                            <Button variant="outline" type="submit" className="w-full"><LogOut className="mr-2"/> Logout</Button>
                        </form>
                    </CardContent>
                </Card>
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
