'use server';

import { z } from 'zod';

const FormSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
});

type FormValues = z.infer<typeof FormSchema>;

export async function submitContactForm(data: FormValues) {
    const parsedData = FormSchema.safeParse(data);

    if (!parsedData.success) {
        return { success: false, error: 'Invalid form data.' };
    }

    // Here you would typically send an email or save to a database.
    // For this example, we'll just log it to the console.
    console.log('New contact form submission:');
    console.log(parsedData.data);
    
    // Simulate a successful API call
    return { success: true };
}
