
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Users, Bell, Camera, Twitter, Book, ShieldCheck } from "lucide-react";
import Link from "next/link";

const communityPlatforms = [
  { name: "Discord", icon: MessageCircle, description: "For live chats, Q&As, and project collaboration.", href: "/join" },
  { name: "WhatsApp", icon: Users, description: "For daily updates and regional group discussions.", href: "/join" },
  { name: "Telegram", icon: Bell, description: "For announcements and key information.", href: "https://t.me/aethercommunity1" },
  { name: "Instagram", icon: Camera, description: "For visual inspiration and community highlights.", href: "#" },
  { name: "X (Twitter)", icon: Twitter, description: "For industry news and real-time conversations.", href: "#" },
  { name: "Facebook", icon: Book, description: "For long-form content and community stories.", href: "#" },
]

export default function CommunityPage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">More than a Platform — A Movement.</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Aether is powered by a vibrant community of architects, designers, and educators building new futures together.
        </p>
      </div>

       <Card className="mb-12 bg-primary/5 text-center">
            <CardHeader>
                <div className="flex justify-center mb-2">
                    <ShieldCheck className="w-12 h-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Verify Your Aether ID</CardTitle>
                 <CardContent>
                    <p className="text-muted-foreground max-w-xl mx-auto mt-2">
                        Already have an Aether ID? Confirm your membership to get access to private community channels and resources.
                    </p>
                    <Button asChild className="mt-4" size="lg">
                        <Link href="/confirm-id">Confirm My ID</Link>
                    </Button>
                </CardContent>
            </CardHeader>
        </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {communityPlatforms.map((platform) => (
            <Card key={platform.name} className="flex flex-col text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <platform.icon className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle>{platform.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{platform.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button asChild className="w-full">
                        <Link href={platform.href} target={platform.href.startsWith('http') ? '_blank' : '_self'}>
                            {platform.href === "/join" ? "Get ID to Join" : `Follow on ${platform.name}`}
                        </Link>
                    </Button>
                </div>
            </Card>
        ))}
      </div>
       <div className="text-center mt-16">
            <h2 className="text-2xl font-bold font-headline">Ready to join?</h2>
            <p className="text-muted-foreground mt-2 mb-4">Get your Aether ID to unlock our community spaces.</p>
            <Button size="lg" asChild>
                <Link href="/join">Join the Community</Link>
            </Button>
        </div>
    </main>
  );
}
