
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
    MEMBERS: 'tblsRnHf5c8KE1s2d', // Replace with your Members table ID
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
};
