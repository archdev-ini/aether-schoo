'use server';

/**
 * @fileOverview AI tool to discover and highlight relevant Aether Ecosystem programs and resources based on user-provided keywords.
 *
 * - discoverInterests - A function that takes user keywords and returns relevant Aether Ecosystem information.
 * - DiscoverInterestsInput - The input type for the discoverInterests function.
 * - DiscoverInterestsOutput - The return type for the discoverInterests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiscoverInterestsInputSchema = z.object({
  keywords: z
    .string()
    .describe('Keywords representing the user\'s interests.'),
});
export type DiscoverInterestsInput = z.infer<typeof DiscoverInterestsInputSchema>;

const DiscoverInterestsOutputSchema = z.object({
  relevantPrograms: z
    .string()
    .describe('A list of relevant Aether Ecosystem programs and resources.'),
});
export type DiscoverInterestsOutput = z.infer<typeof DiscoverInterestsOutputSchema>;

export async function discoverInterests(input: DiscoverInterestsInput): Promise<DiscoverInterestsOutput> {
  return discoverInterestsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'discoverInterestsPrompt',
  input: {schema: DiscoverInterestsInputSchema},
  output: {schema: DiscoverInterestsOutputSchema},
  prompt: `You are an AI assistant designed to help prospective members discover relevant programs and resources within the Aether Ecosystem.

  Based on the user's provided keywords, identify and highlight the most relevant programs and resources.

  Keywords: {{{keywords}}}
  `,
});

const discoverInterestsFlow = ai.defineFlow(
  {
    name: 'discoverInterestsFlow',
    inputSchema: DiscoverInterestsInputSchema,
    outputSchema: DiscoverInterestsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
