/**
 * Contact Type Definitions
 * 
 * Purpose: Default contact types and their category structures.
 * 
 * Last Updated: 2024
 * Status: Active - Contact type system configuration
 */

import { ContactTypeCategory, ContactTypeCategoryValue } from '../types';

/**
 * Default contact type names
 */
export const DEFAULT_CONTACT_TYPES = [
  'Medical',
  'Family',
  'Friend',
  'Romantic',
  'Career',
  'Finance',
] as const;

export type DefaultContactType = typeof DEFAULT_CONTACT_TYPES[number];

/**
 * Default categories and values for each contact type
 */
export const CONTACT_TYPE_DEFINITIONS: Record<string, {
  categories: Omit<ContactTypeCategory, 'id' | 'value'>[];
}> = {
  Medical: {
    categories: [
      {
        title: 'Practice Name',
        isTextInput: true,
      },
      {
        title: 'Specialty',
        values: [
          { id: 'primary-care', label: 'Primary Care' },
          { id: 'emergency', label: 'Emergency' },
          { id: 'ear-nose-throat', label: 'Ear Nose and Throat' },
          { id: 'cardiology', label: 'Cardiology' },
          { id: 'dermatology', label: 'Dermatology' },
          { id: 'orthopedics', label: 'Orthopedics' },
          { id: 'pediatrics', label: 'Pediatrics' },
          { id: 'internal-medicine', label: 'Internal Medicine' },
          { id: 'surgery', label: 'Surgery' },
          { id: 'mental-health', label: 'Mental Health' },
        ] as ContactTypeCategoryValue[],
      },
      {
        title: 'Position',
        values: [
          { id: 'provider', label: 'Provider' },
          { id: 'billing', label: 'Billing' },
          { id: 'front-desk', label: 'Front Desk' },
          { id: 'scheduling', label: 'Scheduling' },
          { id: 'records', label: 'Records' },
          { id: 'nurse', label: 'Nurse' },
          { id: 'physician-assistant', label: 'Physician Assistant' },
          { id: 'nurse-practitioner', label: 'Nurse Practitioner' },
        ] as ContactTypeCategoryValue[],
      },
      {
        title: 'Patient',
        values: [
          { id: 'me', label: 'Me' },
          { id: 'family-member', label: 'Family Member' },
        ] as ContactTypeCategoryValue[],
      },
    ],
  },
  Family: {
    categories: [
      {
        title: 'Relationship',
        values: [
          { id: 'parent', label: 'Parent' },
          { id: 'sibling', label: 'Sibling' },
          { id: 'child', label: 'Child' },
          { id: 'spouse', label: 'Spouse' },
          { id: 'grandparent', label: 'Grandparent' },
          { id: 'grandchild', label: 'Grandchild' },
          { id: 'aunt-uncle', label: 'Aunt/Uncle' },
          { id: 'cousin', label: 'Cousin' },
          { id: 'in-law', label: 'In-Law' },
        ] as ContactTypeCategoryValue[],
      },
      {
        title: 'Geographic Area',
        isTextInput: true,
      },
    ],
  },
  Friend: {
    categories: [
      {
        title: 'Met at',
        isTextInput: true,
      },
      {
        title: 'Relationship',
        values: [
          { id: 'friend-of', label: 'Friend of' },
          { id: 'acquaintance', label: 'Acquaintance' },
          { id: 'close-friend', label: 'Close Friend' },
          { id: 'work-friend', label: 'Work Friend' },
        ] as ContactTypeCategoryValue[],
      },
      {
        title: 'Geographic Area',
        isTextInput: true,
      },
    ],
  },
  Romantic: {
    categories: [
      {
        title: 'Met at',
        isTextInput: true,
      },
      {
        title: 'Status',
        values: [
          { id: 'dating', label: 'Dating' },
          { id: 'serious', label: 'Serious' },
          { id: 'engaged', label: 'Engaged' },
          { id: 'married', label: 'Married' },
          { id: 'separated', label: 'Separated' },
          { id: 'divorced', label: 'Divorced' },
        ] as ContactTypeCategoryValue[],
      },
      {
        title: 'Geographic Area',
        isTextInput: true,
      },
    ],
  },
  Career: {
    categories: [
      {
        title: 'Company',
        isTextInput: true,
      },
      {
        title: 'Position',
        isTextInput: true,
      },
      {
        title: 'Department',
        isTextInput: true,
      },
      {
        title: 'Relationship',
        values: [
          { id: 'colleague', label: 'Colleague' },
          { id: 'manager', label: 'Manager' },
          { id: 'direct-report', label: 'Direct Report' },
          { id: 'client', label: 'Client' },
          { id: 'vendor', label: 'Vendor' },
          { id: 'partner', label: 'Partner' },
        ] as ContactTypeCategoryValue[],
      },
      {
        title: 'Geographic Area',
        isTextInput: true,
      },
    ],
  },
  Finance: {
    categories: [
      {
        title: 'Institution',
        isTextInput: true,
      },
      {
        title: 'Type',
        values: [
          { id: 'cpa', label: 'CPA' },
          { id: 'retirement', label: 'Retirement' },
          { id: 'banking', label: 'Banking' },
          { id: 'investment', label: 'Investment' },
          { id: 'insurance', label: 'Insurance' },
          { id: 'tax', label: 'Tax' },
          { id: 'financial-advisor', label: 'Financial Advisor' },
        ] as ContactTypeCategoryValue[],
      },
      {
        title: 'Position',
        isTextInput: true,
      },
      {
        title: 'Geographic Area',
        isTextInput: true,
      },
    ],
  },
};

/**
 * Get default categories for a contact type
 */
export function getDefaultCategoriesForType(type: string): Omit<ContactTypeCategory, 'id' | 'value'>[] {
  return CONTACT_TYPE_DEFINITIONS[type]?.categories || [];
}

/**
 * Get all available contact type names (defaults + custom)
 */
export function getAvailableContactTypes(existingContacts: Array<{ contactType?: string }>): string[] {
  const customTypes = new Set<string>();
  
  // Extract custom types from existing contacts
  existingContacts.forEach(contact => {
    if (contact.contactType && !DEFAULT_CONTACT_TYPES.includes(contact.contactType as DefaultContactType)) {
      customTypes.add(contact.contactType);
    }
  });
  
  return [...DEFAULT_CONTACT_TYPES, ...Array.from(customTypes)];
}

