
'use server';

import { z } from 'zod';

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  fullName: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export async function submitSuggestion(data: FormValues) {
    const parsedData = FormSchema.safeParse(data);

    if (!parsedData.success) {
        return { success: false, error: 'Invalid form data.' };
    }

    // In a real app, this would save to a database (e.g., Airtable).
    // For this example, we'll just log it to the console.
    console.log('New community suggestion:');
    console.log(parsedData.data);
    
    // Simulate a successful API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
}
