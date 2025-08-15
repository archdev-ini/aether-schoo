
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Cpu, Leaf, School, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const approachPillars = [
  { icon: Leaf, title: "Climate-Responsive Design", description: "We promote architecture that adapts to local climates, materials, and cultures while minimizing environmental impact." },
  { icon: Cpu, title: "Responsible Technology", description: "Through BIM and Web3 tools, we reduce waste, improve collaboration, and foster transparent, regenerative systems." },
  { icon: School, title: "Sustainable Learning", description: "Our open school and immersive studios make sustainability a core design skill — not an afterthought." },
  { icon: Users, title: "Community Impact", description: "From affordable housing to ecological regeneration, we guide projects that address urgent social and environmental challenges." },
];

const commitments = [
    { text: "Aligned with the UN Sustainable Development Goals (SDGs)" },
    { text: "Climate-conscious curriculum and studios" },
    { text: "Advocacy for local materials and low-carbon building" },
    { text: "Global partnerships for ecological innovation" },
]

const initiatives = [
    { title: "Green Design Labs", description: "Community-driven workshops on sustainable design." },
    { title: "Digital for Good", description: "Exploring how BIM + Web3 can reduce waste in construction." },
    { title: "Sustainability Studio Projects", description: "Hands-on work tackling climate challenges in cities like Lagos and beyond." },
]

export default function SustainabilityPage() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 bg-muted">
        <Image
            src="https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1200&h=600&auto=format&fit=crop"
            alt="Green design visual"
            fill
            className="object-cover opacity-20"
            data-ai-hint="green architecture"
        />
        <div className="container relative px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Designing for a Resilient Future
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-muted-foreground md:text-xl">
               At Aether, sustainability is not an option — it’s our foundation.
            </p>
            <div className="mt-8">
                <Button asChild size="lg">
                    <Link href="/join">
                       Join the Movement
                    </Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Why it matters */}
        <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6 text-center max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Why Sustainability Matters</h2>
                 <p className="mt-4 text-muted-foreground md:text-xl">
                    We are building a global community of designers, architects, and innovators committed to shaping a future that works in harmony with our planet. At Aether, sustainability is embedded into our teaching, projects, and technologies.
                </p>
            </div>
        </section>

        {/* Our Approach Section */}
        <section className="w-full py-16 md:py-24 bg-muted">
            <div className="container px-4 md:px-6">
                 <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Our Approach</h2>
                 </div>
                 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {approachPillars.map((pillar) => (
                        <div key={pillar.title} className="bg-background/50 p-6 rounded-lg text-center">
                             <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 text-primary p-4 rounded-full">
                                    <pillar.icon className="w-8 h-8"/>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-headline">{pillar.title}</h3>
                            <p className="mt-2 text-muted-foreground">{pillar.description}</p>
                        </div>
                    ))}
                 </div>
            </div>
        </section>

        {/* Our Commitments Section */}
        <section className="w-full py-16 md:py-24">
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
                    src="https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?q=80&w=600&h=700&auto=format&fit=crop"
                    width={600}
                    height={700}
                    alt="Sustainable building materials"
                    data-ai-hint="sustainable materials"
                    className="rounded-lg object-cover shadow-2xl"
                />
            </div>
        </section>

        {/* Featured Initiatives Section */}
        <section className="w-full py-16 md:py-24 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Featured Initiatives</h2>
                </div>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {initiatives.map((item) => (
                        <Card key={item.title} className="flex flex-col text-center border-t-4 border-primary/20 hover:border-primary transition-all duration-300 p-8">
                            <CardTitle className="text-2xl font-headline">{item.title}</CardTitle>
                            <CardContent className="flex-grow pt-4">
                                <p className="text-muted-foreground">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

      {/* Final CTA */}
        <section className="w-full py-16 md:py-24">
            <div className="container text-center bg-primary/5 rounded-lg p-10 md:p-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Aether is more than an ecosystem — it’s a pledge to design responsibly.</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
                   Be part of the community shaping a sustainable future.
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
