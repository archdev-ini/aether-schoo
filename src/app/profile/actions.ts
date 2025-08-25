
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { cookies } from 'next/headers';

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
    const AIRTABLE_MEMBERS_TABLE_ID = 'tblwPBMFhctPX82g4';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `UPPER({fld7hoOSkHYaZrPr7}) = "${aetherId.toUpperCase()}"`,
            maxRecords: 1,
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Member not found.' };
        }

        const record = records[0];
        
        const profileData = {
            fullName: record.get('fldcoLSWA6ntjtlYV'), // fullName
            aetherId: record.get('fld7hoOSkHYaZrPr7'), // aetherId
            email: record.get('fld2EoTnv3wjIHhNX'), // Email
            role: record.get('fld7rO1pQZ9sY2tB4'), // Role
            location: record.get('fldP5VgkLoOGwFkb3'), // location
            interests: record.get('fldkpeV7NwNz0GJ7O'), // Interests
            mainInterest: record.get('mainInterest'), // This field doesn't seem to have a field ID in the provided schema
            reasonToJoin: record.get('reasonToJoin'), // This field doesn't seem to have a field ID in the provided schema
            entryNumber: record.get('fldmMy5vyIaoPMN3g'), // entryNumber
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

export async function logout() {
    cookies().delete('aether_user_id');
    cookies().delete('aether_user_name');
}
