# Theme System and Component Templates

## Overview

The AREA project uses a shared design system between the mobile and web clients. The `@area/ui` package contains design tokens (colors, spacing, typography) that are used by both platforms to maintain visual consistency.

## Theme Architecture

### @area/ui Package Structure

```
packages/ui/
├── src/
│   ├── theme/
│   │   ├── colors.ts         # Color definitions (light/dark)
│   │   └── index.ts          # Complete theme export
│   ├── tokens.ts             # Shared design tokens
│   └── index.ts              # Package exports
└── package.json
```

### Shared Design Tokens

Design tokens are defined in `packages/ui/src/tokens.ts` and include:

- **Spacing**: xs, sm, md, lg, xl, xxl
- **Border Radius**: none, sm, md, lg, xl, full
- **Font Sizes**: xs to 4xl
- **Font Weights**: normal, medium, semibold, bold
- **Shadows**: sm, md, lg

### Color System

Colors are defined in `packages/ui/src/theme/colors.ts` with two palettes:

- `lightColors`: Light mode palette
- `darkColors`: Dark mode palette

Each palette contains:

- Background colors (background, backgroundAlt)
- Surface colors (surface, surfaceMuted, surface0)
- Text colors (text, textSecondary, textMuted)
- Border colors (border, borderSubtle)
- Primary colors (primary, primarySoft, primaryOn)
- Danger colors (danger, dangerSoft, dangerOn)
- Status colors (success, warning, etc.)
- Gray scale (gray50 to gray900)

## Web Client Usage

### ThemeProvider

The `ThemeProvider` is defined in `packages/web/src/context/ThemeContext.tsx`. It:

1. Imports colors and tokens from `@area/ui`
2. Injects values as CSS variables into `:root`
3. Handles switching between light and dark modes
4. Persists user preference in `localStorage`
5. Automatically detects system preference

### Available CSS Variables

Once `ThemeProvider` is configured, all CSS variables are available:

```css
/* Background colors */
var(--color-background)
var(--color-surface)
var(--color-surface-muted)

/* Text colors */
var(--color-text)
var(--color-text-secondary)
var(--color-text-muted)

/* Primary colors */
var(--color-primary)
var(--color-primary-soft)

/* Border colors */
var(--color-border)
var(--color-border-subtle)

/* Spacing */
var(--spacing-xs)   /* 4px */
var(--spacing-sm)   /* 8px */
var(--spacing-md)   /* 12px */
var(--spacing-lg)   /* 16px */
var(--spacing-xl)   /* 24px */
var(--spacing-xxl)  /* 32px */

/* Border radius */
var(--radius-sm)    /* 8px */
var(--radius-md)    /* 12px */
var(--radius-lg)    /* 16px */
var(--radius-xl)    /* 20px */
var(--radius-full)  /* 9999px */

/* Typography */
var(--font-size-xs)      /* 12px */
var(--font-size-sm)      /* 14px */
var(--font-size-md)      /* 16px */
var(--font-size-lg)      /* 18px */
var(--font-size-xl)      /* 20px */
var(--font-size-2xl)     /* 24px */
var(--font-size-3xl)     /* 30px */
var(--font-size-4xl)     /* 36px */

var(--font-weight-normal)    /* 400 */
var(--font-weight-medium)    /* 500 */
var(--font-weight-semibold)  /* 600 */
var(--font-weight-bold)      /* 700 */

/* Shadows */
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
```

### Usage in Components

#### In CSS Modules

```css
.button {
  background-color: var(--color-primary);
  color: var(--color-primary-on);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--shadow-sm);
}

.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}
```

#### Dark Mode Specific Styles

Use the `data-theme` attribute to target dark mode:

```css
.element {
  background: var(--color-surface);
}

[data-theme='dark'] .element {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

#### Accessing Theme in React Component

```typescript
import { useWebTheme } from '@/context/ThemeContext';

function MyComponent() {
  const { mode, toggleTheme, setTheme } = useWebTheme();

  return (
    <div>
      <p>Current theme: {mode}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

## Component Templates

### Web Component Structure

Web components follow a standardized structure:

```
packages/web/src/components/ui/
├── Button.tsx
├── Button.module.css
├── Card.tsx
├── Card.module.css
└── index.ts
```

### Component Template Example

#### Button.tsx

```typescript
import styles from './Button.module.css';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        fullWidth ? styles.fullWidth : ''
      }`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      {loading ? 'Loading...' : children}
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
}
```

#### Button.module.css

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.primary {
  background-color: var(--color-primary);
  color: var(--color-primary-on);
}

.primary:hover:not(:disabled) {
  opacity: 0.9;
}

.secondary {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.danger {
  background-color: var(--color-danger);
  color: var(--color-danger-on);
}

/* Sizes */
.sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.md {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-md);
}

.lg {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
}

.fullWidth {
  width: 100%;
}
```

## Best Practices

### Use Tokens Instead of Hardcoded Values

Bad:

```css
.element {
  padding: 16px;
  border-radius: 8px;
  color: #3b82f6;
}
```

Good:

```css
.element {
  padding: var(--spacing-lg);
  border-radius: var(--radius-sm);
  color: var(--color-primary);
}
```

### Respect Color Hierarchy

- Use `--color-text` for primary text
- Use `--color-text-secondary` for secondary text
- Use `--color-text-muted` for disabled text
- Use `--color-background` for main backgrounds
- Use `--color-surface` for cards and containers

### Test Both Modes

Always verify that your components work correctly in both light and dark mode.

### Use CSS Modules

Prefer CSS Modules to avoid class name conflicts and maintain encapsulation.

## Modifying the Theme

### Adding a New Color

1. Add the color in `packages/ui/src/theme/colors.ts`:

```typescript
export const lightColors = {
  // ... existing colors
  accent: '#8b5cf6',
  accentSoft: 'rgba(139, 92, 246, 0.1)',
};

export const darkColors = {
  // ... existing colors
  accent: '#a78bfa',
  accentSoft: 'rgba(167, 139, 250, 0.15)',
};
```

2. Add CSS variable in `packages/web/src/context/ThemeContext.tsx`:

```typescript
function injectCSSVariables(mode: ThemeMode) {
  const colors = mode === 'light' ? lightColors : darkColors;
  const root = document.documentElement;

  // ... existing variables
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-accent-soft', colors.accentSoft);
}
```

3. Use the new color:

```css
.element {
  background-color: var(--color-accent);
}
```

### Adding a New Token

1. Define the token in `packages/ui/src/tokens.ts`:

```typescript
export const spacing = {
  // ... existing spacing
  xxxl: 48,
};
```

2. Inject in ThemeProvider:

```typescript
root.style.setProperty('--spacing-xxxl', `${spacing.xxxl}px`);
```

## Mobile Support

Currently, the mobile client does not import from `@area/ui`. However, the tokens and colors are available for future use if needed.

## Resources

- UI Package: `packages/ui/`
- Web ThemeProvider: `packages/web/src/context/ThemeContext.tsx`
- Component Examples: `packages/web/src/components/ui/`
- Design Tokens: `packages/ui/src/tokens.ts`
- Color Definitions: `packages/ui/src/theme/colors.ts`
