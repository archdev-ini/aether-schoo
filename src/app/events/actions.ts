
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
});

export type Event = z.infer<typeof EventSchema>;

export async function getEvents(): Promise<Event[]> {
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
            sort: [{field: "Date", direction: "asc"}],
        }).all();

        const now = new Date();

        const events = records.map(record => {
            const coverImageField = record.get('Cover Image');
            let coverImageUrl;
            if (Array.isArray(coverImageField) && coverImageField.length > 0) {
                coverImageUrl = coverImageField[0].url;
            }

            const eventDateStr = record.get('Date');
            const eventDate = eventDateStr ? new Date(eventDateStr) : new Date();
            
            return {
                id: record.id,
                title: record.get('Title') || 'Untitled Event',
                date: eventDateStr || new Date().toISOString(),
                type: record.get('Type') || 'General',
                speaker: record.get('Speaker') || 'TBA',
                registrationUrl: record.get('Registration URL'),
                description: record.get('Description') || 'No description provided.',
                status: eventDate >= now ? 'Upcoming' : 'Past',
                coverImage: coverImageUrl,
            };
        });
        
        // Sort events by status (upcoming first) then by date
        events.sort((a, b) => {
            if (a.status === 'Upcoming' && b.status === 'Past') return -1;
            if (a.status === 'Past' && b.status === 'Upcoming') return 1;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        return EventSchema.array().parse(events.filter(e => e.title && e.date));

    } catch (error) {
        console.error('Airtable API error:', error);
        return [];
    }
}
