
'use server';

import { z } from 'zod';
import Airtable from 'airtable';

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
        AIRTABLE_MEMBERS_TABLE_ID,
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable member credentials are not set.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            sort: [{field: "Created time", direction: "desc"}],
        }).all();

        const members = records.map(record => ({
            id: record.id,
            fullName: record.get('fldcoLSWA6ntjtlYV') || 'N/A',
            email: record.get('fld2EoTnv3wjIHhNX') || 'N/A',
            aetherId: record.get('fld7hoOSkHYaZrPr7') || 'N/A',
            location: record.get('fldP5VgkLoOGwFkb3') || 'Unknown',
            status: record.get('fldLzkrbVXuycummp') || 'Unknown',
            createdTime: record.get('Created time'),
        }));
        
        return MemberSchema.array().parse(members);

    } catch (error) {
        console.error('Airtable API error fetching members:', error);
        return [];
    }
}
