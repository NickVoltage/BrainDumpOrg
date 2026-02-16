# Calendar Research and Implementation

This document contains research and discussion about creating an accurate calendar system with Google Calendar integration capabilities.

## Goals

- **100% Accurate Calendar**: Days of the month must be accurate according to year, including leap years
- **Holiday Accuracy**: Display holidays accurately for selected regions/countries
- **Leap Year Handling**: Automatically handle leap years correctly
- **100% Offline Operation**: Application works completely offline - no internet required for core functionality
- **Baked-In Holiday Data**: Holiday data bundled with application at build time, accurate forever, no runtime internet needed
- **User-Customizable Holidays**: Users can add, edit, or remove holidays locally (stored in local database)
- **Optional Google Calendar Integration**: Support importing data from Google Calendar via:
  - Google Calendar API (optional, user-initiated sync)
  - Google Takeout file import (optional, user-initiated bulk import)
  - Both methods available as optional features
  - **Note**: Google Calendar integration is NOT required for app to function

## Calendar Accuracy

### Date Calculation Libraries

For TypeScript/React applications, several libraries provide accurate date calculations:

#### 1. **date-fns** (Recommended)
- **Pros**:
  - Lightweight, modular (tree-shakeable)
  - Immutable date operations
  - TypeScript support
  - Handles leap years automatically
  - Timezone support via `date-fns-tz`
  - No dependencies
- **Cons**:
  - Requires separate package for holidays
- **Usage**: `npm install date-fns date-fns-tz`
- **Documentation**: https://date-fns.org/

#### 2. **dayjs**
- **Pros**:
  - Very lightweight (2KB)
  - Moment.js-compatible API
  - Plugin system (timezone, holidays, etc.)
  - TypeScript support
- **Cons**:
  - Plugins add to bundle size
  - Less feature-rich than date-fns
- **Usage**: `npm install dayjs`
- **Documentation**: https://day.js.org/

#### 3. **Luxon**
- **Pros**:
  - Built on Intl API
  - Excellent timezone support
  - Immutable
  - TypeScript support
- **Cons**:
  - Larger bundle size
  - More complex API
- **Usage**: `npm install luxon`
- **Documentation**: https://moment.github.io/luxon/

#### 4. **Native JavaScript Date**
- **Pros**:
  - No dependencies
  - Built-in
- **Cons**:
  - Timezone handling is problematic
  - Mutable (can cause bugs)
  - Limited functionality
  - Not recommended for production calendar apps

### Recommendation: **date-fns**

**Rationale**:
- Best balance of features, size, and TypeScript support
- Automatic leap year handling
- Modular design allows importing only needed functions
- Strong community and maintenance
- Works well with React

### Leap Year Calculation

Leap years are automatically handled by date-fns and other modern libraries. The algorithm:
- Year divisible by 4 = leap year
- EXCEPT: Year divisible by 100 = NOT leap year
- EXCEPT: Year divisible by 400 = leap year

Examples:
- 2000: Divisible by 400 → **Leap year** ✓
- 1900: Divisible by 100, not 400 → **Not leap year** ✓
- 2004: Divisible by 4 → **Leap year** ✓
- 2024: Divisible by 4 → **Leap year** ✓

**date-fns functions that handle this automatically**:
- `getDaysInMonth()` - Returns correct days (28, 29, 30, or 31)
- `isLeapYear()` - Checks if year is leap year
- `addMonths()`, `subMonths()` - Handle month boundaries correctly
- `startOfMonth()`, `endOfMonth()` - Accurate month boundaries

### Month Day Accuracy

Using date-fns ensures:
- February has 28 days (29 in leap years)
- Months with 30/31 days are correct
- Year boundaries handled correctly
- No manual calculation needed

**Example**:
```typescript
import { getDaysInMonth, isLeapYear } from 'date-fns';

const date = new Date(2024, 1, 1); // February 2024
getDaysInMonth(date); // Returns 29 (leap year)

const date2 = new Date(2023, 1, 1); // February 2023
getDaysInMonth(date2); // Returns 28 (not leap year)
```

## Holiday Data Sources

### **REQUIREMENT: Baked-In Holiday Data (Offline-First)**

**Core Principle**: Holiday data must be bundled with the application at build time. No internet connection required for holidays to work.

### Option 1: **Static JSON/TypeScript Files** (Recommended)
- **Approach**: 
  - Create static holiday data files (JSON or TypeScript)
  - Include in application bundle at build time
  - Load from bundled files at runtime (no network requests)
  - Store user customizations in local database
