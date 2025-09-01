
/**
 * @fileoverview This file serves as the single source of truth for all Airtable
 * table names and field IDs used throughout the Aether application.
 *
 * Centralizing the schema here offers several benefits:
 * 1.  Maintainability: If a field name or ID changes in Airtable, it only needs to be updated in this one file.
 * 2.  Readability: Code becomes more readable, e.g., `FIELDS.MEMBERS.AETHER_ID` instead of a cryptic `fld7hoOSkHYaZrPr7`.
 * 3.  Consistency: Ensures all parts of the application refer to the same fields, reducing errors.
 * 4.  Discoverability: Provides a clear overview of the entire data model for developers.
 */

// --- TABLE IDs ---
export const TABLE_IDS = {
    MEMBERS: 'tblwPBMFhctPX82g4',
    COURSES: 'tblG6WAvnevMUOHln',
    EVENTS: 'tbl5Dwc9n31gKW4eu',
    RSVPS: 'tblKzLpQrStUvWxYz',
    // Add other table IDs here as they are created
};

// --- FIELD IDs ---
export const FIELDS = {
    // --- Members Table (tblwPBMFhctPX82g4) ---
    MEMBERS: {
        AETHER_ID: 'fld7hoOSkHYaZrPr7',           // Unique Aether ID
        FULL_NAME: 'fldcoLSWA6ntjtlYV',           // Full Name
        EMAIL: 'fld2EoTnv3wjIHhNX',               // Email Address
        USERNAME: 'fldR7jeaYn5qD4bCe',            // Public Username
        LOCATION: 'fldP5VgkLoOGwFkb3',            // Location (City, Country)
        WORKPLACE: 'fldc8pLqkN7wZ3VfA',           // Workplace / University
        ROLE: 'fld7rO1pQZ9sY2tB4',                // Role (e.g., Student, Professional)
        INTERESTS: 'fldkpeV7NwNz0GJ7O',           // Interests (Multi-select)
        PORTFOLIO_URL: 'fldzxVhA5njMpVaH3',       // Portfolio/LinkedIn URL
        ENTRY_NUMBER: 'fldmMy5vyIaoPMN3g',       // Sequential entry number
        STATUS: 'fldLzkrbVXuycummp',             // Member status (e.g., Prelaunch-Active)
        LOGIN_TOKEN: 'loginToken',               // Magic link token (Custom field name)
        LOGIN_TOKEN_EXPIRES: 'loginTokenExpires', // Token expiry in seconds (Custom field name)
        LOGIN_TOKEN_CREATED_AT: 'loginTokenCreatedAt', // Auto-timestamp field (Custom field name)
        CREATED_TIME: 'Created time',           // Airtable's default created time field
    },

    // --- Courses Table (tblG6WAvnevMUOHln) ---
    COURSES: {
        TITLE: 'fld4yNKUC0jgnjNnl',               // Course Title
        DESCRIPTION: 'fldOi4fl2p2eyBpk4',         // Course Description
        FORMAT: 'fldGK04OgOAtmCdce',              // Format (e.g., Primer, Video Course)
        SLUG: 'fldBihBUYiKQJrWe0',                // URL Slug
        EXTERNAL_URL: 'fldUa8bCdeFghIjKl',       // Link for external content
        IS_PUBLISHED: 'fldgbnGxLp5G4XyCi',         // Published Status (Checkbox/Boolean)
        CREATED_TIME: 'fldb7G8yJqx3V8vA1',       // Created time field
    },

    // --- Events Table (tbl5Dwc9n31gKW4eu) ---
    EVENTS: {
        TITLE: 'fldsWDjmyzCEDVLq1',               // Event Title
        DATE: 'fldZqEcg7wovGdynX',                // Event Date
        TYPE: 'fldDkeL5skl6n3F9A',                // Event Type (e.g., Workshop)
        EVENT_CODE: 'fldXJZa542DQ1eSV9',         // Unique Event Code (e.g., WAD-2025)
        IS_PUBLISHED: 'fldQwNwXW5g9YWsVm',         // Published Status
        RSVP_COUNT: 'fldzY2jK7lW1tZ0Xq',          // RSVP Count (Rollup)
        SPEAKER: 'fldA6qlmJI4DVdCCV',             // Speaker(s)
        DESCRIPTION: 'fld2rolAMxiIEjh7x',         // Event Description
        COVER_IMAGE: 'fldoXDEfNslvE50WF',         // Cover Image attachment
        REGISTRATION_URL: 'fldq6qcxhD04ny6Zj',   // For external registration links
    },

    // --- RSVPs Table (tblKzLpQrStUvWxYz) ---
    RSVPS: {
        EVENT: 'fldUvWxYzAbCdEfGh',               // Linked record to Events
        MEMBER: 'fldIjKlMnOpQrStUv',              // Linked record to Members
    },
};
