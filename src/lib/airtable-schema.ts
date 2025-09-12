
/**
 * @fileoverview This file serves as the single source of truth for all Airtable
 * table names and field IDs used throughout the Aether application.
 *
 * Centralizing the schema here offers several benefits:
 * 1.  Maintainability: If a field name or ID changes in Airtable, it only needs to be updated in this one file.
 * 2.  Readability: Code becomes more readable, e.g., `FIELDS.MEMBERS.FULL_NAME` instead of a cryptic field ID.
 * 3.  Consistency: Ensures all parts of the application refer to the same fields, reducing errors.
 * 4.  Discoverability: Provides a clear overview of the entire data model for developers.
 */

// --- TABLE IDs ---
// Replace with your actual Table IDs from Airtable
export const TABLE_IDS = {
    MEMBERS: 'tblsRnHf5c8KE1s2d',
    EVENTS: 'tblsRnHf5c8KE1s2d', // Replace with your Events table ID if different
    CONTENT: 'tblsRnHf5c8KE1s2d', // Replace with your Content table ID if different
};

// --- FIELD IDs ---
// Replace with your actual Field IDs from Airtable
// Use Airtable's API documentation for a table to find these IDs.
export const FIELDS = {
    MEMBERS: {
        // --- Core Fields ---
        AETHER_ID: 'fldScNl2e3p4q5r6t',        // Formula: Auto-generated
        FULL_NAME: 'fldXyZ7w8v9u0a1b',        // Single Line Text
        EMAIL: 'fldAbC6d5e4f3g2h',          // Email
        INSTITUTION: 'fldGhI5j4k3l2m1n',      // Single Line Text (Optional)
        LOCATION: 'fldNoP4q3r2s1t0u',        // Single Line Text

        // --- Status & Access ---
        STATUS: 'fldUvW3x2y1z0a9b',          // Single Select: [Pending, Active, Archived]
        ROLE: 'fldCdE2f1g0h9i8j',            // Single Select: [Community, Staff, Speaker, Superadmin]
        
        // --- System Fields (Auto-managed) ---
        ENTRY_NUMBER: 'fldJkL1m0n9o8p7q',      // Autonumber
        ACTIVATION_TOKEN: 'fldQrS0t9u8v7w6x',    // Single Line Text (Hidden from most views)
        ACTIVATION_TOKEN_EXPIRES: 'fldYzA9b8c7d6e5f', // Date/Time (Hidden)
        LAST_LOGIN: 'fldGHI6j5k4l3m2n',        // Date/Time (Updated on login)
        DATE_JOINED: 'fldOPQ5r4s3t2u1v'         // Created Time
    },
    EVENTS: {
        EVENT_CODE: 'fldRST4u3v2w1x0y',        // Formula (e.g., 'EVT-' & Autonumber)
        TITLE: 'fldYZA3b2c1d0e9f',          // Single Line Text
        DATE: 'fldGHI2j1k0l9m8n',           // Date/Time
        DESCRIPTION: 'fldPQR1s0t9u8v7w',      // Rich Text
        COVER_IMAGE: 'fldXWV0y9z8a7b6c',      // Attachment (Single)
        STATUS: 'fldDEF9g8h7i6j5k',          // Single Select: [Draft, Published, Archived]
        FORMAT: 'fldLMN8o7p6q5r4s',          // Single Select: [Workshop, Q&A, Talk, Panel]
        HOST: 'fldTUV7w6x5y4z3a',           // Single Line Text (e.g., "Aether Team")
        EVENTBRITE_URL: 'Eventbrite URL',  // URL, referenced by name
        SPEAKER_NAME: 'fldBCd6e5f4g3h2i',       // Single Line Text (Optional)
        SPEAKER_TITLE: 'fldJKl5m4n3o2p1q',      // Single Line Text (Optional)
    },
     CONTENT: {
        TITLE: 'fldYZA3b2c1d0e9f',        // Re-using for consistency, but should be unique
        DESCRIPTION: 'fldPQR1s0t9u8v7w',
        AUTHOR: 'fldBCd6e5f4g3h2i',
        FORMAT: 'fldLMN8o7p6q5r4s',
        DIFFICULTY: 'fldRST4u3v2w1x0y',
        STATUS: 'fldDEF9g8h7i6j5k',
        RELEASE_DATE: 'fldGHI2j1k0l9m8n',
        CONTENT_URL: 'fldXWV0y9z8a7b6c',
        TAGS: 'fldJKl5m4n3o2p1q',
    }
};
