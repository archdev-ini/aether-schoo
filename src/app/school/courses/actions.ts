
'use server';

import { z } from 'zod';
import Airtable from 'airtable';

const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  author: z.string(),
  tags: z.array(z.string()).optional(),
  difficulty: z.string(),
  format: z.string(),
  releaseDate: z.string(),
  imageUrl: z.string().url().optional(),
  aiHint: z.string().optional(),
});

export type Course = z.infer<typeof CourseSchema>;

export async function getCourses(): Promise<Course[]> {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_CONTENT_TABLE_ID } = process.env;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_CONTENT_TABLE_ID) {
    console.warn('Airtable credentials for content are not fully set. Returning empty array.');
    return [];
  }

  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

  try {
    const records = await base(AIRTABLE_CONTENT_TABLE_ID).select({
      filterByFormula: "({Status} = 'Published')",
      sort: [{ field: 'Release Date', direction: 'desc' }],
    }).all();

    const courses = records.map(record => {
      const coverImageField = record.get('Cover Image');
      let coverImageUrl;
      if (Array.isArray(coverImageField) && coverImageField.length > 0) {
        coverImageUrl = coverImageField[0].url;
      }

      return {
        id: record.id,
        title: record.get('Title') || 'Untitled',
        description: record.get('Description') || 'No description available.',
        author: record.get('Author') || 'Aether',
        tags: record.get('Tags') || [],
        difficulty: record.get('Difficulty') || 'All Levels',
        format: record.get('Format') || 'Primer',
        releaseDate: record.get('Release Date') || new Date().toISOString(),
        imageUrl: coverImageUrl,
        aiHint: 'design course', // Generic hint
      };
    });

    return CourseSchema.array().parse(courses);
  } catch (error) {
    console.error('Airtable getCourses error:', error);
    return [];
  }
}
