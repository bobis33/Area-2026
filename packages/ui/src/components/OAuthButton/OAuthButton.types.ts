import type { ReactNode } from 'react';
import type { ViewStyle, TextStyle } from 'react-native';

export interface OAuthButtonProps {
  label: string;
  onPress: () => void;
  backgroundColor: string;
  textColor?: string;
  borderColor?: string;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}