- **Pros**:
  - 100% offline
  - No external dependencies at runtime
  - Fast (no network latency)
  - Privacy (no external API calls)
  - Predictable (same data every time)
- **Cons**:
  - Bundle size increase (manageable with tree-shaking)
  - Requires manual updates for new holidays (rare)
  - Need to maintain data files
- **Implementation**:
  - Create `src/data/holidays/` directory
  - Separate files per country/region (e.g., `us-holidays.json`, `uk-holidays.json`)
  - Or single comprehensive file with country codes
  - Import and use in calendar components

### Option 2: **date-fns-holidays** (If it bundles data)
- **Check**: Verify if `date-fns-holidays` bundles data or requires runtime fetching
- **If it bundles**: Can use as-is
- **If it fetches**: NOT suitable (requires internet)
- **Usage**: `npm install date-fns-holidays` (only if it bundles data)
- **Documentation**: https://github.com/kalm42/date-fns-holidays

### Option 3: **@date-fns/holidays** (If it bundles data)
- **Check**: Verify if `@date-fns/holidays` bundles data or requires runtime fetching
- **If it bundles**: Can use as-is
- **If it fetches**: NOT suitable (requires internet)
- **Usage**: `npm install @date-fns/holidays` (only if it bundles data)

### **NOT Suitable: Holiday API Services**
- **Why**: Require internet connection at runtime
- **Examples**: Calendarific API, AbstractAPI Holidays, Nager.Date API
- **Status**: ❌ Rejected - violates offline-first requirement

### Recommendation: **Static Holiday Data Files**

1. **Create bundled holiday data files**:
   - Research and compile accurate holiday data for target countries
   - Store as JSON or TypeScript files in `src/data/holidays/`
   - Include fixed-date holidays (Christmas, New Year, etc.)
   - Include calculated holidays (Easter, Thanksgiving formulas, etc.)
   - Include leap-year-aware holidays

2. **User customization**:
   - Allow users to add custom holidays (stored in local database)
   - Allow users to hide/disable specific holidays
   - Allow users to edit holiday names/descriptions
   - All customizations stored locally (SQLite)

3. **Data sources for initial compilation**:
   - Use official government sources
   - Use reliable holiday databases (during development only)
   - Verify accuracy before bundling
   - Include formulas for calculated holidays (Easter, etc.)

4. **Maintenance**:
   - Update bundled data only when necessary (rare)
   - New app versions can include updated holiday data
   - Users can always add missing holidays manually

## Google Calendar Integration

### Approach 1: Google Calendar API (Optional Feature)

#### Overview
- **OPTIONAL**: User-initiated feature, not required for app to function
- Real-time synchronization with Google Calendar (when user chooses to enable)
- OAuth 2.0 authentication (user-initiated)
- Read and write capabilities
- Supports recurring events, reminders, attendees, etc.
- **Note**: Requires internet connection, but is completely optional

#### Authentication Flow

1. **OAuth 2.0 Setup**:
   - Create Google Cloud Project
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials (Client ID, Client Secret)
   - Configure redirect URIs for Tauri app

2. **Authentication Process**:
   ```
   User clicks "Connect Google Calendar"
   → Redirect to Google OAuth consent screen
   → User grants permissions
   → Google redirects back with authorization code
   → Exchange code for access token + refresh token
   → Store tokens securely (encrypted in local storage/database)
   → Use access token for API calls
   ```

3. **Token Management**:
   - Access tokens expire (typically 1 hour)
   - Use refresh token to get new access tokens
   - Store refresh token securely (never expose in frontend)
   - Handle token refresh automatically

#### API Endpoints

**Get Events**:
```
GET https://www.googleapis.com/calendar/v3/calendars/primary/events
```

**Create Event**:
```
POST https://www.googleapis.com/calendar/v3/calendars/primary/events
```

**Update Event**:
```
PUT https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}
```

**Delete Event**:
```
DELETE https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}
```

#### Required Scopes

- `https://www.googleapis.com/auth/calendar.readonly` - Read-only access
- `https://www.googleapis.com/auth/calendar` - Full read/write access
- `https://www.googleapis.com/auth/calendar.events` - Events only (read/write)

#### Libraries for Google Calendar API

**Option 1: `googleapis` (Node.js/TypeScript)**
- **Pros**: Official Google client library, comprehensive
- **Cons**: Designed for Node.js (may need backend or Tauri command)
- **Usage**: `npm install googleapis`
- **Documentation**: https://github.com/googleapis/google-api-nodejs-client

