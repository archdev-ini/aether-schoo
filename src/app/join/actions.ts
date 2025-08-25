
'use server';

import { z } from 'zod';
import type { FormValues } from './page';
import { createHash, randomBytes } from 'crypto';
import Airtable from 'airtable';
import { sendWelcomeEmail } from '@/lib/email';

const FormSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  location: z.string(),
  interests: z.array(z.string()),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
});

async function generateAetherId(base: Airtable.Base, tableId: string): Promise<{ aetherId: string; entryNumber: number }> {
    const founderKey = parseInt(process.env.AETHER_FOUNDER_KEY || '731', 10);
    const modulus = 999983; // Large prime modulus

    const records = await base(tableId).select({ fields: ['fldmMy5vyIaoPMN3g'] }).all();
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

export async function submitJoinForm(data: FormValues) {
    const parsedData = FormSchema.safeParse(data);

    if (!parsedData.success) {
        console.error('Form validation failed:', parsedData.error.flatten().fieldErrors);
        return { success: false, error: 'Invalid form data.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;
    const AIRTABLE_MEMBERS_TABLE_ID = 'tblwPBMFhctPX82g4';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID || !process.env.AETHER_FOUNDER_KEY) {
        console.error('Airtable or Founder Key credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error. Please contact support.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const { email, fullName, ...restOfData } = parsedData.data;

        const existingRecords = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `{Email} = "${email}"`,
            maxRecords: 1,
        }).firstPage();

        // Generate a secure token for the magic link
        const token = randomBytes(32).toString('hex');
        const tokenFields = {
            'loginToken': token,
            'loginTokenExpires': 900, // 15 minutes in seconds
        };

        if (existingRecords.length > 0) {
            // User exists, re-send welcome email with a new token
            const record = existingRecords[0];
            await base(AIRTABLE_MEMBERS_TABLE_ID).update(record.id, tokenFields);
            
            await sendWelcomeEmail({
                to: email,
                name: record.get('fldcoLSWA6ntjtlYV') as string,
                aetherId: record.get('fld7hoOSkHYaZrPr7') as string,
                token: token
            });
            // Return success to show the same message to the user, preventing email enumeration
            return { success: true };
        }


        const { aetherId: newAetherId, entryNumber } = await generateAetherId(base, AIRTABLE_MEMBERS_TABLE_ID);
        
        const fields = {
            'fld7hoOSkHYaZrPr7': newAetherId,
            'fld2EoTnv3wjIHhNX': email,
            'fldcoLSWA6ntjtlYV': fullName,
            'fldP5VgkLoOGwFkb3': restOfData.location,
            'fldkpeV7NwNz0GJ7O': restOfData.interests,
            'fldzxVhA5njMpVaH3': restOfData.portfolioUrl,
            'fldmMy5vyIaoPMN3g': entryNumber,
            'fld7rO1pQZ9sY2tB4': 'Member',
            'fldLzkrbVXuycummp': 'Prelaunch-Active',
            ...tokenFields
        };

        const createdRecords = await base(AIRTABLE_MEMBERS_TABLE_ID).create([
            { fields },
        ], { typecast: true });

        if (createdRecords.length === 0) {
            throw new Error("Failed to create record in Airtable.");
        }
        
        // The `loginTokenCreatedAt` field will be auto-populated by Airtable.

        // Send welcome email with magic link
        await sendWelcomeEmail({
            to: email,
            name: fullName,
            aetherId: newAetherId,
            token: token
        });

        return { success: true };

    } catch (error: any) {
        console.error('Airtable API submission error:', error);
        const errorMessage = error.message
            ? `Airtable error: ${error.message}`
            : 'Failed to submit form to Airtable. Please try again later.';
            
        return { success: false, error: errorMessage };
    }
}
