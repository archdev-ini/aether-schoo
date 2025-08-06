import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Lightbulb } from "lucide-react";
import Link from "next/link";


export default function ProgramsPage() {
    return (
      <main className="container py-12 md:py-24 animate-in fade-in duration-500">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Our Programs</h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
                We offer two distinct programs designed to foster innovation and growth.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <GraduationCap className="w-10 h-10 text-primary" />
                        <CardTitle className="text-3xl">Aether School</CardTitle>
                    </div>
                    <CardDescription>Foundational learning for the next wave of innovators.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <p>Aether School provides a comprehensive curriculum focused on emerging technologies, critical thinking, and collaborative project-building. Students engage with expert mentors and a vibrant community to turn theoretical knowledge into practical skills.</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>12-week immersive cohorts</li>
                        <li>Focus on AI, blockchain, and biotech</li>
                        <li>Capstone project showcase</li>
                    </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-4">
                    <Button asChild className="w-full">
                        <Link href="/join">Apply to Aether School</Link>
                    </Button>
                </div>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                     <div className="flex items-center gap-4">
                        <Lightbulb className="w-10 h-10 text-primary" />
                        <CardTitle className="text-3xl">Horizon Studio</CardTitle>
                    </div>
                    <CardDescription>An incubator for groundbreaking ideas.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <p>Horizon Studio is an accelerator for early-stage projects with high-impact potential. We provide funding, strategic guidance, and access to the Aether network to help teams navigate the journey from concept to market-ready venture.</p>
                     <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Seed funding and resources</li>
                        <li>Mentorship from industry leaders</li>
                        <li>Access to an exclusive network</li>
                    </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-4">
                    <Button asChild className="w-full">
                         <Link href="/join">Join the Studio</Link>
                    </Button>
                </div>
            </Card>
        </div>
      </main>
    )
}
