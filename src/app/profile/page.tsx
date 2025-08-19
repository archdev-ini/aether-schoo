
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Award, Flame, MessageSquare, Pencil, CheckCircle, MapPin, Briefcase, Heart, LogOut } from "lucide-react";
import { getMemberProfile, type MemberProfile, logout } from './actions';
import Link from 'next/link';

async function ProfilePageContent({ profile }: { profile: MemberProfile }) {
  const { fullName, aetherId, email, role, location, mainInterest, reasonToJoin } = profile;
  const firstName = fullName.split(' ')[0];

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
                <form action={logout}>
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

export default async function ProfilePage() {
  const cookieStore = cookies();
  const aetherId = cookieStore.get('aether_user_id')?.value;

  if (!aetherId) {
    redirect('/login');
  }

  const result = await getMemberProfile(aetherId);

  if (!result.success || !result.data) {
    // This case handles if the cookie is stale or the user was deleted from Airtable
    // We clear the cookie and redirect to login
    cookies().delete('aether_user_id');
    cookies().delete('aether_user_name');
    redirect('/login?error=not_found');
  }

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <ProfilePageContent profile={result.data} />
    </main>
  );
}
