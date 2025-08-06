
'use server';

import { z } from 'zod';
import type { FormValues } from './page';

const Airtable = require('airtable');

const FormSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  ageRange: z.string(),
  location: z.string(),
  role: z.enum(['Student', 'Graduate', 'Professional']),
  mainInterest: z.enum(['Courses', 'Studio', 'Community', 'Mentorship']),
  preferredPlatform: z.enum(['Discord', 'WhatsApp', 'Telegram']),
  socialHandle: z.string().optional(),
  reason: z.string(),
  referralCode: z.string().optional(),
});

function generateAetherId(fullName: string) {
  const initials = fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  const timestamp = Date.now().toString();
  const lastTwoDigits = timestamp.substring(timestamp.length - 2);
  
  const randomDigit = Math.floor(Math.random() * 10);

  return `AETH-${initials}${lastTwoDigits}${randomDigit}`;
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
    const newAetherId = generateAetherId(parsedData.data.fullName);

    // Using Field IDs for a more robust integration.
    const fields = {
        'fld7hoOSkHYaZrPr7': newAetherId,
        'fldcoLSWA6ntjtlYV': parsedData.data.fullName,
        'fld2EoTnv3wjIHhNX': parsedData.data.email,
        'flddZjhBPq5z7Gtir': parsedData.data.ageRange,
        'fldP5VgkLoOGwFkb3': parsedData.data.location,
        'fldjnwoJZkpsRvtEN': parsedData.data.role,
        'fldBZageF70cMVzMQ': parsedData.data.mainInterest,
        'fldq6gxxBsjMWJCM4': parsedData.data.preferredPlatform,
        'fldbUPQ54FwaYZ5Qx': parsedData.data.socialHandle,
        'flda3C3jBfgZ4aikj': parsedData.data.reason,
        'fldmMy5vyIaoPMN3g': parsedData.data.referralCode,
    };

    try {
        await base(AIRTABLE_MEMBERS_TABLE_ID).create([
            { fields },
        ], { typecast: true }); // Using typecast to handle single select fields gracefully
        return { success: true, aetherId: newAetherId };
    } catch (error: any) {
        console.error('Airtable API submission error:', error);
        // Provide a more specific error message if Airtable returns one
        const errorMessage = error.message
            ? `Airtable error: ${error.message}`
            : 'Failed to submit form to Airtable. Please try again later.';
            
        return { success: false, error: errorMessage };
    }
}
