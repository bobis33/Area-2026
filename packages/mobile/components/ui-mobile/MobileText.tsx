import React from 'react';
import { TextStyle, StyleSheet } from 'react-native';
import { Text, type TextProps } from '@area/ui';
import { useAppTheme } from '@/contexts/ThemeContext';

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

  // Get theme-based text color
  const getTextColor = (): string => {
    if (isDark) {
      // In dark mode, all text should be white (or muted white)
      switch (color) {
        case 'muted':
          return currentTheme.colors.textMuted;
        case 'danger':
          return currentTheme.colors.danger;
        default:
          return currentTheme.colors.text;
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

  const mergedStyle = StyleSheet.flatten([
    { color: getTextColor() },
    style,
  ]) as TextStyle;

  return (
    <Text
      variant={variant}
      align={align}
      color="default" // Always use default, we override with theme color
      numberOfLines={numberOfLines}
      style={mergedStyle}
    >
      {children}
    </Text>
  );
};
