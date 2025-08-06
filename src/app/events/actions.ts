
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
            sort: [{field: "Status", direction: "asc"}, {field: "Date", direction: "asc"}],
        }).all();

        const events = records.map(record => {
            const coverImageField = record.get('Cover Image');
            let coverImageUrl;
            if (Array.isArray(coverImageField) && coverImageField.length > 0) {
                coverImageUrl = coverImageField[0].url;
            }

            return {
                id: record.id,
                title: record.get('Title') || 'Untitled Event',
                date: record.get('Date') || new Date().toISOString(),
                type: record.get('Type') || 'General',
                speaker: record.get('Speaker') || 'TBA',
                registrationUrl: record.get('Registration URL'),
                description: record.get('Description') || 'No description provided.',
                status: record.get('Status') || 'Upcoming',
                coverImage: coverImageUrl,
            };
        });
        
        return EventSchema.array().parse(events.filter(e => e