
'use server';

import { z } from 'zod';
import type { FormValues } from './page';

const Airtable = require('airtable');

const FormSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  location: z.string(),
  mainInterest: z.enum(['Courses', 'Studio', 'Community', 'Mentorship']),
});

function generateAetherId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = Array.from({ length: 2 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
  const randomNumber = Math.floor(Math.random() * 100).toString().padStart(2, '0');

  return `AETH-${randomLetters}${randomNumber}`;
}

export async function submitJoinForm(data: FormValues) {
    const parsedData = FormSchema.safeParse(data);

    if (!parsedData.success) {
        return { success: false, error: 'Invalid form data.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_MEMBERS_TABLE_ID
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error. Please contact support.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const newAetherId = generateAetherId();

    const fields = {
        'aetherId': newAetherId,
        'fullName': parsedData.data.fullName,
        'email': parsedData.data.email,
        'location': parsedData.data.location,
        'mainInterest': parsedData.data.mainInterest,
    };

    try {
        await base(AIRTABLE_MEMBERS_TABLE_ID).create([
            { fields },
        ], { typecast: true });
        return { success: true, aetherId: newAetherId };
    } catch (error: any) {
        console.error('Airtable API submission error:', error);
        const errorMessage = error.message
            ? `Airtable error: ${error.message}`
            : 'Failed to submit form to Airtable. Please try again later.';
            
        return { success: false, error: errorMessage };
    }
}
