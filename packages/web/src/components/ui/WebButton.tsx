import React from 'react';
import { Button } from '@area/ui';
import { useWebTheme } from '@/context/ThemeContext';
import { lightColors, darkColors } from '@area/ui';
import { StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface WebButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onPress?: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export function WebButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  onClick,
  onPress,
  fullWidth,
  style,
  labelStyle,
}: WebButtonProps) {
  const { mode } = useWebTheme();
  const colors = mode === 'light' ? lightColors : darkColors;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (onClick) {
      onClick({} as React.MouseEvent<HTMLButtonElement>);
    }
  };

  const buttonVariant: 'primary' | 'secondary' | 'ghost' =
    variant === 'danger' ? 'primary' : variant;
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {};

    if (variant === 'danger') {
      baseStyle.backgroundColor = colors.danger;
    } else if (variant === 'secondary') {
      baseStyle.backgroundColor = colors.surfaceMuted;
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = (colors as any).borderSubtle || colors.border;
    } else if (variant === 'ghost') {
      baseStyle.backgroundColor = 'transparent';
    }

    if (size === 'sm') {
      baseStyle.paddingVertical = 8;
      baseStyle.paddingHorizontal = 12;
      baseStyle.minHeight = 36;
    } else if (size === 'lg') {
      baseStyle.paddingVertical = 16;
      baseStyle.paddingHorizontal = 24;
      baseStyle.minHeight = 52;
    } else {
      baseStyle.paddingVertical = 12;
      baseStyle.paddingHorizontal = 20;
      baseStyle.minHeight = 44;
    }

    return baseStyle;
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return colors.primaryOn || colors.white;
      case 'danger':
        return colors.dangerOn || colors.white;
      case 'secondary':
      case 'ghost':
        return colors.text;
      default:
        return colors.text;
    }
  };

  // Check if children is a ReactNode (not a primitive string/number)
  const isReactNode = React.isValidElement(children) || (typeof children !== 'string' && typeof children !== 'number' && children != null);
  
  // If children is a ReactNode and no leftIcon/rightIcon, use it as center content
  // Otherwise, convert to string for label
  const hasOnlyIcon = isReactNode && !leftIcon && !rightIcon;
  const label = loading ? '' : (hasOnlyIcon ? ' ' : String(children || ''));
  const centerIcon = hasOnlyIcon ? children : null;

  return (
    <div 
      className={className}
      style={{ position: 'relative', display: fullWidth ? 'block' : 'inline-block', width: fullWidth ? '100%' : 'auto' }}
    >
      <Button
        label={label}
        onPress={handlePress}
        variant={buttonVariant}
        disabled={disabled || loading}
        fullWidth={fullWidth}
        style={StyleSheet.flatten([getButtonStyle(), style]) as ViewStyle}
        labelStyle={StyleSheet.flatten([
          {
            color: hasOnlyIcon ? 'transparent' : getTextColor(),
          },
          labelStyle,
        ]) as TextStyle}
      />
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              border: `2px solid ${getTextColor()}`,
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
            }}
          />
        </div>
      )}
      {!loading && (leftIcon || rightIcon || centerIcon) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: centerIcon ? 'center' : 'space-between',
            pointerEvents: 'none',
            padding: '0 var(--spacing-md)',
          }}
        >
          {leftIcon && <span>{leftIcon}</span>}
          {centerIcon && <span>{centerIcon}</span>}
          {rightIcon && <span style={{ marginLeft: 'auto' }}>{rightIcon}</span>}
        </div>
      )}
    </div>
  );
}
