
'use server';

import { z } from 'zod';
const Airtable = require('airtable');

const MemberDetailsSchema = z.object({
  fullName: z.string(),
  aetherId: z.string(),
});

export type MemberDetails = z.infer<typeof MemberDetailsSchema>;

export async function findMemberById(aetherId: string): Promise<{ success: boolean; data?: MemberDetails; error?: string }> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_MEMBERS_TABLE_ID
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error.' };
    }

    if (!aetherId || typeof aetherId !== 'string') {
        return { success: false, error: 'Invalid Aether ID provided.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            // Find the record where the Aether ID field matches the input
            filterByFormula: `({aetherId} = "${aetherId}")`,
            maxRecords: 1,
            fields: ['fullName', 'aetherId'] // Fetch only the fields we need
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Member not found.' };
        }

        const record = records[0];
        const memberDetails = {
            fullName: record.get('fullName'),
            aetherId: record.get('aetherId'),
        };

        const parsedData = MemberDetailsSchema.safeParse(memberDetails);

        if (!parsedData.success) {
            console.error('Mismatched data structure from Airtable:', parsedData.error);
            return { success: false, error: 'Could not retrieve member details.' };
        }

        return { success: true, data: parsedData.data };

    } catch (error: any) {
        console.error('Airtable API error:', error);
        return { success: false, error: 'Failed to communicate with the database.' };
    }
}
