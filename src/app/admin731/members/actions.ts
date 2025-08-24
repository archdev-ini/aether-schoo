
'use server';

import { z } from 'zod';
import Airtable from 'airtable';

const MemberSchema = z.object({
  id: z.string(),
  aetherId: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  location: z.string(),
  role: z.string(),
  mainInterest: z.string(),
  preferredPlatform: z.string(),
  entryNumber: z.number(),
});

export type Member = z.infer<typeof MemberSchema>;

interface GetMembersOptions {
    search?: string;
    role?: string;
    interest?: string;
    platform?: string;
}

export async function getMembers(options: GetMembersOptions = {}): Promise<Member[]> {
  const { search, role, interest, platform } = options;
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_MEMBERS_TABLE_ID } = process.env;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
    console.error('Airtable credentials for members are not set.');
    return [];
  }

  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

  let filterParts: string[] = [];

  if (search) {
      const lowerSearch = search.toLowerCase();
      // Search by name, email, or aetherId
      filterParts.push(`OR(
          FIND("${lowerSearch}", LOWER({fullName})),
          FIND("${lowerSearch}", LOWER({email})),
          FIND(UPPER("${search}"), UPPER({aetherId}))
      )`);
  }
  if (role && role !== 'all') {
      filterParts.push(`{role} = "${role}"`);
  }
  if (interest && interest !== 'all') {
      filterParts.push(`{mainInterest} = "${interest}"`);
  }
  if (platform && platform !== 'all') {
      filterParts.push(`{preferredPlatform} = "${platform}"`);
  }

  const filterByFormula = filterParts.length > 0 ? `AND(${filterParts.join(', ')})` : '';

  try {
    const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
      sort: [{ field: 'entryNumber', direction: 'desc' }],
      filterByFormula,
    }).all();

    const members = records.map(record => ({
      id: record.id,
      aetherId: record.get('aetherId') || 'N/A',
      fullName: record.get('fullName') || 'No Name',
      email: record.get('email') || 'No Email',
      location: record.get('location') || 'Unknown',
      role: record.get('role') || 'Unspecified',
      mainInterest: record.get('mainInterest') || 'Unspecified',
      preferredPlatform: record.get('preferredPlatform') || 'Unspecified',
      entryNumber: record.get('entryNumber') || 0,
    }));

    return MemberSchema.array().parse(members);
  } catch (error) {
    console.error('Airtable getMembers error:', error);
    return [];
  }
}
