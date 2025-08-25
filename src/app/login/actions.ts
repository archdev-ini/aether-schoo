
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
});

export type LoginInput = z.infer<typeof LoginSchema>;


// This function re-generates an ID based on N and K to verify its authenticity.
function generateVerificationId(entryNumber: number, founderKey: number): string {
    const modulus = 999983;

    const codeValue = (entryNumber * Math.pow(founderKey, 3) + founderKey * 97) % modulus;
    const code = codeValue.toString(36).toUpperCase();

    const hashInput = `${entryNumber}${founderKey}`;
    const sha1Hash = createHash('sha1').update(hashInput).digest('hex');
    const checksum = sha1Hash.substring(0, 2).toUpperCase();

    return `AETH-${code}-${checksum}`;
}


export async function loginUser(input: LoginInput): Promise<{ success: boolean; data?: { fullName: string, aetherId: string, isAdmin: boolean }; error?: string }> {
    const parsedInput = LoginSchema.safeParse(input);

    if (!parsedInput.success) {
        return { success: false, error: 'Invalid data provided.' };
    }

    const { email, password } = parsedInput.data;

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_MEMBERS_TABLE_ID,
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `LOWER({Email}) = "${email.toLowerCase()}"`,
            maxRecords: 1,
            fields: ['fullName', 'entryNumber', 'aetherId', 'role'] 
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'No account found with this email.' };
        }

        const record = records[0];
        const entryNumber = record.get('entryNumber');
        const recordedFullName = record.get('fullName');
        const recordedAetherId = record.get('aetherId');

        // Check if the submitted ID matches the one in the database
        if (aetherId.toUpperCase() !== recordedAetherId.toUpperCase()) {
             return { success: false, error: 'The Aether ID does not match the name provided.' };
        }

        const isAdmin = recordedAetherId.toUpperCase().startsWith('ATM-');

        // Only verify community IDs, not admin/team IDs
        if (!isAdmin) {
             // If entryNumber is missing for some reason, we cannot verify authenticity.
            if (!entryNumber) {
                return { success: false, error: 'Cannot verify this ID. Please contact support.' };
            }
            
            // Re-generate the ID on the server to check its authenticity against tampering.
            const expectedId = generateVerificationId(entryNumber, founderKey);

            if (recordedAetherId.toUpperCase() !== expectedId) {
                // This indicates a forged or incorrect ID, even if the record was found.
                return { success: false, error: 'Verification failed. The provided ID is invalid.' };
            }
        }


        // Set cookies for server-side authentication
        cookies().set('aether_user_id', recordedAetherId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
        cookies().set('aether_user_name', recordedFullName, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });

        return { success: true, data: { fullName: recordedFullName, aetherId: recordedAetherId, isAdmin } };

    } catch (error: any) {
        console.error('Airtable API error:', error);
        return { success: false, error: 'Failed to communicate with the database.' };
    }
}
