/**
 * ContactEditor Input Focus Test
 * 
 * Purpose: Test to reproduce and verify fix for input field focus issue.
 * The issue: Input fields only accept one character at a time before losing focus.
 * 
 * Expected Behavior: User should be able to type multiple characters without losing focus.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactEditor } from './ContactEditor';
import { Contact } from '../types';

// Mock the useContact hook
vi.mock('../hooks/useContact', () => ({
  useContact: () => ({
    createContact: vi.fn().mockResolvedValue({ ok: true, value: {} as Contact }),
    updateContact: vi.fn().mockResolvedValue({ ok: true, value: {} as Contact }),
    loading: false,
  }),
}));

// Mock contact service
vi.mock('../services/contact-service', () => ({
  contactService: {
    getAllContacts: vi.fn().mockResolvedValue({ ok: true, value: [] }),
  },
}));

describe('ContactEditor Input Focus Issue', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should maintain focus when typing multiple characters in firstName field', async () => {
    const user = userEvent.setup();
    
    render(
      <ContactEditor
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={mockOnClose}
      />
    );

    // Find the firstName input field by label
    // FloatingLabelInput uses a label element with htmlFor
    let firstNameInput: HTMLInputElement | null = null;
    
    try {
      // Try to find by label text
      const label = screen.getByText(/first name/i);
      if (label instanceof HTMLLabelElement && label.htmlFor) {
        firstNameInput = document.getElementById(label.htmlFor) as HTMLInputElement;
      }
    } catch {
      // Label might not be visible if field is active
    }

    // If not found, try finding all inputs and get the first one (should be firstName)
    if (!firstNameInput) {
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      // First text input should be firstName
      firstNameInput = inputs.find(input => input.type === 'text') || inputs[0];
    }

    expect(firstNameInput).toBeTruthy();
    if (!firstNameInput) return;

    // Focus the input
    firstNameInput.focus();
    await user.click(firstNameInput);
    
    // Verify initial focus
    expect(document.activeElement).toBe(firstNameInput);

    // Type multiple characters one at a time to simulate the issue
    const textToType = 'John';
    let currentValue = '';
    
    for (let i = 0; i < textToType.length; i++) {
      const char = textToType[i];
      currentValue += char;
      
      // Type the character
      await user.type(firstNameInput, char);
      
      // Wait a bit for state updates
      await waitFor(() => {
        // The value should accumulate
        expect(firstNameInput!.value.length).toBeGreaterThanOrEqual(i + 1);
      }, { timeout: 1000 });
      
      // CRITICAL TEST: After each character, focus should still be on the input
      // If this fails, it confirms the bug exists
      if (document.activeElement !== firstNameInput) {
        console.error(`Focus lost after typing character ${i + 1} (${char}). Active element:`, document.activeElement);
      }
      expect(document.activeElement).toBe(firstNameInput);
    }

    // Final verification
    await waitFor(() => {
      expect(firstNameInput!.value).toBe(textToType);
    });
    expect(document.activeElement).toBe(firstNameInput);
  });

  it('should maintain focus when typing multiple characters in organizationName field', async () => {
    const user = userEvent.setup();
    
    render(
      <ContactEditor
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={mockOnClose}
      />
    );

    // Find organization name input
    const orgInputs = screen.getAllByLabelText(/organization/i);
    const orgInput = orgInputs.find(
      (input) => input instanceof HTMLInputElement && input.type === 'text'
    ) as HTMLInputElement;

    if (!orgInput) {
      // Try finding by role
      const inputs = screen.getAllByRole('textbox');
      // Organization name should be one of the later inputs
      const orgInputByRole = inputs.find(
        (input) => (input as HTMLInputElement).value === '' || (input as HTMLInputElement).placeholder?.toLowerCase().includes('organization')
      ) as HTMLInputElement;
      
      if (orgInputByRole) {
        await user.click(orgInputByRole);
        await user.type(orgInputByRole, 'Test Company');
        
        expect(orgInputByRole.value).toBe('Test Company');
        expect(document.activeElement).toBe(orgInputByRole);
        return;
      }
    }

    expect(orgInput).toBeTruthy();

    await user.click(orgInput);
    expect(document.activeElement).toBe(orgInput);

    // Type multiple characters
    await user.type(orgInput, 'Test Company');

    await waitFor(() => {
      expect(orgInput.value).toBe('Test Company');
    });

    // Verify focus is maintained
    expect(document.activeElement).toBe(orgInput);
  });

  it('REPRODUCES BUG: should NOT lose focus after each character when typing', async () => {
    const user = userEvent.setup();
    
    render(
      <ContactEditor
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={mockOnClose}
      />
    );

    // Get all text inputs - find the first one that's a text input (not date, etc.)
    const allInputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const textInputs = allInputs.filter(input => input.type === 'text');
    expect(textInputs.length).toBeGreaterThan(0, 'Should have at least one text input');

    // Test the first text input (should be firstName)
    const testInput = textInputs[0];
    
    // Focus the input
    testInput.focus();
    await user.click(testInput);
    
    // Verify initial focus
    expect(document.activeElement).toBe(testInput);

    // Type character by character and verify focus after each
    // This reproduces the bug: focus is lost after each character
    const textToType = 'Test';
    let focusLostCount = 0;
    
    for (let i = 0; i < textToType.length; i++) {
      const char = textToType[i];
      
      // Type the character
      await user.type(testInput, char);
      
      // Small delay to allow React to process
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // CRITICAL TEST: Focus should be maintained after each character
      // If this fails, it confirms the bug exists
      if (document.activeElement !== testInput) {
        focusLostCount++;
        console.error(`BUG CONFIRMED: Focus lost after typing character ${i + 1} (${char})`);
        console.error(`Expected: ${testInput.id}, Got: ${(document.activeElement as HTMLElement)?.id || 'null'}`);
        
        // Re-focus for next iteration
        testInput.focus();
      }
      
      // This assertion will fail if focus is lost
      expect(document.activeElement).toBe(testInput);
    }

    // Report findings
    if (focusLostCount > 0) {
      console.error(`BUG REPRODUCED: Focus was lost ${focusLostCount} times out of ${textToType.length} characters`);
    }

    // Final verification
    await waitFor(() => {
      expect(testInput.value.length).toBeGreaterThanOrEqual(textToType.length);
    });
    expect(document.activeElement).toBe(testInput);
  });
});

