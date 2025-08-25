
'use server';

import Airtable from 'airtable';

interface VerificationResult {
    success: boolean;
    error?: string;
    data?: {
        aetherId: string;
        fullName: string;
        role: string;
    };
}

export async function verifyTokenAndLogin(token: string): Promise<VerificationResult> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;
    const AIRTABLE_MEMBERS_TABLE_ID = 'tblwPBMFhctPX82g4';

     if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Server configuration error in activation');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `{loginToken} = "${token}"`,
            maxRecords: 1,
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Invalid or expired activation link.' };
        }

        const record = records[0];
        const tokenCreatedAtStr = record.get('loginTokenCreatedAt') as string;
        const tokenDuration = record.get('loginTokenExpires') as number || 0; // Duration in seconds

        if (!tokenCreatedAtStr || tokenDuration === 0) {
             return { success: false, error: 'Invalid activation record. Please sign up again.' };
        }
        
        const tokenCreatedAt = new Date(tokenCreatedAtStr);
        const expiresAt = new Date(tokenCreatedAt.getTime() + tokenDuration * 1000);

        if (new Date() > expiresAt) {
            // Invalidate expired token
            await base(AIRTABLE_MEMBERS_TABLE_ID).update(record.id, { 'loginToken': null });
            return { success: false, error: 'Activation link has expired. Please try signing up again.' };
        }
        
        const fullName = record.get('fldcoLSWA6ntjtlYV') as string;
        const aetherId = record.get('fld7hoOSkHYaZrPr7') as string;
        const role = record.get('fld7rO1pQZ9sY2tB4') as string;
        
        // Invalidate token after use
        await base(AIRTABLE_MEMBERS_TABLE_ID).update(record.id, {
            'loginToken': null,
            'loginTokenExpires': null,
        });

        return { 
            success: true, 
            data: {
                fullName,
                aetherId,
                role
            }
        };
    } catch (error) {
        console.error('Activation error:', error);
        return { success: false, error: 'An unexpected error occurred during activation.' };
    }
}
