import React from 'react';
import { Input } from '@area/ui';
import { useWebTheme } from '@/context/ThemeContext';
import { lightColors, darkColors } from '@area/ui';
import { StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';

export interface WebInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  multiline?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
}

export function WebInput({
  label,
  value,
  onChange,
  onChangeText,
  placeholder,
  type,
  secureTextEntry = false,
  helperText,
  error,
  disabled = false,
  multiline = false,
  leftIcon,
  rightIcon,
  keyboardType,
  fullWidth: _fullWidth = false,
  className: _className = '',
  id: _id,
  name: _name,
  required: _required,
}: WebInputProps) {
  const { mode } = useWebTheme();
  const colors = mode === 'light' ? lightColors : darkColors;

  const handleChangeText = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    } else if (onChange) {
      const syntheticEvent = {
        target: { value: text },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const isSecure = secureTextEntry || type === 'password';
  const mappedKeyboardType =
    keyboardType ||
    (type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : undefined);

  const getInputContainerStyle = (): ViewStyle => {
    return {
      backgroundColor: colors.surfaceMuted,
      borderColor: error
        ? colors.danger
        : (colors as any).borderSubtle || colors.border,
    };
  };

  const getInputStyle = (): TextStyle => {
    return {
      color: colors.text,
    };
  };

  const mergedInputContainerStyle = StyleSheet.flatten([
    getInputContainerStyle(),
  ]) as ViewStyle;

  const mergedInputStyle = StyleSheet.flatten([
    getInputStyle(),
  ]) as TextStyle;

  return (
    <Input
      label={label}
      value={value || ''}
      onChangeText={handleChangeText}
      placeholder={placeholder}
      secureTextEntry={isSecure}
      helperText={helperText}
      errorMessage={error}
      disabled={disabled}
      multiline={multiline}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      keyboardType={mappedKeyboardType}
      inputContainerStyle={mergedInputContainerStyle}
      inputStyle={mergedInputStyle}
    />
  );
}
