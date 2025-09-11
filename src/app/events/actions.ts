
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';

const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  type: z.string(),
  speaker: z.string(),
  description: z.string(),
  status: z.enum(['Upcoming', 'Past']),
  coverImage: z.string().url().optional(),
  eventCode: z.string().optional(),
});

export type Event = z.infer<typeof EventSchema>;

export async function getEvents(): Promise<Event[]> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.EVENTS) {
        console.error('Airtable credentials for events are not set in environment variables.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const F = FIELDS.EVENTS;
    
    try {
        const records = await base(TABLE_IDS.EVENTS).select({
            filterByFormula: `{${F.IS_PUBLISHED}}`,
            sort: [{field: F.DATE, direction: "desc"}],
        }).all();

        const now = new Date();

        const events = records.map(record => {
            const coverImageField = record.get(F.COVER_IMAGE);
            let coverImageUrl;
            if (Array.isArray(coverImageField) && coverImageField.length > 0) {
                coverImageUrl = coverImageField[0].url;
            }

            const eventDateStr = record.get(F.DATE) as string;
            const eventDate = eventDateStr ? new Date(eventDateStr as string) : new Date();
            
            return {
                id: record.id,
                title: record.get(F.TITLE) as string || 'Untitled Event',
                date: eventDateStr || new Date().toISOString(),
                type: record.get(F.TYPE) as string || 'General',
                speaker: record.get(F.SPEAKER) as string || 'TBA',
                description: record.get(F.DESCRIPTION) as string || 'No description provided.',
                status: eventDate >= now ? 'Upcoming' : 'Past',
                coverImage: coverImageUrl,
                eventCode: record.get(F.EVENT_CODE) as string | undefined
            };
        });
        
        const upcomingEvents = events.filter(e => e.status === 'Upcoming');
        const pastEvents = events.filter(e => e.status === 'Past');

        upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const sortedEvents = [...upcomingEvents, ...pastEvents];

        return EventSchema.array().parse(sortedEvents.filter(e => e.title && e.date));

    } catch (error) {
        console.error('Airtable API error:', error);
        return [];
    }
}
