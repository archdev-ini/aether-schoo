
'use server';

import { z } from 'zod';
const Airtable = require('airtable');

const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  type: z.string(),
  speaker: z.string(),
  registrationUrl: z.string().url().optional(),
  description: z.string(),
  status: z.enum(['Upcoming', 'Past']),
  coverImage: z.string().url().optional(),
  eventCode: z.string().optional(),
});

export type Event = z.infer<typeof EventSchema>;

export async function getEvents(): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Artificial delay

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_EVENTS_TABLE_ID
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_EVENTS_TABLE_ID) {
        console.error('Airtable credentials for events are not set in environment variables.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const records = await base(AIRTABLE_EVENTS_TABLE_ID).select({
            filterByFormula: "({Published} = 1)",
            sort: [{field: "Date", direction: "desc"}], // Fetch newest first
        }).all();

        const now = new Date();

        const events = records.map(record => {
            const coverImageField = record.get('Cover Image');
            let coverImageUrl;
            if (Array.isArray(coverImageField) && coverImageField.length > 0) {
                coverImageUrl = coverImageField[0].url;
            }

            const eventDateStr = record.get('Date');
            const eventDate = eventDateStr ? new Date(eventDateStr as string) : new Date();
            
            return {
                id: record.id,
                title: record.get('Title') || 'Untitled Event',
                date: eventDateStr || new Date().toISOString(),
                type: record.get('Type') || 'General',
                speaker: record.get('Speakers') || 'TBA',
                registrationUrl: record.get('Registration URL'),
                description: record.get('Description') || 'No description provided.',
                status: eventDate >= now ? 'Upcoming' : 'Past',
                coverImage: coverImageUrl,
                eventCode: record.get('EventCode')
            };
        });
        
        // Separate upcoming and past events
        const upcomingEvents = events.filter(e => e.status === 'Upcoming');
        const pastEvents = events.filter(e => e.status === 'Past');

        // Sort upcoming events from soonest to latest
        upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        // Past events are already sorted from newest to oldest due to initial fetch sort

        // Combine them so upcoming are always first
        const sortedEvents = [...upcomingEvents, ...pastEvents];

        return EventSchema.array().parse(sortedEvents.filter(e => e.title && e.date));

    } catch (error) {
        console.error('Airtable API error:', error);
        return [];
    }
}
