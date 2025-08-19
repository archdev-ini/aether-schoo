
'use server';

import { z } from 'zod';
const Airtable = require('airtable');
import type { MemberProfile } from '../actions';


export const UpdateFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  location: z.string().min(3, { message: 'Please enter your city and country.' }),
  ageRange: z.string({ required_error: 'Please select your age range.' }),
  role: z.enum(['Student', 'Graduate', 'Professional']),
  mainInterest: z.enum(['Courses', 'Studio', 'Community', 'Mentorship']),
  reasonToJoin: z.string().optional(),
});

export type UpdateFormValues = z.infer<typeof UpdateFormSchema>;


export async function updateMemberProfile(aetherId: string, data: UpdateFormValues): Promise<{ success: boolean; error?: string }> {
    if (!aetherId) {
        return { success: false, error: 'Aether ID is required for updates.' };
    }

    const parsedData = UpdateFormSchema.safeParse(data);
    if (!parsedData.success) {
        return { success: false, error: 'Invalid form data.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_MEMBERS_TABLE_ID
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        return { success: false, error: 'Server configuration error.' };
    }
    
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `{aetherId} = "${aetherId}"`,
            maxRecords: 1
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Member not found.' };
        }

        const recordId = records[0].id;
        const { fullName, location, ageRange, role, mainInterest, reasonToJoin } = parsedData.data;

        const fieldsToUpdate = {
            'fullName': fullName,
            'location': location,
            'ageRange': ageRange,
            'role': role,
            'mainInterest': mainInterest,
            'reasonToJoin': reasonToJoin
        };

        await base(AIRTABLE_MEMBERS_TABLE_ID).update(recordId, fieldsToUpdate);

        return { success: true };

    } catch (error: any) {
        console.error('Airtable API error updating profile:', error);
        return { success: false, error: 'Failed to update profile.' };
    }
}
