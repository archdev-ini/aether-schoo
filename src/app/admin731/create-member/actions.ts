
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { generateAetherId } from '@/lib/id-generator';

export const NewMemberSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
  role: z.enum(['Student', 'Graduate', 'Professional', 'Staff', 'Superadmin']),
  location: z.string().optional(),
});

export type NewMemberFormValues = z.infer<typeof NewMemberSchema>;

export async function generateIdForNewMember(data: NewMemberFormValues): Promise<{ success: boolean; data?: { fullName: string, aetherId: string }; error?: string }> {
    const parsedData = NewMemberSchema.safeParse(data);

    if (!parsedData.success) {
        return { success: false, error: 'Invalid form data.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_MEMBERS_TABLE_ID
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID || !process.env.AETHER_FOUNDER_KEY) {
        console.error('Airtable or Founder Key credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const { aetherId, entryNumber } = await generateAetherId(base, AIRTABLE_MEMBERS_TABLE_ID, parsedData.data.role);

        const fields = {
            'fullName': parsedData.data.fullName,
            'email': parsedData.data.email,
            'role': parsedData.data.role,
            'location': parsedData.data.location || '',
            'aetherId': aetherId,
            'entryNumber': entryNumber,
            'status': 'Active', // New members start as Active
        };

        await base(AIRTABLE_MEMBERS_TABLE_ID).create([{ fields }], { typecast: true });

        return { success: true, data: { fullName: parsedData.data.fullName, aetherId } };

    } catch (error: any) {
        console.error('Airtable API error during manual creation:', error);
        return { success: false, error: 'Failed to create member in Airtable.' };
    }
}
