import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import type { TextProps } from './Text.types';
import { colors, fontSizes, fontWeights, lineHeights } from '../../tokens';

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  align = 'left',
  color = 'default',
  numberOfLines,
  style,
}) => {
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

  const getColor = (): string => {
    switch (color) {
      case 'default':
        return colors.gray900;
      case 'muted':
        return colors.gray500;
      case 'danger':
        return colors.error;
      default:
        return colors.gray900;
    }
  };

  return (
    <RNText
      style={[getTextStyle(), { color: getColor() }, style]}
      numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
};

