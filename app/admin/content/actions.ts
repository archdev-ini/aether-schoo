
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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


const CreateCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  format: z.enum(['Primer', 'Video Course', 'Archive']),
  slug: z.string().min(3, 'Slug must be at least 3 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
});

export type CreateCourseState = {
  errors?: {
    title?: string[];
    format?: string[];
    slug?: string[];
    _form?: string[];
  };
  message?: string | null;
};

export async function createCourse(prevState: CreateCourseState, formData: FormData): Promise<CreateCourseState> {
    const validatedFields = CreateCourseSchema.safeParse({
        title: formData.get('title'),
        format: formData.get('format'),
        slug: formData.get('slug'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to create course. Please check the fields.',
        };
    }
    
    const { title, format, slug } = validatedFields.data;

    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
    } = process.env;
    const AIRTABLE_COURSES_TABLE_ID = 'tblG6WAvnevMUOHln';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_COURSES_TABLE_ID) {
        return { message: 'Airtable credentials are not set.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        await base(AIRTABLE_COURSES_TABLE_ID).create([
            {
                fields: {
                    'fld4yNKUC0jgnjNnl': title,
                    'fldGK04OgOAtmCdce': format,
                    'fldBihBUYiKQJrWe0': slug,
                    'fldgbnGxLp5G4XyCi': false, // Default to Draft
                }
            }
        ], { typecast: true });
    } catch(error) {
        console.error('Airtable create course error:', error);
        return { message: 'Database Error: Failed to create course.' };
    }

    revalidatePath('/admin/content');
    redirect('/admin/content');
}
