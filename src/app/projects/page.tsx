import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const projects = [
  {
    title: "Project Nova",
    description: "A decentralized platform for scientific collaboration.",
    category: "Aether School",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "science technology",
  },
  {
    title: "Starlight Initiative",
    description: "Mapping the cosmos with community-driven data.",
    category: "Horizon Studio",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "space stars",
  },
  {
    title: "Quantum Leap",
    description: "Exploring next-generation computing paradigms.",
    category: "Aether School",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "quantum computing",
  },
  {
    title: "BioSynth",
    description: "AI-powered protein folding and drug discovery.",
    category: "Horizon Studio",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "biology tech",
  },
  {
    title: "Project Chimera",
    description: "A framework for secure and private digital identities.",
    category: "Aether School",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "cybersecurity abstract",
  },
  {
    title: "Echo Weather",
    description: "Hyper-local weather forecasting using IoT sensors.",
    category: "Horizon Studio",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "weather climate",
  },
];

export default function ProjectsPage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Our Projects</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          A showcase of cutting-edge projects from Aether School and Horizon Studio.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card key={project.title} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Image
              src={project.imageUrl}
              width={600}
              height={400}
              alt={project.title}
              data-ai-hint={project.aiHint}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{project.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
