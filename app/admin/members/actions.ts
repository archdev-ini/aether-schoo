
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';

const MemberSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  aetherId: z.string(),
  location: z.string(),
  status: z.string(),
  createdTime: z.string(),
});

export type Member = z.infer<typeof MemberSchema>;

export async function getMembers(): Promise<Member[]> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.MEMBERS) {
        console.error('Airtable member credentials are not set.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const F = FIELDS.MEMBERS;
    
    try {
        const records = await base(TABLE_IDS.MEMBERS).select({
            sort: [{field: F.CREATED_TIME, direction: "desc"}],
        }).all();

        const members = records.map(record => ({
            id: record.id,
            fullName: record.get(F.FULL_NAME) || 'N/A',
            email: record.get(F.EMAIL) || 'N/A',
            aetherId: record.get(F.AETHER_ID) || 'N/A',
            location: record.get(F.LOCATION) || 'Unknown',
            status: record.get(F.STATUS) || 'Unknown',
            createdTime: record.get(F.CREATED_TIME),
        }));
        
        return MemberSchema.array().parse(members);

    } catch (error) {
        console.error('Airtable API error fetching members:', error);
        return [];
    }
}
