
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

    // Ensure your Airtable columns match these field names exactly (case-sensitive)
    const fields = {
        'aetherId': newAetherId,
        'fullName': parsedData.data.fullName,
        'email': parsedData.data.email,
        'ageRange': parsedData.data.ageRange,
        'location': parsedData.data.location,
        'role': parsedData.data.role,
        'mainInterest': parsedData.data.mainInterest,
        'preferredPlatform': parsedData.data.preferredPlatform,
        'socialHandle': parsedData.data.socialHandle,
        'reasonToJoin': parsedData.data.reason,
        'referralCode': parsedData.data.referralCode,
    };

    try {
        await base(AIRTABLE_MEMBERS_TABLE_ID).create([
            { fields },
        ]);
        return { success: true, aetherId: newAetherId };
    } catch (error: any) {
        console.error('Airtable API submission error:', error);
        // Provide a more specific error message if Airtable returns one
        const errorMessage = error.message && error.message.includes('UNKNOWN_FIELD_NAME')
            ? `Airtable error: One or more fields in your form do not match the columns in your Airtable base. Please check your column names. (Details: ${error.message})`
            : 'Failed to submit form to Airtable. Please try again later.';
            
        return { success: false, error: errorMessage };
    }
}
