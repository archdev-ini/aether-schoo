
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Tag, Users } from "lucide-react";
import Link from "next/link";

const events = [
  {
    title: "Intro to Parametric Design with Grasshopper",
    type: "Workshop",
    date: "October 26, 2024",
    time: "4:00 PM WAT",
    location: "Online / Zoom",
    description: "A hands-on workshop covering the fundamentals of parametric and computational design using Rhino and Grasshopper.",
    href: "#"
  },
  {
    title: "AMA with Lesley Lokko",
    type: "Q&A Session",
    date: "November 5, 2024",
    time: "6:00 PM WAT",
    location: "Discord Stage",
    description: "Join us for an exclusive Ask Me Anything session with renowned architect and educator, Lesley Lokko.",
    href: "#"
  },
  {
    title: "Portfolio Review: Digital Fabrication",
    type: "Critique",
    date: "November 18, 2024",
    time: "5:00 PM WAT",
    location: "Online / Zoom",
    description: "Get feedback on your digital fabrication projects from industry professionals in this group critique session.",
    href: "#"
  },
   {
    title: "Aether Community Meetup",
    type: "Networking",
    date: "December 1, 2024",
    time: "7:00 PM WAT",
    location: "Gather Town",
    description: "Our end-of-year virtual meetup. Connect with fellow members, share your work, and celebrate a year of creativity.",
    href: "#"
  },
];


export default function EventsPage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Events & Sessions</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Join live workshops, Q&As with industry leaders, and community meetups.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {events.map((event) => (
          <Card key={event.title} className="flex flex-col md:flex-row overflow-hidden transition-all hover:shadow-lg">
            <div className="p-6 flex-1">
                <CardHeader className="p-0 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-primary" />
                        <p className="text-primary font-semibold text-sm">{event.type}</p>
                    </div>
                    <CardTitle className="text-2xl font-headline">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                    <p className="text-muted-foreground">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> <span>{event.date}</span></div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span>{event.time}</span></div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> <span>{event.location}</span></div>
                    </div>
                </CardContent>
            </div>
             <div className="p-6 bg-muted/50 flex flex-col justify-center items-center md:w-56">
                <Button asChild className="w-full">
                    <Link href={event.href}>Register Now</Link>
                </Button>
            </div>
          </Card>
        ))}
         <div className="text-center pt-8">
            <p className="text-muted-foreground">More events coming soon. Follow our community channels to stay updated!</p>
        </div>
      </div>
    </main>
  );
}
