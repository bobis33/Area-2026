import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
  border?: boolean;
  style?: ViewStyle;
}

