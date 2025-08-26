
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
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  format: z.enum(['Primer', 'Video Course', 'Archive', 'External Link']),
  slug: z.string().optional(),
  externalUrl: z.string().url().optional().or(z.literal('')),
}).refine((data) => {
    if (data.format === 'External Link') {
        return !!data.externalUrl;
    }
    return !!data.slug;
}, {
    message: 'Slug is required for internal content, URL for external links.',
    path: ['slug'], // You can decide where to show the error
}).refine(data => {
    if (data.format !== 'External Link' && data.slug) {
        return /^[a-z0-9-]+$/.test(data.slug);
    }
    return true;
}, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens.',
    path: ['slug'],
}).refine(data => {
    if (data.format !== 'External Link' && data.slug) {
        return data.slug.length >= 3;
    }
    return true;
}, {
    message: 'Slug must be at least 3 characters.',
    path: ['slug'],
});


export type CreateCourseState = {
  errors?: {
    title?: string[];
    format?: string[];
    slug?: string[];
    externalUrl?: string[];
    _form?: string[];
  };
  message?: string | null;
};

export async function createCourse(prevState: CreateCourseState, formData: FormData): Promise<CreateCourseState> {
    const validatedFields = CreateCourseSchema.safeParse({
        title: formData.get('title'),
        format: formData.get('format'),
        slug: formData.get('slug'),
        externalUrl: formData.get('externalUrl'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to create course. Please check the fields.',
        };
    }
    
    const { title, format, slug, externalUrl } = validatedFields.data;

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
        const fields: Airtable.FieldSet = {
            'fld4yNKUC0jgnjNnl': title,
            'fldGK04OgOAtmCdce': format,
            'fldgbnGxLp5G4XyCi': false, // Default to Draft
        };

        if (format === 'External Link') {
            fields['fldUa8bCdeFghIjKl'] = externalUrl; // Assumes field ID for External URL
        } else {
            fields['fldBihBUYiKQJrWe0'] = slug;
        }

        await base(AIRTABLE_COURSES_TABLE_ID).create([
            { fields }
        ], { typecast: true });
    } catch(error) {
        console.error('Airtable create course error:', error);
        return { message: 'Database Error: Failed to create course.' };
    }

    revalidatePath('/admin/content');
    redirect('/admin/content');
}
