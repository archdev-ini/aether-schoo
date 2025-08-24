
import { z } from 'zod';

/**
 * This schema defines the validation rules for the content creation/editing form.
 * It's used by `react-hook-form` on the client-side for immediate feedback.
 */
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

/**
 * This type is inferred from the Zod schema and represents the data structure
 * for the form values.
 */
export type ContentFormValues = z.infer<typeof ContentFormSchema>;

/**
 * This interface describes the data structure for a single content item,
 * used for both listing content on the admin page and fetching individual items
 * for the edit page.
 */
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
  tags?: string; // Comma-separated string for form input
}
