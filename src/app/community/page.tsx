
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, Bell, ShieldCheck, CheckCircle, Lightbulb, Heart, PencilRuler, Award } from "lucide-react";
import Link from "next/link";

const communityPlatforms = [
  { 
    name: "Discord", 
    icon: MessageCircle, 
    description: "The heart of our community. Join channels for design critiques, project showcases, Q&As, and live events.",
    cta: "Join the Design Critique Channel",
    href: "/confirm-id" 
  },
  { 
    name: "Telegram", 
    icon: Bell, 
    description: "Stay in the loop. Get real-time announcements, industry news, and key Aether updates.",
    cta: "Get Important Announcements",
    href: "/confirm-id" 
  },
  { 
    name: "WhatsApp", 
    icon: Users, 
    description: "Connect with your local chapter. Join regional groups for meetups and localized discussions.",
    cta: "Find Your Local Group",
    href: "/confirm-id" 
  },
];

const communityValues = [
    { icon: Lightbulb, text: "Share generously. Your knowledge and feedback are invaluable." },
    { icon: Heart, text: "Respect all perspectives. Our diversity is our strength." },
    { icon: CheckCircle, text: "Build constructively. We are here to elevate each other." },
]

const topContributors = [
    { name: "Amina E.", points: 1250, avatar: "https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=100&h=100&auto=format&fit=crop", aiHint: "professional woman" },
    { name: "David T.", points: 1100, avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100&h=100&auto=format&fit=crop", aiHint: "professional man" },
    { name: "Sarah K.", points: 950, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop", aiHint: "professional woman portrait" },
]

export default function CommunityPage() {
  return (
    <main className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-muted">
        <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                More than a Network — A Studio Without Walls.
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl">
                The Aether community is where Africa’s most ambitious architects and designers connect to learn, collaborate, and build the future. Here, your ideas are challenged, your skills are sharpened, and your network becomes global.
            </p>
             <div className="mt-8">
                <Button asChild size="lg">
                    <Link href="/join">
                       Join 500+ Architects Shaping the Future
                    </Link>
                </Button>
            </div>
        </div>
      </section>

      {/* How to Connect Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Find Your Space</h2>
                <p className="mt-4 text-muted-foreground md:text-lg">
                    Our community lives across multiple platforms, each designed for a specific purpose. Get your Aether ID to unlock them all.
                </p>
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {communityPlatforms.map((platform) => (
                    <Card key={platform.name} className="flex flex-col text-center border-t-4 border-primary/20 hover:border-primary transition-all duration-300">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 text-primary p-4 rounded-full">
                                    <platform.icon className="w-8 h-8"/>
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-headline">{platform.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">{platform.description}</p>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button asChild className="w-full" variant="outline">
                                <Link href={platform.href}>
                                    {platform.cta}
                                </Link>
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
      </section>
      
      {/* Top Contributors Leaderboard Section */}
        <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Top Contributors</h2>
                    <p className="mt-4 text-muted-foreground md:text-lg">
                        Our community is built by its members. Earn points by contributing notes, helping peers, and suggesting content.
                    </p>
                </div>
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardContent className="p-4 space-y-4">
                           {topContributors.map((user, index) => (
                               <div key={user.name} className="flex items-center gap-4 p-2 rounded-md transition-colors hover:bg-muted/50">
                                   <span className="font-bold text-lg text-muted-foreground w-6 text-center">{index + 1}</span>
                                   <Avatar>
                                       <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.aiHint} />
                                       <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                   </Avatar>
                                   <div className="flex-grow">
                                       <p className="font-semibold">{user.name}</p>
                                   </div>
                                   <div className="text-right">
                                       <p className="font-bold text-primary">{user.points} pts</p>
                                       {index === 0 && <Badge variant="secondary" className="mt-1 bg-amber-500/10 text-amber-600 border-amber-500/20">Top Contributor</Badge>}
                                   </div>
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>


       {/* Community Guidelines Section */}
        <section className="w-full py-16 md:py-24 bg-muted">
            <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Our Community Ethos</h2>
                    <p className="text-lg text-muted-foreground">We are a community built on respect, collaboration, and a shared passion for design excellence. To maintain a safe and inspiring environment for all, we live by these values:</p>
                    <ul className="space-y-4">
                        {communityValues.map((point, index) => (
                        <li key={index} className="flex items-start text-lg">
                            <div className="bg-primary/10 text-primary p-2 rounded-full mr-4 mt-1">
                               <point.icon className="w-5 h-5 flex-shrink-0" />
                            </div>
                            <span className="flex-1">{point.text}</span>
                        </li>
                        ))}
                    </ul>
                     <div className="pt-4">
                        <Button asChild>
                            <Link href="/confirm-id">
                                <PencilRuler className="mr-2"/>
                                Suggest Content for the Library
                            </Link>
                        </Button>
                    </div>
                </div>
                 <Card className="p-8 bg-background shadow-lg">
                    <CardHeader className="p-0">
                         <div className="flex justify-center mb-4">
                            <ShieldCheck className="w-12 h-12 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl text-center">Verify Your Aether ID</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pt-4 text-center">
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Access to our private channels requires a verified Aether ID. This ensures our community remains a trusted space for professionals and students.
                        </p>
                        <Button asChild className="mt-6" size="lg" id="confirm-id-community">
                            <Link href="/confirm-id">Confirm My ID</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-16 md:py-24">
            <div className="container text-center bg-primary/5 rounded-lg p-10 md:p-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Ready to start your first collaboration?</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
                   Your Aether ID is your key to our global studio. Get yours and introduce yourself today.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/join">
                           Get Your Aether ID
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    </main>
  );
}
