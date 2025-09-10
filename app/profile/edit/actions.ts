
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';

export const UpdateFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  username: z.string().min(3, 'Username must be at least 3 characters.').regex(/^[a-z0-9_.]+$/, 'Use lowercase letters, numbers, periods, or underscores.'),
  location: z.string().min(3, { message: 'Please enter your city and country.' }),
  workplace: z.string().optional(),
  focusArea: z.string({ required_error: 'Please select your area of focus.' }),
  goals: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one goal.',
  }),
});

export type UpdateFormValues = z.infer<typeof UpdateFormSchema>;

export async function updateMemberProfile(data: UpdateFormValues): Promise<{ success: boolean; error?: string }> {
    
    // --- SERVER LOGIC DISABLED FOR FRONTEND TESTING ---
    return { success: true };
    
    /*
    const aetherId = cookies().get('aether_user_id')?.value;
    if (!aetherId) {
        return { success: false, error: 'User is not logged in.' };
    }

    const parsedData = UpdateFormSchema.safeParse(data);
    if (!parsedData.success) {
        return { success: false, error: 'Invalid form data.' };
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
            maxRecords: 1
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Member not found.' };
        }

        const recordId = records[0].id;
        const { fullName, username, location, workplace, focusArea, goals } = parsedData.data;

        const fieldsToUpdate = {
            [F.FULL_NAME]: fullName,
            [F.USERNAME]: username,
            [F.LOCATION]: location,
            [F.WORKPLACE]: workplace,
            [F.ROLE]: focusArea,
            [F.INTERESTS]: goals,
        };

        await base(TABLE_IDS.MEMBERS).update(recordId, fieldsToUpdate);
        
        // Update the user's name in the cookie as well
        cookies().set('aether_user_name', fullName, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });

        revalidatePath('/profile');
        revalidatePath('/profile/edit');

        return { success: true };

    } catch (error: any) {
        console.error('Airtable API error updating profile:', error);
        return { success: false, error: 'Failed to update profile.' };
    }
    */
}

