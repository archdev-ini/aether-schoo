
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Award, Flame, MessageSquare, Pencil, CheckCircle, MapPin, Briefcase, Heart, LogOut } from "lucide-react";
import { getMemberProfile, type MemberProfile, logout } from './actions';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <Card className="overflow-hidden">
          <Skeleton className="h-24 md:h-32 w-full" />
          <div className="flex flex-col md:flex-row items-center md:items-end p-6 gap-6 -mt-16 md:-mt-20">
            <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background" />
            <div className="flex-grow text-center md:text-left space-y-2">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-5 w-64" />
            </div>
             <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-10" />
             </div>
          </div>
        </Card>
        <div className="grid lg:grid-cols-3 gap-8">
            <aside className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader><Skeleton className="h-7 w-32" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-48" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                      <Skeleton className="h-7 w-24" />
                      <Skeleton className="h-4 w-48 mt-1" />
                    </CardHeader>
                    <CardContent>
                       <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </aside>
            <div className="lg:col-span-2">
                <Card className="h-full">
                    <CardHeader>
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-5 w-full mt-1" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
  )
}

function ProfilePageContent({ profile }: { profile: MemberProfile }) {
  const { fullName, aetherId, email, role, location, mainInterest, reasonToJoin } = profile;
  const firstName = fullName.split(' ')[0];
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    window.dispatchEvent(new CustomEvent('auth-change'));
    router.push('/login');
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
                        <CardTitle>Aether ID</CardTitle>
                        <CardDescription>Your unique identifier in the ecosystem.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="p-3 bg-muted rounded-md text-center">
                            <p className="font-mono font-bold text-lg tracking-wider text-primary">{aetherId}</p>
                       </div>
                    </CardContent>
                </Card>
            </aside>

            {/* Right Column (Reason for joining) */}
            <div className="lg:col-span-2">
                <Card className="h-full">
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
                            <p className="text-muted-foreground italic">You didn't specify a reason for joining, but we're excited to have you!</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
  )
}


export default function ProfilePage() {
    const [profile, setProfile] = useState<MemberProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const aetherId = localStorage.getItem('aether_user_id');
        if (!aetherId) {
            router.push('/login');
            return;
        }

        async function fetchProfile() {
            setIsLoading(true);
            const result = await getMemberProfile(aetherId);
            if (result.success && result.data) {
                setProfile(result.data);
            } else {
                // Handle error, e.g., user not found or stale ID
                localStorage.removeItem('aether_user_id');
                localStorage.removeItem('aether_user_name');
                window.dispatchEvent(new CustomEvent('auth-change'));
                router.push('/login?error=not_found');
            }
            setIsLoading(false);
        }

        fetchProfile();
    }, [router]);
    
    return (
        <main className="container py-12 md:py-24 animate-in fade-in duration-500">
            {isLoading ? <ProfileSkeleton /> : profile ? <ProfilePageContent profile={profile} /> : null}
        </main>
    );
}

