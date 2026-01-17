import type { TextStyle, ViewStyle } from 'react-native';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

