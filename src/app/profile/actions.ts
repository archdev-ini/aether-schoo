
'use server';

import { z } from 'zod';
const Airtable = require('airtable');

const MemberProfileSchema = z.object({
    fullName: z.string(),
    aetherId: z.string(),
    email: z.string().email(),
    role: z.string(),
    location: z.string(),
    mainInterest: z.string(),
    reasonToJoin: z.string().optional(),
    entryNumber: z.number(),
});

export type MemberProfile = z.infer<typeof MemberProfileSchema>;

export async function getMemberProfile(aetherId: string): Promise<{ success: boolean; data?: MemberProfile; error?: string }> {
    if (!aetherId) {
        return { success: false, error: 'Aether ID is required.' };
    }

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
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Member not found.' };
        }

        const record = records[0];
        
        const profileData = {
            fullName: record.get('fullName'),
            aetherId: record.get('aetherId'),
            email: record.get('email'),
            role: record.get('role'),
            location: record.get('location'),
            mainInterest: record.get('mainInterest'),
            reasonToJoin: record.get('reasonToJoin'),
            entryNumber: record.get('entryNumber'),
        };

        const parsedData = MemberProfileSchema.safeParse(profileData);
        if (!parsedData.success) {
            console.error("Airtable data parsing error:", parsedData.error);
            return { success: false, error: 'Failed to parse member data.' };
        }

        return { success: true, data: parsedData.data };

    } catch (error: any) {
        console.error('Airtable API error fetching profile:', error);
        return { success: false, error: 'Failed to communicate with the database.' };
    }
}
