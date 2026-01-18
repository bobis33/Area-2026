declare module 'react-native-web' {
  import * as React from 'react';
  import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

  export interface ViewProps {
    children?: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    testID?: string;
    accessibilityLabel?: string;
    accessibilityRole?: string;
    accessibilityState?: {
      disabled?: boolean;
      selected?: boolean;
      checked?: boolean | 'mixed';
      busy?: boolean;
      expanded?: boolean;
    };
    onLayout?: (event: { nativeEvent: { layout: { x: number; y: number; width: number; height: number } } }) => void;
    onStartShouldSetResponder?: () => boolean;
    onMoveShouldSetResponder?: () => boolean;
    onResponderGrant?: () => void;
    onResponderMove?: () => void;
    onResponderRelease?: () => void;
    onResponderTerminate?: () => void;
    [key: string]: any;
  }

  export const View: React.FC<ViewProps>;
  export const Text: React.FC<{
    children?: React.ReactNode;
    style?: TextStyle | TextStyle[];
    numberOfLines?: number;
    onPress?: () => void;
    testID?: string;
    [key: string]: any;
  }>;
  export const Image: React.FC<{
    source: { uri: string } | number;
    style?: ImageStyle | ImageStyle[];
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'center' | 'repeat';
    testID?: string;
    [key: string]: any;
  }>;
  export const ScrollView: React.FC<{
    children?: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    contentContainerStyle?: ViewStyle | ViewStyle[];
    onScroll?: (event: { nativeEvent: { contentOffset: { x: number; y: number } } }) => void;
    scrollEnabled?: boolean;
    showsVerticalScrollIndicator?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    testID?: string;
    [key: string]: any;
  }>;
  export const TouchableOpacity: React.FC<{
    children?: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    onPress?: () => void;
    disabled?: boolean;
    activeOpacity?: number;
    testID?: string;
    [key: string]: any;
  }>;
  export const Pressable: React.FC<{
    children?: React.ReactNode | ((state: { pressed: boolean }) => React.ReactNode);
    style?: ViewStyle | ViewStyle[] | ((state: { pressed: boolean }) => ViewStyle | ViewStyle[]);
    onPress?: () => void;
    disabled?: boolean;
    testID?: string;
    [key: string]: any;
  }>;
  export const TextInput: React.FC<{
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    style?: TextStyle | TextStyle[];
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    multiline?: boolean;
    editable?: boolean;
    testID?: string;
    [key: string]: any;
  }>;
  export const ActivityIndicator: React.FC<{
    size?: 'small' | 'large' | number;
    color?: string;
    style?: ViewStyle | ViewStyle[];
    testID?: string;
    [key: string]: any;
  }>;
  export const StyleSheet: {
    create: <T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(styles: T) => T;
    flatten: (style: ViewStyle | TextStyle | ImageStyle | Array<ViewStyle | TextStyle | ImageStyle | undefined | null>) => ViewStyle | TextStyle | ImageStyle;
  };
  export const Platform: {
    OS: 'web' | 'ios' | 'android';
    select: <T>(spec: { web?: T; ios?: T; android?: T; default?: T }) => T | undefined;
  };
}
