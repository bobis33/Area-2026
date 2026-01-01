/**
 * Shared UI Library
 * Exports all public components
 */

export { Button } from '@area/ui/components/Button';
export type { ButtonProps } from '@area/ui/components/Button';

export { Text } from '@area/ui/components/Text';
export type { TextProps } from '@area/ui/components/Text';

export { Input } from '@area/ui/components/Input';
export type { InputProps } from '@area/ui/components/Input';

export { Card } from '@area/ui/components/Card';
export type { CardProps } from './components/Card';

export { ScreenLayout } from '@area/ui/components/ScreenLayout';
export type { ScreenLayoutProps } from '@area/ui/components/ScreenLayout';

export { OAuthButton } from '@area/ui/components/OAuthButton';
export type { OAuthButtonProps } from '@area/ui/components/OAuthButton';

// Design tokens (for advanced usage)
export {
  colors,
  spacing,
  borderRadius,
  fontSizes,
  fontWeights,
  lineHeights,
  shadows,
} from '@area/ui/tokens';

// Theme system
export { theme, lightColors, darkColors } from '@area/ui/theme';
export type { Theme, ThemeMode } from '@area/ui/theme';