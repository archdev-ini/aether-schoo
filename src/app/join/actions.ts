
'use server';

import { z } from 'zod';
import type { FormValues } from './page';
import { generateAetherId } from '@/lib/id-generator';

const Airtable = require('airtable');

const FormSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  location: z.string(),
  ageRange: z.string(),
  role: z.enum(['Student', 'Graduate', 'Professional']),
  mainInterest: z.enum(['Courses', 'Studio', 'Community', 'Mentorship']),
  preferredPlatform: z.enum(['Discord', 'WhatsApp', 'Telegram']),
  socialHandle: z.string().optional(),
  reasonToJoin: z.string().optional(),
});


export async function submitJoinForm(data: FormValues) {
    const parsedData = FormSchema.safeParse(data);

    if (!parsedData.success) {
        console.error('Form validation failed:', parsedData.error.flatten().fieldErrors);
        return { success: false, error: 'Invalid form data.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_MEMBERS_TABLE_ID
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID || !process.env.AETHER_FOUNDER_KEY) {
        console.error('Airtable or Founder Key credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error. Please contact support.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const { aetherId: newAetherId, entryNumber } = await generateAetherId(base, AIRTABLE_MEMBERS_TABLE_ID, parsedData.data.role);
        const { 
            fullName, email, location, ageRange, role, 
            mainInterest, preferredPlatform, socialHandle, reasonToJoin 
        } = parsedData.data;

        const fields = {
            'aetherId': newAetherId,
            'fullName': fullName,
            'email': email,
            'location': location,
            'ageRange': ageRange,
            'role': role,
            'mainInterest': mainInterest,
            'preferredPlatform': preferredPlatform,
            'socialHandle': socialHandle,
            'reasonToJoin': reasonToJoin,
            'entryNumber': entryNumber,
            'status': 'Active', // Set default status
        };

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
