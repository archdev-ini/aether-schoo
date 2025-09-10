
/**
 * @fileoverview This file serves as the single source of truth for all Airtable
 * table names and field IDs used throughout the Aether application.
 *
 * Centralizing the schema here offers several benefits:
 * 1.  Maintainability: If a field name or ID changes in Airtable, it only needs to be updated in this one file.
 * 2.  Readability: Code becomes more readable, e.g., `FIELDS.MEMBERS.AETHER_ID` instead of a cryptic field ID.
 * 3.  Consistency: Ensures all parts of the application refer to the same fields, reducing errors.
 * 4.  Discoverability: Provides a clear overview of the entire data model for developers.
 */

// --- TABLE IDs ---
// From your provided Airtable API documentation.
export const TABLE_IDS = {
    TABLE_1: 'tblsLqfSRHuy8nknA',
    // Keeping previous tables commented out in case they are needed later
    // MEMBERS: 'tblEpMfyqgZC5yXBy',
    // COURSES: 'tblnWNDELJW099acM',
    // EVENTS: 'tbl3bdubKE54y8WGL',
    // RSVPS: 'tblS1kPjT5pZ2UfRI',
};

// --- FIELD IDs ---
// From your provided Airtable API documentation.
export const FIELDS = {
    // --- Table 1 (tblsLqfSRHuy8nknA) ---
    TABLE_1: {
        NAME: 'fldQiV7RPq3wyGikF',
        NOTES: 'fldRDzQ6ClpkTKCVG',
        ASSIGNEE: 'fldJUnq3MDhTGVNLe',
        STATUS: 'fldltKc4BszMs4C7p',
        ATTACHMENTS: 'fld59ukt0MeIqkxBj',
        ATTACHMENT_SUMMARY: 'fld71gdw9OOQptVrz',
    },
};
