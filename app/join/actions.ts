
'use server';

import { z } from 'zod';
import type { FormValues } from './page';
import { createHash, randomBytes } from 'crypto';
import Airtable from 'airtable';
import { sendWelcomeEmail } from '@/lib/email';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';

const FormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('A valid email is required.'),
  location: z.string().min(3, 'Location is required.'),
  workplace: z.string().optional(),
  role: z.string({ required_error: 'Please select a role.' }),
  interests: z.array(z.string()).refine(val => val.length > 0, 'Select at least one interest.'),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
});

export async function generateAetherIdForUser(): Promise<{ aetherId: string; entryNumber: number }> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;

     if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.MEMBERS || !process.env.AETHER_FOUNDER_KEY) {
        console.error('Airtable or Founder Key credentials are not set for ID generation.');
        throw new Error('Server configuration error for ID generation.');
    }
    
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    const founderKey = parseInt(process.env.AETHER_FOUNDER_KEY, 10);
    const modulus = 999983; // Large prime modulus

    const records = await base(TABLE_IDS.MEMBERS).select({ fields: [FIELDS.MEMBERS.ENTRY_NUMBER] }).all();
    const N = records.length + 1;

    const codeValue = (N * Math.pow(founderKey, 3) + founderKey * 97) % modulus;
    const code = codeValue.toString(36).toUpperCase();

    const hashInput = `${N}${founderKey}`;
    const sha1Hash = createHash('sha1').update(hashInput).digest('hex');
    const checksum = sha1Hash.substring(0, 2).toUpperCase();

    return {
        aetherId: `AETH-${code}-${checksum}`,
        entryNumber: N
    };
}


export async function submitJoinForm(data: FormValues, aetherId: string, entryNumber: number) {
    const parsedData = FormSchema.safeParse(data);

    if (!parsedData.success) {
        console.error('Form validation failed:', parsedData.error.flatten().fieldErrors);
        return { success: false, error: 'Invalid form data.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.MEMBERS) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error. Please contact support.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const membersTable = base(TABLE_IDS.MEMBERS);
    const F = FIELDS.MEMBERS;

    try {
        const { email, fullName, ...restOfData } = parsedData.data;

        const existingRecords = await membersTable.select({
            filterByFormula: `{${F.EMAIL}} = "${email}"`,
            maxRecords: 1,
        }).firstPage();

        const token = randomBytes(32).toString('hex');
        const tokenFields = {
            [F.LOGIN_TOKEN]: token,
            [F.LOGIN_TOKEN_EXPIRES]: 900, // 15 minutes in seconds
        };

        if (existingRecords.length > 0) {
            const record = existingRecords[0];
            await membersTable.update(record.id, tokenFields);
            
            await sendWelcomeEmail({
                to: email,
                name: record.get(F.FULL_NAME) as string,
                aetherId: record.get(F.AETHER_ID) as string,
                token: token,
                type: 'welcome'
            });
            return { success: true, aetherId: record.get(F.AETHER_ID) as string, fullName: record.get(F.FULL_NAME) as string };
        }

        const fields = {
            [F.AETHER_ID]: aetherId,
            [F.EMAIL]: email,
            [F.FULL_NAME]: fullName,
            [F.USERNAME]: restOfData.username,
            [F.LOCATION]: restOfData.location,
            [F.WORKPLACE]: restOfData.workplace,
            [F.ROLE]: restOfData.role,
            [F.INTERESTS]: restOfData.interests,
            [F.PORTFOLIO_URL]: restOfData.portfolioUrl,
            [F.ENTRY_NUMBER]: entryNumber,
            [F.STATUS]: 'Prelaunch-Active',
            ...tokenFields
        };

        await membersTable.create([
            { fields },
        ], { typecast: true });

        await sendWelcomeEmail({
            to: email,
            name: fullName,
            aetherId: aetherId,
            token: token,
            type: 'welcome'
        });

        return { success: true, aetherId, fullName };

    } catch (error: any) {
        console.error('Airtable API submission error:', error);
        const errorMessage = error.message
            ? `Airtable error: ${error.message}`
            : 'Failed to submit form to Airtable. Please try again later.';
            
        return { success: false, error: errorMessage };
    }
}
