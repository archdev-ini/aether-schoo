
'use server';

import Airtable from 'airtable';
import { TABLE_IDS } from '@/lib/airtable-schema';

export async function getSignupCount(): Promise<number> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.TABLE_1) {
        console.error('Airtable credentials for Table 1 are not set in environment variables.');
        return 0;
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const records = await base(TABLE_IDS.TABLE_1).select({
            view: 'Grid view' 
        }).all();
        
        return records.length;
    } catch (error) {
        console.error('Airtable API error:', error);
        return 0;
    }
}
