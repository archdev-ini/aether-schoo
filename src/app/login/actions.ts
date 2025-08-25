
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { randomBytes } from 'crypto';
import { sendWelcomeEmail } from '@/lib/email'; 

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export type LoginInput = z.infer<typeof LoginSchema>;


export async function loginUser(input: LoginInput): Promise<{ success: boolean; data?: { fullName: string, aetherId: string }; error?: string }> {
    const parsedInput = LoginSchema.safeParse(input);

    if (!parsedInput.success) {
        return { success: false, error: 'Invalid email provided.' };
    }

    const { email } = parsedInput.data;

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
        }).firstPage();

        // Security best practice: To prevent email enumeration, we don't reveal if an account exists.
        // We proceed with sending the email only if a record is found.
        if (records.length > 0) {
            const record = records[0];
            
            // Generate a new secure token for the magic link
            const token = randomBytes(32).toString('hex');
            
            await base(AIRTABLE_MEMBERS_TABLE_ID).update(record.id, {
                'loginToken': token,
                'loginTokenExpires': 900, // 15 minutes in seconds
            });
            
            // Airtable's "Created Time" field for loginTokenCreatedAt will auto-update if the field `loginToken` is updated.

            await sendWelcomeEmail({
                to: email,
                name: record.get('fldcoLSWA6ntjtlYV') as string,
                aetherId: record.get('fld7hoOSkHYaZrPr7') as string,
                token: token,
                type: 'login'
            });
        }
        
        // Always return success to prevent leaking information about which emails are registered.
        return { success: true };

    } catch (error: any) {
        console.error('Airtable API error:', error);
        return { success: false, error: 'Failed to process login request.' };
    }
}
