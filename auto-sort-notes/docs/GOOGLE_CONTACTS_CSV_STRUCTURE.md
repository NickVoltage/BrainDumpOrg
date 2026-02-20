# Google Contacts: UI Fields vs CSV Structure

This document itemizes what appears on the Google Contacts website, then describes how the same data is stored in the exported CSV so we can parse it reliably.

---

## Part 1: Information on the Google Contacts Page

From the native Google Contacts UI for a contact (e.g. David M. Cole CPA), the following **distinct fields** are shown:

### Person (name)
| Field        | Example for David M. Cole CPA |
|-------------|-------------------------------|
| First name  | (CPA) David                   |
| Middle name | M.                            |
| Last name   | Cole                          |

### Company / organization
| Field     | Example                    |
|-----------|----------------------------|
| Company   | David M. Cole CPA          |
| Job title | CPA                        |

### Email
| Field | Label (type) | Value        |
|-------|----------------|-------------|
| Email | (none when empty) | *Empty – "Add email"* |

### Phone
| Field | Label | Value           |
|-------|--------|-----------------|
| Phone | Work   | (407) 536-2033  |

### Address
| Field              | Example value                    |
|--------------------|----------------------------------|
| Country / Region   | United States                    |
| Street address    | #700 5401 S Kirkman Rd           |
| Street address line 2 | *(empty)*                 |
| City               | Orlando                         |
| State              | Florida                         |
| ZIP code           | 32819                           |
| PO Box             | *(empty)*                       |
| Label              | Work                            |

### Date (birthday / anniversary)
| Field | Example   |
|-------|-----------|
| Month | *(empty)* |
| Day   | *(empty)* |
| Year  | *(empty)* |

### Website
| Field   | Label  | Value            |
|---------|--------|------------------|
| Website | other  | DavidColeCPA.com |

### Related person (relationship)
| Field | Value      |
|-------|------------|
| Related person | Accountant |

### Label (category / tag)
| Field | Value           |
|-------|-----------------|
| Label | Business/ Finance |

### Notes
| Field | Value               |
|-------|---------------------|
| Notes | $250 for 2017 taxes |

---

**Important:** In Google’s UI, “Related person” holds the value **Accountant**, and the **Label** (category) is **Business/ Finance**. So “Accountant” is the relationship type; “Business/ Finance” is a separate tag/category, not the country or address.

---

## Part 2: CSV Header – Column Order and Names

The first line of the CSV is a single header row. **Column separation is by comma.** There are no commas inside the header names, so the header line can be split on comma to get exact column order.

**Column index → Header name (52 columns, 0–51):**

| Index | Header name |
|-------|-------------|
| 0 | First Name |
| 1 | Middle Name |
| 2 | Last Name |
| 3 | Phonetic First Name |
| 4 | Phonetic Middle Name |
| 5 | Phonetic Last Name |
| 6 | Name Prefix |
| 7 | Name Suffix |
| 8 | Nickname |
| 9 | File As |
| 10 | Organization Name |
| 11 | Organization Title |
| 12 | Organization Department |
| 13 | Birthday |
| 14 | Notes |
| 15 | Photo |
| 16 | Labels |
| 17 | E-mail 1 - Label |
| 18 | E-mail 1 - Value |
| 19 | E-mail 2 - Label |
| 20 | E-mail 2 - Value |
| 21 | Phone 1 - Label |
| 22 | Phone 1 - Value |
| 23 | Phone 2 - Label |
| 24 | Phone 2 - Value |
| 25 | Phone 3 - Label |
| 26 | Phone 3 - Value |
| 27 | Address 1 - Label |
| 28 | Address 1 - Formatted |
| 29 | Address 1 - Street |
| 30 | Address 1 - City |
| 31 | Address 1 - PO Box |
| 32 | Address 1 - Region |
| 33 | Address 1 - Postal Code |
| 34 | Address 1 - Country |
| 35 | Address 1 - Extended Address |
| 36 | Relation 1 - Label |
| 37 | Relation 1 - Value |
| 38 | Relation 2 - Label |
| 39 | Relation 2 - Value |
| 40 | Relation 3 - Label |
| 41 | Relation 3 - Value |
| 42 | Website 1 - Label |
| 43 | Website 1 - Value |
| 44 | Website 2 - Label |
| 45 | Website 2 - Value |
| 46 | Event 1 - Label |
| 47 | Event 1 - Value |
| 48 | Event 2 - Label |
| 49 | Event 2 - Value |
| 50 | Custom Field 1 - Label |
| 51 | Custom Field 1 - Value |

So **field separation** at the top level is: **one column per logical field** (or per slot, e.g. Phone 1, Phone 2). There is no ambiguity in column boundaries in the header.

---

## Part 3: How Data Is Separated Within the CSV

### 3.1 Row separation
- **Rows** are separated by **line breaks** (one logical contact per row).
- A single “row” may span **multiple physical lines** when a cell value is quoted and contains newlines (see below).

### 3.2 Column separation (within a row)
- **Columns** are separated by **commas** (`,`).
- So the delimiter is **comma**, and the number of columns is fixed by the header (52 columns).

