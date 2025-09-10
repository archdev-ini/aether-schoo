
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
export const TABLE_IDS = {
    MEMBERS: 'tblaIODuHwuucBsD4',
    // Keeping other tables here in case they are re-introduced later.
    COURSES: 'tblnWNDELJW099acM', // Placeholder, not from new schema
    EVENTS: 'tbl3bdubKE54y8WGL',   // Placeholder, not from new schema
    RSVPS: 'tblS1kPjT5pZ2UfRI',    // Placeholder, not from new schema
};

// --- FIELD IDs ---
export const FIELDS = {
    // --- Members Table (Aether Members Prelaunch - tblaIODuHwuucBsD4) ---
    MEMBERS: {
        AETHER_ID: 'Aether ID', // No Field ID for Formula/AutoNumber fields, using name
        FULL_NAME: 'fldTPWgcBYWv1jU52',
        USERNAME: 'fldXDPtkhEnM9VqBT',
        EMAIL: 'fldlji3ahQi1NFo3i',
        LOCATION: 'fldGxuuQVudjZ6X24',
        WORKPLACE: 'fldoMEBV9boFn8gC9',
        ROLE: 'fldqz79h166gNBZJU', // Corresponds to "Area of Focus"
        INTERESTS: 'fld0F3NxDtfjhMStj', // Corresponds to "Goals / Interests"
        SIGNUP_STEP_COMPLETED: 'fldiQc2hDCql3vEi9',
        SUBMISSION_TIMESTAMP: 'fldrHZklYnQTMPYvz', // This is a Created Time field
        OPT_IN_STATUS: 'fldoDh94K9a8SRomO',
        NOTES: 'fldviX9uy77dnPuxh',
        MAGIC_LINK_SENT_TIMESTAMP: 'fldRCOslGxSY47vRH',
        SOURCE_REFERRAL: 'fldwRLECL1JWeWQF6',
        ID_CLAIMED: 'fldvjYqKxQaTgM1IM',
        // The following fields are from older schemas and are kept for reference, but are not in the new schema.
        ENTRY_NUMBER: 'Entry Number', // Placeholder, assuming this logic will be handled differently now
        STATUS: 'Status', // No longer in the provided schema
        CREATED_TIME: 'Submission Timestamp', // Mapping to the new field name
    },

    // --- Placeholder schemas for other tables ---
    COURSES: {
        TITLE: 'fldGLScFN9o36F1gi',
        DESCRIPTION: 'fldswXBsxtD62JgXi',
        FORMAT: 'fldK8GIv3kg5dibSj',
        SLUG: 'fld7WYdW0hYR7jUl2',
        EXTERNAL_URL: 'fldt3xNm4cf42dBNO',
        IS_PUBLISHED: 'fldzi5EAjK7iSFQsh',
        CREATED_TIME: 'fldoOzsAhQ9pgiWgC',
    },
    EVENTS: {
        TITLE: 'fldJQovh56G3PeGcE',
        DATE: 'fldxa5phNB56hpNbK',
        TYPE: 'fld1OApGPAnPrDFi9',
        EVENT_CODE: 'fldT2JyzpCpruC7Hj',
        IS_PUBLISHED: 'fld6fZMRqUR8xNzGc',
        SPEAKER: 'fldfWFthJgucLL9Cw',
        DESCRIPTION: 'fldxPmbhLuOW1XYxV',
        COVER_IMAGE: 'fldaSuNFFC9xHWrAT',
        RSVP_COUNT: 'RSVP Count',
    },
    RSVPS: {
        EVENT: 'fldoy3is7eXrL35Bc',
        MEMBER: 'flduPFrNabdrEZt5u',
    },
};
