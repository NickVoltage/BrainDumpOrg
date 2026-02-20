/**
 * Contact CSV Service
 * 
 * Purpose: Import/Export contacts in Google Contacts CSV format.
 * 
 * Last Updated: 2024
 * Status: Active - Google Contacts CSV compatibility
 */

// Comment 413: Contact CSV Service - Google Contacts CSV Import/Export
// This service handles importing and exporting contacts in Google Contacts CSV format.
// Supports all Google Contacts fields including multiple emails, phones, addresses, etc.
//
// Intended Interactions:
// - Called by: ContactList (import), ContactExportDialog (export)
// - Formats: Google Contacts CSV format
//
// Related Comments:
// - Comment 412 (contact-export-service.ts - general export service)

import { Contact, LabeledField, ContactAddress, ContactEvent } from '../types';

/**
 * Google Contacts CSV column headers
 */
export const GOOGLE_CSV_HEADERS = [
  'First Name', 'Middle Name', 'Last Name',
  'Phonetic First Name', 'Phonetic Middle Name', 'Phonetic Last Name',
  'Name Prefix', 'Name Suffix', 'Nickname', 'File As',
  'Organization Name', 'Organization Title', 'Organization Department',
  'Birthday', 'Notes', 'Photo', 'Labels',
  'E-mail 1 - Label', 'E-mail 1 - Value',
  'E-mail 2 - Label', 'E-mail 2 - Value',
  'E-mail 3 - Label', 'E-mail 3 - Value',
  'Phone 1 - Label', 'Phone 1 - Value',
  'Phone 2 - Label', 'Phone 2 - Value',
  'Phone 3 - Label', 'Phone 3 - Value',
  'Address 1 - Label', 'Address 1 - Formatted', 'Address 1 - Street',
  'Address 1 - City', 'Address 1 - PO Box', 'Address 1 - Region',
  'Address 1 - Postal Code', 'Address 1 - Country', 'Address 1 - Extended Address',
  'Relation 1 - Label', 'Relation 1 - Value',
  'Relation 2 - Label', 'Relation 2 - Value',
  'Relation 3 - Label', 'Relation 3 - Value',
  'Website 1 - Label', 'Website 1 - Value',
  'Website 2 - Label', 'Website 2 - Value',
  'Event 1 - Label', 'Event 1 - Value',
  'Event 2 - Label', 'Event 2 - Value',
  'Custom Field 1 - Label', 'Custom Field 1 - Value',
];

/**
 * Escape CSV value (handles quotes and commas)
 */
function escapeCSVValue(value: string): string {
  if (!value) return '';
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Unescape CSV value
 */
function unescapeCSVValue(value: string): string {
  if (!value) return '';
  // Remove surrounding quotes if present
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
    // Unescape double quotes
    value = value.replace(/""/g, '"');
  }
  return value;
}

/**
 * Parse CSV line (handles quoted values with commas and newlines)
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  values.push(current);
  
  return values;
}

/**
 * Convert Contact to Google Contacts CSV row
 */
