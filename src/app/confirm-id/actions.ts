
'use server';

import { z } from 'zod';
import { createHash } from 'crypto';
const Airtable = require('airtable');

const VerifyMemberSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name.'),
  aetherId: z.string().min(5, 'Please enter a valid Aether ID.'),
});

export type VerifyMemberInput = z.infer<typeof VerifyMemberSchema>;

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

export async function verifyMember(input: VerifyMemberInput): Promise<{ success: boolean; data?: { fullName: string }; error?: string }> {
    const parsedInput = VerifyMemberSchema.safeParse(input);

    if (!parsedInput.success) {
        return { success: false, error: 'Invalid data provided.' };
    }

    const { fullName, aetherId } = parsedInput.data;

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_MEMBERS_TABLE_ID,
        AETHER_FOUNDER_KEY
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID || !AETHER_FOUNDER_KEY) {
        console.error('Airtable or Founder Key credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const founderKey = parseInt(AETHER_FOUNDER_KEY, 10);

    try {
        // Find the record by full name and the submitted Aether ID to prevent enumeration.
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `AND(UPPER({aetherId}) = "${aetherId.toUpperCase()}", {fullName} = "${fullName}")`,
            maxRecords: 1,
            fields: ['fullName', 'entryNumber'] // Fetch the entryNumber
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Member not found. Please check your details and try again.' };
        }

        const record = records[0];
        const entryNumber = record.get('entryNumber');
        const recordedFullName = record.get('fullName');

        // If entryNumber is missing for some reason, we cannot verify.
        if (!entryNumber) {
            return { success: false, error: 'Cannot verify this ID. Please contact support.' };
        }
        
        // Re-generate the ID on the server to check its authenticity.
        const expectedId = generateVerificationId(entryNumber, founderKey);

        if (aetherId.toUpperCase() !== expectedId) {
            // This indicates a forged or incorrect ID, even if the record was found.
            return { success: false, error: 'Verification failed. The provided ID is invalid.' };
        }

        // If the re-generated ID matches the submitted one, the user is authentic.
        return { success: true, data: { fullName: recordedFullName } };

    } catch (error: any) {
        console.error('Airtable API error:', error);
        return { success: false, error: 'Failed to communicate with the database.' };
    }
}
