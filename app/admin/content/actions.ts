
'use server';

import { z } from 'zod';
import Airtable from 'airtable';

const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  format: z.string(),
  isPublished: z.boolean(),
  createdTime: z.string(),
});

export type Course = z.infer<typeof CourseSchema>;

export async function getCourses(): Promise<Course[]> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;
    const AIRTABLE_COURSES_TABLE_ID = 'tblG6WAvnevMUOHln';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_COURSES_TABLE_ID) {
        console.error('Airtable credentials for courses are not set.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    
    try {
        const records = await base(AIRTABLE_COURSES_TABLE_ID).select({
            sort: [{field: "fldb7G8yJqx3V8vA1", direction: "desc"}],
        }).all();

        const courses = records.map(record => ({
            id: record.id,
            title: record.get('fld4yNKUC0jgnjNnl') || 'Untitled Course',
            format: record.get('fldGK04OgOAtmCdce') || 'Unknown',
            isPublished: record.get('fldgbnGxLp5G4XyCi') || false,
            createdTime: record.get('fldb7G8yJqx3V8vA1'),
        }));
        
        return CourseSchema.array().parse(courses);

    } catch (error) {
        console.error('Airtable API error fetching courses:', error);
        return [];
    }
}
