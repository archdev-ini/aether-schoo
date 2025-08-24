
'use server';

import { z } from 'zod';
import Airtable from 'airtable';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

// These types are now defined in ContentForm.tsx but we need them for the function signatures.
// It's a bit of duplication, but necessary to keep the 'use server' file clean.
const ContentFormSchema = z.object({
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
type ContentFormValues = z.infer<typeof ContentFormSchema>;


// This type describes the data structure for a single content item,
// used for both listing and fetching individual items.
export interface ContentData {
  id: string;
  title: string;
  description?: string;
  author: string;
  format: string;
  difficulty?: string;
  status: 'Draft' | 'Published';
  releaseDate?: string;
  contentUrl?: string;
  tags?: string;
}


function getAirtableBase() {
    const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        throw new Error('Airtable credentials are not fully set.');
    }
    return new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
}


export async function getContent(): Promise<ContentData[]> {
  const { AIRTABLE_CONTENT_TABLE_ID } = process.env;

  if (!AIRTABLE_CONTENT_TABLE_ID) {
    console.warn('Airtable Content table ID is not set. Returning empty array.');
    return [];
  }
  
  const base = getAirtableBase();

  try {
    const records = await base(AIRTABLE_CONTENT_TABLE_ID).select({
      sort: [{ field: 'Release Date', direction: 'desc' }],
      fields: ['Title', 'Format', 'Status', 'Content URL', 'Tags', 'Release Date', 'Author'] // Specify fields
    }).all();

    const content: ContentData[] = records.map(record => ({
      id: record.id,
      title: record.get('Title') as string || 'Untitled',
      format: record.get('Format') as string || 'N/A',
      author: record.get('Author') as string || 'N/A',
      status: record.get('Status') as 'Draft' | 'Published' || 'Draft',
      releaseDate: record.get('Release Date') as string,
      contentUrl: record.get('Content URL') as string,
      tags: (record.get('Tags') as string[] || []).join(', '),
    }));

    return content;
  } catch (error) {
    console.error('Airtable getContent error:', error);
    return [];
  }
}

export async function getContentById(id: string): Promise<ContentData | null> {
    const { AIRTABLE_CONTENT_TABLE_ID } = process.env;
    if (!AIRTABLE_CONTENT_TABLE_ID) return null;

    const base = getAirtableBase();
    try {
        const record = await base(AIRTABLE_CONTENT_TABLE_ID).find(id);
        
        const tags = record.get('Tags') as string[] || [];

        return {
            id: record.id,
            title: record.get('Title') as string,
            description: record.get('Description') as string,
            author: record.get('Author') as string,
            format: record.get('Format') as string,
            difficulty: record.get('Difficulty') as string,
            status: record.get('Status') as 'Draft' | 'Published',
            releaseDate: record.get('Release Date') as string,
            contentUrl: (record.get('Content URL') as string) || '',
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
