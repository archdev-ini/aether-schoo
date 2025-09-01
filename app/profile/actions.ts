
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { cookies } from 'next/headers';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';
import { redirect } from 'next/navigation';

const MemberProfileSchema = z.object({
    fullName: z.string(),
    aetherId: z.string(),
    email: z.string().email(),
    role: z.string(),
    location: z.string(),
    mainInterest: z.string().optional(),
    interests: z.array(z.string()).optional(),
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
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.MEMBERS) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const F = FIELDS.MEMBERS;

    try {
        const records = await base(TABLE_IDS.MEMBERS).select({
            filterByFormula: `UPPER({${F.AETHER_ID}}) = "${aetherId.toUpperCase()}"`,
            maxRecords: 1,
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Member not found.' };
        }

        const record = records[0];
        
        const profileData = {
            fullName: record.get(F.FULL_NAME),
            aetherId: record.get(F.AETHER_ID),
            email: record.get(F.EMAIL),
            role: record.get(F.ROLE),
            location: record.get(F.LOCATION),
            interests: record.get(F.INTERESTS),
            entryNumber: record.get(F.ENTRY_NUMBER),
            // Legacy fields that might not exist on new signups
            mainInterest: record.get('mainInterest'), 
            reasonToJoin: record.get('reasonToJoin'),
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
