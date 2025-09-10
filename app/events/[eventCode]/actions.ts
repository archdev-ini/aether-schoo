
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';

const AttendeeSchema = z.object({
    id: z.string(),
    name: z.string(),
    aetherId: z.string(),
});

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
  attendees: z.array(AttendeeSchema),
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
    if (!TABLE_IDS.EVENTS || !TABLE_IDS.RSVPS || !TABLE_IDS.MEMBERS) {
        console.error("Airtable table IDs for events/rsvps are not fully configured.");
        return null;
    }
    const base = await getAirtableBase();
    const EF = FIELDS.EVENTS;
    const MF = FIELDS.MEMBERS;
    const RF = FIELDS.RSVPS;
    
    try {
        const eventRecords = await base(TABLE_IDS.EVENTS).select({
            filterByFormula: `UPPER({${EF.EVENT_CODE}}) = "${eventCode.toUpperCase()}"`,
            maxRecords: 1,
        }).firstPage();

        if (eventRecords.length === 0) return null;
        const eventRecord = eventRecords[0];
        const eventId = eventRecord.id;

        // Fetch all RSVPs for this event
        const rsvpRecords = await base(TABLE_IDS.RSVPS).select({
            filterByFormula: `{${RF.EVENT}} = '${eventId}'`
        }).all();
        const memberRecordIds = rsvpRecords.map(r => r.get(RF.MEMBER)).flat().filter(Boolean);

        let attendees: z.infer<typeof AttendeeSchema>[] = [];
        if (memberRecordIds.length > 0) {
            const memberFilter = "OR(" + memberRecordIds.map(id => `RECORD_ID() = '${id}'`).join(',') + ")";
            const memberRecords = await base(TABLE_IDS.MEMBERS).select({
                filterByFormula: memberFilter,
                fields: [MF.USERNAME, MF.FULL_NAME]
            }).all();
            attendees = memberRecords.map(rec => ({
                id: rec.id,
                name: rec.get(MF.FULL_NAME) as string,
                aetherId: rec.get(MF.USERNAME) as string // Using username as a stand-in for a public ID
            }));
        }
        
        let hasRsvpd = false;
        const currentAetherId = cookies().get('aether_user_id')?.value;
        if (currentAetherId) {
            // This logic assumes aether_user_id cookie stores the Airtable Record ID. 
            // If it stores a different ID (like AETHER_ID), this lookup needs adjustment.
            hasRsvpd = memberRecordIds.includes(currentAetherId);
        }
        
        const coverImageField = eventRecord.get(EF.COVER_IMAGE);
        let coverImageUrl;
        if (Array.isArray(coverImageField) && coverImageField.length > 0) {
            coverImageUrl = coverImageField[0].url;
        }

        const eventDateStr = eventRecord.get(EF.DATE) as string;
        const eventDate = new Date(eventDateStr);
        
        const event = {
            id: eventId,
            title: eventRecord.get(EF.TITLE) as string || 'Untitled Event',
            date: eventDateStr,
            type: eventRecord.get(EF.TYPE) as string || 'General',
            speaker: eventRecord.get(EF.SPEAKER) as string || 'TBA',
            description: eventRecord.get(EF.DESCRIPTION) as string || 'No description provided.',
            status: eventDate >= new Date() ? 'Upcoming' : 'Past',
            coverImage: coverImageUrl,
            eventCode: eventRecord.get(EF.EVENT_CODE) as string,
            rsvpCount: eventRecord.get(EF.RSVP_COUNT) as number || 0,
            hasRsvpd: hasRsvpd,
            attendees: attendees,
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

    if (!TABLE_IDS.EVENTS || !TABLE_IDS.RSVPS || !TABLE_IDS.MEMBERS) {
        return { success: false, error: 'Server RSVP functionality is not configured.' };
    }
    const base = await getAirtableBase();
    const EF = FIELDS.EVENTS;
    const MF = FIELDS.MEMBERS;
    const RF = FIELDS.RSVPS;

    try {
        // NOTE: This assumes aether_user_id cookie stores the Airtable record ID.
        // If it stores a custom Aether ID, a lookup is needed first.
        const memberRecordId = aetherId;
        
        const existingRsvp = await base(TABLE_IDS.RSVPS).select({
            filterByFormula: `AND({${RF.EVENT}} = '${eventId}', {${RF.MEMBER}} = '${memberRecordId}')`,
            maxRecords: 1,
        }).firstPage();

        if (existingRsvp.length > 0) {
            return { success: false, error: "You've already RSVP'd to this event." };
        }

        await base(TABLE_IDS.RSVPS).create([
            {
                fields: {
                    [RF.EVENT]: [eventId],
                    [RF.MEMBER]: [memberRecordId],
                }
            }
        ]);
        
        const eventRecord = await base(TABLE_IDS.EVENTS).find(eventId);
        const eventCode = eventRecord.get(EF.EVENT_CODE);
        revalidatePath(`/events/${eventCode}`);
        
        return { success: true };

    } catch (error: any) {
        console.error('RSVP submission error:', error);
        return { success: false, error: 'Failed to submit RSVP due to a database error.' };
    }
}
