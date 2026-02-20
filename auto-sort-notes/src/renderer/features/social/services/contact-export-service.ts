/**
 * Contact Export Service
 * 
 * Purpose: Business logic for exporting contacts to standard formats (vCard, CSV).
 * 
 * Last Updated: 2024
 * Status: Active - Complete export service
 */

// Comment 412: Contact Export Service - Contact Export Operations
// This service handles exporting contacts to standard formats.
// Converts contact data to vCard or CSV format.
//
// Intended Interactions:
// - Called by: ContactExportDialog component (Comment 411)
// - Exports: Contact data to vCard (.vcf) or CSV (.csv) format
//
// Related Comments:
// - Comment 411 (ContactExportDialog.tsx - export dialog component)

import { ContactExportData } from '../components/ContactExportDialog';

export const contactExportService = {
  /**
   * Generate vCard content from contact export data
   */
  generateVCard(exportData: ContactExportData): string {
    const lines: string[] = [];
    
    lines.push('BEGIN:VCARD');
    lines.push('VERSION:3.0');
    
    // Name
    const fullName = `${exportData.firstName || ''} ${exportData.lastName || ''}`.trim();
    if (fullName) {
      lines.push(`FN:${escapeVCardValue(fullName)}`);
      lines.push(`N:${escapeVCardValue(exportData.lastName || '')};${escapeVCardValue(exportData.firstName || '')};;;`);
    }
    
    // Nickname
    if (exportData.nickname) {
      lines.push(`NICKNAME:${escapeVCardValue(exportData.nickname)}`);
    }
    
    // Email
    if (exportData.email) {
      lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(exportData.email)}`);
    }
    
    // Phone
    if (exportData.phone) {
      lines.push(`TEL;TYPE=CELL:${escapeVCardValue(exportData.phone)}`);
    }
    
    // Organization
    if (exportData.organization) {
      lines.push(`ORG:${escapeVCardValue(exportData.organization)}`);
    }
    
    // Title
    if (exportData.title) {
      lines.push(`TITLE:${escapeVCardValue(exportData.title)}`);
    }
    
    // Website
    if (exportData.website) {
      lines.push(`URL:${escapeVCardValue(exportData.website)}`);
    }
    
    // Address
    if (exportData.address) {
      lines.push(`ADR;TYPE=HOME:;;${escapeVCardValue(exportData.address)};;;;`);
    }
    
    // Birthday
    if (exportData.birthday) {
      const birthday = exportData.birthday instanceof Date 
        ? exportData.birthday 
        : new Date(exportData.birthday);
      const year = birthday.getFullYear();
      const month = String(birthday.getMonth() + 1).padStart(2, '0');
      const day = String(birthday.getDate()).padStart(2, '0');
      lines.push(`BDAY:${year}${month}${day}`);
    }
    
    // Photo
    if (exportData.photo) {
      // If photo is a data URL, extract base64 data
      if (exportData.photo.startsWith('data:')) {
        const base64Match = exportData.photo.match(/data:image\/([^;]+);base64,(.+)/);
        if (base64Match) {
          const [, imageType, base64Data] = base64Match;
          lines.push(`PHOTO;ENCODING=b;TYPE=${imageType.toUpperCase()}:${base64Data}`);
        }
      } else {
        // URL to photo
        lines.push(`PHOTO;VALUE=URI:${escapeVCardValue(exportData.photo)}`);
      }
    }
    
    // Notes
    if (exportData.notes) {
      lines.push(`NOTE:${escapeVCardValue(exportData.notes)}`);
    }
    
    lines.push('END:VCARD');
    
    return lines.join('\r\n');
  },

  /**
   * Generate CSV content from contact export data
   * Uses Google Contacts CSV format for compatibility
   */
  generateCSV(exportData: ContactExportData): string {
    // Convert export data to Contact format for CSV generation
    const contact: Contact = {
      id: exportData.id || 'export',
      firstName: exportData.firstName || '',
      lastName: exportData.lastName || '',
      nickname: exportData.nickname,
      photo: exportData.photo,
      organizationName: exportData.organization,
      organizationTitle: exportData.title,
      birthday: exportData.birthday,
      notes: exportData.notes,
      emails: exportData.email ? [{ label: '* Work', value: exportData.email }] : undefined,
      phones: exportData.phone ? [{ label: '* Work', value: exportData.phone }] : undefined,
      addresses: exportData.address ? [{ label: '* Work', formatted: exportData.address, street: exportData.address }] : undefined,
      websites: exportData.website ? [{ label: '* Work', value: exportData.website }] : undefined,
      displayCustomName: false,
      quickViewFields: [],
      entries: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const headerRow = GOOGLE_CSV_HEADERS.join(',');
    const dataRow = contactToGoogleCSV(contact);
    
    return `${headerRow}\r\n${dataRow}`;
  },

  /**
   * Download contact file
   */
  async downloadContactFile(content: string, filename: string, mimeType: string): Promise<void> {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};

/**
 * Escape special characters for vCard format
 */
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

/**
 * Escape special characters for CSV format
 */
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

