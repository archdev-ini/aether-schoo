
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
    MEMBERS: 'tblEpMfyqgZC5yXBy',
    COURSES: 'tblnWNDELJW099acM',
    EVENTS: 'tbl3bdubKE54y8WGL',
    RSVPS: 'tblS1kPjT5pZ2UfRI',
    // The 'Team' table (tblbHLqhAtsknhxxq) is not yet used in the app.
};

// --- FIELD IDs ---
// From your provided Airtable API documentation.
export const FIELDS = {
    // --- Members Table (tblEpMfyqgZC5yXBy) ---
    MEMBERS: {
        AETHER_ID: 'fldxveAXRQlJ5XVdm',
        FULL_NAME: 'fldtKtxc0gqX0kglc',
        EMAIL: 'fldQbKhprX3RtYpZd',
        USERNAME: 'fldTp1SmBwV8oAant',
        LOCATION: 'fldTXGQAnQJcXRM3E',
        WORKPLACE: 'fldK3rQnHM6iU0XGa',
        ROLE: 'fld9RfSXC5RcrekTg', // Maps to "Area of Focus"
        INTERESTS: 'fldFMNV7xNrgoVzeX', // Maps to "Goals / Interests"
        PORTFOLIO_URL: 'fldQNps4G7x2WEpZK',
        ENTRY_NUMBER: 'flduvEUVkORBayKfE',
        STATUS: 'fldulIgSnU1PJe3zR', // Used to set 'Prelaunch-Active'
        LOGIN_TOKEN: 'fldEZo9OJfdNZ1fMu', // Not used in prelaunch, but kept for future
        LOGIN_TOKEN_EXPIRES: 'fldMtMVFFwEhWZSHC', // Not used in prelaunch
        LOGIN_TOKEN_CREATED_AT: 'fldh43fF5mXPJv0Hj', // Not used in prelaunch
        CREATED_TIME: 'Created', // Airtable default field for submission timestamp
    },

    // --- Courses Table (tblnWNDELJW099acM) ---
    COURSES: {
        TITLE: 'fldGLScFN9o36F1gi',
        DESCRIPTION: 'fldswXBsxtD62JgXi',
        FORMAT: 'fldK8GIv3kg5dibSj',
        SLUG: 'fld7WYdW0hYR7jUl2',
        EXTERNAL_URL: 'fldt3xNm4cf42dBNO',
        IS_PUBLISHED: 'fldzi5EAjK7iSFQsh', // Note: This is a Single Select in the new schema, not a boolean. The actions will handle it.
        CREATED_TIME: 'fldoOzsAhQ9pgiWgC',
    },

    // --- Events Table (tbl3bdubKE54y8WGL) ---
    EVENTS: {
        TITLE: 'fldJQovh56G3PeGcE',
        DATE: 'fldxa5phNB56hpNbK',
        TYPE: 'fld1OApGPAnPrDFi9',
        EVENT_CODE: 'fldT2JyzpCpruC7Hj',
        IS_PUBLISHED: 'fld6fZMRqUR8xNzGc',
        SPEAKER: 'fldfWFthJgucLL9Cw',
        DESCRIPTION: 'fldxPmbhLuOW1XYxV',
        COVER_IMAGE: 'fldaSuNFFC9xHWrAT',
        RSVPS: 'fldtnzKLHzwI68kJ9',
        RSVP_COUNT: 'RSVP Count', // Assuming this is a rollup field based on RSVPs link, name might not have a field ID.
        REGISTRATION_URL: 'Registration URL', // Field not present in new doc, keeping name for compatibility
    },

    // --- RSVPs Table (tblS1kPjT5pZ2UfRI) ---
    RSVPS: {
        EVENT: 'fldoy3is7eXrL35Bc',
        MEMBER: 'flduPFrNabdrEZt5u',
        // Other RSVP fields from the doc are not yet used in the app.
    },
};
