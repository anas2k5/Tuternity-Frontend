// src/utils/dateUtils.js

/**
 * Generates the date string for tomorrow in YYYY-MM-DD format (ISO 8601).
 * This is used to pre-fill the availability form for easy testing.
 */
export const getCurrentDateString = () => {
    // Get the current date
    const tomorrow = new Date();
    
    // Add one day to the current date
    tomorrow.setDate(tomorrow.getDate() + 1); 
    
    // Format to YYYY-MM-DD string
    return tomorrow.toISOString().split('T')[0];
};