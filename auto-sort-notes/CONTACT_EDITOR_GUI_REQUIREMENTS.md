# Contact Editor GUI Requirements

## Overview
Complete redesign of the ContactEditor component to improve usability and visual hierarchy.

## Key Design Principles
1. **Set Width**: The form should have a fixed/maximum width for better readability
2. **Profile Preview**: Display profile picture and name preview at the top
3. **Always Visible**: All sections are visible by default (no collapsible dropdowns)
4. **Show More Pattern**: Each section shows minimum required fields, with "Show More" to reveal additional fields
5. **Icon-Based Sections**: Each section uses an icon (no text titles)
6. **Default Fields**: Each section displays at least one field by default (no "Add" button required for first entry)

---

## Section Layouts

### 1. Profile Picture & Name Preview (Top Section)
- **Profile Picture**: Circular preview with edit overlay
- **Name Preview**: Display the contact's name as it will appear (respects `displayCustomName` setting)
- **Layout**: Horizontal layout with photo on left, name on right

---

### 2. Basic Information Section
**Icon**: User (Person icon)

**Default Visible:**
- First Name - Last Name (side by side, 2-column grid)
- Middle Name (full width)
- [Show More button]

**Hidden Until "Show More" Clicked:**
- Nickname (full width)
- Name Prefix - Name Suffix (side by side, 2-column grid)
- Phonetic First Name - Phonetic Middle Name - Phonetic Last Name (3-column grid)
- Checkbox: "Show nickname instead of full name"

---

### 3. Labels Section
**Icon**: Tag

**Default Visible:**
- Label field (one field shown by default, not requiring "Add" button)
  - Text input for label value
- [Add Label button] (for additional labels)

**Behavior:**
- First label field is always visible
- Additional labels can be added via "Add Label" button
- Each label can be removed individually

---

### 4. Organization Section
**Icon**: Building2

**Default Visible:**
- Organization Name (with label dropdown: "Work", "Home", "Add New", etc.)
- Title - Department (side by side, 2-column grid)
- [Add More Roles button]

**Label Dropdown Options:**
- Work
- Home
- Other
- Add New (allows custom label)

---

### 5. Contact Information Section
**Icon**: Phone (or combination icon)

**Default Visible:**
- **Email Address** (one field shown by default)
  - Email input field
  - Label dropdown: "Work", "Home", "Other", "Add New"
  - [Add Email Address button]

- **Phone Number** (one field shown by default)
  - Phone input field
  - Label dropdown: "Work", "Home", "Mobile", "Main", "Other", "Add New"
  - [Add Phone Number button]

- **Address** (one field shown by default)
  - Full address fields (street, city, state, zip, country, etc.)
  - Label dropdown: "Work", "Home", "Other", "Add New"
  - [Add Address button]

- **[Add P.O. Box button]** (separate button for P.O. Box addresses)

---

### 6. Relationships Section
**Icon**: Users

**Default Visible:**
- **Person** (one field shown by default)
  - Person name input field
  - Label dropdown: "Parent", "Friend", "Referred By", "Other", "Add New"
  - [Add Relationship button]

---

### 7. Websites Section
**Icon**: Globe

**Default Visible:**
- **Website** (one field shown by default)
  - Website URL input field
  - Label dropdown: "Work", "Personal", "Other", "Add New"
  - [Add Website button]

- **Social** (one field shown by default)
  - Social media URL input field
  - Label dropdown: "Work", "Personal", "Other", "Add New"
  - [Add Social button]

---

### 8. Important Dates Section
**Icon**: Calendar

**Default Visible:**
- **Date** (one field shown by default)
  - Date input field
  - Label dropdown: "Birthday", "Anniversary", "Other", "Add New"
  - [Add Date button]

**Note**: Birthday is typically the first date, but all dates use the same structure.

---

### 9. Custom Fields Section
**Icon**: Tag

**Default Visible:**
- **Custom** (one field shown by default)
  - Custom field name input
  - Custom field value input
  - Label dropdown: "Add New" (allows custom label)
  - [Add Custom Field button]

---

### 10. Notes Section
**Icon**: FileText

**Default Visible:**
- **Notes** (always visible, no "Show More")
  - Textarea field for notes
  - No additional fields or buttons

---

## Implementation Details

### Label Dropdown Behavior
- All label dropdowns should support:
  - Standard options (Work, Home, Other, etc.)
  - "Add New" option that allows users to type a custom label
  - When "Add New" is selected, show a text input to enter the custom label

### Show More Functionality
- Each section with "Show More" should:
  - Track expanded state per section
  - Smoothly reveal/hide additional fields
  - Button text changes to "Show Less" when expanded

### Field Defaults
- All sections that require at least one entry should:
  - Initialize with one empty field if no data exists
  - Display existing data if contact is being edited
  - Never require clicking "Add" button to see the first field

### Layout Constraints
- Form should have a maximum width (e.g., `max-w-4xl` or similar)
- Form should be centered
- Consistent spacing between sections
- Consistent field spacing within sections

### Name Preview Logic
- If `displayCustomName` is true: Show nickname (or "No nickname" if empty)
- If `displayCustomName` is false: Show full name format
  - Format: `[Prefix] First [Middle] Last [Suffix]`
  - Example: "Dr. John Michael Smith Jr."

---

## State Management

### New State Variables Needed
- `showMoreBasicInfo: boolean` - Controls visibility of additional basic info fields
- `showMoreOrganization: boolean` - Controls visibility of additional org fields (if any)
- Per-section expanded states for "Show More" functionality

### Field Initialization
- Ensure all array fields (emails, phones, addresses, etc.) have at least one empty entry if the array is empty
- This ensures users always see input fields without needing to click "Add"

---

## Visual Design
- Clean, modern layout
- Consistent use of FloatingLabelInput components
- Icons positioned to the left of each section
- Proper spacing and visual hierarchy
- Theme-aware styling (respects light/dark mode)

