

import { createHash, randomBytes } from 'crypto';

/**
 * Counts the number of existing records to determine the entry number for a new member.
 *
 * @param base The Airtable base instance.
 * @param tableId The ID of the members table.
 * @returns The entry number for the new member.
 */
async function getEntryNumber(base: any, tableId: string): Promise<number> {
    const records = await base(tableId).select({ fields: [] }).all();
    return records.length + 1;
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
 * This function is now simplified as Airtable handles the primary ID generation.
 *
 * @param base The Airtable base instance.
 * @param tableId The ID of the members table.
 * @param role The role of the new member.
 * @returns An object containing the generated aetherId (if applicable) and entryNumber.
 */
export async function generateAetherId(base: any, tableId: string, role: string): Promise<{ aetherId?: string; entryNumber: number }> {
    
    // The entry number is still useful to know, so we'll get that.
    const entryNumber = await getEntryNumber(base, tableId);

    // For regular members, Airtable generates the ID, so we don't return one.
    // For special roles, we might still generate a specific format if needed.
    if (['Staff', 'Superadmin'].includes(role)) {
        const teamId = generateTeamId(role);
        return {
            aetherId: teamId,
            entryNumber: entryNumber,
        };
    } else {
        // Airtable will auto-generate the ID for standard members.
        return {
            entryNumber: entryNumber,
        };
    }
}
