import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import type { TextProps } from '@area/ui';
import { useAppTheme } from '@/contexts/ThemeContext';
import { fontSizes, fontWeights, lineHeights } from '@area/ui';

export interface MobileTextProps extends TextProps {}

export const MobileText: React.FC<MobileTextProps> = ({
  children,
  variant = 'body',
  align = 'left',
  color = 'default',
  numberOfLines,
  style,
}) => {
  const { currentTheme, isDark } = useAppTheme();

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      textAlign: align,
    };

    // Variant styles
    switch (variant) {
      case 'title':
        return {
          ...baseStyle,
          fontSize: fontSizes['3xl'],
          fontWeight: fontWeights.bold,
          lineHeight: fontSizes['3xl'] * lineHeights.tight,
        };
      case 'subtitle':
        return {
          ...baseStyle,
          fontSize: fontSizes.xl,
          fontWeight: fontWeights.semibold,
          lineHeight: fontSizes.xl * lineHeights.normal,
        };
      case 'body':
        return {
          ...baseStyle,
          fontSize: fontSizes.md,
          fontWeight: fontWeights.normal,
          lineHeight: fontSizes.md * lineHeights.normal,
        };
      case 'caption':
        return {
          ...baseStyle,
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.normal,
          lineHeight: fontSizes.sm * lineHeights.normal,
        };
      default:
        return baseStyle;
    }
  };

  // Always use theme colors, force white in dark mode
  const getTextColor = (): string => {
    if (isDark) {
      // In dark mode, all text should be white (or muted white)
      switch (color) {
        case 'muted':
          return currentTheme.colors.textMuted; // rgba(255,255,255,0.65)
        case 'danger':
          return currentTheme.colors.danger; // Keep danger red
        default:
          return currentTheme.colors.text; // #FFFFFF
      }
    }

    // Light mode uses theme colors
    switch (color) {
      case 'default':
        return currentTheme.colors.text;
      case 'muted':
        return currentTheme.colors.textMuted;
      case 'danger':
        return currentTheme.colors.danger;
      default:
        return currentTheme.colors.text;
    }
  };

  return (
    <RNText
      style={[getTextStyle(), { color: getTextColor() }, style]}
      numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
};
