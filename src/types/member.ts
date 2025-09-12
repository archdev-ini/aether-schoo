
import { z } from 'zod';

/**
 * This schema defines the validation rules for the member creation/editing form.
 * It's used by `react-hook-form` on the client-side for immediate feedback and
 * by the server action for server-side validation.
 */
export const MemberFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  institution: z.string().optional(),
  location: z.string().min(2, 'Please enter your country or location.'),
});

/**
 * This type is inferred from the Zod schema and represents the data structure
 * for the form values.
 */
export type MemberFormValues = z.infer<typeof MemberFormSchema>;

/**
 * This interface describes the data structure for a single member record,
 * as it would be fetched from Airtable.
 */
export interface MemberData {
  id: string; // The Airtable record ID
  aetherId: string;
  fullName: string;
  email: string;
  institution?: string;
  location: string;
  status: 'Pending' | 'Active' | 'Archived';
  role: 'Community' | 'Staff' | 'Speaker' | 'Superadmin';
  entryNumber: number;
  dateJoined: string;
}
