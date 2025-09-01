
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';

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

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.EVENTS) {
        console.error('Airtable credentials for events are not set.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const F = FIELDS.EVENTS;
    
    try {
        const records = await base(TABLE_IDS.EVENTS).select({
            sort: [{field: F.DATE, direction: "desc"}],
        }).all();

        const events = records.map(record => ({
            id: record.id,
            title: record.get(F.TITLE) as string || 'Untitled Event',
            date: record.get(F.DATE) as string,
            type: record.get(F.TYPE) as string || 'General',
            isPublished: record.get(F.IS_PUBLISHED) === 'Published',
            rsvpCount: record.get(F.RSVP_COUNT) as number || 0,
        }));
        
        return AdminEventSchema.array().parse(events);

    } catch (error) {
        console.error('Airtable API error fetching admin events:', error);
        return [];
    }
}


const CreateEventSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  date: z.date({ required_error: "An event date is required." }),
  type: z.enum(['Workshop', 'Horizon Studio', 'Webinar']),
  eventCode: z.string().min(3, { message: 'Event code must be at least 3 characters.' }).regex(/^[A-Z0-9-]+$/, { message: 'Use uppercase letters, numbers, and hyphens only.' }),
});

export type CreateEventState = {
  errors?: {
    title?: string[];
    date?: string[];
    type?: string[];
    eventCode?: string[];
    _form?: string[];
  };
  message?: string | null;
};


export async function createEvent(prevState: CreateEventState, formData: FormData): Promise<CreateEventState> {
    const validatedFields = CreateEventSchema.safeParse({
        title: formData.get('title'),
        date: new Date(formData.get('date') as string),
        type: formData.get('type'),
        eventCode: formData.get('eventCode'),
    });

     if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to create event. Please check the fields.',
        };
    }
    
    const { title, date, type, eventCode } = validatedFields.data;

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.EVENTS) {
        return { message: 'Airtable credentials for events are not set.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const F = FIELDS.EVENTS;

     try {
        const fields: Airtable.FieldSet = {
            [F.TITLE]: title,
            [F.DATE]: date.toISOString(),
            [F.TYPE]: type,
            [F.EVENT_CODE]: eventCode,
            [F.IS_PUBLISHED]: 'Draft', // Default to Draft
        };

        await base(TABLE_IDS.EVENTS).create([
            { fields }
        ], { typecast: true });
    } catch(error) {
        console.error('Airtable create event error:', error);
        return { message: 'Database Error: Failed to create event.' };
    }

    revalidatePath('/admin/manage-events');
    redirect('/admin/manage-events');
}
