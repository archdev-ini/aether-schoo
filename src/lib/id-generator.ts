
import { createHash, randomBytes } from 'crypto';

/**
 * Generates a unique Aether ID for community members.
 * The ID is deterministic based on the member count and a founder key.
 *
 * @param base The Airtable base instance.
 * @param tableId The ID of the members table.
 * @returns An object containing the generated aetherId and entryNumber.
 */
async function generateCommunityId(base: any, tableId: string): Promise<{ aetherId: string; entryNumber: number }> {
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


/**
 * Generates a unique Team ID.
 * Format: ATM-[TEAMCODE]-[RANDOM4]
 * @param teamName The name of the team (e.g., "Staff", "Design").
 * @returns A randomly generated Team ID string.
 */
function generateTeamId(teamName: string): string {
    // Generate TEAMCODE: First 3 consonants, or first 3 letters if not enough consonants.
    const consonants = teamName.toUpperCase().replace(/[AEIOU]/g, '');
    let teamCode = consonants.substring(0, 3);
    if (teamCode.length < 3) {
        teamCode = teamName.toUpperCase().substring(0, 3);
    }

    // Generate Random Suffix: 4 random alphanumeric characters
    const randomSuffix = randomBytes(2).toString('hex').toUpperCase();

    return `ATM-${teamCode}-${randomSuffix}`;
}


/**
 * Generates a unique Aether ID and entry number for a new member.
 * Differentiates between community members and internal team members.
 *
 * @param base The Airtable base instance.
 * @param tableId The ID of the members table.
 * @param role The role of the new member.
 * @returns An object containing the generated aetherId and entryNumber.
 */
export async function generateAetherId(base: any, tableId: string, role: string): Promise<{ aetherId: string; entryNumber: number }> {
    
    // Check if the role is for an internal team member
    if (['Staff', 'Superadmin'].includes(role)) {
        // For team members, entry number is not sequential in the same way, can be set to 0 or another indicator
        const teamId = generateTeamId(role);
        const records = await base(tableId).select({ fields: [] }).all();
        const N = records.length + 1; // Still useful to have a unique entry number
        return {
            aetherId: teamId,
            entryNumber: N,
        };
    } else {
        // For community members, use the deterministic sequential generation
        return generateCommunityId(base, tableId);
    }
}
