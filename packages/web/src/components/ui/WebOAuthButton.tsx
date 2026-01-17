import React from 'react';
import { OAuthButton } from '@area/ui';
import { StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';

export interface WebOAuthButtonProps {
  label: string;
  onClick?: () => void;
  onPress?: () => void;
  backgroundColor: string;
  textColor?: string;
  borderColor?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export function WebOAuthButton({
  label,
  onClick,
  onPress,
  backgroundColor,
  textColor = '#ffffff',
  borderColor,
  icon,
  disabled = false,
  loading = false,
  className = '',
  style,
  labelStyle,
}: WebOAuthButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className={className}>
      <OAuthButton
        label={label}
        onPress={handlePress}
        backgroundColor={backgroundColor}
        textColor={textColor}
        borderColor={borderColor}
        icon={icon}
        disabled={disabled || loading}
        loading={loading}
        style={StyleSheet.flatten([style]) as ViewStyle}
        labelStyle={StyleSheet.flatten([labelStyle]) as TextStyle}
      />
    </div>
  );
}
