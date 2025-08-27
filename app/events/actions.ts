
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
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;
    const AIRTABLE_EVENTS_TABLE_ID = 'tbl5Dwc9n31gKW4eu';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_EVENTS_TABLE_ID) {
        console.error('Airtable credentials for events are not set in environment variables.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const records = await base(AIRTABLE_EVENTS_TABLE_ID).select({
            filterByFormula: "({fldQwNwXW5g9YWsVm} = 1)", // Published
            sort: [{field: "fldZqEcg7wovGdynX", direction: "desc"}], // Date
        }).all();

        const now = new Date();

        const events = records.map(record => {
            const coverImageField = record.get('fldoXDEfNslvE50WF'); // Cover Image
            let coverImageUrl;
            if (Array.isArray(coverImageField) && coverImageField.length > 0) {
                coverImageUrl = coverImageField[0].url;
            }

            const eventDateStr = record.get('fldZqEcg7wovGdynX'); // Date
            const eventDate = eventDateStr ? new Date(eventDateStr as string) : new Date();
            
            return {
                id: record.id,
                title: record.get('fldsWDjmyzCEDVLq1') || 'Untitled Event', // Title
                date: eventDateStr || new Date().toISOString(),
                type: record.get('fldDkeL5skl6n3F9A') || 'General', // Type
                speaker: record.get('fldA6qlmJI4DVdCCV') || 'TBA', // Speakers
                registrationUrl: record.get('fldq6qcxhD04ny6Zj'), // Registration URL
                description: record.get('fld2rolAMxiIEjh7x') || 'No description provided.', // Description
                status: eventDate >= now ? 'Upcoming' : 'Past',
                coverImage: coverImageUrl,
                eventCode: record.get('fldXJZa542DQ1eSV9') // EventCode
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