**Option 2: Direct Fetch API Calls**
- **Pros**: Works in frontend, no additional dependencies
- **Cons**: More manual implementation, need to handle OAuth flow
- **Approach**: Use `fetch()` with OAuth tokens

#### Implementation Considerations

**For Tauri Application**:
- OAuth flow can be handled in Tauri window
- Store tokens securely using Tauri's secure storage or encrypted SQLite
- Use Tauri commands for API calls (backend) or fetch directly (frontend)
- Handle deep linking for OAuth redirect

**Sync Strategy**:
- **Real-time**: Poll API periodically (every 5-15 minutes)
- **On-demand**: Sync when user requests
- **Push notifications**: Use Google Calendar push notifications (webhooks) - requires backend server
- **Hybrid**: Periodic sync + on-demand refresh

#### Pros and Cons

**Pros**:
- Real-time synchronization
- Two-way sync (read and write)
- Always up-to-date
- Supports all Google Calendar features (recurring events, reminders, etc.)
- Can sync multiple calendars

**Cons**:
- Requires internet connection
- OAuth setup complexity
- Token management overhead
- API rate limits (1,000,000 requests/day for free tier)
- Privacy: Data flows through Google servers
- Requires Google account

### Approach 2: Google Takeout Import (Optional Feature)

#### Overview
- **OPTIONAL**: User-initiated feature, not required for app to function
- One-time or periodic bulk import (user chooses when)
- User exports calendar from Google Takeout
- App parses and imports the data
- No ongoing connection to Google
- **Note**: Works offline after import (data stored locally)

#### Google Takeout Format

Google Takeout exports calendars as **iCalendar (.ics) files**:
- Standard format (RFC 5545)
- Text-based format
- Contains all calendar events, recurring rules, timezones, etc.
- One file per calendar

#### File Structure

