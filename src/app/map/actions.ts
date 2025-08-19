
'use server';

import { z } from 'zod';
const Airtable = require('airtable');

const UserLocationSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  location: z.string(),
  mainInterest: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type UserLocation = z.infer<typeof UserLocationSchema>;

// Simple cache to avoid re-geocoding the same location repeatedly
const geocodeCache = new Map<string, { lat: number; lng: number }>();

async function geocodeLocation(location: string, apiKey: string): Promise<{ lat: number; lng: number } | null> {
    if (geocodeCache.has(location)) {
        return geocodeCache.get(location)!;
    }

    if (!apiKey) {
        console.error('Geocoding API key is not set. The map feature will not work.');
        // Returning null instead of throwing an error to prevent the entire page from crashing.
        return null;
    }
    
    const encodedLocation = encodeURIComponent(location);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.results[0]) {
            const { lat, lng } = data.results[0].geometry.location;
            const result = { lat, lng };
            geocodeCache.set(location, result);
            return result;
        } else {
            console.warn(`Geocoding failed for "${location}": ${data.status} - ${data.error_message || ''}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching geocode for "${location}":`, error);
        return null;
    }
}

export async function getUserLocations(): Promise<UserLocation[]> {
    const {
        AIRTABLE_API_KEY,
        AIRTABLE_BASE_ID,
        AIRTABLE_MEMBERS_TABLE_ID,
        GOOGLE_MAPS_API_KEY
    } = process.env;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        throw new Error('Airtable credentials are not set in environment variables.');
    }
     if (!GOOGLE_MAPS_API_KEY) {
        throw new Error('Google Maps API key is not configured.');
    }

    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: "NOT({location} = '')",
            fields: ['fullName', 'location', 'mainInterest'],
            maxRecords: 100 // Limit to avoid excessive geocoding requests
        }).all();

        const locationsPromises = records.map(async (record) => {
            const locationString = record.get('location') as string;
            let coords = null;
            if (locationString) {
                 coords = await geocodeLocation(locationString, GOOGLE_MAPS_API_KEY);
            }

            return {
                id: record.id,
                fullName: record.get('fullName') as string || 'An Aether Member',
                location: locationString || 'Parts Unknown',
                mainInterest: record.get('mainInterest') as string || 'Exploring',
                lat: coords?.lat,
                lng: coords?.lng,
            };
        });

        const locations = await Promise.all(locationsPromises);

        // Filter out users that could not be geocoded
        const validLocations = locations.filter(l => l.lat && l.lng);
        
        return UserLocationSchema.array().parse(validLocations);

    } catch (error) {
        console.error('Airtable API error:', error);
        throw new Error('Failed to fetch locations from the database.');
    }
}
