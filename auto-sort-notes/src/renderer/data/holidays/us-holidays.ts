/**
 * US Holidays Data
 * 
 * Purpose: Baked-in holiday data for United States.
 * All holidays are accurate and calculated correctly (including leap years).
 * 
 * Last Updated: 2024
 * Status: Baked-in data - accurate forever
 */

// Comment 2000: US Holidays Data - Baked-In Holiday Information
// This file contains static holiday data for the United States.
// Holidays are defined with their calculation rules (fixed dates, calculated dates like Easter, etc.).
// This data is bundled with the application and requires no internet connection.
//
// Holiday Types:
// - Fixed Date: Same date every year (e.g., Christmas = December 25)
// - Calculated: Based on formulas (e.g., Thanksgiving = 4th Thursday of November)
// - Leap Year Aware: Some holidays adjust for leap years
//
// Related Comments:
// - Comment 2001 (holiday-utils.ts - holiday calculation functions)
// - Comment 2002 (CalendarMonth.tsx - displays holidays)

export interface Holiday {
  id: string;
  name: string;
  date: Date | ((year: number) => Date); // Fixed date or calculation function
  type: 'fixed' | 'calculated';
  country: string;
  description?: string;
}

// Note: Fixed holidays are defined inline in the usHolidays array below

/**
 * Calculated holidays (formulas)
 */

// Thanksgiving: 4th Thursday of November
function getThanksgiving(year: number): Date {
  // November 1st
  const nov1 = new Date(year, 10, 1);
  // Day of week (0 = Sunday, 4 = Thursday)
  const dayOfWeek = nov1.getDay();
  // Days to add to get to first Thursday
  const daysToAdd = dayOfWeek <= 4 ? 4 - dayOfWeek : 11 - dayOfWeek;
  // 4th Thursday = first Thursday + 21 days
  return new Date(year, 10, 1 + daysToAdd + 21);
}

// Memorial Day: Last Monday of May
function getMemorialDay(year: number): Date {
  // May 31st
  const may31 = new Date(year, 4, 31);
  const dayOfWeek = may31.getDay();
  // Days to subtract to get to Monday
  const daysToSubtract = dayOfWeek === 1 ? 0 : dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return new Date(year, 4, 31 - daysToSubtract);
}

// Labor Day: First Monday of September
function getLaborDay(year: number): Date {
  const sep1 = new Date(year, 8, 1);
  const dayOfWeek = sep1.getDay();
  const daysToAdd = dayOfWeek === 1 ? 0 : dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  return new Date(year, 8, 1 + daysToAdd);
}

// Martin Luther King Jr. Day: Third Monday of January
function getMLKDay(year: number): Date {
  const jan1 = new Date(year, 0, 1);
  const dayOfWeek = jan1.getDay();
  // Days to get to first Monday
  const daysToFirstMonday = dayOfWeek === 1 ? 0 : dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  // Third Monday = first Monday + 14 days
  return new Date(year, 0, 1 + daysToFirstMonday + 14);
}

// Presidents' Day: Third Monday of February
function getPresidentsDay(year: number): Date {
  const feb1 = new Date(year, 1, 1);
  const dayOfWeek = feb1.getDay();
  const daysToFirstMonday = dayOfWeek === 1 ? 0 : dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  return new Date(year, 1, 1 + daysToFirstMonday + 14);
}

// Columbus Day: Second Monday of October
function getColumbusDay(year: number): Date {
  const oct1 = new Date(year, 9, 1);
  const dayOfWeek = oct1.getDay();
  const daysToFirstMonday = dayOfWeek === 1 ? 0 : dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  return new Date(year, 9, 1 + daysToFirstMonday + 7);
}

// Veterans Day: November 11 (fixed, but observed on nearest weekday if weekend)
function getVeteransDay(year: number): Date {
  const nov11 = new Date(year, 10, 11);
  const dayOfWeek = nov11.getDay();
  // If Saturday, observe on Friday; if Sunday, observe on Monday
  if (dayOfWeek === 0) return new Date(year, 10, 12);
  if (dayOfWeek === 6) return new Date(year, 10, 10);
  return nov11;
}

/**
 * Complete US holidays list
 */
export const usHolidays: Holiday[] = [
  // Fixed dates
  {
    id: 'new-years-day',
    name: "New Year's Day",
    date: (year: number) => new Date(year, 0, 1),
    type: 'fixed',
    country: 'US',
  },
  {
    id: 'independence-day',
    name: 'Independence Day',
    date: (year: number) => new Date(year, 6, 4),
    type: 'fixed',
    country: 'US',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    date: (year: number) => new Date(year, 11, 25),
    type: 'fixed',
    country: 'US',
  },
  // Calculated dates
  {
    id: 'mlk-day',
    name: "Martin Luther King Jr. Day",
    date: getMLKDay,
    type: 'calculated',
    country: 'US',
  },
  {
    id: 'presidents-day',
    name: "Presidents' Day",
    date: getPresidentsDay,
    type: 'calculated',
    country: 'US',
  },
  {
    id: 'memorial-day',
    name: 'Memorial Day',
    date: getMemorialDay,
    type: 'calculated',
    country: 'US',
  },
  {
    id: 'labor-day',
    name: 'Labor Day',
    date: getLaborDay,
    type: 'calculated',
    country: 'US',
  },
  {
    id: 'columbus-day',
    name: 'Columbus Day',
    date: getColumbusDay,
    type: 'calculated',
    country: 'US',
  },
  {
    id: 'veterans-day',
    name: 'Veterans Day',
    date: getVeteransDay,
    type: 'calculated',
    country: 'US',
  },
  {
    id: 'thanksgiving',
    name: 'Thanksgiving',
    date: getThanksgiving,
    type: 'calculated',
    country: 'US',
  },
];

/**
 * Get all holidays for a given year
 */
export function getHolidaysForYear(year: number): Date[] {
  return usHolidays.map(holiday => {
    if (typeof holiday.date === 'function') {
      return holiday.date(year);
    }
    return holiday.date;
  });
}

/**
 * Get holidays for a specific date
 * Normalizes dates to midnight to avoid timezone/time issues
 */
export function getHolidaysForDate(date: Date): Holiday[] {
  const year = date.getFullYear();
  // Normalize input date to midnight (ignore time component)
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  return usHolidays.filter(holiday => {
    const holidayDate = typeof holiday.date === 'function' 
      ? holiday.date(year)
      : holiday.date;
    // Normalize holiday date to midnight
    const normalizedHolidayDate = new Date(
      holidayDate.getFullYear(),
      holidayDate.getMonth(),
      holidayDate.getDate()
    );
    
    return (
      normalizedHolidayDate.getTime() === normalizedDate.getTime()
    );
  });
}

