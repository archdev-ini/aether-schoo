
'use server';

import { z } from 'zod';
const Airtable = require('airtable');

const VerifyMemberSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name.'),
  aetherId: z.string().min(5, 'Please enter a valid Aether ID.'),
});

export type VerifyMemberInput = z.infer<typeof VerifyMemberSchema>;

export async function verifyMember(input: VerifyMemberInput): Promise<{ success: boolean; data?: { fullName: string }; error?: string }> {
    const parsedInput = VerifyMemberSchema.safeParse(input);

    if (!parsedInput.success) {
        return { success: false, error: 'Invalid data provided.' };
    }

    const { fullName, aetherId } = parsedInput.data;

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
            // Find the record where BOTH the Aether ID and Full Name match.
            filterByFormula: `AND({aetherId} = "${aetherId.toUpperCase()}", {fullName} = "${fullName}")`,
            maxRecords: 1,
            fields: ['fullName'] // We only need to confirm the name exists.
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Member not found. Please check your details and try again.' };
        }

        const record = records[0];
        const memberDetails = {
            fullName: record.get('fullName'),
        };

        return { success: true, data: memberDetails };

    } catch (error: any) {
        console.error('Airtable API error:', error);
        return { success: false, error: 'Failed to communicate with the database.' };
    }
}
