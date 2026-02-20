/**
 * Labeled Field List Component
 * 
 * Purpose: Reusable component for managing lists of labeled fields (emails, phones, etc.)
 */

import { useState } from 'react';
import { Plus, X, Mail, Phone, MapPin, Users, Globe, Calendar, Tag } from 'lucide-react';
import { LabeledField } from '../types';
import { FloatingLabelInput } from '../../../shared/components/FloatingLabelInput';

interface LabeledFieldListProps {
  fields: LabeledField[];
  onChange: (fields: LabeledField[]) => void;
  type: 'email' | 'phone' | 'address' | 'relationship' | 'website' | 'event' | 'custom';
  maxFields?: number;
  labelPlaceholder?: string;
  valuePlaceholder?: string;
}

const LABEL_OPTIONS: Record<string, string[]> = {
  email: ['* Work', '* Home', '* Other'],
  phone: ['* Work', '* Home', '* Mobile', '* Main', '* Other'],
  address: ['* Work', '* Home', '* Other'],
  relationship: ['Parent', 'Friend', 'Referred By', '* Other'],
  website: ['* Work', '* Personal', '* Other'],
  event: ['Birthday', 'Anniversary', '* Other'],
  custom: ['* Other'],
};

const ICONS = {
  email: Mail,
  phone: Phone,
  address: MapPin,
  relationship: Users,
  website: Globe,
  event: Calendar,
  custom: Tag,
};

export const LabeledFieldList = ({
  fields,
  onChange,
  type,
  maxFields = 3,
  labelPlaceholder = 'Label',
  valuePlaceholder = 'Value',
}: LabeledFieldListProps) => {
  const Icon = ICONS[type];
  const labelOptions = LABEL_OPTIONS[type] || ['* Other'];

  const handleAdd = () => {
    if (fields.length < maxFields) {
      onChange([...fields, { label: labelOptions[0], value: '' }]);
    }
  };

  const handleRemove = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  const handleLabelChange = (index: number, label: string) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], label };
    onChange(updated);
  };

  const handleValueChange = (index: number, value: string) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="flex-1">
            <select
              value={field.label}
              onChange={(e) => handleLabelChange(index, e.target.value)}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
            >
              {labelOptions.map((option) => (
                <option key={option} value={option}>
                  {option.replace('* ', '')}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <FloatingLabelInput
              label={valuePlaceholder}
              type={type === 'email' ? 'email' : type === 'phone' ? 'tel' : type === 'website' ? 'url' : type === 'event' ? 'date' : 'text'}
              value={field.value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              icon={<Icon className="w-4 h-4" />}
            />
          </div>
          {fields.length > 0 && (
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-2 rounded hover:bg-muted transition-colors mt-1"
              style={{ color: 'var(--color-foreground)' }}
              aria-label="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      {fields.length < maxFields && (
        <button
          type="button"
          onClick={handleAdd}
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
          <span>Add {type}</span>
        </button>
      )}
    </div>
  );
};

