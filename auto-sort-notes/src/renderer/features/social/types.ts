/**
 * Social Hub Types
 * 
 * Purpose: TypeScript type definitions for Social Hub feature.
 * 
 * Last Updated: 2024
 * Status: Active - Complete type definitions
 */

// Comment 400: Social Hub Types - TypeScript Type Definitions
// This file defines TypeScript interfaces and types for Social Hub feature.
// Includes Contact, ContactEntry, QuickViewField, and related types.
//
// Related Comments:
// - Comment 401 (contact-service.ts - uses these types)
// - Comment 402 (contact-storage.ts - uses these types)

/**
 * Contact entry type - categorizes different types of information
 */
export type ContactEntryType = 'general' | 'social' | 'education' | 'experience' | 'interaction' | 'custom';

/**
 * Contact entry - represents a single piece of information about a contact
 * Entries are organized by date and can be viewed chronologically
 */
export interface ContactEntry {
  id: string;
  contactId: string;
  type: ContactEntryType;
  title: string;
  content: string;
  dateEntered: Date; // When the entry was created
  customDate?: Date; // User-specified date (e.g., when event occurred)
  metadata?: Record<string, any>; // Additional structured data
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Quick view field configuration
 * Defines which fields are displayed in the quick-view section
 */
export interface QuickViewField {
  fieldId: string; // e.g., 'birthday', 'phone', 'email', 'lastInteraction'
  label: string;
  value: string | Date | number | null;
  displayOrder: number; // Order in which fields appear
}

/**
 * Labeled contact field - for emails, phones, addresses, etc.
 */
export interface LabeledField {
  label: string; // e.g., "Work", "Home", "Mobile", "Other"
  value: string;
}

/**
 * Address structure matching Google Contacts format
 */
export interface ContactAddress {
  label: string; // e.g., "Work", "Home", "Other"
  formatted?: string; // Full formatted address
  street?: string;
  city?: string;
  poBox?: string;
  region?: string; // State/Province
  postalCode?: string;
  country?: string;
  extendedAddress?: string; // Apartment, suite, etc.
}

/**
 * Event structure (Birthday, Anniversary, Other dates)
 */
export interface ContactEvent {
  label: string; // "Birthday", "Anniversary", "Other"
  value: Date | string; // Date in YYYY-MM-DD format or Date object
}

/**
 * Contact Type Category Value - represents a value within a category
 */
export interface ContactTypeCategoryValue {
  id: string;
  label: string; // e.g., "Primary Care", "Emergency"
  subValues?: ContactTypeCategorySubValue[]; // Optional sub-values
}

/**
 * Contact Type Category Sub-Value - represents a sub-value within a category value
 */
export interface ContactTypeCategorySubValue {
  id: string;
  label: string; // e.g., "Provider", "Billing"
}

/**
 * Contact Type Category - represents a category (Title) with its values
 */
export interface ContactTypeCategory {
  id: string;
  title: string; // e.g., "Specialty", "Position", "Practice Name"
  value?: string; // Selected value (for text fields) or selected value ID (for dropdowns)
  subValue?: string; // Selected sub-value ID (for hierarchical values)
  values?: ContactTypeCategoryValue[]; // Available values for dropdowns
  isTextInput?: boolean; // If true, this is a text input field (like Practice Name)
}

/**
 * Contact Type Data - stores all category data for a contact's type
 */
export interface ContactTypeData {
  type: string; // Contact type name (e.g., "Medical", "Friend")
  categories: ContactTypeCategory[]; // All categories for this contact type
  geographicArea?: string; // e.g., "Texas, Dallas"
  timePeriod?: {
    start?: string; // e.g., "01-2019"
    end?: string; // e.g., "present" or "12-2022"
  };
}

/**
 * Contact interface
 * Represents a person with all their associated information
 * Supports full Google Contacts compatibility
 */
export interface Contact {
  id: string;
  
  // Basic Information
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneticFirstName?: string;
  phoneticMiddleName?: string;
  phoneticLastName?: string;
  namePrefix?: string; // e.g., "Mr.", "Dr."
  nameSuffix?: string; // e.g., "Jr.", "III"
  nickname?: string;
  fileAs?: string; // How to file/sort this contact
  displayCustomName: boolean; // If true, show nickname instead of full name
  
  // Photo
  photo?: string; // Photo URL or base64 data
  
  // Organization
  organizationName?: string;
  organizationTitle?: string;
  organizationDepartment?: string;
  
  // Dates
  birthday?: Date | string; // Primary birthday (YYYY-MM-DD format or Date)
  
  // Multiple Fields (Google Contacts supports multiple)
  emails?: LabeledField[]; // Multiple emails with labels
  phones?: LabeledField[]; // Multiple phones with labels
  addresses?: ContactAddress[]; // Multiple addresses
  relationships?: LabeledField[]; // Multiple relationships (Parent, Friend, etc.)
  websites?: LabeledField[]; // Multiple websites with labels
  events?: ContactEvent[]; // Multiple events (Birthday, Anniversary, Other dates)
  customFields?: LabeledField[]; // Custom fields with labels
  
  // Notes and Labels
  notes?: string;
  labels?: string[]; // Tags/labels (e.g., "* myContacts", "Example Label")
  
  // Quick view and entries (existing functionality)
  quickViewFields: QuickViewField[]; // User-selected fields for quick-view
  entries: ContactEntry[]; // All information entries
  
  // Contact Type System
  contactType?: string; // Contact type name (e.g., "Medical", "Friend", "Family")
  contactTypeData?: ContactTypeData; // Contact type category data
  
  // Metadata
  tags?: string[]; // Optional tags for categorization (legacy, use labels instead)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contact filter options
 */
export interface ContactFilter {
  searchQuery?: string;
  tags?: string[];
  hasPhoto?: boolean;
  hasRecentInteraction?: boolean;
}

