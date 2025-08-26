
'use server';

import Airtable from 'airtable';

export async function getSignupCount(): Promise<number> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_MEMBERS_TABLE_ID
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable credentials for members are not set in environment variables.');
        return 0;
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            view: 'Grid view' 
        }).all();
        
        return records.length;
    } catch (error) {
        console.error('Airtable API error:', error);
        return 0;
    }
}