Example `.ics` file:
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Google Inc//Google Calendar 70.9054//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:20240101T100000Z
DTEND:20240101T110000Z
DTSTAMP:20231215T120000Z
UID:event123@google.com
SUMMARY:Meeting
DESCRIPTION:Team meeting
LOCATION:Conference Room
RRULE:FREQ=WEEKLY;BYDAY=MO
END:VEVENT
END:VCALENDAR
```

#### Parsing Libraries

**Option 1: `ical.js`**
- **Pros**: Comprehensive, handles complex recurring events
- **Cons**: Larger bundle size
- **Usage**: `npm install ical.js`
- **Documentation**: https://github.com/mozilla-comm/ical.js

**Option 2: `node-ical`**
- **Pros**: Simple API, good for basic parsing
- **Cons**: May not handle all edge cases
- **Usage**: `npm install node-ical`
- **Documentation**: https://github.com/jens-maus/node-ical

**Option 3: `ical-generator`** (for writing)
- **Pros**: Can also write ICS files
- **Cons**: Primarily for generation, parsing is secondary
- **Usage**: `npm install ical-generator`
- **Documentation**: https://github.com/sebbo2002/ical-generator

#### Import Process

1. **User Action**:
   - User exports calendar from Google Takeout
   - User selects `.ics` file(s) in app
   - App parses file(s)

2. **Parsing**:
   - Read `.ics` file
   - Parse events, recurring rules, timezones
   - Convert to app's internal event format
   - Handle recurring events (expand if needed)

3. **Storage**:
   - Store events in local database (SQLite)
   - Link to source (mark as "imported from Google")
   - Handle duplicates (if re-importing)

4. **Conflict Resolution**:
   - Detect duplicate events (by UID or date/time/title)
   - Options: Skip, Replace, Merge, Ask user

#### Pros and Cons

**Pros**:
- No OAuth complexity
- Works offline after import
- No API rate limits
- Privacy: Data stays local
- No Google account required after export
- Can import historical data easily
- Simple implementation

**Cons**:
- One-way import (no sync back to Google)
- Manual process (user must export and import)
- Not real-time (data becomes stale)
- User must remember to re-export for updates
- May miss recent changes if not re-exported

### Approach 3: Hybrid (Both Methods - Optional)

#### Overview
Support both API sync and Takeout import as **optional features**, allowing users to choose their preferred method if they want to import Google Calendar data. Neither method is required for the app to function.

#### Implementation Strategy

1. **User Choice**:
   - Option 1: Connect via Google Calendar API (real-time sync)
   - Option 2: Import from Google Takeout file (one-time/periodic)
   - Option 3: Both (API for active calendar, Takeout for historical data)

2. **Data Merging**:
   - Events from API and Takeout may overlap
   - Use event UID to identify duplicates
   - Prefer API data for conflicts (more recent)
   - Allow user to choose conflict resolution

3. **UI/UX**:
   - Settings page with import options
   - Show sync status (last sync time, method used)
   - Allow switching between methods
   - Option to disable one method

#### Pros and Cons

**Pros**:
- Maximum flexibility for users
- Can use best of both approaches
- API for active calendar, Takeout for historical data
- Users can choose based on privacy/connectivity preferences

**Cons**:
- More complex implementation
- Need to handle data merging/conflicts
- More code to maintain
- Potential confusion for users (which method to use?)

## Recommendations

### For Calendar Accuracy

1. **Use `date-fns`** for all date calculations
2. **Never manually calculate dates** - always use library functions
3. **All date operations work offline** - date-fns has no network dependencies

### For Holiday Data

1. **Create static holiday data files** bundled with application
2. **Store in `src/data/holidays/`** as JSON or TypeScript files
3. **Load from bundled files** at runtime (no network requests)
4. **Store user's custom holidays** in local database (SQLite)
5. **Allow users to customize** (add, edit, remove holidays locally)

### For Google Calendar Integration

**Both Methods are Optional Features**

**Implementation Priority**:
1. **Core calendar** (offline, with bundled holidays)
2. **Google Takeout Import** (optional, user-initiated)
3. **Google Calendar API** (optional, user-initiated)

**Rationale**:
- Core app works 100% offline
- Google Calendar integration is a convenience feature
- Users can choose their preferred import method
- Both methods are optional - app doesn't require either

### Implementation Priority

1. **Calendar accuracy** (date-fns, leap years, month days)
2. **Basic calendar UI** (month view, navigation)
3. **Holiday display** (date-fns-holidays integration)
4. **Google Takeout import** (.ics file parsing)
5. **Google Calendar API** (OAuth, sync) - if needed

## Technical Considerations

### Timezone Handling

- Store all dates in UTC internally
- Convert to user's timezone for display
- Use `date-fns-tz` for timezone conversions
- Handle daylight saving time transitions

### Recurring Events

- Google Calendar uses RRULE (RFC 5545) for recurring events
- Libraries like `ical.js` can parse and expand recurring events
- Consider caching expanded events for performance
- Handle exceptions (cancelled instances, modified instances)

### Performance

- Cache holiday data (don't recalculate every render)
- Lazy load calendar months (only render visible months)
- Virtualize long event lists
- Debounce sync operations

### Data Storage

- Store events in SQLite database
- Schema should support:
  - Event details (title, description, location, etc.)
  - Dates/times (UTC)
  - Recurring rules (if not expanded)
  - Source (API, Takeout, manual)
  - Google Calendar UID (for duplicate detection)

## Offline-First Architecture

### Core Principles

1. **No Runtime Internet Required**:
   - All core features work offline
   - Holiday data bundled with app
   - Date calculations use local libraries
   - No external API calls for core functionality

2. **Optional Internet Features**:
   - Google Calendar API sync (optional, user-initiated)
   - Google Takeout import (optional, user-initiated)
   - Both require internet, but are not required for app to function

3. **Data Storage**:
   - All data stored locally (SQLite database)
   - Holiday data bundled at build time
   - User customizations stored locally
   - Imported calendar events stored locally

4. **Development vs Runtime**:
   - **Development**: Internet OK (npm install, building, etc.)
   - **Runtime**: No internet required for core features

## Questions for Discussion

1. **Holiday Coverage**: Which countries/regions should be supported initially in bundled data?
2. **Holiday Data Format**: JSON files or TypeScript files? Single file or per-country?
3. **Calculated Holidays**: How to handle Easter, Thanksgiving (formulas vs. pre-calculated dates)?
4. **Google Calendar Sync Frequency**: How often should API sync occur? (if user enables it)
5. **Conflict Resolution**: How should duplicate events be handled when importing?
6. **Write Back**: Should app be able to create/edit events in Google Calendar? (requires API, optional feature)

## Next Steps

1. **Research specific libraries** for ICS parsing in TypeScript/React
2. **Design database schema** for calendar events
3. **Plan OAuth flow** for Tauri application (if API approach chosen)
4. **Create implementation plan** with specific steps
5. **Test date-fns** with various edge cases (leap years, month boundaries)

---

**Last Updated**: 2024  
**Status**: Research and discussion document