### 3.3 Values that contain comma or newline
- If a value contains **comma** or **newline**, the entire value is wrapped in **double quotes** (`"`).
- While inside double quotes, the next character is not treated as a column or row boundary.
- So **one cell** can span several physical lines until the closing `"`.

**Examples from the file:**
- **Address 1 - Formatted** for David M. Cole (column 28):  
  `"#700 5401 S Kirkman Rd\nOrlando, FL 32819\nUS"`  
  So one cell = three lines; commas and newlines inside the quotes are part of the value.
- **Notes** with multiple lines (e.g. Alexander): the Notes cell is quoted and contains newlines and commas.
- **First Name** with comma: `"Alexander (Wawa, shaved head)"` — quoted so the comma doesn’t start a new column.

### 3.4 Escaping double quotes inside a quoted value
- Inside a quoted field, a **literal double quote** is represented by **two double quotes** (`""`).
- Example: `*"Friend"` in Notes is stored as `*""Friend""` inside the quoted Notes cell (see Alexander’s row).

### 3.5 Multiple values in a single cell (labels, etc.)
- Some columns hold **multiple logical values** in one cell; Google uses the sequence **space-colon-colon-colon-space** (` ::: `) as the separator.
- **Labels** (column 16): e.g. `* myContacts ::: * starred` = two labels.
- **Phones**: in at least one row, multiple numbers appear in one slot as `+1-936-206-1941 ::: +1-972-676-9407` (Phone 1 - Value), so ** ::: ** can appear in phone/value columns too when Google exports multiple entries into one slot.

So:
- **Between columns:** comma (or comma outside quotes).
- **Between rows:** newline, except when inside a quoted cell.
- **Inside a quoted cell:** newlines and commas are literal; `""` = one literal `"`.
- **Multiple items in one cell:** separator is ` ::: ` (space, three colons, space).

---

## Part 4: Mapping UI → CSV for David M. Cole CPA

After **correctly** parsing the CSV (respecting quotes so that the address stays one cell), the David M. Cole row should look like this:

| UI field / concept | CSV column (index) | CSV header | Expected value |
|--------------------|--------------------|------------|-----------------|
| First name         | 0  | First Name | (CPA) David |
| Middle name        | 1  | Middle Name | M. |
| Last name          | 2  | Last Name | Cole |
| Company            | 10 | Organization Name | David M. Cole CPA |
| Job title          | 11 | Organization Title | CPA |
| Email              | 18 | E-mail 1 - Value | *(empty)* |
| Phone label        | 21 | Phone 1 - Label | Work |
| Phone value        | 22 | Phone 1 - Value | (407) 536-2033 |
| Address label      | 27 | Address 1 - Label | Work |
| Address formatted  | 28 | Address 1 - Formatted | "#700 5401 S Kirkman Rd\nOrlando, FL 32819\nUS" (one cell) |
| Street             | 29 | Address 1 - Street | #700 5401 S Kirkman Rd |
| City               | 30 | Address 1 - City | Orlando |
| PO Box             | 31 | Address 1 - PO Box | *(empty)* |
| Region (state)     | 32 | Address 1 - Region | FL |
| Postal code        | 33 | Address 1 - Postal Code | 32819 |
| **Country**        | **34** | **Address 1 - Country** | **US** |
| Extended address   | 35 | Address 1 - Extended Address | *(empty)* |
| **Relation label (category)** | 36 | Relation 1 - Label | **Business/ Finance** |
| **Relation value (person/role)** | 37 | Relation 1 - Value | **Accountant** |
| Website label      | 42 | Website 1 - Label | Other |
| Website value      | 43 | Website 1 - Value | DavidColeCPA.com |
| Notes              | 14 | Notes | $250 for 2017 taxes |
| Labels             | 16 | Labels | * myContacts ::: * starred |

So in the CSV:
- **Country** is in column **34** (**Address 1 - Country**), value **US** (not “Business/ Finance”).
- **“Business/ Finance”** is in column **36** (**Relation 1 - Label**).
- **“Accountant”** is in column **37** (**Relation 1 - Value**).

If the parser misaligns columns (e.g. by not handling quoted multi-line address correctly), then column 34 might be read from the wrong position and show “Business/ Finance” instead of “US”. So **correct parsing of quoted fields is required** before trusting any column index.

---

## Part 5: Summary – Rules to Parse This CSV Reliably

1. **Header:** One line; split by comma to get 52 column names and order. Build a map from header name → index (and optionally normalize spaces/case if needed).
2. **Rows:** Read row by row. A row ends only when you have seen 52 cells **and** you are not inside a quoted field.
3. **Cells:**  
   - If the next character is `"`, read until the matching closing `"` (treat `""` as one literal `"`); that’s one cell.  
   - Otherwise read until the next comma or end of line; trim quotes if any.  
   Repeat until 52 cells.
4. **Multi-value in one cell:** For columns like Labels, or sometimes Phone/Email values, split the cell value on ` ::: ` to get a list of items.
5. **Mapping:** Use the header map to read by name (e.g. `Address 1 - Country`, `Relation 1 - Label`, `Relation 1 - Value`) so that column order and parsing are consistent.

Once this structure is implemented, the parser should produce the same mapping as in the table above and avoid “Country” showing “Business/ Finance” or “Accountant” appearing in the wrong place.
