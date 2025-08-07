
import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">About Aether Ecosystem</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
        <div className="space-y-6">
          <p className="text-xl text-muted-foreground">
            Aether is a digital-first architecture and design school redefining education for African creatives. It’s a vibrant ecosystem fostering learning, collaboration, and creative empowerment.
          </p>
          <p className="text-xl text-muted-foreground">
            Our mission is to empower culturally grounded, globally connected designers who start where they are, with what they have.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
              <p className="font-medium">Aether School – Open-access, asynchronous courses for skill-building.</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
              <p className="font-medium">Horizon Studio – Immersive, cohort-based learning for real-world projects.</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
              <p className="font-medium">Aether Community – A decentralized network for peer learning, events, and mentorship.</p>
            </div>
          </div>
        </div>
        <div>
            <Image
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&h=600&auto=format&fit=crop"
                width={600}
                height={600}
                alt="Ecosystem Diagram"
                data-ai-hint="modern house exterior"
                className="rounded-lg object-cover shadow-2xl"
            />
        </div>
      </div>
    </main>
  );
}
