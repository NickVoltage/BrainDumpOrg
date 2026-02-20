/**
 * Contact Editor Component
 * 
 * Purpose: Comprehensive form component for creating and editing contacts with all Google Contacts fields.
 * 
 * Last Updated: 2024
 * Status: Active - Complete contact editor with Google Contacts compatibility
 */

// Comment 407: Contact Editor Component - Create/Edit Contact Form
// This component provides a comprehensive form interface for creating and editing contacts.
// Supports all Google Contacts fields including multiple emails, phones, addresses, etc.
//
// Intended Interactions:
// - Uses: useContact hook (Comment 403) for contact operations
// - Handles: All contact fields matching Google Contacts format
//
// Related Comments:
// - Comment 403 (useContact.ts - hook used by this component)

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Save, Image as ImageIcon, User, Building2, Mail, Phone, MapPin, Users, Globe, Calendar, Tag, FileText, Plus, Edit2 } from 'lucide-react';
import { useContact } from '../hooks/useContact';
import { Contact, LabeledField, ContactAddress, ContactEvent, ContactTypeData, ContactTypeCategory } from '../types';
import { FloatingLabelInput, FloatingLabelTextarea } from '../../../shared/components/FloatingLabelInput';
import { DEFAULT_CONTACT_TYPES, CONTACT_TYPE_DEFINITIONS, getDefaultCategoriesForType, getAvailableContactTypes } from '../config/contact-types';
import { contactService } from '../services/contact-service';

interface ContactEditorProps {
  contact?: Contact;
  onSave: (contact: Contact) => void;
  onCancel: () => void;
  onClose: () => void;
}

