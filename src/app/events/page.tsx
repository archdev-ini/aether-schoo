
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  return (
    <div className="container py-20 md:py-32 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
            <div className="bg-muted text-primary p-4 rounded-full">
                <Calendar className="w-12 h-12"/>
            </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          Upcoming Events
        </h1>
        <p className="mt-6 text-muted-foreground md:text-xl">
          Our inaugural season of events is just around the corner. Join the community to be the first to know when tickets and registration go live this November.
        </p>
        <div className="mt-8">
            <Button asChild size="lg">
                <Link href="/join">
                   Join the Community
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
