
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const AdminEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  type: z.string(),
  isPublished: z.boolean(),
  rsvpCount: z.number(), // This might need to be adjusted if there's no RSVP field
});

export type AdminEvent = z.infer<typeof AdminEventSchema>;

export async function getAdminEvents(): Promise<AdminEvent[]> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;
    const AIRTABLE_EVENTS_TABLE_ID = 'tbl5Dwc9n31gKW4eu';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_EVENTS_TABLE_ID) {
        console.error('Airtable credentials for events are not set.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const records = await base(AIRTABLE_EVENTS_TABLE_ID).select({
            sort: [{field: "fldZqEcg7wovGdynX", direction: "desc"}], // Date
        }).all();

        const events = records.map(record => ({
            id: record.id,
            title: record.get('fldsWDjmyzCEDVLq1') || 'Untitled Event', // Title
            date: record.get('fldZqEcg7wovGdynX'), // Date
            type: record.get('fldDkeL5skl6n3F9A') || 'General', // Type
            isPublished: record.get('fldQwNwXW5g9YWsVm') || false, // Published
            rsvpCount: 0, // Placeholder, as there's no RSVP count field in the new schema
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
});

export type CreateEventState = {
  errors?: {
    title?: string[];
    date?: string[];
    type?: string[];
    _form?: string[];
  };
  message?: string | null;
};


export async function createEvent(prevState: CreateEventState, formData: FormData): Promise<CreateEventState> {
    const validatedFields = CreateEventSchema.safeParse({
        title: formData.get('title'),
        date: new Date(formData.get('date') as string),
        type: formData.get('type'),
    });

     if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to create event. Please check the fields.',
        };
    }
    
    const { title, date, type } = validatedFields.data;

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;
    const AIRTABLE_EVENTS_TABLE_ID = 'tbl5Dwc9n31gKW4eu';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_EVENTS_TABLE_ID) {
        return { message: 'Airtable credentials for events are not set.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

     try {
        const fields: Airtable.FieldSet = {
            'fldsWDjmyzCEDVLq1': title, // Title
            'fldZqEcg7wovGdynX': date.toISOString(), // Date
            'fldDkeL5skl6n3F9A': type, // Type
            'fldQwNwXW5g9YWsVm': false, // Published, default to Draft
        };

        await base(AIRTABLE_EVENTS_TABLE_ID).create([
            { fields }
        ], { typecast: true });
    } catch(error) {
        console.error('Airtable create event error:', error);
        return { message: 'Database Error: Failed to create event.' };
    }

    revalidatePath('/admin/manage-events');
    redirect('/admin/manage-events');
}
