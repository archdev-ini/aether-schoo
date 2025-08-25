
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Pencil, MapPin, Briefcase, Heart, LogOut } from "lucide-react";
import { getMemberProfile, type MemberProfile, logout, getMemberLearningProgress } from './actions';
import Link from 'next/link';
import { CommunityAccessHub } from '@/components/common/CommunityAccessHub';
import { LearningProgress } from '@/components/common/LearningProgress';

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
                        <CardTitle>Member Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
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
                    </CardContent>
                </Card>

                 <CommunityAccessHub aetherId={aetherId} />

            </aside>

            {/* Right Column (Mission & Onboarding) */}
            <div className="lg:col-span-2 space-y-8">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Your Mission</CardTitle>
                        <CardDescription>A little about what you hope to achieve with Aether.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {reasonToJoin ? (
                             <blockquote className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground">
                                "{reasonToJoin}"
                            </blockquote>
                        ) : (
                            <p className="text-muted-foreground italic">You haven't set your mission yet. You can add this by editing your profile!</p>
                        )}
                    </CardContent>
                </Card>

                <LearningProgress learningData={learningData} />
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

  const profileResult = await getMemberProfile(aetherId);

  if (!profileResult.success || !profileResult.data) {
    // This case handles if the cookie is stale or the user was deleted from Airtable
    // We clear the cookie and redirect to login
    cookies().delete('aether_user_id');
    cookies().delete('aether_user_name');
    cookies().delete('aether_user_role');
    redirect('/login?error=not_found');
  }

  const learningData = await getMemberLearningProgress(profileResult.data.aetherId);

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <ProfilePageContent profile={profileResult.data} learningData={learningData} />
    </main>
  );
}
