
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const EventDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  type: z.string(),
  speaker: z.string(),
  description: z.string(),
  status: z.enum(['Upcoming', 'Past']),
  coverImage: z.string().url().optional(),
  eventCode: z.string(),
  rsvpCount: z.number(),
  hasRsvpd: z.boolean(),
});

export type EventDetail = z.infer<typeof EventDetailSchema>;


async function getAirtableBase() {
    const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        throw new Error('Airtable credentials are not configured.');
    }
    return new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
}


export async function getEventDetails(eventCode: string): Promise<EventDetail | null> {
    const { AIRTABLE_EVENTS_TABLE_ID, AIRTABLE_RSVPS_TABLE_ID, AIRTABLE_MEMBERS_TABLE_ID } = process.env;
    if (!AIRTABLE_EVENTS_TABLE_ID || !AIRTABLE_RSVPS_TABLE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error("Airtable table IDs for events/rsvps are not fully configured.");
        return null;
    }
    const base = await getAirtableBase();
    
    try {
        const eventRecords = await base(AIRTABLE_EVENTS_TABLE_ID).select({
            filterByFormula: `UPPER({fldXJZa542DQ1eSV9}) = "${eventCode.toUpperCase()}"`,
            maxRecords: 1,
        }).firstPage();

        if (eventRecords.length === 0) return null;
        const eventRecord = eventRecords[0];

        // Check if current user has RSVP'd
        let hasRsvpd = false;
        const aetherId = cookies().get('aether_user_id')?.value;
        
        if (aetherId) {
            const memberRecords = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
                filterByFormula: `{fld7hoOSkHYaZrPr7} = "${aetherId}"`,
                maxRecords: 1
            }).firstPage();

            if (memberRecords.length > 0) {
                const memberRecordId = memberRecords[0].id;
                const rsvpRecords = await base(AIRTABLE_RSVPS_TABLE_ID).select({
                     filterByFormula: `AND({fldUvWxYzAbCdEfGh} = '${eventRecord.id}', {fldIjKlMnOpQrStUv} = '${memberRecordId}')`,
                     maxRecords: 1,
                }).firstPage();
                hasRsvpd = rsvpRecords.length > 0;
            }
        }
        
        const coverImageField = eventRecord.get('fldoXDEfNslvE50WF');
        let coverImageUrl;
        if (Array.isArray(coverImageField) && coverImageField.length > 0) {
            coverImageUrl = coverImageField[0].url;
        }

        const eventDateStr = eventRecord.get('fldZqEcg7wovGdynX') as string;
        const eventDate = new Date(eventDateStr);
        
        const event = {
            id: eventRecord.id,
            title: eventRecord.get('fldsWDjmyzCEDVLq1') || 'Untitled Event',
            date: eventDateStr,
            type: eventRecord.get('fldDkeL5skl6n3F9A') || 'General',
            speaker: eventRecord.get('fldA6qlmJI4DVdCCV') || 'TBA',
            description: eventRecord.get('fld2rolAMxiIEjh7x') || 'No description provided.',
            status: eventDate >= new Date() ? 'Upcoming' : 'Past',
            coverImage: coverImageUrl,
            eventCode: eventRecord.get('fldXJZa542DQ1eSV9') as string,
            rsvpCount: eventRecord.get('fldzY2jK7lW1tZ0Xq') || 0, // RSVP Count field ID from new schema
            hasRsvpd: hasRsvpd,
        };
        
        return EventDetailSchema.parse(event);
    } catch (error) {
        console.error(`Error fetching event details for ${eventCode}:`, error);
        return null;
    }
}


export async function submitRsvp(eventId: string): Promise<{ success: boolean; error?: string }> {
    const aetherId = cookies().get('aether_user_id')?.value;
    if (!aetherId) {
        return { success: false, error: 'You must be logged in to RSVP.' };
    }

    const { AIRTABLE_EVENTS_TABLE_ID, AIRTABLE_RSVPS_TABLE_ID, AIRTABLE_MEMBERS_TABLE_ID } = process.env;
    if (!AIRTABLE_EVENTS_TABLE_ID || !AIRTABLE_RSVPS_TABLE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        return { success: false, error: 'Server RSVP functionality is not configured.' };
    }
    const base = await getAirtableBase();

    try {
        // 1. Get Member's Record ID
        const memberRecords = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `{fld7hoOSkHYaZrPr7} = "${aetherId}"`,
            maxRecords: 1,
        }).firstPage();

        if (memberRecords.length === 0) {
            return { success: false, error: 'Could not verify your member account.' };
        }
        const memberRecordId = memberRecords[0].id;
        
        // 2. Check for existing RSVP
        const existingRsvp = await base(AIRTABLE_RSVPS_TABLE_ID).select({
            filterByFormula: `AND({fldUvWxYzAbCdEfGh} = '${eventId}', {fldIjKlMnOpQrStUv} = '${memberRecordId}')`,
            maxRecords: 1,
        }).firstPage();

        if (existingRsvp.length > 0) {
            return { success: false, error: "You've already RSVP'd to this event." };
        }

        // 3. Create the RSVP Record
        await base(AIRTABLE_RSVPS_TABLE_ID).create([
            {
                fields: {
                    'fldUvWxYzAbCdEfGh': [eventId],
                    'fldIjKlMnOpQrStUv': [memberRecordId],
                }
            }
        ]);
        
        // 4. Update the RSVP count on the event
        const eventRecord = await base(AIRTABLE_EVENTS_TABLE_ID).find(eventId);
        const currentRsvpCount = eventRecord.get('fldzY2jK7lW1tZ0Xq') as number || 0;
        await base(AIRTABLE_EVENTS_TABLE_ID).update(eventId, {
            'fldzY2jK7lW1tZ0Xq': currentRsvpCount + 1,
        });

        // 5. Revalidate the path to show the updated RSVP status
        const eventCode = eventRecord.get('fldXJZa542DQ1eSV9');
        revalidatePath(`/events/${eventCode}`);
        
        return { success: true };

    } catch (error: any) {
        console.error('RSVP submission error:', error);
        return { success: false, error: 'Failed to submit RSVP due to a database error.' };
    }
}