export function contactToGoogleCSV(contact: Contact): string {
  const values: string[] = [];
  
  // Basic name fields
  values.push(escapeCSVValue(contact.firstName || ''));
  values.push(escapeCSVValue(contact.middleName || ''));
  values.push(escapeCSVValue(contact.lastName || ''));
  values.push(escapeCSVValue(contact.phoneticFirstName || ''));
  values.push(escapeCSVValue(contact.phoneticMiddleName || ''));
  values.push(escapeCSVValue(contact.phoneticLastName || ''));
  values.push(escapeCSVValue(contact.namePrefix || ''));
  values.push(escapeCSVValue(contact.nameSuffix || ''));
  values.push(escapeCSVValue(contact.nickname || ''));
  values.push(escapeCSVValue(contact.fileAs || ''));
  
  // Organization
  values.push(escapeCSVValue(contact.organizationName || ''));
  values.push(escapeCSVValue(contact.organizationTitle || ''));
  values.push(escapeCSVValue(contact.organizationDepartment || ''));
  
  // Birthday (format as YYYY-MM-DD)
  let birthdayStr = '';
  if (contact.birthday) {
    if (contact.birthday instanceof Date) {
      birthdayStr = contact.birthday.toISOString().split('T')[0];
    } else {
      birthdayStr = contact.birthday;
    }
  }
  values.push(escapeCSVValue(birthdayStr));
  
  // Notes
  values.push(escapeCSVValue(contact.notes || ''));
  
  // Photo (URL)
  values.push(escapeCSVValue(contact.photo || ''));
  
  // Labels (join with " ::: ")
  const labels = contact.labels || [];
  values.push(escapeCSVValue(labels.join(' ::: ')));
  
  // Emails (up to 3)
  for (let i = 0; i < 3; i++) {
    const email = contact.emails?.[i];
    values.push(escapeCSVValue(email?.label || ''));
    values.push(escapeCSVValue(email?.value || ''));
  }
  
  // Phones (up to 3)
  for (let i = 0; i < 3; i++) {
    const phone = contact.phones?.[i];
    values.push(escapeCSVValue(phone?.label || ''));
    values.push(escapeCSVValue(phone?.value || ''));
  }
  
  // Address 1
  const address = contact.addresses?.[0];
  values.push(escapeCSVValue(address?.label || ''));
  // Formatted address (combine all parts)
  const formattedParts: string[] = [];
  if (address?.street) formattedParts.push(address.street);
  if (address?.city) {
    const cityLine = [address.city];
    if (address.region) cityLine.push(address.region);
    if (address.postalCode) cityLine.push(address.postalCode);
    formattedParts.push(cityLine.join(', '));
  }
  if (address?.country) formattedParts.push(address.country);
  values.push(escapeCSVValue(formattedParts.join('\n')));
  values.push(escapeCSVValue(address?.street || ''));
  values.push(escapeCSVValue(address?.city || ''));
  values.push(escapeCSVValue(address?.poBox || ''));
  values.push(escapeCSVValue(address?.region || ''));
  values.push(escapeCSVValue(address?.postalCode || ''));
  values.push(escapeCSVValue(address?.country || ''));
  values.push(escapeCSVValue(address?.extendedAddress || ''));
  
  // Relationships (up to 3)
  for (let i = 0; i < 3; i++) {
    const relation = contact.relationships?.[i];
    values.push(escapeCSVValue(relation?.label || ''));
    values.push(escapeCSVValue(relation?.value || ''));
  }
  
  // Websites (up to 2)
  for (let i = 0; i < 2; i++) {
    const website = contact.websites?.[i];
    values.push(escapeCSVValue(website?.label || ''));
    values.push(escapeCSVValue(website?.value || ''));
  }
  
  // Events (up to 2) - Birthday is already in birthday field, so these are Anniversary/Other
  for (let i = 0; i < 2; i++) {
    const event = contact.events?.[i];
    let eventValue = '';
    if (event?.value) {
      if (event.value instanceof Date) {
        eventValue = event.value.toISOString().split('T')[0];
      } else {
        eventValue = event.value;
      }
    }
    values.push(escapeCSVValue(event?.label || ''));
    values.push(escapeCSVValue(eventValue));
  }
  
  // Custom Fields (up to 1)
  const customField = contact.customFields?.[0];
  values.push(escapeCSVValue(customField?.label || ''));
  values.push(escapeCSVValue(customField?.value || ''));
  
  return values.join(',');
}

/**
 * Parse Google Contacts CSV row to Contact
 */
