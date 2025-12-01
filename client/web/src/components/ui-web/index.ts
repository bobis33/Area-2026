/**
 * Web UI Components
 *
 * These components wrap the shared @area/ui components and add
 * web-specific functionality while maintaining visual consistency
 * with the mobile app.
 */

export { WebButton } from './WebButton';
export type { WebButtonProps } from './WebButton';

export { WebInput } from './WebInput';
export type { WebInputProps } from './WebInput';

export { WebCard } from './WebCard';
export type { WebCardProps } from './WebCard';

export { WebText } from './WebText';
export type { WebTextProps } from './WebText';

// Re-export design tokens from the shared package for convenience
export {
  colors,
  spacing,
  borderRadius,
  fontSizes,
  fontWeights,
  lineHeights,
  shadows,
} from '@area/ui';
