
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

export async function getMembers(): Promise<Member[]> {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_MEMBERS_TABLE_ID } = process.env;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
    console.error('Airtable credentials for members are not set.');
    return [];
  }

  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

  try {
    const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
      sort: [{ field: 'entryNumber', direction: 'desc' }],
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
