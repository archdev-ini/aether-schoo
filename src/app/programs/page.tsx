import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, GraduationCap, Lightbulb } from "lucide-react";
import Link from "next/link";


export default function ProgramsPage() {
    return (
      <main className="container py-12 md:py-24 animate-in fade-in duration-500">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <GraduationCap className="w-10 h-10 text-primary" />
                        <CardTitle className="text-3xl">Aether School</CardTitle>
                    </div>
                    <CardDescription>Learn on Your Terms</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <p>Access open, beginner-friendly courses in architecture, design, and tools like Revit. Learn at your pace, track your progress, and unlock badges and certificates.</p>
                    <p className="font-semibold">What You’ll Get:</p>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" /> Free access to curated beginner courses</li>
                        <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" /> Progress tracking</li>
                        <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" /> Limited live sessions and replays</li>
                        <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" /> Bookmark content</li>
                        <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" /> Badges + optional certificate</li>
                    </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-4">
                    <Button asChild className="w-full">
                        <Link href="/join">Start Learning</Link>
                    </Button>
                </div>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                     <div className="flex items-center gap-4">
                        <Lightbulb className="w-10 h-10 text-primary" />
                        <CardTitle className="text-3xl">Horizon Studio</CardTitle>
                    </div>
                    <CardDescription>A 6-week immersive studio for African designers ready to level up.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <p className="font-semibold">What’s Inside:</p>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" /> Cohort-based experience</li>
                        <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" /> Live mentorship from practicing architects</li>
                        <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" /> Studio critiques + reviews</li>
                        <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" /> A final portfolio-worthy project</li>
                        <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" /> Certificate + ecosystem showcase access</li>
                    </ul>
                     <div className="mt-4 pt-4 border-t">
                        <p className="text-center font-semibold">Applications for the next cohort open soon.</p>
                    </div>
                </CardContent>
                <div className="p-6 pt-0 mt-4">
                    <Button asChild className="w-full">
                         <Link href="/join">Apply to Join</Link>
                    </Button>
                </div>
            </Card>
        </div>
      </main>
    )
}
