
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createEvent, type CreateEventState } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create Event
    </Button>
  );
}

const eventTypes = ["Workshop", "Horizon Studio", "Webinar", "Lecture", "Meetup", "Conference", "Other"];

export default function NewEventPage() {
  const initialState: CreateEventState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createEvent, initialState);
  const [date, setDate] = useState<Date>();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/admin/manage-events">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Create New Event
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Fill out the basic information for the new event.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., 'Workshop: Intro to Parametric Design'"
                aria-describedby="title-error"
              />
              <div id="title-error" aria-live="polite" aria-atomic="true">
                {state.errors?.title &&
                  state.errors.title.map((error: string) => (
                    <p className="mt-2 text-sm text-destructive" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Event Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                 <input type="hidden" name="date" value={date?.toISOString()} />
                 <div id="date-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.date &&
                    state.errors.date.map((error: string) => (
                        <p className="mt-2 text-sm text-destructive" key={error}>
                        {error}
                        </p>
                    ))}
                </div>
              </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Event Type</Label>
                     <Select name="type" defaultValue="Workshop">
                        <SelectTrigger id="type" aria-label="Select event type">
                            <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                            {eventTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div id="type-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.type &&
                        state.errors.type.map((error: string) => (
                            <p className="mt-2 text-sm text-destructive" key={error}>
                            {error}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventCode">Event Code</Label>
              <Input
                id="eventCode"
                name="eventCode"
                placeholder="e.g., WAD-2025 (must be unique)"
                aria-describedby="eventCode-error"
                className="font-mono uppercase"
              />
              <div id="eventCode-error" aria-live="polite" aria-atomic="true">
                {state.errors?.eventCode &&
                  state.errors.eventCode.map((error: string) => (
                    <p className="mt-2 text-sm text-destructive" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            <div aria-live="polite" aria-atomic="true">
                {state.message ? (
                    <p className="mt-2 text-sm text-destructive">{state.message}</p>
                ) : null}
            </div>
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
