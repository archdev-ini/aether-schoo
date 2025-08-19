
'use server';

import { z } from 'zod';
const Airtable = require('airtable');

const LoginSchema = z.object({
  aetherId: z.string().min(5, 'Please enter a valid Aether ID.'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export async function validateAetherId(input: LoginInput): Promise<{ success: boolean; data?: { fullName: string }; error?: string }> {
    const parsedInput = LoginSchema.safeParse(input);

    if (!parsedInput.success) {
        return { success: false, error: 'Invalid data provided.' };
    }

    const { aetherId } = parsedInput.data;

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_MEMBERS_TABLE_ID
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `UPPER({aetherId}) = "${aetherId.toUpperCase()}"`,
            maxRecords: 1,
            fields: ['fullName']
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Aether ID not found. Please verify your ID first.' };
        }

        const record = records[0];
        const fullName = record.get('fullName');
        
        return { success: true, data: { fullName } };

    } catch (error: any) {
        console.error('Airtable API error:', error);
        return { success: false, error: 'Failed to communicate with the database.' };
    }
}
