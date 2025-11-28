import type { ReactNode } from 'react';
import type { TextInputProps as RNTextInputProps, TextStyle, ViewStyle } from 'react-native';

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  multiline?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  keyboardType?: RNTextInputProps['keyboardType'];
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

