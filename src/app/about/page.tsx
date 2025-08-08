
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Heart, GitBranch, Globe, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const missionPoints = [
    { text: "Honor local culture and history." },
    { text: "Work with, not against, the climate." },
    { text: "Stand the test of time — structurally, socially, and economically." },
];

const approachPoints = [
    { title: "Africa-first Curriculum", description: "Courses on vernacular design, sustainable materials, urban resilience." },
    { title: "Global Connectivity", description: "Access to mentors, projects, and ideas from around the world." },
    { title: "Proof-of-Skill Credentials", description: "Verifiable digital badges that prove what you can do, not just what you’ve studied." },
    { title: "Learn-to-Earn Projects", description: "Opportunities to design, build, and get rewarded." },
];

const values = [
    { icon: Globe, title: "Context Matters", description: "Good design starts with understanding people and place." },
    { icon: Users, title: "Collaboration Over Competition", description: "We rise together as a community." },
    { icon: GitBranch, title: "Heritage as Innovation", description: "Africa’s past inspires our future." },
    { icon: Heart, title: "Sustainability First", description: "Design with the climate, not against it." },
    { icon: Star, title: "Access for All", description: "Talent shouldn’t be limited by geography or privilege." },
];


export default function AboutPage() {
  return (
    <div className="animate-in fade-in duration-500">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 bg-muted">
            <div className="container px-4 md:px-6 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                    Shaping Africa’s Future, One Space at a Time.
                </h1>
                <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl">
                    Aether is a pan-African architecture learning community, empowering architects and students to design spaces that are culturally rooted, climate-responsive, and globally competitive.
                </p>
            </div>
        </section>

        {/* Our Story Section */}
        <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">We started Aether with a simple belief: Africa’s architecture should reflect Africa’s soul.</h2>
                    <div className="space-y-4 text-muted-foreground text-lg">
                        <p>For decades, the continent’s architectural education has been shaped by imported templates that don’t always work in our climates, cultures, or communities. We saw a gap — between what’s taught in school and what’s needed to build resilient, relevant cities.</p>
                        <p className="font-semibold text-foreground">So we built Aether:</p>
                         <ul className="space-y-3">
                            <li className="flex items-start"><CheckCircle className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" /><span>A place to learn contemporary architectural practice without losing our heritage.</span></li>
                            <li className="flex items-start"><CheckCircle className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" /><span>A place where students, graduates, and practitioners can collaborate beyond borders.</span></li>
                            <li className="flex items-start"><CheckCircle className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" /><span>A place where proof-of-skill matters as much as a degree.</span></li>
                        </ul>
                    </div>
                </div>
                 <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&h=700&auto=format&fit=crop"
                    width={600}
                    height={700}
                    alt="Team collaborating"
                    data-ai-hint="team collaboration"
                    className="rounded-lg object-cover shadow-2xl"
                />
            </div>
        </section>
        
        {/* Our Mission Section */}
        <section className="w-full py-16 md:py-24 bg-muted">
            <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                <Image
                    src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600&h=600&auto=format&fit=crop"
                    width={600}
                    height={600}
                    alt="Blueprint of a building"
                    data-ai-hint="architecture blueprint"
                    className="rounded-lg object-cover shadow-2xl"
                />
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Our Mission</h2>
                    <p className="text-lg text-muted-foreground">To equip Africa’s next generation of architects to create spaces that:</p>
                    <ul className="space-y-4">
                        {missionPoints.map((point, index) => (
                        <li key={index} className="flex items-start text-lg">
                            <CheckCircle className="w-6 h-6 mr-3 text-primary flex-shrink-0 mt-1" />
                            <span className="flex-1">{point.text}</span>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>

        {/* Our Approach Section */}
        <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6">
                 <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Our Approach</h2>
                    <p className="mt-4 text-lg text-muted-foreground">We blend:</p>
                 </div>
                 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {approachPoints.map((point) => (
                        <div key={point.title} className="bg-muted/50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold font-headline">{point.title}</h3>
                            <p className="mt-2 text-muted-foreground">{point.description}</p>
                        </div>
                    ))}
                 </div>
            </div>
        </section>

        {/* The Aether Experience */}
        <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground">
            <div className="container px-4 md:px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight font-headline">In Aether, you’re not just a member — you’re part of a studio without walls.</h2>
                 <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Learn from peers and professionals.</h3>
                    </div>
                     <div className="space-y-2">
                        <h3 className="text-xl font-bold">Take on real design challenges.</h3>
                    </div>
                     <div className="space-y-2">
                        <h3 className="text-xl font-bold">Build your portfolio with projects that matter.</h3>
                    </div>
                     <div className="space-y-2">
                        <h3 className="text-xl font-bold">Connect to the future of African architecture.</h3>
                    </div>
                 </div>
            </div>
        </section>

        {/* Our Values Section */}
        <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Our Values</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {values.map((value) => (
                    <div key={value.title} className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-primary/10 text-primary p-4 rounded-full">
                                <value.icon className="w-8 h-8"/>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold font-headline">{value.title}</h3>
                        <p className="mt-2 text-muted-foreground">{value.description}</p>
                    </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-16 md:py-24 bg-muted">
            <div className="container text-center bg-background rounded-lg p-10 md:p-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Architecture is the blueprint of a better future. Let’s design it together.</h2>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/join">
                           Join the Founding 500
                        </Link>
                    </Button>
                </div>
                 <p className="mt-4 text-sm text-muted-foreground">The road ahead: Prelaunch on Oct 6, 2025. Full rollout on Dec 8, 2025.</p>
            </div>
        </section>
    </div>
  );
}