export function googleCSVToContact(row: string[], headerMap?: Map<string, number>, contactId?: string): Contact {
  // Helper to get value by header name or index (for backward compatibility)
  const getValue = (headerName: string, fallbackIndex?: number) => {
    if (headerMap) {
      const index = headerMap.get(headerName);
      if (index !== undefined && row[index] !== undefined) {
        return unescapeCSVValue(row[index]);
      }
    }
    if (fallbackIndex !== undefined) {
      return unescapeCSVValue(row[fallbackIndex] || '');
    }
    return '';
  };
  
  // Parse birthday
  let birthday: Date | string | undefined;
  const birthdayStr = getValue('Birthday', 13);
  if (birthdayStr) {
    try {
      birthday = new Date(birthdayStr);
      if (isNaN(birthday.getTime())) {
        birthday = birthdayStr; // Keep as string if invalid date
      }
    } catch {
      birthday = birthdayStr;
    }
  }
  
  // Parse labels (split by " ::: ")
  const labelsStr = getValue('Labels', 16);
  const labels = labelsStr ? labelsStr.split(' ::: ').filter(l => l.trim()) : [];
  
  // Parse emails
  const emails: LabeledField[] = [];
  for (let i = 1; i <= 3; i++) {
    const label = getValue(`E-mail ${i} - Label`, 17 + (i - 1) * 2);
    const value = getValue(`E-mail ${i} - Value`, 18 + (i - 1) * 2);
    if (label || value) {
      emails.push({ label: label || '* Other', value });
    }
  }
  
  // Parse phones
  const phones: LabeledField[] = [];
  for (let i = 1; i <= 3; i++) {
    const label = getValue(`Phone ${i} - Label`, 23 + (i - 1) * 2);
    const value = getValue(`Phone ${i} - Value`, 24 + (i - 1) * 2);
    if (label || value) {
      phones.push({ label: label || '* Other', value });
    }
  }
  
  // Parse address 1
  const addresses: ContactAddress[] = [];
  const addressLabel = getValue('Address 1 - Label', 29);
  const addressFormatted = getValue('Address 1 - Formatted', 30);
  const addressStreet = getValue('Address 1 - Street', 31);
  const addressCity = getValue('Address 1 - City', 32);
  const addressPOBox = getValue('Address 1 - PO Box', 33);
  const addressRegion = getValue('Address 1 - Region', 34);
  const addressPostalCode = getValue('Address 1 - Postal Code', 35);
  const addressCountry = getValue('Address 1 - Country', 36);
  const addressExtended = getValue('Address 1 - Extended Address', 37);
  
  if (addressLabel || addressStreet || addressCity || addressFormatted) {
    addresses.push({
      label: addressLabel || '* Other',
      formatted: addressFormatted,
      street: addressStreet,
      city: addressCity,
      poBox: addressPOBox,
      region: addressRegion,
      postalCode: addressPostalCode,
      country: addressCountry,
      extendedAddress: addressExtended,
    });
  }
  
  // Parse relationships
  const relationships: LabeledField[] = [];
  for (let i = 1; i <= 3; i++) {
    const label = getValue(`Relation ${i} - Label`, 38 + (i - 1) * 2);
    const value = getValue(`Relation ${i} - Value`, 39 + (i - 1) * 2);
    if (label || value) {
      relationships.push({ label: label || '* Other', value });
    }
  }
  
  // Parse websites
  const websites: LabeledField[] = [];
  for (let i = 1; i <= 2; i++) {
    const label = getValue(`Website ${i} - Label`, 44 + (i - 1) * 2);
    const value = getValue(`Website ${i} - Value`, 45 + (i - 1) * 2);
    if (label || value) {
      websites.push({ label: label || '* Other', value });
    }
  }
  
  // Parse events
  const events: ContactEvent[] = [];
  for (let i = 1; i <= 2; i++) {
    const label = getValue(`Event ${i} - Label`, 48 + (i - 1) * 2);
    const value = getValue(`Event ${i} - Value`, 49 + (i - 1) * 2);
    if (label || value) {
      let eventValue: Date | string = value;
      try {
        const dateValue = new Date(value);
        if (!isNaN(dateValue.getTime())) {
          eventValue = dateValue;
        }
      } catch {
        // Keep as string
      }
      events.push({ label: label || '* Other', value: eventValue });
    }
  }
  
  // Parse custom fields
  const customFields: LabeledField[] = [];
  const customLabel = getValue('Custom Field 1 - Label', 52);
  const customValue = getValue('Custom Field 1 - Value', 53);
  if (customLabel || customValue) {
    customFields.push({ label: customLabel || '* Other', value: customValue });
  }
  
  const now = new Date();
  
  return {
    id: contactId || `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    firstName: getValue('First Name', 0) || 'Unknown',
    middleName: getValue('Middle Name', 1) || undefined,
    lastName: getValue('Last Name', 2) || '',
    phoneticFirstName: getValue('Phonetic First Name', 3) || undefined,
    phoneticMiddleName: getValue('Phonetic Middle Name', 4) || undefined,
    phoneticLastName: getValue('Phonetic Last Name', 5) || undefined,
    namePrefix: getValue('Name Prefix', 6) || undefined,
    nameSuffix: getValue('Name Suffix', 7) || undefined,
    nickname: getValue('Nickname', 8) || undefined,
    fileAs: getValue('File As', 9) || undefined,
    organizationName: getValue('Organization Name', 10) || undefined,
    organizationTitle: getValue('Organization Title', 11) || undefined,
    organizationDepartment: getValue('Organization Department', 12) || undefined,
    birthday,
    notes: getValue('Notes', 14) || undefined,
    photo: getValue('Photo', 15) || undefined,
    labels: labels.length > 0 ? labels : undefined,
    emails: emails.length > 0 ? emails : undefined,
    phones: phones.length > 0 ? phones : undefined,
    addresses: addresses.length > 0 ? addresses : undefined,
    relationships: relationships.length > 0 ? relationships : undefined,
    websites: websites.length > 0 ? websites : undefined,
    events: events.length > 0 ? events : undefined,
    customFields: customFields.length > 0 ? customFields : undefined,
    displayCustomName: false,
    quickViewFields: [],
    entries: [],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Generate Google Contacts CSV from array of contacts
 */
export function contactsToGoogleCSV(contacts: Contact[]): string {
  const headerRow = GOOGLE_CSV_HEADERS.join(',');
  const dataRows = contacts.map(contact => contactToGoogleCSV(contact));
  return [headerRow, ...dataRows].join('\r\n');
}

/**
 * Parse CSV rows properly handling multi-line quoted values
 */
function parseCSVRows(csvContent: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of row (only if not in quotes)
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      }
      // Skip \r\n combination
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
    } else {
      currentField += char;
    }
  }
  
  // Add last field and row if any
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  
  return rows;
}

/**
 * Create header index mapping
 */
function createHeaderMap(headers: string[]): Map<string, number> {
  const map = new Map<string, number>();
  headers.forEach((header, index) => {
    const normalizedHeader = header.trim();
    if (normalizedHeader) {
      map.set(normalizedHeader, index);
    }
  });
  return map;
}

/**
 * Parse Google Contacts CSV file content
 */
export function parseGoogleCSV(csvContent: string): Contact[] {
  const rows = parseCSVRows(csvContent);
  if (rows.length === 0) return [];
  
  // First row is headers - create mapping
  const headers = rows[0];
  const headerMap = createHeaderMap(headers);
  
  // Parse data rows
  const contacts: Contact[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length > 0 && row[0]?.trim()) { // At least first name should exist
      try {
        contacts.push(googleCSVToContact(row, headerMap));
      } catch (error) {
        console.error(`Error parsing contact row ${i}:`, error);
        // Continue with next contact
      }
    }
  }
  
  return contacts;
}

