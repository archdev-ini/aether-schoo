
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
    } = process.env;
    const AIRTABLE_MEMBERS_TABLE_ID = 'tblwPBMFhctPX82g4';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `LOWER({fld2EoTnv3wjIHhNX}) = "${email.toLowerCase()}"`,
            maxRecords: 1,
            fields: ['fldcoLSWA6ntjtlYV', 'fld7hoOSkHYaZrPr7', 'fldXyYp2g4R3z9K1j', 'fld7rO1pQZ9sY2tB4'] // fullName, aetherId, Password, Role
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'No account found with this email.' };
        }

        const record = records[0];
        const hashedPassword = record.get('fldXyYp2g4R3z9K1j') as string; // Password
        const recordedFullName = record.get('fldcoLSWA6ntjtlYV') as string; // fullName
        const recordedAetherId = record.get('fld7hoOSkHYaZrPr7') as string; // aetherId
        const role = record.get('fld7rO1pQZ9sY2tB4') as string; // Role

        if (!hashedPassword) {
            return { success: false, error: 'Authentication cannot be performed for this account. Please reset your password.' };
        }
        
        const passwordsMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordsMatch) {
            return { success: false, error: 'Invalid password. Please try again.' };
        }

        // If all checks pass, set auth cookie
        cookies().set('aether_user_id', recordedAetherId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
         cookies().set('aether_user_name', recordedFullName, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        cookies().set('aether_user_role', role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });


        return { success: true, data: { fullName: recordedFullName, aetherId: recordedAetherId, isAdmin } };

    } catch (error: any) {
        console.error('Airtable API error:', error);
        return { success: false, error: 'Failed to communicate with the database.' };
    }
}
