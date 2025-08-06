import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">About Aether Ecosystem</h1>
        <p className="mt-4 max-w-3xl mx-auto text-muted-foreground md:text-xl">
          Aether is a digital-first architecture and design school creating the next generation of African design leaders.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Aether School</h3>
                <p className="text-muted-foreground">Open access to skill-building for aspiring and professional designers.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Horizon Studio</h3>
                <p className="text-muted-foreground">An immersive studio experience for portfolio-ready projects and career acceleration.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Aether Community</h3>
                <p className="text-muted-foreground">A vibrant network for peer learning, industry events, and lifelong mentorship.</p>
              </div>
            </div>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            We’re backed by Buildr Africa and committed to decentralizing opportunity for African creatives.
          </p>
        </div>
        <div>
            <Image
                src="https://placehold.co/600x600.png"
                width={600}
                height={600}
                alt="Ecosystem Diagram"
                data-ai-hint="community learning connection"
                className="rounded-lg object-cover"
            />
        </div>
      </div>
    </main>
  );
}
