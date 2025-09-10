
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { generateAetherId } from '@/lib/id-generator';
import { sendWelcomeEmail } from '@/lib/email';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';


export const FormSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  username: z.string().min(3, 'Username must be at least 3 characters.').regex(/^[a-z0-9_.]+$/, 'Use lowercase letters, numbers, periods, or underscores.'),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  // portfolioUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

export type FormValues = z.infer<typeof FormSchema>;


export async function submitJoinForm(data: FormValues) {
    const parsedData = FormSchema.safeParse(data);

    if (!parsedData.success) {
        console.error('Form validation failed:', parsedData.error.flatten().fieldErrors);
        return { success: false, error: 'Invalid form data.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.MEMBERS || !process.env.AETHER_FOUNDER_KEY) {
        console.error('Airtable or Founder Key credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error. Please contact support.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const F = FIELDS.MEMBERS;
    
    try {
        const { email, fullName, username } = parsedData.data;

        const existingRecords = await base(TABLE_IDS.MEMBERS).select({
            filterByFormula: `OR({${F.EMAIL}} = "${email}", {${F.USERNAME}} = "${username}")`,
            maxRecords: 1,
        }).firstPage();

        if (existingRecords.length > 0) {
            const existing = existingRecords[0];
            if ((existing.get(F.EMAIL) as string).toLowerCase() === email.toLowerCase()) {
                return { success: false, error: 'An account with this email already exists.' };
            }
            if ((existing.get(F.USERNAME) as string).toLowerCase() === username.toLowerCase()) {
                return { success: false, error: 'This username is already taken.' };
            }
        }

        const token = "placeholder_token_for_now"; // We will implement token generation later

        // TODO: This is a placeholder. Full implementation will be done in a subsequent step.
        console.log("Submitting data to Airtable:", parsedData.data);


        return { success: true };

    } catch (error: any) {
        console.error('Airtable API submission error:', error);
        return { success: false, error: 'Failed to submit form to Airtable. Please try again later.' };
    }
}
