
import { createHash } from 'crypto';

/**
 * Generates a unique Aether ID and entry number for a new member.
 * The ID is deterministic based on the member count and a founder key.
 *
 * @param base The Airtable base instance.
 * @param tableId The ID of the members table.
 * @param role The role of the new member.
 * @returns An object containing the generated aetherId and entryNumber.
 */
export async function generateAetherId(base: any, tableId: string, role: string): Promise<{ aetherId: string; entryNumber: number }> {
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
    const prefix = ['Staff', 'Superadmin'].includes(role) ? 'A-TEAM' : 'AETH';

    return {
        aetherId: `${prefix}-${code}-${checksum}`,
        entryNumber: N
    };
}
