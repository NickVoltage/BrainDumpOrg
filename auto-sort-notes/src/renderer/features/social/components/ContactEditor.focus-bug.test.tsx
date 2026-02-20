/**
 * ContactEditor Focus Bug Test
 * 
 * PURPOSE: This test REPRODUCES and CONFIRMS the input focus bug.
 * 
 * BUG DESCRIPTION:
 * - When typing in any input field, only one character can be entered at a time
 * - After each character, the input loses focus
 * - User must re-click the field to enter another character
 * 
 * EXPECTED BEHAVIOR:
 * - User should be able to type multiple characters continuously
 * - Focus should remain on the input throughout typing
 * 
 * If this test FAILS, it confirms the bug exists.
 * If this test PASSES, the bug has been fixed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactEditor } from './ContactEditor';

// Mock the useContact hook
vi.mock('../hooks/useContact', () => ({
  useContact: () => ({
    createContact: vi.fn(),
    updateContact: vi.fn(),
    loading: false,
  }),
}));

// Mock contact service
vi.mock('../services/contact-service', () => ({
  contactService: {
    getAllContacts: vi.fn().mockResolvedValue({ ok: true, value: [] }),
  },
}));

describe('ContactEditor Input Focus Bug - REPRODUCTION TEST', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('BUG REPRODUCTION: Input loses focus after each character', async () => {
    const user = userEvent.setup();
    
    render(
      <ContactEditor
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={mockOnClose}
      />
    );

    // Wait for component to fully render
    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);
    });

    // Find the first text input (firstName field)
    const allInputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const textInputs = allInputs.filter(input => 
      input.type === 'text' && 
      input.value === '' && 
      !input.disabled
    );
    
    expect(textInputs.length).toBeGreaterThan(0, 'Should find at least one empty text input');
    const testInput = textInputs[0];

    // Focus the input
    testInput.focus();
    await waitFor(() => {
      expect(document.activeElement).toBe(testInput);
    }, { timeout: 1000 });

    // Type multiple characters one at a time
    const textToType = 'ABC';
    let focusLostEvents: Array<{ char: string; index: number; activeElement: string | null }> = [];

    for (let i = 0; i < textToType.length; i++) {
      const char = textToType[i];
      
      // Store current focus before typing
      const hadFocusBefore = document.activeElement === testInput;
      
      // Type the character
      await user.type(testInput, char);
      
      // Wait a moment for React to process
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Check if focus was lost
      const hasFocusAfter = document.activeElement === testInput;
      
      if (!hasFocusAfter) {
        focusLostEvents.push({
          char,
          index: i,
          activeElement: document.activeElement ? (document.activeElement as HTMLElement).id || 'unknown' : 'null',
        });
        
        // Re-focus for next iteration
        testInput.focus();
      }
    }

    // REPORT THE BUG
    if (focusLostEvents.length > 0) {
      console.error('\n========================================');
      console.error('BUG CONFIRMED: Input Focus Issue Detected');
      console.error('========================================');
      console.error(`Focus was lost ${focusLostEvents.length} times out of ${textToType.length} characters`);
      console.error('Focus lost events:', focusLostEvents);
      console.error('========================================\n');
      
      // This assertion will FAIL, confirming the bug
      expect(focusLostEvents.length).toBe(0, 
        `BUG CONFIRMED: Focus was lost ${focusLostEvents.length} time(s). ` +
        `Expected to maintain focus throughout typing, but focus was lost after: ${focusLostEvents.map(e => e.char).join(', ')}`
      );
    } else {
      // If we get here, the bug might be fixed (or test needs adjustment)
      console.log('No focus loss detected - bug may be fixed or test needs adjustment');
    }

    // Final check
    await waitFor(() => {
      expect(testInput.value.length).toBeGreaterThanOrEqual(textToType.length);
    });
  });
});

