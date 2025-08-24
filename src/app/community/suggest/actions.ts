
'use server';

import { z } from 'zod';
import Airtable from 'airtable';

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  fullName: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export async function submitSuggestion(data: FormValues) {
    const parsedData = FormSchema.safeParse(data);

    if (!parsedData.success) {
        return { success: false, error: 'Invalid form data.' };
    }
    
    const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_QUESTIONS_TABLE_ID } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_QUESTIONS_TABLE_ID) {
        console.error('Airtable credentials for suggestions are not set.');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        await base(AIRTABLE_QUESTIONS_TABLE_ID).create([
            {
                fields: {
                    'Submission Text': `${parsedData.data.title}: ${parsedData.data.description}`,
                    'Type': 'Suggestions',
                    'Context': 'Content Suggestion Form',
                    'Submitter Name': parsedData.data.fullName || 'Anonymous',
                }
            }
        ], { typecast: true });
        
        return { success: true };

    } catch(error) {
        console.error('Airtable suggestion submission error:', error);
        return { success: false, error: 'Failed to submit suggestion to our database.' };
    }
}
