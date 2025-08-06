
'use server';

import { z } from 'zod';

const LumaEventSchema = z.object({
  api_id: z.string(),
  name: z.string(),
  description: z.string(),
  url: z.string(),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  location_type: z.string(),
  location_address: z.string().nullable(),
  series_info: z.object({
    title: z.string(),
  }).nullable(),
});

export type LumaEvent = z.infer<typeof LumaEventSchema>;

const LumaApiResponseSchema = z.object({
  entries: LumaEventSchema.array(),
});

export async function getLumaEvents(): Promise<LumaEvent[]> {
  const { LUMA_API_KEY } = process.env;

  if (!LUMA_API_KEY) {
    console.error('Luma API key is not set in environment variables.');
    return [];
  }

  const calendarId = LUMA_API_KEY.split('-')[1];
  const url = `https://api.lu.ma/public/v1/calendar/get-events?calendar_id=${calendarId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-luma-api-key': LUMA_API_KEY,
      },
      next: {
        // Revalidate every hour
        revalidate: 3600,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch Luma events: ${response.status} ${errorText}`);
    }

    const json = await response.json();
    const parsedData = LumaApiResponseSchema.safeParse(json);

    if (!parsedData.success) {
      console.error('Failed to parse Luma API response:', parsedData.error);
      return [];
    }

    return parsedData.data.entries;

  } catch (error) {
    console.error('Error fetching Luma events:', error);
    return [];
  }
}
