
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
            filterByFormula: `UPPER({fld7hoOSkHYaZrPr7}) = "${aetherId.toUpperCase()}"`,
            maxRecords: 1,
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Member not found.' };
        }

        const record = records[0];
        
        const profileData = {
            fullName: record.get('fldcoLSWA6ntjtlYV'),
            aetherId: record.get('fld7hoOSkHYaZrPr7'),
            email: record.get('fld2EoTnv3wjIHhNX'),
            role: record.get('fld7rO1pQZ9sY2tB4'),
            location: record.get('fldP5VgkLoOGwFkb3'),
            interests: record.get('fldkpeV7NwNz0GJ7O'),
            mainInterest: record.get('mainInterest'),
            reasonToJoin: record.get('reasonToJoin'),
            entryNumber: record.get('fldmMy5vyIaoPMN3g'),
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
    } = process.env;

    const AIRTABLE_MEMBERS_TABLE_ID = 'tblwPBMFhctPX82g4';
    const AIRTABLE_COURSES_TABLE_ID = 'tblG6WAvnevMUOHln';
    const AIRTABLE_COURSE_PROGRESS_TABLE_ID = 'tblDQ7M9Q4E3YyIhw';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID ) {
        console.error('Airtable credentials for learning are not fully set.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        // 1. Get Member's Record ID from Aether ID
        const memberRecords = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `{fld7hoOSkHYaZrPr7} = "${aetherId}"`,
            fields: [],
            maxRecords: 1,
        }).firstPage();

        if (memberRecords.length === 0) return [];
        const memberRecordId = memberRecords[0].id;

        // 2. Get all completed course IDs for that member
        const completedProgressRecords = await base(AIRTABLE_COURSE_PROGRESS_TABLE_ID).select({
            filterByFormula: `AND({fldQE9NNeGDnVGVdr} = '${memberRecordId}', {fld3JTiTa7EbOIfK0} = 'Completed')`,
            fields: ['fld0gxA6RjbZKbxpy'] // Course
        }).all();
        const completedCourseIds = new Set(completedProgressRecords.map(r => r.get('fld0gxA6RjbZKbxpy')).flat());
        
        // 3. Get all published primers from the Courses table using Field IDs
        const primerRecords = await base(AIRTABLE_COURSES_TABLE_ID).select({
            filterByFormula: "AND({fldgbnGxLp5G4XyCi} = 1, {fldGK04OgOAtmCdce} = 'Primer')", // IsPublished and Format
            fields: ['fld4yNKUC0jgnjNnl', 'fldOi4fl2p2eyBpk4', 'fldGK04OgOAtmCdce', 'fldBihBUYiKQJrWe0'], // Title, Description, Format, Slug
        }).all();

        // 4. Map primers to LearningItem, checking completion status
        const learningItems = primerRecords.map(record => ({
            id: record.id,
            title: record.get('fld4yNKUC0jgnjNnl') || 'Untitled',
            description: record.get('fldOi4fl2p2eyBpk4'),
            format: record.get('fldGK04OgOAtmCdce') || 'Primer',
            slug: record.get('fldBihBUYiKQJrWe0') || '',
            isCompleted: completedCourseIds.has(record.id),
        }));

        return LearningItemSchema.array().parse(learningItems);
    } catch (error) {
        console.error("Error fetching learning progress:", error);
        return [];
    }
}
