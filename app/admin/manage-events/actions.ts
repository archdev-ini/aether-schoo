
'use server';

import { z } from 'zod';
import Airtable from 'airtable';

const AdminEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  type: z.string(),
  isPublished: z.boolean(),
  rsvpCount: z.number(),
});

export type AdminEvent = z.infer<typeof AdminEventSchema>;

export async function getAdminEvents(): Promise<AdminEvent[]> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;
    const AIRTABLE_EVENTS_TABLE_ID = 'tblv6PzXgqK8rL9yB';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_EVENTS_TABLE_ID) {
        console.error('Airtable credentials for events are not set.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const records = await base(AIRTABLE_EVENTS_TABLE_ID).select({
            sort: [{field: "fldB5cK3jL8xP1nB2", direction: "desc"}],
        }).all();

        const events = records.map(record => ({
            id: record.id,
            title: record.get('fldA4nB2cK3jL8xP1') || 'Untitled Event',
            date: record.get('fldB5cK3jL8xP1nB2'),
            type: record.get('fldC6dK3jL8xP1nB3') || 'General',
            isPublished: record.get('fldD7eK3jL8xP1nB4') || false,
            rsvpCount: record.get('fldE8fK3jL8xP1nB5') || 0,
        }));
        
        return AdminEventSchema.array().parse(events);

    } catch (error) {
        console.error('Airtable API error fetching admin events:', error);
        return [];
    }
}
