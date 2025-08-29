
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Lightbulb, GitBranch, Globe, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const challenges = [
    { text: "Africa’s urban growth is among the fastest in the world, yet architectural training often lags behind the realities of modern cities." },
    { text: "Many curricula rely heavily on imported models that overlook local heritage, climate, and materials." },
    { text: "Young architects frequently lack the networks, mentorship, and real-world projects needed to thrive in a competitive global industry." },
];

const solutions = [
    { text: "Teach through a contemporary, Africa-first curriculum that blends vernacular wisdom with modern design principles." },
    { text: "Connect members to peers, mentors, and collaborators across countries and continents." },
    { text: "Empower architects to work on real projects, earn verifiable proof-of-skill credentials, and access opportunities both locally and internationally." },
];

const differentiators = [
    { icon: Globe, title: "Global by Design", description: "An Africa-first design approach adaptable to any global context." },
    { icon: GitBranch, title: "Integrated Practice", description: "Integration of culture, climate, and technology in every project." },
    { icon: Star, title: "Learn-to-Earn Model", description: "Rewards members for applying their skills in real-world scenarios." },
    { icon: Users, title: "Proof-of-Skill", description: "Verifiable credentials to showcase expertise beyond traditional degrees." },
];


export default function AboutPage() {
  return (
    <div className="animate-in fade-in duration-500">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 bg-muted">
            <div className="container px-4 md:px-6 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                    Shaping the Architects Who Will Shape the Future
                </h1>
                <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl">
                    Aether is the first architecture learning community that starts in Africa and scales to the world. We are building a new path for architecture education — one that equips emerging architects to design spaces that are culturally grounded, climate-responsive, and globally competitive.
                </p>
            </div>
        </section>

        {/* The Challenge Section */}
        <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">The challenge is clear:</h2>
                    <ul className="space-y-4 text-muted-foreground text-lg">
                        {challenges.map((challenge, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircle className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                <span>{challenge.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <Image
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&h=700&auto=format&fit=crop"
                    width={600}
                    height={700}
                    alt="Architects reviewing blueprints"
                    data-ai-hint="architects planning"
                    className="rounded-lg object-cover shadow-2xl"
                />
            </div>
        </section>
        
        {/* Our Solution Section */}
        <section className="w-full py-16 md:py-24 bg-muted">
            <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                <Image
                    src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600&h=600&auto=format&fit=crop"
                    width={600}
                    height={600}
                    alt="A modern, well-designed building"
                    data-ai-hint="modern architecture"
                    className="rounded-lg object-cover shadow-2xl"
                />
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Our Solution — A Studio Without Walls</h2>
                    <p className="text-lg text-muted-foreground">Aether is not just another online course platform. It’s a dynamic ecosystem where learning, collaboration, and practice happen seamlessly. We:</p>
                    <ul className="space-y-4">
                        {solutions.map((point, index) => (
                        <li key={index} className="flex items-start text-lg">
                            <Lightbulb className="w-6 h-6 mr-3 text-primary flex-shrink-0 mt-1" />
                            <span className="flex-1">{point.text}</span>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>

        {/* What Makes Aether Different Section */}
        <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6">
                 <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">What Makes Aether Different</h2>
                 </div>
                 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {differentiators.map((point) => (
                        <div key={point.title} className="bg-muted/50 p-6 rounded-lg text-center">
                             <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 text-primary p-4 rounded-full">
                                    <point.icon className="w-8 h-8"/>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-headline">{point.title}</h3>
                            <p className="mt-2 text-muted-foreground">{point.description}</p>
                        </div>
                    ))}
                 </div>
            </div>
        </section>
        
        {/* Vision and Mission Section */}
        <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground">
            <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-headline">Our Vision</h2>
                    <p className="text-lg opacity-90">Aether begins in Africa because we believe the continent’s design stories and solutions can inspire the world. But our approach is borderless. As we grow, Aether will serve as a hub for architects everywhere who want to design with cultural intelligence and environmental responsibility.</p>
                </div>
                 <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-headline">Our Mission</h2>
                    <p className="text-lg opacity-90">To nurture a generation of architects who can confidently design for their communities — whether those communities are in Lagos, London, or Lima — while staying connected to the roots of their craft.</p>
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
