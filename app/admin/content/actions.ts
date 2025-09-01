
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { TABLE_IDS, FIELDS } from '@/lib/airtable-schema';

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

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.COURSES) {
        console.error('Airtable credentials for courses are not set.');
        return [];
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const F = FIELDS.COURSES;
    
    try {
        const records = await base(TABLE_IDS.COURSES).select({
            sort: [{field: F.CREATED_TIME, direction: "desc"}],
        }).all();

        const courses = records.map(record => ({
            id: record.id,
            title: record.get(F.TITLE) as string || 'Untitled Course',
            format: record.get(F.FORMAT) as string || 'Unknown',
            isPublished: record.get(F.IS_PUBLISHED) === 'Published',
            createdTime: record.get(F.CREATED_TIME) as string,
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
    path: ['slug'],
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

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !TABLE_IDS.COURSES) {
        return { message: 'Airtable credentials are not set.' };
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    const F = FIELDS.COURSES;

    try {
        const fields: Airtable.FieldSet = {
            [F.TITLE]: title,
            [F.FORMAT]: format,
            [F.IS_PUBLISHED]: 'Draft', // Default to Draft
        };

        if (format === 'External Link') {
            fields[F.EXTERNAL_URL] = externalUrl;
        } else {
            fields[F.SLUG] = slug;
        }

        await base(TABLE_IDS.COURSES).create([
            { fields }
        ], { typecast: true });
    } catch(error) {
        console.error('Airtable create course error:', error);
        return { message: 'Database Error: Failed to create course.' };
    }

    revalidatePath('/admin/content');
    redirect('/admin/content');
}
