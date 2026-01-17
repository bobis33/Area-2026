import type { ReactNode } from 'react';
import type { TextStyle } from 'react-native';

export interface TextProps {
  children: ReactNode;
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  align?: 'left' | 'center' | 'right';
  color?: 'default' | 'muted' | 'danger';
  numberOfLines?: number;
  style?: TextStyle;
}

