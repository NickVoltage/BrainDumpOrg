/**
 * Holiday Utilities
 * 
 * Purpose: Utility functions for working with baked-in holiday data.
 * 
 * Last Updated: 2024
 * Status: Utility functions for holiday calculations
 */

// Comment 2001: Holiday Utilities - Holiday Calculation Functions
// This utility provides functions to work with baked-in holiday data.
// Handles holiday lookups, date comparisons, and holiday display.
//
// Related Comments:
// - Comment 2000 (us-holidays.ts - holiday data source)
// - Comment 2002 (CalendarMonth.tsx - uses these utilities)

import { getHolidaysForDate, Holiday } from '../../data/holidays/us-holidays';

/**
 * Check if a date is a holiday
 */
export function isHoliday(date: Date): boolean {
  const holidays = getHolidaysForDate(date);
  return holidays.length > 0;
}

/**
 * Get holiday names for a date
 */
export function getHolidayNames(date: Date): string[] {
  const holidays = getHolidaysForDate(date);
  return holidays.map(h => h.name);
}

/**
 * Get all holiday objects for a date
 */
export function getHolidays(date: Date): Holiday[] {
  return getHolidaysForDate(date);
}

