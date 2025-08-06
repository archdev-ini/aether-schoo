
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Tag, Users } from "lucide-react";
import Link from "next/link";
import { getLumaEvents, type LumaEvent } from './actions';

function formatEventTime(event: LumaEvent) {
    const startDate = new Date(event.start_at);
    const endDate = new Date(event.end_at);

    const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' };
    
    const date = startDate.toLocaleDateString('en-US', dateOptions);
    const startTime = startDate.toLocaleTimeString('en-US', timeOptions);
    const endTime = endDate.toLocaleTimeString('en-US', timeOptions);

    return {
        date,
        time: `${startTime} - ${endTime}`
    }
}


export default async function EventsPage() {
  const events = await getLumaEvents();

  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Events & Sessions</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Join live workshops, Q&As with industry leaders, and community meetups.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {events.map((event) => {
          const { date, time } = formatEventTime(event);
          return (
            <Card key={event.api_id} className="flex flex-col md:flex-row overflow-hidden transition-all hover:shadow-lg">
                <div className="p-6 flex-1">
                    <CardHeader className="p-0 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-4 h-4 text-primary" />
                            <p className="text-primary font-semibold text-sm">{event.series_info?.title || 'Standalone Event'}</p>
                        </div>
                        <CardTitle className="text-2xl font-headline">{event.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                        <p className="text-muted-foreground line-clamp-3">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> <span>{date}</span></div>
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span>{time}</span></div>
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> <span>{event.location_type === 'online' ? 'Online' : event.location_address}</span></div>
                        </div>
                    </CardContent>
                </div>
                 <div className="p-6 bg-muted/50 flex flex-col justify-center items-center md:w-56">
                    <Button asChild className="w-full">
                        <Link href={event.url} target="_blank">Register on Luma</Link>
                    </Button>
                </div>
            </Card>
          )
        })}
         <div className="text-center pt-8">
            <p className="text-muted-foreground">More events coming soon. Follow our community channels to stay updated!</p>
        </div>
      </div>
    </main>
  );
}
