'use server';

import { z } from 'zod';
import Airtable from 'airtable';

const ContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  format: z.string(),
  author: z.string(),
  status: z.enum(['Draft', 'Published']),
  releaseDate: z.string().optional(),
});

export type Content = z.infer<typeof ContentSchema>;

export async function getContent(): Promise<Content[]> {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_CONTENT_TABLE_ID } = process.env;

  // For now, if the content table isn't configured, return an empty array
  // In a real app, you might want to throw an error or handle this differently.
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_CONTENT_TABLE_ID) {
    console.warn('Airtable credentials for content are not fully set. Returning empty array.');
    return [];
  }

  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

  try {
    const records = await base(AIRTABLE_CONTENT_TABLE_ID).select({
      sort: [{ field: 'Release Date', direction: 'desc' }],
    }).all();

    const content = records.map(record => ({
      id: record.id,
      title: record.get('Title') || 'Untitled',
      format: record.get('Format') || 'N/A',
      author: record.get('Author') || 'N/A',
      status: record.get('Status') || 'Draft',
      releaseDate: record.get('Release Date'),
    }));

    return ContentSchema.array().parse(content);
  } catch (error) {
    console.error('Airtable getContent error:', error);
    return [];
  }
}
