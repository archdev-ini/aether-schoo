
'use server';

import { z } from 'zod';
import type { FormValues } from './page';
import Airtable from 'airtable';
import { sendWelcomeEmail } from '@/lib/email';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';


export async function submitJoinForm(data: FormValues): Promise<{ success: boolean; error?: string }> {

    const FormSchema = z.object({
        fullName: z.string(),
        username: z.string(),
        email: z.string().email(),
        location: z.string(),
        workplace: z.string().optional(),
        focusArea: z.string(),
        goals: z.array(z.string()),
    });

    const parsedData = FormSchema.safeParse(data);

    if (!parsedData.success) {
        console.error('Form validation failed:', parsedData.error.flatten().fieldErrors);
        return { success: false, error: 'Invalid form data.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;


    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.MEMBERS ) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error. Please contact support.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const { email, fullName, username, location, workplace, focusArea, goals } = parsedData.data;

        const existingRecords = await base(TABLE_IDS.MEMBERS).select({
            filterByFormula: `{${FIELDS.MEMBERS.EMAIL}} = "${email}"`,
            maxRecords: 1,
        }).firstPage();

        if (existingRecords.length > 0) {
            console.log(`Duplicate email prevented registration: ${email}`);
            return { success: true };
        }

        // The ID generation logic no longer creates the Aether ID. Airtable does.
        // We still need to count records to get an entry number if that logic is desired.
        // For now, we will let Airtable handle the ID entirely.
        
        const fields: Airtable.FieldSet = {
            [FIELDS.MEMBERS.FULL_NAME]: fullName,
            [FIELDS.MEMBERS.EMAIL]: email,
            [FIELDS.MEMBERS.USERNAME]: username,
            [FIELDS.MEMBERS.LOCATION]: location,
            [FIELDS.MEMBERS.WORKPLACE]: workplace || '',
            [FIELDS.MEMBERS.ROLE]: focusArea,
            [FIELDS.MEMBERS.INTERESTS]: goals,
            [FIELDS.MEMBERS.SIGNUP_STEP_COMPLETED]: 'Completed',
            [FIELDS.MEMBERS.OPT_IN_STATUS]: 'Pending',
        };

        await base(TABLE_IDS.MEMBERS).create([
            { fields },
        ], { typecast: true });

        // Email sending is disabled for prelaunch lead capture.

        return { success: true };

    } catch (error: any) {
        console.error('Airtable API submission error:', error);
        const errorMessage = error.message
            ? `Airtable error: ${error.message}`
            : 'Failed to submit form to Airtable. Please try again later.';
            
        return { success: false, error: errorMessage };
    }
}
