
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

export const ContentFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  author: z.string().min(2, 'Author is required.'),
  format: z.string({ required_error: 'Please select a format.' }),
  difficulty: z.string({ required_error: 'Please select a difficulty.'}),
  status: z.enum(['Draft', 'Published']),
  releaseDate: z.string().optional(),
  contentUrl: z.string().url().optional().or(z.literal('')),
  tags: z.string().optional(),
});

export type ContentFormValues = z.infer<typeof ContentFormSchema>;


const ContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  format: z.string(),
  author: z.string(),
  status: z.enum(['Draft', 'Published']),
  releaseDate: z.string().optional(),
  contentUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

export type Content = z.infer<typeof ContentSchema>;

function getAirtableBase() {
    const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        throw new Error('Airtable credentials are not fully set.');
    }
    return new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
}


export async function getContent(): Promise<Content[]> {
  const { AIRTABLE_CONTENT_TABLE_ID } = process.env;

  if (!AIRTABLE_CONTENT_TABLE_ID) {
    console.warn('Airtable Content table ID is not set. Returning empty array.');
    return [];
  }
  
  const base = getAirtableBase();

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
      contentUrl: record.get('Content URL'),
      tags: record.get('Tags') || [],
    }));

    return ContentSchema.array().parse(content);
  } catch (error) {
    console.error('Airtable getContent error:', error);
    return [];
  }
}

export async function getContentById(id: string) {
    const { AIRTABLE_CONTENT_TABLE_ID } = process.env;
    if (!AIRTABLE_CONTENT_TABLE_ID) return null;

    const base = getAirtableBase();
    try {
        const record = await base(AIRTABLE_CONTENT_TABLE_ID).find(id);
        
        const tags = record.get('Tags') || [];

        return {
            id: record.id,
            title: record.get('Title'),
            description: record.get('Description'),
            author: record.get('Author'),
            format: record.get('Format'),
            difficulty: record.get('Difficulty'),
            status: record.get('Status'),
            releaseDate: record.get('Release Date'),
            contentUrl: record.get('Content URL') || '',
            tags: tags.join(', '), // Convert array to comma-separated string for form input
        };
    } catch (error) {
        console.error(`Error fetching content by id ${id}:`, error);
        notFound();
    }
}

async function upsertContent(data: ContentFormValues, id?: string) {
    const { AIRTABLE_CONTENT_TABLE_ID } = process.env;
    if (!AIRTABLE_CONTENT_TABLE_ID) {
        return { success: false, error: 'Airtable Content table ID not configured.' };
    }

    const base = getAirtableBase();

    const fields = {
        'Title': data.title,
        'Description': data.description,
        'Author': data.author,
        'Format': data.format,
        'Difficulty': data.difficulty,
        'Status': data.status,
        'Release Date': data.releaseDate || new Date().toISOString().split('T')[0],
        'Content URL': data.contentUrl,
        'Tags': data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
    };
    
    try {
        if (id) {
            await base(AIRTABLE_CONTENT_TABLE_ID).update([{ id, fields }]);
        } else {
            await base(AIRTABLE_CONTENT_TABLE_ID).create([{ fields }]);
        }
        revalidatePath('/admin731/content');
        revalidatePath('/school/courses'); // Also revalidate public pages
        return { success: true };
    } catch (error: any) {
        console.error('Airtable upsertContent error:', error);
        return { success: false, error: 'Failed to save content to Airtable.' };
    }
}

export async function createContent(data: ContentFormValues) {
    return upsertContent(data);
}

export async function updateContent(id: string, data: ContentFormValues) {
    return upsertContent(data, id);
}

export async function deleteContent(id: string): Promise<{ success: boolean; error?: string }> {
    const { AIRTABLE_CONTENT_TABLE_ID } = process.env;
    if (!AIRTABLE_CONTENT_TABLE_ID) {
        return { success: false, error: 'Airtable Content table ID not configured.' };
    }
    const base = getAirtableBase();
    try {
        await base(AIRTABLE_CONTENT_TABLE_ID).destroy([id]);
        revalidatePath('/admin731/content');
        return { success: true };
    } catch (error: any) {
        console.error('Airtable deleteContent error:', error);
        return { success: false, error: 'Failed to delete content from Airtable.' };
    }
}
