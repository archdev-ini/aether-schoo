
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
    role: z.string().optional(),
    location: z.string(),
    interests: z.array(z.string()).optional(),
    entryNumber: z.number(),
    username: z.string().optional(),
    workplace: z.string().optional(),
    focusArea: z.string().optional(),
    goals: z.array(z.string()).optional(),
});

export type MemberProfile = z.infer<typeof MemberProfileSchema>;

export async function getMemberProfile(): Promise<{ success: boolean; data?: MemberProfile; error?: string }> {
    const aetherId = cookies().get('aether_user_id')?.value;
    if (!aetherId) {
        return { success: false, error: 'User is not logged in.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.MEMBERS) {
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
            username: record.get(F.USERNAME),
            location: record.get(F.LOCATION),
            workplace: record.get(F.WORKPLACE),
            role: record.get(F.ROLE),
            focusArea: record.get(F.ROLE), // Using ROLE as focusArea
            interests: record.get(F.INTERESTS),
            goals: record.get(F.INTERESTS), // Using INTERESTS as goals
            entryNumber: record.get(F.ENTRY_NUMBER),
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
