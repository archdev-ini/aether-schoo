
'use server';

import Airtable from 'airtable';

type CommunityPlatform = 'Discord' | 'Telegram' | 'WhatsApp';

const communityLinks = {
    'Discord': 'https://discord.gg/D8g8dSf7GE',
    'Telegram': '#', // Replace with your Telegram link
    'WhatsApp': 'https://chat.whatsapp.com/Bvwdx1p9h5G9goxokoDDhl?mode=ems_copy_c',
};

const platformFieldMapping: Record<CommunityPlatform, string> = {
    'Discord': 'ClickedDiscord',
    'Telegram': 'ClickedTelegram',
    'WhatsApp': 'ClickedWhatsApp',
};

export async function trackCommunityLinkClick(aetherId: string, platform: CommunityPlatform): Promise<{ success: boolean; url?: string; error?: string }> {
     if (!aetherId || !platform) {
        return { success: false, error: 'User ID and platform are required.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_MEMBERS_TABLE_ID
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error.' };
    }
    
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const fieldToUpdate = platformFieldMapping[platform];
    const communityUrl = communityLinks[platform];

    if (!fieldToUpdate || !communityUrl) {
        return { success: false, error: 'Invalid community platform specified.' };
    }

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `{aetherId} = "${aetherId}"`,
            maxRecords: 1
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Member not found.' };
        }

        const recordId = records[0].id;
        
        await base(AIRTABLE_MEMBERS_TABLE_ID).update(recordId, {
            [fieldToUpdate]: true
        });

        return { success: true, url: communityUrl };

    } catch (error: any) {
        console.error(`Airtable API error tracking ${platform} click:`, error);
        return { success: false, error: `Failed to track ${platform} click.` };
    }
}
