/**
 * Date Utilities
 * 
 * Purpose: Date manipulation and formatting utilities using date-fns.
 * 
 * Last Updated: 2024
 * Status: Active - Uses date-fns for accurate date calculations
 */

// Comment 009: Date Utilities - Date Manipulation
// This utility provides date manipulation and formatting functions using date-fns.
// Used across calendar, todos, alarms, and other date-related features.
// All functions use date-fns for accurate date calculations (leap years, month boundaries, etc.).
//
// Related Comments:
// - Comment 100 (calendar-service.ts - uses date utilities)
// - Comment 2002 (CalendarMonth.tsx - uses date utilities)

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getDaysInMonth,
  isLeapYear,
} from 'date-fns';

export const dateUtils = {
  /**
   * Get the first day of a month
   */
  getStartOfMonth: (date: Date) => startOfMonth(date),

  /**
   * Get the last day of a month
   */
  getEndOfMonth: (date: Date) => endOfMonth(date),

  /**
   * Get the first day of the week for a date (start of calendar grid)
   */
  getStartOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 0 }), // Sunday = 0

  /**
   * Get the last day of the week for a date (end of calendar grid)
   */
  getEndOfWeek: (date: Date) => endOfWeek(date, { weekStartsOn: 0 }),

  /**
   * Get all days in a date range (for calendar grid)
   */
  getDaysInRange: (start: Date, end: Date) => eachDayOfInterval({ start, end }),

  /**
   * Format a date
   */
  formatDate: (date: Date, formatString: string) => format(date, formatString),

  /**
   * Check if two dates are in the same month
   */
  isSameMonth: (date1: Date, date2: Date) => isSameMonth(date1, date2),

  /**
   * Check if two dates are the same day
   */
  isSameDay: (date1: Date, date2: Date) => isSameDay(date1, date2),

  /**
   * Check if a date is today
   */
  isToday: (date: Date) => isToday(date),

  /**
   * Add months to a date
   */
  addMonths: (date: Date, months: number) => addMonths(date, months),

  /**
   * Subtract months from a date
   */
  subMonths: (date: Date, months: number) => subMonths(date, months),

  /**
   * Get number of days in a month (handles leap years automatically)
   */
  getDaysInMonth: (date: Date) => getDaysInMonth(date),

  /**
   * Check if a year is a leap year
   */
  isLeapYear: (date: Date) => isLeapYear(date),
};
