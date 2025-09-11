
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';

const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  description: z.string(),
  speaker: z.string(),
  image: z.string().url().optional(),
  aiHint: z.string().optional(),
  eventbriteUrl: z.string().url(),
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
            filterByFormula: `{${F.IS_PUBLISHED}} = 1`,
            sort: [{field: F.DATE, direction: "desc"}],
        }).all();

        const events = records.map(record => {
            const coverImageField = record.get(F.COVER_IMAGE);
            let coverImageUrl;
            if (Array.isArray(coverImageField) && coverImageField.length > 0) {
                coverImageUrl = coverImageField[0].url;
            }
            
            return {
                id: record.id,
                title: record.get(F.TITLE) as string || 'Untitled Event',
                date: record.get(F.DATE) as string || new Date().toISOString(),
                description: record.get(F.DESCRIPTION) as string || 'No description provided.',
                speaker: record.get(F.SPEAKER) as string || 'TBA',
                image: coverImageUrl,
                aiHint: 'event cover photo',
                eventbriteUrl: record.get('Eventbrite URL') as string,
            };
        });

        // Filter out events without an eventbrite link
        const validEvents = events.filter(e => e.eventbriteUrl);
        return EventSchema.array().parse(validEvents);

    } catch (error) {
        console.error('Airtable API error fetching events:', error);
        return [];
    }
}
