
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    title: "Eco-Modular Housing Kiosk",
    description: "A prototype for a low-cost, sustainable community kiosk designed by a Horizon Studio cohort.",
    category: "Horizon Studio",
    imageUrl: "https://images.unsplash.com/photo-1558526012-88b779b5d351?q=80&w=600&h=400&auto=format&fit=crop",
    aiHint: "modular architecture",
  },
  {
    title: "Digital Archive of Sahelian Mosques",
    description: "A digital preservation project documenting the vernacular architecture of the Sahel region.",
    category: "Aether School Grant",
    imageUrl: "https://images.unsplash.com/photo-1590483441839-a68b55500448?q=80&w=600&h=400&auto=format&fit=crop",
    aiHint: "african architecture",
  },
  {
    title: "Rainwater Harvesting System for Urban Homes",
    description: "A final project from the 'Design for Climate Resilience' course, adapted for dense urban living.",
    category: "Aether School",
    imageUrl: "https://images.unsplash.com/photo-1616047006789-b7af52592bef?q=80&w=600&h=400&auto=format&fit=crop",
    aiHint: "sustainable home",
  },
  {
    title: "Lagos Floating Community Center",
    description: "A conceptual design addressing sea-level rise with adaptive, water-based architecture.",
    category: "Horizon Studio",
    imageUrl: "https://images.unsplash.com/photo-1600585152225-358b5c1fac95?q=80&w=600&h=400&auto=format&fit=crop",
    aiHint: "modern house design",
  },
  {
    title: "3D-Printed Laterite Bricks",
    description: "Research into combining digital fabrication with local, earth-based materials for construction.",
    category: "Aether School Research",
    imageUrl: "https://images.unsplash.com/photo-1551884831-bbf327632454?q=80&w=600&h=400&auto=format&fit=crop",
    aiHint: "construction technology",
  },
  {
    title: "The Makoko Digital Twin",
    description: "A collaborative project to map and visualize the Makoko floating community for urban planning.",
    category: "Community Project",
    imageUrl: "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?q=80&w=600&h=400&auto=format&fit=crop",
    aiHint: "city map",
  },
];

export default function ProjectsPage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Projects from the Ecosystem</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          A showcase of projects from Aether School courses, Horizon Studio cohorts, and community initiatives.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card key={project.title} className="flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="relative">
                 <Image
                  src={project.imageUrl}
                  width={600}
                  height={400}
                  alt={project.title}
                  data-ai-hint={project.aiHint}
                  className="w-full h-48 object-cover"
                />
                <Badge variant="secondary" className="absolute top-3 right-3">{project.category}</Badge>
            </div>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{project.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
