
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


const CreateEventSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  date: z.date({ required_error: "An event date is required." }),
  type: z.enum(['Workshop', 'AMA', 'Design Challenge', 'Community Call']),
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
    const AIRTABLE_EVENTS_TABLE_ID = 'tblv6PzXgqK8rL9yB';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_EVENTS_TABLE_ID) {
        return { message: 'Airtable credentials for events are not set.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

     try {
        const fields: Airtable.FieldSet = {
            'fldA4nB2cK3jL8xP1': title,
            'fldB5cK3jL8xP1nB2': date.toISOString(),
            'fldC6dK3jL8xP1nB3': type,
            'fldD7eK3jL8xP1nB4': false, // Default to Draft
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
