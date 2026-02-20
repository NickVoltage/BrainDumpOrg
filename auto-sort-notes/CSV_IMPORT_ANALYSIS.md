# CSV Import Analysis: David M. Cole CPA

## Original CSV Data (Row 3)

Column mapping from CSV header:
- Column 0: `(CPA) David` - First Name
- Column 1: `M.` - Middle Name  
- Column 2: `Cole` - Last Name
- Columns 3-9: Empty (Phonetic names, Prefix, Suffix, Nickname)
- Column 10: `David M. Cole CPA` - File As
- Column 11: `CPA` - Organization Name
- Columns 12-13: Empty (Organization Title, Department)
- Column 14: `$250 for 2017 taxes` - Notes
- Column 15: Empty - Photo
- Column 16: `* myContacts ::: * starred` - Labels

**Email Fields:**
- Column 17: Empty - E-mail 1 - Label
- Column 18: Empty - E-mail 1 - Value
- Columns 19-20: Empty - E-mail 2

**Phone Fields:**
- Column 21: `Work` - Phone 1 - Label
- Column 22: `(407) 536-2033 ::: (407) 536-2033` - Phone 1 - Value (DUPLICATE)
- Columns 23-26: Empty - Phone 2 & 3

**Address Fields:**
- Column 27: `Work` - Address 1 - Label
- Column 28: `5401 S Kirkman Rd. #700, Orlando, FL 32819` - Address 1 - Formatted
- Column 29: `#700 5401 S Kirkman Rd` - Address 1 - Street
- Column 30: `Orlando` - Address 1 - City
- Column 31: Empty - Address 1 - PO Box
- Column 32: `FL` - Address 1 - Region
- Column 33: `32819` - Address 1 - Postal Code
- Column 34: Empty - Address 1 - Country
- Column 35: Empty - Address 1 - Extended Address

**Relationship Fields:**
- Column 36: `Business/ Finance` - Relation 1 - Label
- Column 37: `Accountant` - Relation 1 - Value
- Columns 38-41: Empty - Relation 2 & 3

**Website Fields:**
- Column 42: `Other` - Website 1 - Label
- Column 43: `DavidColeCPA.com` - Website 1 - Value
- Columns 44-45: Empty - Website 2

**Events & Custom Fields:**
- Columns 46-51: Empty

---

## Expected Post-Import Contact Object

```javascript
{
  id: "contact-[timestamp]-[random]",
  firstName: "(CPA) David",
  middleName: "M.",
  lastName: "Cole",
  fileAs: "David M. Cole CPA",
  organizationName: "CPA",
  notes: "$250 for 2017 taxes",
  labels: ["* myContacts", "* starred"],
  
  // EMAILS: Should be EMPTY (columns 17-20 are all empty)
  emails: [],
  
  // PHONES: Should have ONE entry (deduplicated)
  phones: [
    { label: "Work", value: "(407) 536-2033" }
  ],
  
  // ADDRESSES: Should have ONE entry with correct fields
  addresses: [
    {
      label: "Work",
      formatted: "5401 S Kirkman Rd. #700, Orlando, FL 32819",
      street: "#700 5401 S Kirkman Rd",
      city: "Orlando",
      poBox: undefined,
      region: "FL",
      postalCode: "32819",
      country: undefined,  // Column 34 is EMPTY
      extendedAddress: undefined  // Column 35 is EMPTY
    }
  ],
  
  // RELATIONSHIPS: Should have ONE entry
  relationships: [
    { label: "Business/ Finance", value: "Accountant" }
  ],
  
  // WEBSITES: Should have ONE entry
  websites: [
    { label: "Other", value: "DavidColeCPA.com" }
  ],
  
  events: [],
  customFields: [],
  displayCustomName: false,
  quickViewFields: [],
  entries: [],
  createdAt: [Date],
  updatedAt: [Date]
}
```

---

## Issues Identified

### Issue 1: Phone Number in Email Field
**Problem:** Phone number `(407) 536-2033` is appearing in the email field.

**Root Cause Analysis:**
- CSV columns 17-20 (all email fields) are EMPTY
- The importer code checks `if (label || value)` - if BOTH are empty, it should NOT create an email entry
- If phone number is appearing in email, it means:
  1. Header mapping is failing and using wrong fallback indices, OR
  2. The CSV row parsing is misaligned (columns shifted), OR
  3. There's a bug in the email parsing logic that's reading from wrong columns

**Expected Behavior:**
- `getValue('E-mail 1 - Label', 17)` should return empty string
- `getValue('E-mail 1 - Value', 18)` should return empty string
- Since both are empty, NO email entry should be created

### Issue 2: "Accountant" in "Person" Field
**Problem:** The relationship value "Accountant" is correctly showing, but the user is asking where it should go.

**Explanation:**
- "Person" is just the label for the relationship VALUE field in the UI
- The relationship data is:
  - Label: "Business/ Finance" (dropdown selector)
  - Value: "Accountant" (text input labeled "Person")
- This is CORRECT - "Accountant" is the person/role name, "Business/ Finance" is the relationship type

**However:** The user might be expecting "Accountant" to go in a different field. Let me check if there's a better place for this data...

**Possible Better Location:**
- Organization Title field? (Currently empty - column 12)
- Custom field?
- Contact type system?

---

## Debugging Steps Needed

1. **Verify Header Mapping:**
   - Check if `headerMap.get('E-mail 1 - Label')` returns 17
   - Check if `headerMap.get('E-mail 1 - Value')` returns 18
   - Check if `headerMap.get('Phone 1 - Label')` returns 21
   - Check if `headerMap.get('Phone 1 - Value')` returns 22

2. **Verify Row Parsing:**
   - Check if `row[17]` is actually empty (not accidentally containing phone data)
   - Check if `row[18]` is actually empty
   - Check if `row[21]` contains "Work"
   - Check if `row[22]` contains the phone number

3. **Check for Column Misalignment:**
   - The CSV might have quoted values that are being parsed incorrectly
   - Address field has quotes: `"5401 S Kirkman Rd. #700, Orlando, FL 32819"`
   - This could cause column misalignment if not parsed correctly

---

## Next Steps

1. Add debug logging to see what values are being read from each column
2. Verify the CSV row parsing handles quoted addresses correctly
3. Check if header mapping is working correctly
4. Fix any column misalignment issues
