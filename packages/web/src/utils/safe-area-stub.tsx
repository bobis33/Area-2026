// Stub for react-native-safe-area-context on web
import React from 'react';
import { View } from 'react-native-web';
import type { ViewProps } from 'react-native-web';

export const SafeAreaView: React.FC<ViewProps & { edges?: string[] }> = ({ 
  children, 
  style, 
  edges,
  ...props 
}) => {
  return <View style={style} {...props}>{children}</View>;
};

export const SafeAreaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });
export const useSafeAreaFrame = () => ({ x: 0, y: 0, width: 0, height: 0 });
