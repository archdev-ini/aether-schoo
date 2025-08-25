
'use server';

import { z } from 'zod';
import type { FormValues } from './page';
import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';

const Airtable = require('airtable');

const FormSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string(),
  location: z.string(),
  interests: z.array(z.string()),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
});

async function generateAetherId(base: any, tableId: string): Promise<{ aetherId: string; entryNumber: number }> {
    const founderKey = parseInt(process.env.AETHER_FOUNDER_KEY || '731', 10);
    const modulus = 999983; // Large prime modulus

    const records = await base(tableId).select({ fields: [] }).all();
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
        const { email, password, ...restOfData } = parsedData.data;

        // Check if email already exists
        const existingRecords = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `{fld2EoTnv3wjIHhNX} = "${email}"`,
            maxRecords: 1,
        }).firstPage();

        if (existingRecords.length > 0) {
            return { success: false, error: 'An account with this email already exists.' };
        }

        const { aetherId: newAetherId, entryNumber } = await generateAetherId(base, AIRTABLE_MEMBERS_TABLE_ID);
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const fields = {
            'fld7hoOSkHYaZrPr7': newAetherId,
            'fld2EoTnv3wjIHhNX': email,
            'fldXyYp2g4R3z9K1j': hashedPassword,
            'fldcoLSWA6ntjtlYV': restOfData.fullName,
            'fldP5VgkLoOGwFkb3': restOfData.location,
            'fldkpeV7NwNz0GJ7O': restOfData.interests,
            'fld7vKqZ1wX9jL8mO': restOfData.avatarUrl,
            'fldzxVhA5njMpVaH3': restOfData.portfolioUrl,
            'fldmMy5vyIaoPMN3g': entryNumber,
            'fld7rO1pQZ9sY2tB4': 'Member',
            'fldLzkrbVXuycummp': 'Prelaunch-Active'
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
