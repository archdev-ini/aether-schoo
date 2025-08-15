
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Globe, Users, Package, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const impactPillars = [
  { 
    icon: Globe, 
    title: "Environmental Sustainability", 
    points: [
        "Promoting climate-responsive and culturally rooted design",
        "Encouraging use of local, low-carbon, and regenerative materials",
        "Leveraging BIM and digital tools to reduce waste and energy use"
    ]
  },
  { 
    icon: Users, 
    title: "Social Equity & Access", 
    points: [
        "Making world-class design education accessible through our open school",
        "Empowering young designers globally, starting with Africa",
        "Supporting inclusive, community-driven design solutions"
    ]
  },
  { 
    icon: Package, 
    title: "Innovation for Good", 
    points: [
        "Exploring Web3 + BIM for transparent, decentralized collaboration",
        "Encouraging open-source knowledge and skill-sharing",
        "Bridging global innovation with local realities"
    ]
  },
];

const commitments = [
    { text: "Aligned with the UN Sustainable Development Goals (SDGs)" },
    { text: "Advocating for equity in design education and practice" },
    { text: "Empowering communities through open learning and creative challenges" },
    { text: "Supporting regenerative, future-proof design practices" },
]

const featuredStories = [
    { title: "Case study: Community-first design in Lagos" },
    { title: "Podcast: Future of Architecture & Web3" },
    { title: "Blog: Why Social Impact is Central to Aether’s Mission" },
]

export default function ImpactPage() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 bg-muted">
        <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&h=600&auto=format&fit=crop"
            alt="People collaborating on designs"
            fill
            className="object-cover opacity-20"
            data-ai-hint="team collaboration design"
        />
        <div className="container relative px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Architecture with Purpose
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl">
               Our impact is measured by the lives we touch and the planet we protect.
            </p>
            <div className="mt-8">
                <Button asChild size="lg">
                    <Link href="#commitments">
                       Explore Our Commitments
                    </Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Why it matters */}
        <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6 text-center max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Why Impact Matters</h2>
                 <p className="mt-4 text-muted-foreground md:text-xl">
                    At Aether, architecture is more than buildings — it’s about shaping societies and ecosystems. We measure success not only by design excellence but also by the positive change our ecosystem brings to people and the planet.
                </p>
            </div>
        </section>

        {/* Our Impact Pillars Section */}
        <section className="w-full py-16 md:py-24 bg-muted">
            <div className="container px-4 md:px-6">
                 <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Our Impact Pillars</h2>
                 </div>
                 <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {impactPillars.map((pillar) => (
                        <Card key={pillar.title} className="bg-background/50 p-8 rounded-lg text-center flex flex-col">
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 text-primary p-4 rounded-full">
                                    <pillar.icon className="w-8 h-8"/>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-headline">{pillar.title}</h3>
                             <ul className="mt-4 space-y-2 text-muted-foreground text-left flex-grow">
                                {pillar.points.map((point, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="w-4 h-4 mr-3 mt-1 text-primary/50 flex-shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>

        {/* Our Commitments Section */}
        <section id="commitments" className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Our Commitments</h2>
                    <ul className="space-y-4 text-muted-foreground text-lg">
                        {commitments.map((commitment, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircle className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                <span>{commitment.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <Image
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&h=700&auto=format&fit=crop"
                    width={600}
                    height={700}
                    alt="Team working together"
                    data-ai-hint="teamwork collaboration"
                    className="rounded-lg object-cover shadow-2xl"
                />
            </div>
        </section>

        {/* Featured Stories Section */}
        <section className="w-full py-16 md:py-24 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Featured Stories & Resources</h2>
                    <p className="mt-4 text-muted-foreground">Coming Soon</p>
                </div>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {featuredStories.map((item) => (
                        <Card key={item.title} className="flex flex-col text-center border-t-4 border-primary/20 hover:border-primary transition-all duration-300 p-8 opacity-60">
                            <CardTitle className="text-2xl font-headline">{item.title}</CardTitle>
                            <CardContent className="flex-grow pt-4">
                                <p className="text-muted-foreground">This content is currently in development.</p>
                            </CardContent>
                             <div className="mt-auto pt-4">
                                <Button variant="outline" disabled>Read More</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

      {/* Final CTA */}
        <section className="w-full py-16 md:py-24">
            <div className="container text-center bg-primary/5 rounded-lg p-10 md:p-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Impact happens when we act together.</h2>
                 <p className="mt-4 max-w-3xl mx-auto text-muted-foreground md:text-xl">
                   Every member — student, architect, creative, or builder — contributes to shaping a better world.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/join">
                           Join Aether
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    </div>
  );
}
