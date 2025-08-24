
'use server';

import { z } from 'zod';
import Airtable from 'airtable';

const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  tags: z.array(z.string()).optional(),
  difficulty: z.string(),
  format: z.string(),
  releaseDate: z.string(),
  description: z.string(),
  imageUrl: z.string().url().optional(),
  contentUrl: z.string().url().optional(),
  // For later use, not fetched yet
  // lessons: z.array(z.any()).optional(),
  // communityNotes: z.array(z.any()).optional(),
});

export type Course = z.infer<typeof CourseSchema>;

export async function getCourseById(courseId: string): Promise<Course | null> {
    const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_CONTENT_TABLE_ID } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_CONTENT_TABLE_ID) {
        console.error('Airtable credentials for content are not set.');
        return null;
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        const record = await base(AIRTABLE_CONTENT_TABLE_ID).find(courseId);

        const coverImageField = record.get('Cover Image');
        let coverImageUrl;
        if (Array.isArray(coverImageField) && coverImageField.length > 0) {
            coverImageUrl = coverImageField[0].url;
        }

        const courseData = {
            id: record.id,
            title: record.get('Title') || 'Untitled',
            author: record.get('Author') || 'Aether',
            tags: record.get('Tags') || [],
            difficulty: record.get('Difficulty') || 'All Levels',
            format: record.get('Format') || 'Primer',
            releaseDate: record.get('Release Date') || new Date().toISOString(),
            description: record.get('Description') || 'No description available.',
            imageUrl: coverImageUrl,
            contentUrl: record.get('Content URL'),
        };

        return CourseSchema.parse(courseData);
    } catch (error) {
        console.error(`Failed to fetch course ${courseId}:`, error);
        return null;
    }
}
