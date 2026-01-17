/**
 * Shared UI Library
 * Exports design tokens and theme for mobile and web clients
 */

// Design tokens
export {
  colors,
  spacing,
  borderRadius,
  fontSizes,
  fontWeights,
  lineHeights,
  shadows,
} from "./tokens";

// Theme system
export { theme, lightColors, darkColors } from "./theme";
export type { Theme, ThemeMode } from "./theme";
