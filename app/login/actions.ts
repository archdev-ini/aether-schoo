
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { randomBytes } from 'crypto';
import { sendWelcomeEmail } from '@/lib/email';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export type LoginInput = z.infer<typeof LoginSchema>;


export async function sendLoginLink(input: LoginInput): Promise<{ success: boolean; error?: string }> {
    const parsedInput = LoginSchema.safeParse(input);

    if (!parsedInput.success) {
        return { success: false, error: 'Invalid email provided.' };
    }

    const { email } = parsedInput.data;

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.MEMBERS) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const membersTable = base(TABLE_IDS.MEMBERS);
    const F = FIELDS.MEMBERS;

    try {
        const records = await membersTable.select({
            filterByFormula: `LOWER({${F.EMAIL}}) = "${email.toLowerCase()}"`,
            maxRecords: 1,
        }).firstPage();

        if (records.length > 0) {
            const record = records[0];
            
            const token = randomBytes(32).toString('hex');
            
            await membersTable.update(record.id, {
                [F.LOGIN_TOKEN]: token,
                [F.LOGIN_TOKEN_EXPIRES]: 900,
            });
            
            await sendWelcomeEmail({
                to: email,
                name: record.get(F.FULL_NAME) as string,
                aetherId: record.get(F.AETHER_ID) as string,
                token: token,
                type: 'login'
            });
        }
        
        return { success: true };

    } catch (error: any) {
        console.error('Airtable API error:', error);
        return { success: false, error: 'Failed to process login request.' };
    }
}
