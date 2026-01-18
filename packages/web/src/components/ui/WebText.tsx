import { Text, type TextProps } from '@area/ui';
import { useWebTheme } from '@/context/ThemeContext';
import { lightColors, darkColors } from '@area/ui';
import { StyleSheet } from 'react-native';
import type { TextStyle } from 'react-native';

export interface WebTextProps extends TextProps {
  className?: string;
}

export function WebText({
  children,
  variant = 'body',
  align = 'left',
  color = 'default',
  numberOfLines,
  className = '',
  style,
  ...textProps
}: WebTextProps) {
  const { mode } = useWebTheme();
  const colors = mode === 'light' ? lightColors : darkColors;

  const getTextColor = (): string => {
    switch (color) {
      case 'default':
        return colors.text;
      case 'muted':
        return colors.textMuted;
      case 'danger':
        return colors.danger;
      default:
        return colors.text;
    }
  };

  return (
    <Text
      variant={variant}
      align={align}
      color="default"
      numberOfLines={numberOfLines}
      style={StyleSheet.flatten([
        {
          color: getTextColor(),
        },
        style,
      ]) as TextStyle}
      {...textProps}
    >
      {children}
    </Text>
  );
}
