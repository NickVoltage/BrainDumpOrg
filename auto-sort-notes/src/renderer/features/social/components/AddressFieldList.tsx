/**
 * Address Field List Component
 * 
 * Purpose: Component for managing contact addresses (more complex than simple labeled fields)
 */

import { useState } from 'react';
import { Plus, X, MapPin } from 'lucide-react';
import { ContactAddress } from '../types';
import { FloatingLabelInput } from '../../../shared/components/FloatingLabelInput';

interface AddressFieldListProps {
  addresses: ContactAddress[];
  onChange: (addresses: ContactAddress[]) => void;
  maxAddresses?: number;
}

const ADDRESS_LABEL_OPTIONS = ['* Work', '* Home', '* Other'];

export const AddressFieldList = ({
  addresses,
  onChange,
  maxAddresses = 1,
}: AddressFieldListProps) => {
  const handleAdd = () => {
    if (addresses.length < maxAddresses) {
      onChange([...addresses, { label: ADDRESS_LABEL_OPTIONS[0], street: '', city: '', region: '', postalCode: '', country: '' }]);
    }
  };

  const handleRemove = (index: number) => {
    onChange(addresses.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, field: keyof ContactAddress, value: string) => {
    const updated = [...addresses];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {addresses.map((address, index) => (
        <div key={index} className="space-y-3 p-4 rounded border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-2">
            <select
              value={address.label}
              onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
              className="px-3 py-2 rounded border text-sm"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
            >
              {ADDRESS_LABEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.replace('* ', '')}
                </option>
              ))}
            </select>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
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
            onChange={(e) => handleFieldChange(index, 'street', e.target.value)}
            icon={<MapPin className="w-4 h-4" />}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <FloatingLabelInput
              label="City"
              type="text"
              value={address.city || ''}
              onChange={(e) => handleFieldChange(index, 'city', e.target.value)}
            />
            <FloatingLabelInput
              label="State/Region"
              type="text"
              value={address.region || ''}
              onChange={(e) => handleFieldChange(index, 'region', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <FloatingLabelInput
              label="Postal Code"
              type="text"
              value={address.postalCode || ''}
              onChange={(e) => handleFieldChange(index, 'postalCode', e.target.value)}
            />
            <FloatingLabelInput
              label="Country"
              type="text"
              value={address.country || ''}
              onChange={(e) => handleFieldChange(index, 'country', e.target.value)}
            />
          </div>
          
          <FloatingLabelInput
            label="Extended Address (Apt, Suite, etc.)"
            type="text"
            value={address.extendedAddress || ''}
            onChange={(e) => handleFieldChange(index, 'extendedAddress', e.target.value)}
          />
        </div>
      ))}
      
      {addresses.length < maxAddresses && (
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
          <span>Add Address</span>
        </button>
      )}
    </div>
  );
};

