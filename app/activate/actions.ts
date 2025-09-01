
'use server';

import Airtable from 'airtable';
import { cookies } from 'next/headers';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';

interface VerificationResult {
    success: boolean;
    error?: string;
}

export async function verifyTokenAndLogin(token: string): Promise<VerificationResult> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;

     if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.MEMBERS) {
        console.error('Server configuration error in activation');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const membersTable = base(TABLE_IDS.MEMBERS);
    const F = FIELDS.MEMBERS;

    try {
        const records = await membersTable.select({
            filterByFormula: `{${F.LOGIN_TOKEN}} = "${token}"`,
            maxRecords: 1,
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Invalid or expired activation link.' };
        }

        const record = records[0];
        const tokenCreatedAtStr = record.get(F.LOGIN_TOKEN_CREATED_AT) as string;
        const tokenDuration = record.get(F.LOGIN_TOKEN_EXPIRES) as number || 0; 

        if (!tokenCreatedAtStr || tokenDuration === 0) {
             return { success: false, error: 'Invalid activation record. Please sign up again.' };
        }
        
        const tokenCreatedAt = new Date(tokenCreatedAtStr);
        const expiresAt = new Date(tokenCreatedAt.getTime() + tokenDuration * 1000);

        if (new Date() > expiresAt) {
            await membersTable.update(record.id, { [F.LOGIN_TOKEN]: null });
            return { success: false, error: 'Activation link has expired. Please try signing up again.' };
        }
        
        const fullName = record.get(F.FULL_NAME) as string;
        const aetherId = record.get(F.AETHER_ID) as string;
        const role = record.get(F.ROLE) as string;
        
        // Invalidate token after use
        await membersTable.update(record.id, {
            [F.LOGIN_TOKEN]: null,
            [F.LOGIN_TOKEN_EXPIRES]: null,
        });

        // Set secure, HttpOnly cookies for session
        const cookieStore = cookies();
        cookieStore.set('aether_user_id', aetherId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 }); // 1 week
        cookieStore.set('aether_user_name', fullName, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
        cookieStore.set('aether_user_role', role, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });

        return { 
            success: true, 
        };
    } catch (error) {
        console.error('Activation error:', error);
        return { success: false, error: 'An unexpected error occurred during activation.' };
    }
}
