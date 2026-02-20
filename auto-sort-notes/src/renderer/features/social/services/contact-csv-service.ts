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
 * Unescape CSV value (used when reading a pre-split cell that may still have quotes)
 */
function unescapeCSVValue(value: string): string {
  if (value == null) return '';
  const s = String(value).trim();
  if (!s) return '';
  if (s.startsWith('"') && s.endsWith('"')) {
    return s.slice(1, -1).replace(/""/g, '"');
  }
  return s;
}

/** Multi-value separator used by Google in a single cell (space-colon-colon-colon-space) */
const MULTI_VALUE_SEP = ' ::: ';

/**
 * Parse CSV content into rows of cells (RFC 4180 style).
 * - Comma separates columns; newline separates rows.
 * - Field may be wrapped in double quotes if it contains comma or newline.
 * - Inside quoted field, "" represents one literal double quote.
 * - BOM at start is stripped. \r\n and \r are treated as row terminators.
 * Each cell is returned unescaped (no surrounding quotes, "" already converted to ").
 */
function parseCSVRows(csvContent: string): string[][] {
  const rows: string[][] = [];
  let content = csvContent;
  if (content.length > 0 && content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
  let i = 0;
  const len = content.length;
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  while (i < len) {
    const c = content[i];
    const next = content[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        currentCell += '"';
        i += 2;
      } else if (c === '"') {
        inQuotes = false;
        i += 1;
      } else {
        currentCell += c;
        i += 1;
      }
      continue;
    }

    if (c === ',') {
      currentRow.push(currentCell);
      currentCell = '';
      i += 1;
      continue;
    }

    if (c === '\n' || c === '\r') {
      currentRow.push(currentCell);
      if (currentRow.length > 0 || currentCell !== '') {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
      i += 1;
      if (c === '\r' && next === '\n') i += 1;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    currentCell += c;
    i += 1;
  }

  currentRow.push(currentCell);
  if (currentRow.length > 0 || currentCell !== '') {
    rows.push(currentRow);
  }

  return rows;
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
 * Parse Google Contacts CSV row to Contact.
 * Uses only headerMap for column lookup (no fallback indices) so column shifts cannot occur.
 */
export function googleCSVToContact(row: string[], headerMap?: Map<string, number>, contactId?: string): Contact {
  const getValue = (headerName: string): string => {
    if (!headerMap) return '';
    let index = headerMap.get(headerName) ?? headerMap.get(headerName.trim()) ?? headerMap.get(headerName.toLowerCase());
    if (index === undefined) return '';
    const raw = row[index];
    if (raw === undefined || raw === '') return '';
    return unescapeCSVValue(raw);
  };
  
  // Parse birthday
  let birthday: Date | string | undefined;
  const birthdayStr = getValue('Birthday');
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
  const labelsStr = getValue('Labels');
  const labels = labelsStr ? labelsStr.split(MULTI_VALUE_SEP).map(s => s.trim()).filter(Boolean) : [];

  // Parse emails (only add values that look like email; never add phone numbers)
  const emails: LabeledField[] = [];
  const seenEmails = new Set<string>();
  for (let i = 1; i <= 3; i++) {
    const label = getValue(`E-mail ${i} - Label`);
    let value = getValue(`E-mail ${i} - Value`);
    if (!value && !label) continue;
    const parts = value ? value.split(MULTI_VALUE_SEP).map(v => v.trim()).filter(Boolean) : [value].filter(Boolean) as string[];
    for (const v of parts) {
      if (!v || seenEmails.has(v.toLowerCase())) continue;
      if (looksLikePhone(v)) continue; // do not put phone numbers in email
      if (!looksLikeEmail(v)) continue; // only add if it looks like email
      seenEmails.add(v.toLowerCase());
      emails.push({ label: label || '* Other', value: v });
    }
  }

  // Parse phones (deduplicate by normalized form; " ::: " can appear in one cell)
  const phones: LabeledField[] = [];
  const seenPhones = new Set<string>();
  for (let i = 1; i <= 3; i++) {
    const label = getValue(`Phone ${i} - Label`);
    let value = getValue(`Phone ${i} - Value`);
    if (!value && !label) continue;
    const parts = value ? value.split(MULTI_VALUE_SEP).map(v => v.trim()).filter(Boolean) : [value].filter(Boolean) as string[];
    const usedLabel = label || '* Other';
    parts.forEach((p, idx) => {
      const norm = p.replace(/\D/g, '');
      if (norm.length < 7 || seenPhones.has(norm)) return;
      seenPhones.add(norm);
      phones.push({ label: idx === 0 ? usedLabel : '* Other', value: p });
    });
  }

  // Parse address 1 (by header name only)
  const addresses: ContactAddress[] = [];
  const addressLabel = getValue('Address 1 - Label');
  const addressFormatted = getValue('Address 1 - Formatted');
  const addressStreet = getValue('Address 1 - Street');
  const addressCity = getValue('Address 1 - City');
  const addressPOBox = getValue('Address 1 - PO Box');
  const addressRegion = getValue('Address 1 - Region');
  const addressPostalCode = getValue('Address 1 - Postal Code');
  const addressCountry = getValue('Address 1 - Country');
  const addressExtended = getValue('Address 1 - Extended Address');
  
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
  
  // Parse relationships (Relation N - Label = category e.g. "Business/ Finance", Value = e.g. "Accountant")
  const relationships: LabeledField[] = [];
  for (let i = 1; i <= 3; i++) {
    const label = getValue(`Relation ${i} - Label`);
    const value = getValue(`Relation ${i} - Value`);
    if (label || value) {
      relationships.push({ label: label || '* Other', value });
    }
  }

  // Parse websites (" ::: " possible; take first per slot)
  const websites: LabeledField[] = [];
  for (let i = 1; i <= 2; i++) {
    const label = getValue(`Website ${i} - Label`);
    const value = getValue(`Website ${i} - Value`);
    const first = value ? value.split(MULTI_VALUE_SEP).map(v => v.trim()).filter(Boolean)[0] ?? '' : '';
    if (!first && !label) continue;
    websites.push({ label: label || '* Other', value: first || '' });
  }

  // Parse events
  const events: ContactEvent[] = [];
  for (let i = 1; i <= 2; i++) {
    const label = getValue(`Event ${i} - Label`);
    const value = getValue(`Event ${i} - Value`);
    const first = value ? value.split(MULTI_VALUE_SEP).map(v => v.trim()).filter(Boolean)[0] ?? '' : '';
    if (!first && !label) continue;
    let eventValue: Date | string = first;
    try {
      const d = new Date(first);
      if (!isNaN(d.getTime())) eventValue = d;
    } catch {
      // keep string
    }
    events.push({ label: label || '* Other', value: eventValue });
  }

  // Parse custom fields
  const customFields: LabeledField[] = [];
  const customLabel = getValue('Custom Field 1 - Label');
  const customValue = getValue('Custom Field 1 - Value');
  if (customLabel || customValue) {
    customFields.push({ label: customLabel || '* Other', value: customValue });
  }
  
  const now = new Date();
  
  return {
    id: contactId || `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    firstName: getValue('First Name') || 'Unknown',
    middleName: getValue('Middle Name') || undefined,
    lastName: getValue('Last Name') || '',
    phoneticFirstName: getValue('Phonetic First Name') || undefined,
    phoneticMiddleName: getValue('Phonetic Middle Name') || undefined,
    phoneticLastName: getValue('Phonetic Last Name') || undefined,
    namePrefix: getValue('Name Prefix') || undefined,
    nameSuffix: getValue('Name Suffix') || undefined,
    nickname: getValue('Nickname') || undefined,
    fileAs: getValue('File As') || undefined,
    organizationName: getValue('Organization Name') || undefined,
    organizationTitle: getValue('Organization Title') || undefined,
    organizationDepartment: getValue('Organization Department') || undefined,
    birthday,
    notes: getValue('Notes') || undefined,
    photo: getValue('Photo') || undefined,
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
 * Build header name -> column index map.
 * Uses trimmed header names; also stores lowercase for case-insensitive lookup.
 * No fallback indices - we only read by header name so column order is reliable.
 */
function createHeaderMap(headers: string[]): Map<string, number> {
  const map = new Map<string, number>();
  headers.forEach((header, index) => {
    const trimmed = header.trim();
    if (trimmed) {
      map.set(trimmed, index);
      const lower = trimmed.toLowerCase();
      if (lower !== trimmed) map.set(lower, index);
    }
  });
  return map;
}

/** Return true if string looks like a phone number (not an email). */
function looksLikePhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 && /^[\d\s\-\(\)\+\.]+$/.test(value.trim());
}

/** Return true if string looks like an email (not a phone). */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
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

