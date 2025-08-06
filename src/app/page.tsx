import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BrainCircuit, Rocket, Telescope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Welcome to Aether Space
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A curated ecosystem for innovators, creators, and pioneers. Discover projects, join programs, and find your place in the future.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/discover">
                      Discover Your Interests
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/projects">
                      View Projects
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="galaxy abstract"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Explore the Ecosystem</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Dive into the core components of Aether Space and find what resonates with you.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <Card>
                <CardHeader className="items-center text-center">
                  <Telescope className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Project Showcase</CardTitle>
                  <CardDescription>A curated showcase of Aether School and Horizon Studio projects.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                   <Button asChild variant="outline">
                    <Link href="/projects">Explore Projects</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center text-center">
                   <Rocket className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Our Programs</CardTitle>
                  <CardDescription>Detailed information about Aether School and Horizon Studio programs.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button asChild variant="outline">
                    <Link href="/programs">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="items-center text-center">
                   <BrainCircuit className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>AI Discovery Tool</CardTitle>
                  <CardDescription>Find relevant aspects of the ecosystem for your specific interests.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button asChild variant="outline">
                    <Link href="/discover">Try Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
