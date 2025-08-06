
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

function generateAetherId() {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AETH-${result}`;
}

export async function submitJoinForm(data: FormValues) {
    const parsedData = FormSchema.safeParse(data);

    if (!parsedData.success) {
        return { success: false, error: 'Invalid form data.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_TABLE_NAME
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error. Please contact support.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const newAetherId = generateAetherId();

    try {
        await base(AIRTABLE_TABLE_NAME).create([
        {
            fields: {
                'Aether ID': newAetherId,
                'Full Name': parsedData.data.fullName,
                'Email': parsedData.data.email,
                'Age Range': parsedData.data.ageRange,
                'City + Country': parsedData.data.location,
                'Role': parsedData.data.role,
                'Main Interest': parsedData.data.mainInterest,
                'Preferred Platform': parsedData.data.preferredPlatform,
                'Social Handle': parsedData.data.socialHandle,
                'Reason to Join': parsedData.data.reason,
                'Referral Code': parsedData.data.referralCode,
            },
        },
        ]);
        return { success: true, aetherId: newAetherId };
    } catch (error) {
        console.error('Airtable API error:', error);
        return { success: false, error: 'Failed to submit form to Airtable.' };
    }
}

    