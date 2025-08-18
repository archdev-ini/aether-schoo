
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Construction } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
            <User className="w-12 h-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Your Profile</h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
                This is where your learning journey, contributions, and achievements will live.
            </p>
        </div>
        <Card className="text-center">
            <CardHeader>
                <Construction className="w-16 h-16 mx-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <CardTitle className="text-2xl font-bold mt-4">Feature Under Construction</CardTitle>
                <CardDescription className="mt-2">
                    The full profile page is coming soon! It will include your course progress, community badges, and more.
                </CardDescription>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
