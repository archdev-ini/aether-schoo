
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { generateAetherId } from '@/lib/id-generator';
import { sendWelcomeEmail } from '@/lib/email';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';
import { randomBytes } from 'crypto';

// The schema is now defined in page.tsx for client-side validation.
// This file should only contain server-side actions.
import type { FormValues } from './page';


export async function submitJoinForm(data: FormValues): Promise<{ success: boolean; error?: string }> {

    // --- SERVER LOGIC DISABLED ---
    // The original logic is commented out to allow frontend development.
    // The form will now always return a success message.
    return { success: true };

    /*
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.MEMBERS || !process.env.AETHER_FOUNDER_KEY) {
        console.error('Airtable or Founder Key credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error. Please contact support.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const F = FIELDS.MEMBERS;
    
    try {
        const { email, fullName, username, location, workplace, focusArea, goals } = data;

        const existingRecords = await base(TABLE_IDS.MEMBERS).select({
            filterByFormula: `OR({${F.EMAIL}} = "${email}", {${F.USERNAME}} = "${username}")`,
            maxRecords: 1,
        }).firstPage();
        
        const token = randomBytes(32).toString('hex');
        const tokenFields = {
            [F.LOGIN_TOKEN]: token,
            [F.LOGIN_TOKEN_EXPIRES]: 900, // 15 minutes in seconds
        };

        if (existingRecords.length > 0) {
            const existing = existingRecords[0];
            if ((existing.get(F.EMAIL) as string).toLowerCase() === email.toLowerCase()) {
                await base(TABLE_IDS.MEMBERS).update(existing.id, tokenFields);
                await sendWelcomeEmail({
                    to: email,
                    name: existing.get(F.FULL_NAME) as string,
                    aetherId: existing.get(F.AETHER_ID) as string,
                    token: token,
                    type: 'welcome'
                });
                return { success: true };
            }
            if ((existing.get(F.USERNAME) as string).toLowerCase() === username.toLowerCase()) {
                return { success: false, error: 'This username is already taken.' };
            }
        }
        
        const { aetherId, entryNumber } = await generateAetherId(base, TABLE_IDS.MEMBERS, 'Member');

        const fields = {
            [F.FULL_NAME]: fullName,
            [F.USERNAME]: username,
            [F.EMAIL]: email,
            [F.LOCATION]: location,
            [F.WORKPLACE]: workplace,
            [F.ROLE]: focusArea,
            [F.INTERESTS]: goals,
            [F.AETHER_ID]: aetherId,
            [F.ENTRY_NUMBER]: entryNumber,
            [F.STATUS]: 'Prelaunch-Active',
            ...tokenFields
        };

        await base(TABLE_IDS.MEMBERS).create([{ fields }], { typecast: true });
        
        await sendWelcomeEmail({
            to: email,
            name: fullName,
            aetherId: aetherId,
            token: token,
            type: 'welcome'
        });


        return { success: true };

    } catch (error: any) {
        console.error('Airtable API submission error:', error);
        return { success: false, error: 'Failed to submit form to Airtable. Please try again later.' };
    }
    */
}
