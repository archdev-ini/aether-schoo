
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import type { FormValues } from './page';

const FormSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  telegramHandle: z.string().optional(),
  existingAetherId: z.string().optional(),
  team: z.string(),
  teamRole: z.string(),
  secretPassphrase: z.string(),
  supervisor: z.string(),
});

export async function submitTeamRequest(data: FormValues) {
    const parsedData = FormSchema.safeParse(data);

    if (!parsedData.success) {
        console.error('Form validation failed:', parsedData.error.flatten().fieldErrors);
        return { success: false, error: 'Invalid form data.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_TEAM_REQUESTS_TABLE_ID // Assumes a new table for these requests
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TEAM_REQUESTS_TABLE_ID) {
        console.error('Airtable credentials for team requests are not set.');
        return { success: false, error: 'Server configuration error. Please contact support.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const { 
            fullName, email, telegramHandle, existingAetherId, team, 
            teamRole, secretPassphrase, supervisor 
        } = parsedData.data;

        // Note: We are not hashing the passphrase here.
        // In a production system, this should be hashed before storage.
        const fields = {
            'Full Name': fullName,
            'Email': email,
            'Telegram Handle': telegramHandle,
            'Existing Aether ID': existingAetherId,
            'Team': team,
            'Team Role': teamRole,
            'Secret Passphrase': secretPassphrase,
            'Supervisor': supervisor,
            'Status': 'Pending', // Default status for a new request
        };

        await base(AIRTABLE_TEAM_REQUESTS_TABLE_ID).create([
            { fields },
        ], { typecast: true });

        // In a real app, you might also trigger an email notification to the supervisor.

        return { success: true };

    } catch (error: any) {
        console.error('Airtable API submission error:', error);
        return { success: false, error: 'Failed to submit request to our database.' };
    }
}
