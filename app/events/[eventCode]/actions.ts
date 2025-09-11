
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
        const memberRecordIds = rsvpRecords.map(r => r.get(RF.MEMBER)).flat().filter(Boolean) as string[];

        let attendees: z.infer<typeof AttendeeSchema>[] = [];
        if (memberRecordIds.length > 0) {
            const memberFilter = "OR(" + memberRecordIds.map(id => `RECORD_ID() = '${id}'`).join(',') + ")";
            const memberRecords = await base(TABLE_IDS.MEMBERS).select({
                filterByFormula: memberFilter,
                fields: [MF.AETHER_ID, MF.FULL_NAME]
            }).all();
            attendees = memberRecords.map(rec => ({
                id: rec.id,
                name: rec.get(MF.FULL_NAME) as string,
                aetherId: rec.get(MF.AETHER_ID) as string
            }));
        }
        
        let hasRsvpd = false;
        const currentAetherIdCookie = cookies().get('aether_user_id')?.value;
        if (currentAetherIdCookie) {
             const currentUserMemberRecords = await base(TABLE_IDS.MEMBERS).select({
                filterByFormula: `{${MF.AETHER_ID}} = '${currentAetherIdCookie}'`,
                maxRecords: 1
            }).firstPage();

            if (currentUserMemberRecords.length > 0) {
                const memberRecordId = currentUserMemberRecords[0].id;
                hasRsvpd = memberRecordIds.includes(memberRecordId);
            }
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
        const memberRecords = await base(TABLE_IDS.MEMBERS).select({
            filterByFormula: `{${MF.AETHER_ID}} = '${aetherId}'`,
            maxRecords: 1,
        }).firstPage();

        if (memberRecords.length === 0) {
            return { success: false, error: 'Member record not found.' };
        }
        const memberRecordId = memberRecords[0].id;
        
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


const GuestRsvpSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('A valid email is required.'),
});

async function findOrCreateMember(base: Airtable.Base, fullName: string, email: string): Promise<string> {
    const MF = FIELDS.MEMBERS;
    if (!TABLE_IDS.MEMBERS) {
        throw new Error("Members table ID is not configured.");
    }
    const existingRecords = await base(TABLE_IDS.MEMBERS).select({
        filterByFormula: `LOWER({${MF.EMAIL}}) = "${email.toLowerCase()}"`,
        maxRecords: 1,
    }).firstPage();

    if (existingRecords.length > 0) {
        return existingRecords[0].id;
    }

    const newRecord = await base(TABLE_IDS.MEMBERS).create([
        {
            fields: {
                [MF.FULL_NAME]: fullName,
                [MF.EMAIL]: email,
                [MF.OPT_IN_STATUS]: 'Interested',
            }
        }
    ]);
    return newRecord[0].id;
}

export async function submitGuestRsvp(eventId: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
    const validatedFields = GuestRsvpSchema.safeParse({
        fullName: formData.get('fullName'),
        email: formData.get('email'),
    });

    if (!validatedFields.success) {
        return { success: false, error: 'Invalid data provided. Please check your name and email.' };
    }

    const { fullName, email } = validatedFields.data;
    const base = await getAirtableBase();
    const RF = FIELDS.RSVPS;

    try {
        const memberRecordId = await findOrCreateMember(base, fullName, email);

        const existingRsvp = await base(TABLE_IDS.RSVPS).select({
            filterByFormula: `AND({${RF.EVENT}} = '${eventId}', {${RF.MEMBER}} = '${memberRecordId}')`,
            maxRecords: 1,
        }).firstPage();

        if (existingRsvp.length > 0) {
            return { success: false, error: "It looks like you've already RSVP'd with this email." };
        }

        await base(TABLE_IDS.RSVPS).create([
            { fields: { [RF.EVENT]: [eventId], [RF.MEMBER]: [memberRecordId] } }
        ]);

        const eventRecord = await base(TABLE_IDS.EVENTS).find(eventId);
        const eventCode = eventRecord.get(FIELDS.EVENTS.EVENT_CODE);
        revalidatePath(`/events/${eventCode}`);
        
        return { success: true };
    } catch (error) {
        console.error('Guest RSVP submission error:', error);
        return { success: false, error: 'Failed to submit RSVP due to a database error.' };
    }
}
