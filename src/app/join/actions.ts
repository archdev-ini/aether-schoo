
'use server';

import { z } from 'zod';
import type { FormValues } from './page';
import { createHash } from 'crypto';

const Airtable = require('airtable');

const FormSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  location: z.string(),
  mainInterest: z.enum(['Courses', 'Studio', 'Community', 'Mentorship']),
});

async function generateAetherId(base: any, tableId: string): Promise<{ aetherId: string; entryNumber: number }> {
    const founderKey = parseInt(process.env.AETHER_FOUNDER_KEY || '731', 10);
    const modulus = 999983; // Large prime modulus

    // 1. Get the current count of records to determine N
    const records = await base(tableId).select({ fields: [] }).all();
    const N = records.length + 1;

    // 2. Calculate the CODE
    // Formula: CODE = BASE36(((N * K^3 + K * 97) mod M))
    const codeValue = (N * Math.pow(founderKey, 3) + founderKey * 97) % modulus;
    const code = codeValue.toString(36).toUpperCase();

    // 3. Calculate the CHECKSUM
    // First 2 characters of SHA1 hash of (N || K).
    const hashInput = `${N}${founderKey}`;
    const sha1Hash = createHash('sha1').update(hashInput).digest('hex');
    const checksum = sha1Hash.substring(0, 2).toUpperCase();

    // 4. Assemble the final ID
    return {
        aetherId: `AETH-${code}-${checksum}`,
        entryNumber: N
    };
}

export async function submitJoinForm(data: FormValues) {
    const parsedData = FormSchema.safeParse(data);

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
        return { success: false, error: 'Server configuration error. Please contact support.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const { aetherId: newAetherId, entryNumber } = await generateAetherId(base, AIRTABLE_MEMBERS_TABLE_ID);

        const fields = {
            'aetherId': newAetherId,
            'fullName': parsedData.data.fullName,
            'email': parsedData.data.email,
            'location': parsedData.data.location,
            'mainInterest': parsedData.data.mainInterest,
            'entryNumber': entryNumber, // Store the entry number
        };

        await base(AIRTABLE_MEMBERS_TABLE_ID).create([
            { fields },
        ], { typecast: true });
        return { success: true, aetherId: newAetherId };

    } catch (error: any) {
        console.error('Airtable API submission error:', error);
        const errorMessage = error.message
            ? `Airtable error: ${error.message}`
            : 'Failed to submit form to Airtable. Please try again later.';
            
        return { success: false, error: errorMessage };
    }
}
