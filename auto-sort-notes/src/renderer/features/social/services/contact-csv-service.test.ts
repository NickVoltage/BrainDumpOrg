/**
 * Tests for Google Contacts CSV parser (100% accuracy: correct column mapping, no phone-in-email).
 */
import { describe, it, expect } from 'vitest';
import { parseGoogleCSV } from './contact-csv-service';

// Minimal CSV matching Google export: header + one row for "David M. Cole CPA" with multi-line quoted address
const DAVID_ROW_CSV = `First Name,Middle Name,Last Name,Phonetic First Name,Phonetic Middle Name,Phonetic Last Name,Name Prefix,Name Suffix,Nickname,File As,Organization Name,Organization Title,Organization Department,Birthday,Notes,Photo,Labels,E-mail 1 - Label,E-mail 1 - Value,E-mail 2 - Label,E-mail 2 - Value,Phone 1 - Label,Phone 1 - Value,Phone 2 - Label,Phone 2 - Value,Phone 3 - Label,Phone 3 - Value,Address 1 - Label,Address 1 - Formatted,Address 1 - Street,Address 1 - City,Address 1 - PO Box,Address 1 - Region,Address 1 - Postal Code,Address 1 - Country,Address 1 - Extended Address,Relation 1 - Label,Relation 1 - Value,Relation 2 - Label,Relation 2 - Value,Relation 3 - Label,Relation 3 - Value,Website 1 - Label,Website 1 - Value,Website 2 - Label,Website 2 - Value,Event 1 - Label,Event 1 - Value,Event 2 - Label,Event 2 - Value,Custom Field 1 - Label,Custom Field 1 - Value
(CPA) David,M.,Cole,,,,,,,,David M. Cole CPA,CPA,,,$250 for 2017 taxes,,* myContacts ::: * starred,,,,,Work,(407) 536-2033,,,,,Work,"#700 5401 S Kirkman Rd
Orlando, FL 32819
US",#700 5401 S Kirkman Rd,Orlando,,FL,32819,US,,Business/ Finance,Accountant,,,,,Other,DavidColeCPA.com,,,,,,,,
`;

describe('contact-csv-service', () => {
  describe('parseGoogleCSV', () => {
    it('maps Address 1 - Country to country (not Relation label)', () => {
      const contacts = parseGoogleCSV(DAVID_ROW_CSV);
      expect(contacts.length).toBe(1);
      const c = contacts[0]!;
      expect(c.firstName).toBe('(CPA) David');
      expect(c.lastName).toBe('Cole');
      expect(c.organizationName).toBe('David M. Cole CPA');
      expect(c.organizationTitle).toBe('CPA');
      expect(c.notes).toBe('$250 for 2017 taxes');

      const addr = c.addresses?.[0];
      expect(addr).toBeDefined();
      expect(addr?.country).toBe('US');
      expect(addr?.region).toBe('FL');
      expect(addr?.city).toBe('Orlando');
      expect(addr?.postalCode).toBe('32819');
      expect(addr?.street).toContain('5401 S Kirkman Rd');

      expect(c.relationships?.[0]?.label).toBe('Business/ Finance');
      expect(c.relationships?.[0]?.value).toBe('Accountant');

      expect(c.phones?.length).toBe(1);
      expect(c.phones?.[0]?.value).toBe('(407) 536-2033');
      expect(c.phones?.[0]?.label).toBe('Work');

      expect((c.emails ?? []).length).toBe(0);

      expect(c.websites?.[0]?.value).toBe('DavidColeCPA.com');
      expect(c.websites?.[0]?.label).toBe('Other');
    });

    it('does not put phone numbers in email list', () => {
      // Same 52-column header; one data row: only First Name and Phone 1 set (columns 0, 21, 22)
      const header = 'First Name,Middle Name,Last Name,Phonetic First Name,Phonetic Middle Name,Phonetic Last Name,Name Prefix,Name Suffix,Nickname,File As,Organization Name,Organization Title,Organization Department,Birthday,Notes,Photo,Labels,E-mail 1 - Label,E-mail 1 - Value,E-mail 2 - Label,E-mail 2 - Value,Phone 1 - Label,Phone 1 - Value,Phone 2 - Label,Phone 2 - Value,Phone 3 - Label,Phone 3 - Value,Address 1 - Label,Address 1 - Formatted,Address 1 - Street,Address 1 - City,Address 1 - PO Box,Address 1 - Region,Address 1 - Postal Code,Address 1 - Country,Address 1 - Extended Address,Relation 1 - Label,Relation 1 - Value,Relation 2 - Label,Relation 2 - Value,Relation 3 - Label,Relation 3 - Value,Website 1 - Label,Website 1 - Value,Website 2 - Label,Website 2 - Value,Event 1 - Label,Event 1 - Value,Event 2 - Label,Event 2 - Value,Custom Field 1 - Label,Custom Field 1 - Value';
      const dataRow = 'Test,' + ','.repeat(20) + 'Work,(407) 555-1234,' + ','.repeat(29);
      const contacts = parseGoogleCSV(header + '\n' + dataRow + '\n');
      expect(contacts.length).toBe(1);
      expect((contacts[0]!.emails ?? []).length).toBe(0);
      expect((contacts[0]!.phones ?? []).length).toBe(1);
      expect(contacts[0]!.phones?.[0]?.value).toBe('(407) 555-1234');
    });
  });
});
