# Floating Label Input Component

## Overview
A Material Design-inspired floating label input component that provides a modern, clean form input experience similar to Google Contacts.

## Features
- **Floating Label Animation**: Label starts inside the input and smoothly animates to the top border on focus
- **Smart State Management**: Label stays at top if input has a value, returns to inside if empty on blur
- **Icon Support**: Optional icon on the left side of the input
- **Error States**: Visual error indication with error message
- **Helper Text**: Optional helper text below the input
- **Theme-Aware**: Uses CSS variables for consistent theming
- **Accessible**: Proper label association and ARIA attributes

## Usage

### Basic Input
```tsx
import { FloatingLabelInput } from '@/shared/components/FloatingLabelInput';

<FloatingLabelInput
  label="First name"
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
/>
```

### With Icon
```tsx
import { FloatingLabelInput } from '@/shared/components/FloatingLabelInput';
import { User } from 'lucide-react';

<FloatingLabelInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  icon={<User className="w-4 h-4" />}
/>
```

### With Error
```tsx
<FloatingLabelInput
  label="Phone number"
  type="tel"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  error="Please enter a valid phone number"
/>
```

### Textarea
```tsx
import { FloatingLabelTextarea } from '@/shared/components/FloatingLabelInput';

<FloatingLabelTextarea
  label="Notes"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  rows={4}
/>
```

## Props

### FloatingLabelInput
- `label` (required): The label text that will float
- `value`: Input value (controlled component)
- `onChange`: Change handler
- `error`: Error message to display
- `helperText`: Helper text to display below input
- `icon`: Optional icon element to display on the left
- `containerClassName`: Additional classes for the container
- All standard HTML input attributes are supported

### FloatingLabelTextarea
- Same props as FloatingLabelInput, but for textarea elements
- Supports `rows` prop for textarea height

## Behavior
1. **Initial State**: Label appears inside the input field as placeholder text
2. **On Focus**: Label animates up to the top border and changes color to primary
3. **With Value**: If input has a value, label stays at top even when not focused
4. **On Blur (Empty)**: If input is empty on blur, label animates back down into the field
5. **On Blur (With Value)**: If input has value on blur, label stays at top

## Styling
The component uses CSS variables for theming:
- `--color-primary`: Label color when active
- `--color-error`: Error text and border color
- `--color-muted-foreground`: Label color when inactive
- `--color-border`: Input border color
- `--color-background`: Input background color
- `--color-foreground`: Input text color

## Implementation Notes
- Uses CSS transitions for smooth animations (200ms duration)
- Label scaling uses `scale(0.75)` when at top to match Material Design
- Properly handles ref forwarding for form libraries
- Supports all standard input types (text, email, tel, date, etc.)

