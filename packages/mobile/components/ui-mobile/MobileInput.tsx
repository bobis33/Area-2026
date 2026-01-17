import React from 'react';
import { ViewStyle, TextStyle, StyleSheet } from 'react-native';
import type { InputProps } from '@area/ui';
import type { TextInputProps } from 'react-native';
import { Input } from '@area/ui';
import { useAppTheme } from '@/contexts/ThemeContext';

export interface MobileInputProps extends Omit<
  InputProps,
  'containerStyle' | 'inputContainerStyle' | 'inputStyle'
> {
  autoCapitalize?: TextInputProps['autoCapitalize'];
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  helperText,
  errorMessage,
  disabled = false,
  multiline = false,
  leftIcon,
  rightIcon,
  keyboardType,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  autoCapitalize = 'none',
  ...inputProps
}) => {
  const { currentTheme } = useAppTheme();

  const getInputContainerStyle = (): ViewStyle => {
    return {
      backgroundColor: currentTheme.colors.surfaceMuted,
      borderColor: errorMessage
        ? currentTheme.colors.danger
        : (currentTheme.colors as any).borderSubtle ||
          currentTheme.colors.border,
      ...inputContainerStyle,
    };
  };

  const getInputStyle = (): TextStyle => {
    return {
      color: currentTheme.colors.text,
      ...inputStyle,
    };
  };

  const mergedInputContainerStyle = StyleSheet.flatten([
    getInputContainerStyle(),
    inputContainerStyle,
  ]) as ViewStyle;

  const mergedInputStyle = StyleSheet.flatten([
    getInputStyle(),
    inputStyle,
  ]) as TextStyle;

  // Note: autoCapitalize is not supported by Input from @area/ui
  // We'll need to extend Input or handle it differently
  // For now, we'll pass it through if Input supports it via inputStyle

  return (
    <Input
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      helperText={helperText}
      errorMessage={errorMessage}
      disabled={disabled}
      multiline={multiline}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      keyboardType={keyboardType}
      containerStyle={containerStyle}
      inputContainerStyle={mergedInputContainerStyle}
      inputStyle={mergedInputStyle}
      {...inputProps}
    />
  );
};
