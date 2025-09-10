
'use server';

import type { FormValues } from './page';

export async function submitJoinForm(data: FormValues): Promise<{ success: boolean; error?: string }> {

    // --- SERVER LOGIC DISABLED FOR FRONTEND DEVELOPMENT ---
    // The original logic is commented out to allow frontend development.
    // The form will now always return a success message.
    console.log("Form submitted (server logic disabled):", data);
    return { success: true };

}
