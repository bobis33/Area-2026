import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface ScreenLayoutProps {
  children: ReactNode;
  title?: string;
  scroll?: boolean;
  safeArea?: boolean;
  headerRight?: ReactNode;
  contentStyle?: ViewStyle;
}