// Section component with icon - MUST be defined outside to prevent recreation on every render
// This was causing input focus loss because React was treating it as a new component type
const Section = React.memo(({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5" style={{ color: 'var(--color-foreground)' }} />
    </div>
    <div className="space-y-3 pl-7">
      {children}
    </div>
  </div>
));

Section.displayName = 'Section';

// Label options for dropdowns
const LABEL_OPTIONS = {
  email: ['Work', 'Home', 'Other'],
  phone: ['Work', 'Home', 'Mobile', 'Main', 'Other'],
  address: ['Work', 'Home', 'Other'],
  relationship: ['Parent', 'Friend', 'Referred By', 'Other'],
  website: ['Work', 'Personal', 'Other'],
  event: ['Birthday', 'Anniversary', 'Other'],
  custom: ['Other'],
  organization: ['Work', 'Home', 'Other'],
};

export const ContactEditor = ({ contact, onSave, onCancel, onClose }: ContactEditorProps) => {
  const { createContact, updateContact, loading } = useContact();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Basic Information
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneticFirstName, setPhoneticFirstName] = useState('');
  const [phoneticMiddleName, setPhoneticMiddleName] = useState('');
  const [phoneticLastName, setPhoneticLastName] = useState('');
  const [namePrefix, setNamePrefix] = useState('');
  const [nameSuffix, setNameSuffix] = useState('');
  const [nickname, setNickname] = useState('');
  const [displayCustomName, setDisplayCustomName] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showMoreBasicInfo, setShowMoreBasicInfo] = useState(false);
  
  // Organization
  const [organizationName, setOrganizationName] = useState('');
  const [organizationLabel, setOrganizationLabel] = useState('Work');
  const [organizationTitle, setOrganizationTitle] = useState('');
  const [organizationDepartment, setOrganizationDepartment] = useState('');
  const [organizationRoles, setOrganizationRoles] = useState<Array<{ title: string; department: string; label: string }>>([]);
  
  // Contact Information
  const [emails, setEmails] = useState<LabeledField[]>([]);
  const [phones, setPhones] = useState<LabeledField[]>([]);
  const [addresses, setAddresses] = useState<ContactAddress[]>([]);
  
  // Relationships
  const [relationships, setRelationships] = useState<LabeledField[]>([]);
  
  // Websites
  const [websites, setWebsites] = useState<LabeledField[]>([]);
  const [socials, setSocials] = useState<LabeledField[]>([]);
  
  // Events
  const [dates, setDates] = useState<ContactEvent[]>([]);
  
  // Custom Fields
  const [customFields, setCustomFields] = useState<LabeledField[]>([]);
  
  // Labels and Notes
  const [labels, setLabels] = useState<string[]>(['']); // Start with one empty label
  const [notes, setNotes] = useState('');

  // Contact Type
  const [contactType, setContactType] = useState<string>('');
  const [contactTypeCategories, setContactTypeCategories] = useState<ContactTypeCategory[]>([]);
  const [contactTypeGeographicArea, setContactTypeGeographicArea] = useState('');
  const [contactTypeTimePeriodStart, setContactTypeTimePeriodStart] = useState('');
  const [contactTypeTimePeriodEnd, setContactTypeTimePeriodEnd] = useState('');
  const [customContactTypeName, setCustomContactTypeName] = useState('');
  const [showAddCustomType, setShowAddCustomType] = useState(false);

  // Get all contacts for organization lookup
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  
  useEffect(() => {
    // Load all contacts to get organization names for Medical contacts
    contactService.getAllContacts().then(result => {
      if (result.ok) {
        setAllContacts(result.value);
      }
    });
  }, []);

  // Get available contact types (defaults + custom from existing contacts)
  const availableContactTypes = useMemo(() => {
    return getAvailableContactTypes(allContacts);
  }, [allContacts]);

  // Get organization names from Medical contacts for Practice Name dropdown
  const medicalOrganizations = useMemo(() => {
    const orgs = new Set<string>();
    allContacts.forEach(c => {
      if (c.contactType === 'Medical' && c.organizationName) {
        orgs.add(c.organizationName);
      }
    });
    return Array.from(orgs).sort();
  }, [allContacts]);

  // Memoized display name - only recalculates when name-related fields change
  // This prevents the entire component from re-rendering when typing in other fields
  const displayName = useMemo(() => {
    if (displayCustomName && nickname.trim()) {
      return nickname.trim();
    }
    const parts: string[] = [];
    if (namePrefix.trim()) parts.push(namePrefix.trim());
    if (firstName.trim()) parts.push(firstName.trim());
    if (middleName.trim()) parts.push(middleName.trim());
    if (lastName.trim()) parts.push(lastName.trim());
    if (nameSuffix.trim()) parts.push(nameSuffix.trim());
    return parts.length > 0 ? parts.join(' ') : 'New Contact';
  }, [displayCustomName, nickname, namePrefix, firstName, middleName, lastName, nameSuffix]);

  // Initialize arrays with at least one entry if empty
  const ensureArrayHasEntry = <T,>(array: T[], defaultEntry: T): T[] => {
    return array.length === 0 ? [defaultEntry] : array;
  };

  useEffect(() => {
    if (contact) {
      setFirstName(contact.firstName || '');
      setMiddleName(contact.middleName || '');
      setLastName(contact.lastName || '');
      setPhoneticFirstName(contact.phoneticFirstName || '');
      setPhoneticMiddleName(contact.phoneticMiddleName || '');
      setPhoneticLastName(contact.phoneticLastName || '');
      setNamePrefix(contact.namePrefix || '');
      setNameSuffix(contact.nameSuffix || '');
      setNickname(contact.nickname || '');
      setDisplayCustomName(contact.displayCustomName);
      setPhoto(contact.photo || null);
      
      setOrganizationName(contact.organizationName || '');
      setOrganizationTitle(contact.organizationTitle || '');
      setOrganizationDepartment(contact.organizationDepartment || '');
      
      // Ensure arrays have at least one entry
      setEmails(ensureArrayHasEntry(contact.emails || [], { label: 'Work', value: '' }));
      setPhones(ensureArrayHasEntry(contact.phones || [], { label: 'Work', value: '' }));
      setAddresses(ensureArrayHasEntry(contact.addresses || [], { label: 'Work', street: '', city: '', region: '', postalCode: '', country: '' }));
      setRelationships(ensureArrayHasEntry(contact.relationships || [], { label: 'Other', value: '' }));
      setWebsites(ensureArrayHasEntry(contact.websites || [], { label: 'Work', value: '' }));
      
      // Combine birthday and events
      const allDates: ContactEvent[] = [];
      if (contact.birthday) {
        const bdayValue = contact.birthday instanceof Date 
          ? contact.birthday.toISOString().split('T')[0]
          : contact.birthday;
        allDates.push({ label: 'Birthday', value: bdayValue });
      }
      if (contact.events) {
        allDates.push(...contact.events.filter(e => e.label !== 'Birthday'));
      }
      setDates(ensureArrayHasEntry(allDates, { label: 'Birthday', value: '' }));
      
      setCustomFields(ensureArrayHasEntry(contact.customFields || [], { label: 'Other', value: '' }));
      setLabels(contact.labels && contact.labels.length > 0 ? contact.labels : ['']);
      setNotes(contact.notes || '');

      // Contact Type
      if (contact.contactType) {
        setContactType(contact.contactType);
        if (contact.contactTypeData) {
          setContactTypeCategories(contact.contactTypeData.categories || []);
          setContactTypeGeographicArea(contact.contactTypeData.geographicArea || '');
          setContactTypeTimePeriodStart(contact.contactTypeData.timePeriod?.start || '');
          setContactTypeTimePeriodEnd(contact.contactTypeData.timePeriod?.end || '');
        } else {
          // Initialize with default categories
          initializeContactTypeCategories(contact.contactType);
        }
      } else {
        // Reset contact type state for new contact
        setContactType('');
        setContactTypeCategories([]);
        setContactTypeGeographicArea('');
        setContactTypeTimePeriodStart('');
        setContactTypeTimePeriodEnd('');
      }
    } else {
      // Initialize with default empty entries for new contact
      setEmails([{ label: 'Work', value: '' }]);
      setPhones([{ label: 'Work', value: '' }]);
      setAddresses([{ label: 'Work', street: '', city: '', region: '', postalCode: '', country: '' }]);
      setRelationships([{ label: 'Other', value: '' }]);
      setWebsites([{ label: 'Work', value: '' }]);
      setSocials([{ label: 'Work', value: '' }]);
      setDates([{ label: 'Birthday', value: '' }]);
      setCustomFields([{ label: 'Other', value: '' }]);
    }
  }, [contact]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhoto(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file');
      }
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddLabel = () => {
    setLabels([...labels, '']);
  };

  const handleRemoveLabel = (index: number) => {
    if (labels.length > 1) {
      setLabels(labels.filter((_, i) => i !== index));
    } else {
      setLabels(['']);
    }
  };

  const handleLabelChange = (index: number, value: string) => {
    const updated = [...labels];
    updated[index] = value;
    setLabels(updated);
  };

  const handleAddEmail = () => {
    setEmails([...emails, { label: 'Work', value: '' }]);
  };

  const handleRemoveEmail = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    } else {
      setEmails([{ label: 'Work', value: '' }]);
    }
  };

  const handleEmailChange = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...emails];
    updated[index] = { ...updated[index], [field]: value };
    setEmails(updated);
  };

  const handleAddPhone = () => {
    setPhones([...phones, { label: 'Work', value: '' }]);
  };

  const handleRemovePhone = (index: number) => {
    if (phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index));
    } else {
      setPhones([{ label: 'Work', value: '' }]);
    }
  };

  const handlePhoneChange = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...phones];
    updated[index] = { ...updated[index], [field]: value };
    setPhones(updated);
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, { label: 'Work', street: '', city: '', region: '', postalCode: '', country: '' }]);
  };

  const handleRemoveAddress = (index: number) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((_, i) => i !== index));
    } else {
      setAddresses([{ label: 'Work', street: '', city: '', region: '', postalCode: '', country: '' }]);
    }
  };

  const handleAddressChange = (index: number, field: keyof ContactAddress, value: string) => {
    const updated = [...addresses];
    updated[index] = { ...updated[index], [field]: value };
    setAddresses(updated);
  };

  const handleAddRelationship = () => {
    setRelationships([...relationships, { label: 'Other', value: '' }]);
  };

  const handleRemoveRelationship = (index: number) => {
    if (relationships.length > 1) {
      setRelationships(relationships.filter((_, i) => i !== index));
    } else {
      setRelationships([{ label: 'Other', value: '' }]);
    }
  };

  const handleRelationshipChange = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...relationships];
    updated[index] = { ...updated[index], [field]: value };
    setRelationships(updated);
  };

  const handleAddWebsite = () => {
    setWebsites([...websites, { label: 'Work', value: '' }]);
  };

  const handleRemoveWebsite = (index: number) => {
    if (websites.length > 1) {
      setWebsites(websites.filter((_, i) => i !== index));
    } else {
      setWebsites([{ label: 'Work', value: '' }]);
    }
  };

  const handleWebsiteChange = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...websites];
    updated[index] = { ...updated[index], [field]: value };
    setWebsites(updated);
  };

  const handleAddSocial = () => {
    setSocials([...socials, { label: 'Work', value: '' }]);
  };

  const handleRemoveSocial = (index: number) => {
    if (socials.length > 1) {
      setSocials(socials.filter((_, i) => i !== index));
    } else {
      setSocials([{ label: 'Work', value: '' }]);
    }
  };

  const handleSocialChange = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    setSocials(updated);
  };

  const handleAddDate = () => {
    setDates([...dates, { label: 'Birthday', value: '' }]);
  };

  const handleRemoveDate = (index: number) => {
    if (dates.length > 1) {
      setDates(dates.filter((_, i) => i !== index));
    } else {
      setDates([{ label: 'Birthday', value: '' }]);
    }
  };

  const handleDateChange = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...dates];
    updated[index] = { ...updated[index], [field]: value };
    setDates(updated);
  };

  const handleAddCustomField = () => {
    setCustomFields([...customFields, { label: 'Other', value: '' }]);
  };

  const handleRemoveCustomField = (index: number) => {
    if (customFields.length > 1) {
      setCustomFields(customFields.filter((_, i) => i !== index));
    } else {
      setCustomFields([{ label: 'Other', value: '' }]);
    }
  };

  const handleCustomFieldChange = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], [field]: value };
    setCustomFields(updated);
  };

  const handleAddOrganizationRole = () => {
    setOrganizationRoles([...organizationRoles, { title: '', department: '', label: 'Work' }]);
  };

  const handleRemoveOrganizationRole = (index: number) => {
    setOrganizationRoles(organizationRoles.filter((_, i) => i !== index));
  };

  const handleOrganizationRoleChange = (index: number, field: 'title' | 'department' | 'label', value: string) => {
    const updated = [...organizationRoles];
    updated[index] = { ...updated[index], [field]: value };
    setOrganizationRoles(updated);
  };

  // Initialize contact type categories from defaults
  const initializeContactTypeCategories = (type: string) => {
    const defaultCategories = getDefaultCategoriesForType(type);
    const categories: ContactTypeCategory[] = defaultCategories.map((cat, index) => ({
      id: `category-${index}-${Date.now()}`,
      title: cat.title,
      isTextInput: cat.isTextInput,
      values: cat.values?.map((val, valIndex) => ({
        id: val.id || `value-${valIndex}-${Date.now()}`,
        label: val.label,
        subValues: val.subValues?.map((sub, subIndex) => ({
          id: sub.id || `sub-${subIndex}-${Date.now()}`,
          label: sub.label,
        })),
      })),
    }));
    setContactTypeCategories(categories);
  };

  // Handle contact type selection
  const handleContactTypeChange = (type: string) => {
    if (type === '+ Add New') {
      setShowAddCustomType(true);
      setContactType('');
      return;
    }
    
    setContactType(type);
    setShowAddCustomType(false);
    setCustomContactTypeName('');
    
    // Initialize categories for this type
    initializeContactTypeCategories(type);
    
    // Clear existing category values
    setContactTypeGeographicArea('');
    setContactTypeTimePeriodStart('');
    setContactTypeTimePeriodEnd('');
  };

  // Handle adding custom contact type
  const handleAddCustomContactType = () => {
    if (customContactTypeName.trim()) {
      setContactType(customContactTypeName.trim());
      setShowAddCustomType(false);
      // Start with empty categories - user will add them
      setContactTypeCategories([]);
      setCustomContactTypeName('');
    }
  };

  // Handle Practice Name change (for Medical contacts)
  const handlePracticeNameChange = async (practiceName: string) => {
    // Find the category for Practice Name
    const practiceCategoryIndex = contactTypeCategories.findIndex(c => c.title === 'Practice Name');
    if (practiceCategoryIndex === -1) return;

    const updatedCategories = [...contactTypeCategories];
    updatedCategories[practiceCategoryIndex] = {
      ...updatedCategories[practiceCategoryIndex],
      value: practiceName,
    };
    setContactTypeCategories(updatedCategories);

    // Auto-populate organization field
    if (practiceName.trim()) {
      // Check if organization already exists
      if (!organizationName || organizationName.trim() === '') {
        setOrganizationName(practiceName.trim());
      } else if (organizationName.trim() !== practiceName.trim()) {
        // Add as new organization (don't overwrite)
        // This will be handled in the submit - for now just set the name
        // The user can manually add it if needed
      }

      // Auto-populate Specialty from existing Medical contact with same practice
      const existingMedicalContact = allContacts.find(c => 
        c.contactType === 'Medical' && 
        c.organizationName === practiceName.trim()
      );
      
      if (existingMedicalContact?.contactTypeData) {
        const specialtyCategory = existingMedicalContact.contactTypeData.categories.find(c => c.title === 'Specialty');
        if (specialtyCategory?.value) {
          const specialtyIndex = updatedCategories.findIndex(c => c.title === 'Specialty');
          if (specialtyIndex !== -1) {
            updatedCategories[specialtyIndex] = {
              ...updatedCategories[specialtyIndex],
              value: specialtyCategory.value,
            };
            setContactTypeCategories(updatedCategories);
          }
        }
      }
    }
  };

  // Handle category value change
  const handleCategoryValueChange = (categoryIndex: number, value: string) => {
    const updated = [...contactTypeCategories];
    updated[categoryIndex] = {
      ...updated[categoryIndex],
      value,
      subValue: undefined, // Clear sub-value when main value changes
    };
    setContactTypeCategories(updated);
  };

  // Handle sub-value change
  const handleSubValueChange = (categoryIndex: number, subValue: string) => {
    const updated = [...contactTypeCategories];
    updated[categoryIndex] = {
      ...updated[categoryIndex],
      subValue,
    };
    setContactTypeCategories(updated);
  };

  // Handle adding new category
  const handleAddCategory = () => {
    const newCategory: ContactTypeCategory = {
      id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: '',
      isTextInput: false,
    };
    setContactTypeCategories([...contactTypeCategories, newCategory]);
  };

  // Handle removing category
  const handleRemoveCategory = (categoryIndex: number) => {
    setContactTypeCategories(contactTypeCategories.filter((_, i) => i !== categoryIndex));
  };

  // Handle category title change
  const handleCategoryTitleChange = (categoryIndex: number, title: string) => {
    const updated = [...contactTypeCategories];
    updated[categoryIndex] = {
      ...updated[categoryIndex],
      title,
    };
    setContactTypeCategories(updated);
  };

  // Handle adding value to category
  const handleAddCategoryValue = (categoryIndex: number, valueLabel: string) => {
    const updated = [...contactTypeCategories];
    const category = updated[categoryIndex];
    if (!category.values) {
      category.values = [];
    }
    category.values.push({
      id: `value-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: valueLabel,
    });
    setContactTypeCategories(updated);
  };

  // Handle adding sub-value
  const handleAddSubValue = (categoryIndex: number, valueIndex: number, subValueLabel: string) => {
    const updated = [...contactTypeCategories];
    const category = updated[categoryIndex];
    if (category.values && category.values[valueIndex]) {
      if (!category.values[valueIndex].subValues) {
        category.values[valueIndex].subValues = [];
      }
      category.values[valueIndex].subValues!.push({
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        label: subValueLabel,
      });
      setContactTypeCategories(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      alert('First name and last name are required.');
      return;
    }

    // Filter out empty values
    const filteredEmails = emails.filter(e => e.value.trim());
    const filteredPhones = phones.filter(p => p.value.trim());
    const filteredAddresses = addresses.filter(a => a.street || a.city);
    const filteredRelationships = relationships.filter(r => r.value.trim());
    const filteredWebsites = websites.filter(w => w.value.trim());
    const filteredSocials = socials.filter(s => s.value.trim());
    const filteredDates = dates.filter(d => d.value);
    const filteredCustomFields = customFields.filter(c => c.value.trim());
    const filteredLabels = labels.filter(l => l.trim());

    // Separate birthday from other events
    const birthdayEvent = filteredDates.find(d => d.label === 'Birthday');
    const otherEvents = filteredDates.filter(d => d.label !== 'Birthday');

    const contactData: Partial<Contact> = {
      firstName: firstName.trim(),
      middleName: middleName.trim() || undefined,
      lastName: lastName.trim(),
      phoneticFirstName: phoneticFirstName.trim() || undefined,
      phoneticMiddleName: phoneticMiddleName.trim() || undefined,
      phoneticLastName: phoneticLastName.trim() || undefined,
      namePrefix: namePrefix.trim() || undefined,
      nameSuffix: nameSuffix.trim() || undefined,
      nickname: nickname.trim() || undefined,
      displayCustomName,
      photo: photo || undefined,
      
      organizationName: organizationName.trim() || undefined,
      organizationTitle: organizationTitle.trim() || undefined,
      organizationDepartment: organizationDepartment.trim() || undefined,
      
      emails: filteredEmails.length > 0 ? filteredEmails : undefined,
      phones: filteredPhones.length > 0 ? filteredPhones : undefined,
      addresses: filteredAddresses.length > 0 ? filteredAddresses : undefined,
      
      relationships: filteredRelationships.length > 0 ? filteredRelationships : undefined,
      websites: [...filteredWebsites, ...filteredSocials].length > 0 ? [...filteredWebsites, ...filteredSocials] : undefined,
      
      birthday: birthdayEvent?.value || undefined,
      events: otherEvents.length > 0 ? otherEvents : undefined,
      
      customFields: filteredCustomFields.length > 0 ? filteredCustomFields : undefined,
      
      labels: filteredLabels.length > 0 ? filteredLabels : undefined,
      notes: notes.trim() || undefined,

      // Contact Type
      contactType: contactType || undefined,
      contactTypeData: contactType ? {
        type: contactType,
        categories: contactTypeCategories,
        geographicArea: contactTypeGeographicArea.trim() || undefined,
        timePeriod: (contactTypeTimePeriodStart.trim() || contactTypeTimePeriodEnd.trim()) ? {
          start: contactTypeTimePeriodStart.trim() || undefined,
          end: contactTypeTimePeriodEnd.trim() || undefined,
        } : undefined,
      } : undefined,
    };

    if (contact) {
      const result = await updateContact(contact.id, contactData);
      if (result.ok && result.value) {
        onSave(result.value);
      }
    } else {
      const result = await createContact(
        firstName.trim(),
        lastName.trim(),
        photo || undefined,
        nickname.trim() || undefined,
        displayCustomName
      );
      if (result.ok && result.value) {
        const fullResult = await updateContact(result.value.id, contactData);
        if (fullResult.ok && fullResult.value) {
          onSave(fullResult.value);
        } else {
          onSave(result.value);
        }
      }
    }

    if (onClose) {
      onClose();
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCancelClick}>
      <div
        className="bg-background border border-border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden m-4 flex flex-col"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
            {contact ? 'Edit Contact' : 'New Contact'}
          </h2>
          <button
            onClick={handleCancelClick}
            className="p-1 rounded hover:bg-muted transition-colors"
            style={{ color: 'var(--color-foreground)' }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Profile Picture & Name Preview */}
          <div className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
                id="contactPhoto"
              />
              {photo ? (
                <div className="relative">
                  <img
                    src={photo}
                    alt="Contact preview"
                    className="w-20 h-20 rounded-full object-cover border-2"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                  <label
                    htmlFor="contactPhoto"
                    className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      borderColor: 'var(--color-background)',
                      color: 'var(--color-primary-foreground)',
                    }}
                  >
                    <Edit2 className="w-3 h-3" />
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="contactPhoto"
                  className="w-20 h-20 rounded-full border-2 flex items-center justify-center cursor-pointer"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-muted)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  <ImageIcon className="w-8 h-8" />
                </label>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
                {displayName}
              </h3>
            </div>
          </div>

          {/* Basic Information Section */}
          <Section icon={User}>
            <div className="grid grid-cols-2 gap-3">
              <FloatingLabelInput
                label="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <FloatingLabelInput
                label="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            
            <FloatingLabelInput
              label="Middle Name"
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
            
            {!showMoreBasicInfo && (
              <button
                type="button"
                onClick={() => setShowMoreBasicInfo(true)}
                className="text-sm"
                style={{ color: 'var(--color-primary)' }}
              >
                Show More
              </button>
            )}
            
            {showMoreBasicInfo && (
              <>
                <FloatingLabelInput
                  label="Nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <FloatingLabelInput
                    label="Name Prefix"
                    type="text"
                    value={namePrefix}
                    onChange={(e) => setNamePrefix(e.target.value)}
                    placeholder="Mr., Dr., etc."
                  />
                  <FloatingLabelInput
                    label="Name Suffix"
                    type="text"
                    value={nameSuffix}
                    onChange={(e) => setNameSuffix(e.target.value)}
                    placeholder="Jr., III, etc."
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <FloatingLabelInput
                    label="Phonetic First Name"
                    type="text"
                    value={phoneticFirstName}
                    onChange={(e) => setPhoneticFirstName(e.target.value)}
                  />
                  <FloatingLabelInput
                    label="Phonetic Middle Name"
                    type="text"
                    value={phoneticMiddleName}
                    onChange={(e) => setPhoneticMiddleName(e.target.value)}
                  />
                  <FloatingLabelInput
                    label="Phonetic Last Name"
                    type="text"
                    value={phoneticLastName}
                    onChange={(e) => setPhoneticLastName(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="displayCustomName"
                    checked={displayCustomName}
                    onChange={(e) => setDisplayCustomName(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="displayCustomName"
                    className="text-sm cursor-pointer"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    Show nickname instead of full name
                  </label>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowMoreBasicInfo(false)}
                  className="text-sm"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Show Less
                </button>
              </>
            )}
          </Section>

          {/* Contact Type Section */}
          <Section icon={Tag}>
            <div className="space-y-3">
              {/* Contact Type Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-foreground)' }}>
                  Contact Type
                </label>
                {showAddCustomType ? (
                  <div className="flex items-center gap-2">
                    <FloatingLabelInput
                      label="New Contact Type Name"
                      type="text"
                      value={customContactTypeName}
                      onChange={(e) => setCustomContactTypeName(e.target.value)}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomContactType}
                      className="px-4 py-2 rounded border transition-colors"
                      style={{
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-primary-foreground)',
                      }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddCustomType(false);
                        setCustomContactTypeName('');
                      }}
                      className="px-4 py-2 rounded border transition-colors"
                      style={{
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-foreground)',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <select
                    value={contactType}
                    onChange={(e) => handleContactTypeChange(e.target.value)}
                    className="w-full px-3 py-2 rounded border text-sm"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    <option value="">Select Contact Type</option>
                    {availableContactTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                    <option value="+ Add New">+ Add New</option>
                  </select>
                )}
              </div>

              {/* Contact Type Categories */}
              {contactType && (
                <div className="space-y-4 p-3 border rounded" style={{ borderColor: 'var(--color-border)' }}>
                  {contactTypeCategories.map((category, categoryIndex) => (
                    <div key={category.id} className="space-y-2">
                      {/* Category Title (for custom categories) */}
                      {!CONTACT_TYPE_DEFINITIONS[contactType]?.categories.find(c => c.title === category.title) && (
                        <div className="flex items-center gap-2">
                          <FloatingLabelInput
                            label="Category Title"
                            type="text"
                            value={category.title}
                            onChange={(e) => handleCategoryTitleChange(categoryIndex, e.target.value)}
                            className="flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(categoryIndex)}
                            className="p-2 rounded hover:bg-muted transition-colors"
                            style={{ color: 'var(--color-foreground)' }}
                            aria-label="Remove category"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Practice Name Field (Special handling for Medical) */}
                      {category.title === 'Practice Name' && contactType === 'Medical' ? (
                        <div className="space-y-2">
                          <label className="text-xs font-medium" style={{ color: 'var(--color-foreground)' }}>
                            Practice Name
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              list={`practice-names-${categoryIndex}`}
                              value={category.value || ''}
                              onChange={(e) => handlePracticeNameChange(e.target.value)}
                              className="flex-1 px-3 py-2 rounded border text-sm"
                              style={{
                                backgroundColor: 'var(--color-background)',
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-foreground)',
                              }}
                              placeholder="Enter or select practice name"
                            />
                            <datalist id={`practice-names-${categoryIndex}`}>
                              {medicalOrganizations.map(org => (
                                <option key={org} value={org} />
                              ))}
                            </datalist>
                          </div>
                        </div>
                      ) : category.isTextInput ? (
                        /* Text Input Category */
                        <FloatingLabelInput
                          label={category.title}
                          type="text"
                          value={category.value || ''}
                          onChange={(e) => handleCategoryValueChange(categoryIndex, e.target.value)}
                        />
                      ) : category.values && category.values.length > 0 ? (
                        /* Dropdown Category with Values */
                        <div className="space-y-2">
                          <label className="text-xs font-medium" style={{ color: 'var(--color-foreground)' }}>
                            {category.title}
                          </label>
                          <select
                            value={category.value || ''}
                            onChange={(e) => handleCategoryValueChange(categoryIndex, e.target.value)}
                            className="w-full px-3 py-2 rounded border text-sm"
                            style={{
                              backgroundColor: 'var(--color-background)',
                              borderColor: 'var(--color-border)',
                              color: 'var(--color-foreground)',
                            }}
                          >
                            <option value="">Select {category.title}</option>
                            {category.values.map(value => (
                              <option key={value.id} value={value.id}>
                                {value.label}
                              </option>
                            ))}
                          </select>

                          {/* Sub-values for selected value */}
                          {category.value && (() => {
                            const selectedValue = category.values?.find(v => v.id === category.value);
                            if (selectedValue?.subValues && selectedValue.subValues.length > 0) {
                              return (
                                <div className="pl-4 space-y-2">
                                  <label className="text-xs font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                                    {selectedValue.label} Details
                                  </label>
                                  <select
                                    value={category.subValue || ''}
                                    onChange={(e) => handleSubValueChange(categoryIndex, e.target.value)}
                                    className="w-full px-3 py-2 rounded border text-sm"
                                    style={{
                                      backgroundColor: 'var(--color-background)',
                                      borderColor: 'var(--color-border)',
                                      color: 'var(--color-foreground)',
                                    }}
                                  >
                                    <option value="">Select detail</option>
                                    {selectedValue.subValues.map(subValue => (
                                      <option key={subValue.id} value={subValue.id}>
                                        {subValue.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      ) : (
                        /* Empty category - allow user to add values */
                        <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                          No values defined for {category.title}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add Category Button (for custom contact types) */}
                  {!CONTACT_TYPE_DEFINITIONS[contactType] && (
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors"
                      style={{
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-foreground)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  )}

                  {/* Geographic Area */}
                  <FloatingLabelInput
                    label="Geographic Area"
                    type="text"
                    value={contactTypeGeographicArea}
                    onChange={(e) => setContactTypeGeographicArea(e.target.value)}
                    placeholder="e.g., Texas, Dallas"
                  />

                  {/* Time Period */}
                  <div className="grid grid-cols-2 gap-3">
                    <FloatingLabelInput
                      label="Time Period Start"
                      type="text"
                      value={contactTypeTimePeriodStart}
                      onChange={(e) => setContactTypeTimePeriodStart(e.target.value)}
                      placeholder="e.g., 01-2019"
                    />
                    <FloatingLabelInput
                      label="Time Period End"
                      type="text"
                      value={contactTypeTimePeriodEnd}
                      onChange={(e) => setContactTypeTimePeriodEnd(e.target.value)}
                      placeholder="e.g., present or 12-2022"
                    />
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Labels Section */}
          <Section icon={Tag}>
            {labels.map((label, index) => (
              <div key={index} className="flex items-center gap-2">
                <FloatingLabelInput
                  label="Label"
                  type="text"
                  value={label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  className="flex-1"
                />
                {labels.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLabel(index)}
                    className="p-2 rounded hover:bg-muted transition-colors"
                    style={{ color: 'var(--color-foreground)' }}
                    aria-label="Remove label"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLabel}
              className="flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Label</span>
            </button>
          </Section>

          {/* Organization Section */}
          <Section icon={Building2}>
            <div className="flex items-start gap-2">
              <FloatingLabelInput
                label="Organization Name"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="flex-1"
              />
              <select
                value={organizationLabel}
                onChange={(e) => setOrganizationLabel(e.target.value)}
                className="px-3 py-2 rounded border text-sm mt-1"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              >
                {LABEL_OPTIONS.organization.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FloatingLabelInput
                label="Title"
                type="text"
                value={organizationTitle}
                onChange={(e) => setOrganizationTitle(e.target.value)}
              />
              <FloatingLabelInput
                label="Department"
                type="text"
                value={organizationDepartment}
                onChange={(e) => setOrganizationDepartment(e.target.value)}
              />
            </div>
            {organizationRoles.length > 0 && (
              <div className="space-y-3">
                {organizationRoles.map((role, index) => (
                  <div key={index} className="space-y-2 p-3 border rounded" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center justify-between">
                      <select
                        value={role.label}
                        onChange={(e) => handleOrganizationRoleChange(index, 'label', e.target.value)}
                        className="px-3 py-2 rounded border text-sm"
                        style={{
                          backgroundColor: 'var(--color-background)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-foreground)',
                        }}
                      >
                        {LABEL_OPTIONS.organization.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveOrganizationRole(index)}
                        className="p-2 rounded hover:bg-muted transition-colors"
                        style={{ color: 'var(--color-foreground)' }}
                        aria-label="Remove role"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FloatingLabelInput
                        label="Title"
                        type="text"
                        value={role.title}
                        onChange={(e) => handleOrganizationRoleChange(index, 'title', e.target.value)}
                      />
                      <FloatingLabelInput
                        label="Department"
                        type="text"
                        value={role.department}
                        onChange={(e) => handleOrganizationRoleChange(index, 'department', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={handleAddOrganizationRole}
              className="flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add More Roles</span>
            </button>
          </Section>

          {/* Contact Information Section */}
          <Section icon={Phone}>
            {/* Email */}
            {emails.map((email, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <FloatingLabelInput
                    label="Email Address"
                    type="email"
                    value={email.value}
                    onChange={(e) => handleEmailChange(index, 'value', e.target.value)}
                    className="flex-1"
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <select
                    value={email.label}
                    onChange={(e) => handleEmailChange(index, 'label', e.target.value)}
                    className="px-3 py-2 rounded border text-sm mt-1"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    {LABEL_OPTIONS.email.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(index)}
                      className="p-2 rounded hover:bg-muted transition-colors mt-1"
                      style={{ color: 'var(--color-foreground)' }}
                      aria-label="Remove email"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddEmail}
              className="flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Email Address</span>
            </button>

            {/* Phone */}
            {phones.map((phone, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <FloatingLabelInput
                    label="Phone Number"
                    type="tel"
                    value={phone.value}
                    onChange={(e) => handlePhoneChange(index, 'value', e.target.value)}
                    className="flex-1"
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <select
                    value={phone.label}
                    onChange={(e) => handlePhoneChange(index, 'label', e.target.value)}
                    className="px-3 py-2 rounded border text-sm mt-1"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    {LABEL_OPTIONS.phone.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(index)}
                      className="p-2 rounded hover:bg-muted transition-colors mt-1"
                      style={{ color: 'var(--color-foreground)' }}
                      aria-label="Remove phone"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPhone}
              className="flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Phone Number</span>
            </button>

            {/* Address */}
            {addresses.map((address, index) => (
              <div key={index} className="space-y-3 p-3 border rounded" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center justify-between">
                  <select
                    value={address.label}
                    onChange={(e) => handleAddressChange(index, 'label', e.target.value)}
                    className="px-3 py-2 rounded border text-sm"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    {LABEL_OPTIONS.address.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAddress(index)}
                      className="p-2 rounded hover:bg-muted transition-colors"
                      style={{ color: 'var(--color-foreground)' }}
                      aria-label="Remove address"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <FloatingLabelInput
                  label="Street Address"
                  type="text"
                  value={address.street || ''}
                  onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                  icon={<MapPin className="w-4 h-4" />}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FloatingLabelInput
                    label="City"
                    type="text"
                    value={address.city || ''}
                    onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                  />
                  <FloatingLabelInput
                    label="State/Region"
                    type="text"
                    value={address.region || ''}
                    onChange={(e) => handleAddressChange(index, 'region', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FloatingLabelInput
                    label="Postal Code"
                    type="text"
                    value={address.postalCode || ''}
                    onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                  />
                  <FloatingLabelInput
                    label="Country"
                    type="text"
                    value={address.country || ''}
                    onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                  />
                </div>
                <FloatingLabelInput
                  label="Extended Address (Apt, Suite, etc.)"
                  type="text"
                  value={address.extendedAddress || ''}
                  onChange={(e) => handleAddressChange(index, 'extendedAddress', e.target.value)}
                />
                {address.poBox && (
                  <FloatingLabelInput
                    label="P.O. Box"
                    type="text"
                    value={address.poBox || ''}
                    onChange={(e) => handleAddressChange(index, 'poBox', e.target.value)}
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAddress}
              className="flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Address</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAddresses([...addresses, { label: 'Other', street: '', city: '', region: '', postalCode: '', country: '', poBox: '' }]);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add P.O. Box</span>
            </button>
          </Section>

          {/* Relationships Section */}
          <Section icon={Users}>
            {relationships.map((relationship, index) => (
              <div key={index} className="flex items-start gap-2">
                <FloatingLabelInput
                  label="Person"
                  type="text"
                  value={relationship.value}
                  onChange={(e) => handleRelationshipChange(index, 'value', e.target.value)}
                  className="flex-1"
                />
                <select
                  value={relationship.label}
                  onChange={(e) => handleRelationshipChange(index, 'label', e.target.value)}
                  className="px-3 py-2 rounded border text-sm mt-1"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  {LABEL_OPTIONS.relationship.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {relationships.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRelationship(index)}
                    className="p-2 rounded hover:bg-muted transition-colors mt-1"
                    style={{ color: 'var(--color-foreground)' }}
                    aria-label="Remove relationship"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddRelationship}
              className="flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Relationship</span>
            </button>
          </Section>

          {/* Websites Section */}
          <Section icon={Globe}>
            {websites.map((website, index) => (
              <div key={index} className="flex items-start gap-2">
                <FloatingLabelInput
                  label="Website"
                  type="url"
                  value={website.value}
                  onChange={(e) => handleWebsiteChange(index, 'value', e.target.value)}
                  className="flex-1"
                  icon={<Globe className="w-4 h-4" />}
                />
                <select
                  value={website.label}
                  onChange={(e) => handleWebsiteChange(index, 'label', e.target.value)}
                  className="px-3 py-2 rounded border text-sm mt-1"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  {LABEL_OPTIONS.website.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {websites.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveWebsite(index)}
                    className="p-2 rounded hover:bg-muted transition-colors mt-1"
                    style={{ color: 'var(--color-foreground)' }}
                    aria-label="Remove website"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddWebsite}
              className="flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Website</span>
            </button>

            {socials.map((social, index) => (
              <div key={index} className="flex items-start gap-2">
                <FloatingLabelInput
                  label="Social"
                  type="url"
                  value={social.value}
                  onChange={(e) => handleSocialChange(index, 'value', e.target.value)}
                  className="flex-1"
                  icon={<Globe className="w-4 h-4" />}
                />
                <select
                  value={social.label}
                  onChange={(e) => handleSocialChange(index, 'label', e.target.value)}
                  className="px-3 py-2 rounded border text-sm mt-1"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  {LABEL_OPTIONS.website.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {socials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(index)}
                    className="p-2 rounded hover:bg-muted transition-colors mt-1"
                    style={{ color: 'var(--color-foreground)' }}
                    aria-label="Remove social"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSocial}
              className="flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Social</span>
            </button>
          </Section>

          {/* Important Dates Section */}
          <Section icon={Calendar}>
            {dates.map((date, index) => (
              <div key={index} className="flex items-start gap-2">
                <FloatingLabelInput
                  label="Date"
                  type="date"
                  value={typeof date.value === 'string' ? date.value : date.value instanceof Date ? date.value.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange(index, 'value', e.target.value)}
                  className="flex-1"
                  icon={<Calendar className="w-4 h-4" />}
                />
                <select
                  value={date.label}
                  onChange={(e) => handleDateChange(index, 'label', e.target.value)}
                  className="px-3 py-2 rounded border text-sm mt-1"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  {LABEL_OPTIONS.event.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {dates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDate(index)}
                    className="p-2 rounded hover:bg-muted transition-colors mt-1"
                    style={{ color: 'var(--color-foreground)' }}
                    aria-label="Remove date"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDate}
              className="flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Date</span>
            </button>
          </Section>

          {/* Custom Fields Section */}
          <Section icon={Tag}>
            {customFields.map((field, index) => (
              <div key={index} className="flex items-start gap-2">
                <FloatingLabelInput
                  label="Custom"
                  type="text"
                  value={field.label === 'Other' ? '' : field.label}
                  onChange={(e) => handleCustomFieldChange(index, 'label', e.target.value)}
                  className="flex-1"
                />
                <FloatingLabelInput
                  label="Value"
                  type="text"
                  value={field.value}
                  onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                  className="flex-1"
                />
                {customFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomField(index)}
                    className="p-2 rounded hover:bg-muted transition-colors mt-1"
                    style={{ color: 'var(--color-foreground)' }}
                    aria-label="Remove custom field"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCustomField}
              className="flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Field</span>
            </button>
          </Section>

          {/* Notes Section */}
          <Section icon={FileText}>
            <FloatingLabelTextarea
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
            />
          </Section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-4 py-2 rounded transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-foreground)',
                border: '1px solid var(--color-border)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !firstName.trim() || !lastName.trim()}
              className="px-4 py-2 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
                border: 'none',
              }}
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : contact ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
