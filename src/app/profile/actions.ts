
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { cookies } from 'next/headers';

const MemberProfileSchema = z.object({
    fullName: z.string(),
    aetherId: z.string(),
    email: z.string().email(),
    role: z.string(),
    location: z.string(),
    mainInterest: z.string().optional(),
    interests: z.array(z.string()).optional(),
    reasonToJoin: z.string().optional(),
    entryNumber: z.number(),
});

export type MemberProfile = z.infer<typeof MemberProfileSchema>;

export async function getMemberProfile(aetherId: string): Promise<{ success: boolean; data?: MemberProfile; error?: string }> {
    if (!aetherId) {
        return { success: false, error: 'Aether ID is required.' };
    }

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;
    const AIRTABLE_MEMBERS_TABLE_ID = 'tblwPBMFhctPX82g4';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable credentials are not set in environment variables.');
        return { success: false, error: 'Server configuration error.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `UPPER({aetherId}) = "${aetherId.toUpperCase()}"`,
            maxRecords: 1,
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Member not found.' };
        }

        const record = records[0];
        
        const profileData = {
            fullName: record.get('fullName'),
            aetherId: record.get('aetherId'),
            email: record.get('Email'),
            role: record.get('Role'),
            location: record.get('location'),
            interests: record.get('Interests'),
            mainInterest: record.get('mainInterest'),
            reasonToJoin: record.get('reasonToJoin'),
            entryNumber: record.get('entryNumber'),
        };

        const parsedData = MemberProfileSchema.safeParse(profileData);
        if (!parsedData.success) {
            console.error("Airtable data parsing error:", parsedData.error);
            return { success: false, error: 'Failed to parse member data.' };
        }

        return { success: true, data: parsedData.data };

    } catch (error: any) {
        console.error('Airtable API error fetching profile:', error);
        return { success: false, error: 'Failed to communicate with the database.' };
    }
}

export async function logout() {
    const cookieStore = cookies();
    cookieStore.delete('aether_user_id');
    cookieStore.delete('aether_user_name');
    cookieStore.delete('aether_user_role');
    redirect('/login');
}

const LearningItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    format: z.string(),
    slug: z.string(),
    isCompleted: z.boolean(),
});

export type LearningItem = z.infer<typeof LearningItemSchema>;

export async function getMemberLearningProgress(aetherId: string): Promise<LearningItem[]> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_COURSES_TABLE_ID,
        AIRTABLE_COURSE_PROGRESS_TABLE_ID
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_COURSES_TABLE_ID || !AIRTABLE_COURSE_PROGRESS_TABLE_ID) {
        console.error('Airtable credentials for learning are not fully set.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        // 1. Get Member's Record ID from Aether ID
        const memberRecords = await base('Members').select({
            filterByFormula: `{aetherId} = "${aetherId}"`,
            fields: [],
            maxRecords: 1,
        }).firstPage();

        if (memberRecords.length === 0) return [];
        const memberRecordId = memberRecords[0].id;

        // 2. Get all completed course IDs for that member
        const completedProgressRecords = await base('CourseProgress').select({
            filterByFormula: `AND({Member} = '${memberRecordId}', {Status} = 'Completed')`,
            fields: ['Course']
        }).all();
        const completedCourseIds = new Set(completedProgressRecords.map(r => r.get('Course')).flat());
        
        // 3. Get all published primers
        const primerRecords = await base('Courses').select({
            filterByFormula: "AND({IsPublished} = 1, {Format} = 'Primer')",
            fields: ['Title', 'Description', 'Format', 'Slug'],
        }).all();

        // 4. Map primers to LearningItem, checking completion status
        const learningItems = primerRecords.map(record => ({
            id: record.id,
            title: record.get('Title') || 'Untitled',
            description: record.get('Description'),
            format: record.get('Format') || 'Primer',
            slug: record.get('Slug') || '',
            isCompleted: completedCourseIds.has(record.id),
        }));

        return LearningItemSchema.array().parse(learningItems);
    } catch (error) {
        console.error("Error fetching learning progress:", error);
        return [];
    }
}
