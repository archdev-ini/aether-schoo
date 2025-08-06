
'use server';

import { z } from 'zod';
const Airtable = require('airtable');

const UserLocationSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  location: z.string(),
  mainInterest: z.string(),
});

export type UserLocation = z.infer<typeof UserLocationSchema>;

export async function getUserLocations(): Promise<UserLocation[]> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_TABLE_NAME
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
        console.error('Airtable credentials are not set in environment variables.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const records = await base(AIRTABLE_TABLE_NAME).select({
            // Selecting fields to speed up the query
            fields: ['Full Name', 'City + Country', 'Main Interest'],
            // Add any sorting or filtering if needed
            // sort: [{field: "Created Time", direction: "desc"}],
        }).all();

        const locations = records.map(record => {
            return {
                id: record.id,
                fullName: record.get('Full Name') || 'An Aether Member',
                location: record.get('City + Country') || 'Parts Unknown',
                mainInterest: record.get('Main Interest') || 'Exploring',
            };
        });

        return UserLocationSchema.array().parse(locations);

    } catch (error) {
        console.error('Airtable API error:', error);
        return [];
    }
}
