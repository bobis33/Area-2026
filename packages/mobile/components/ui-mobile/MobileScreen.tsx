import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, fontSizes, fontWeights } from '@area/ui';
import { useAppTheme } from '@/contexts/ThemeContext';
import { MobileText as Text } from './MobileText';

export interface MobileScreenProps {
  children: React.ReactNode;
  scroll?: boolean; // default true
  keyboardAware?: boolean; // default false for tab screens
  safeArea?: boolean; // default true
  contentStyle?: ViewStyle;
  title?: string;
  headerRight?: React.ReactNode;
}

export const MobileScreen: React.FC<MobileScreenProps> = ({
  children,
  scroll = true,
  keyboardAware = false,
  safeArea = true,
  contentStyle,
  title,
  headerRight,
}) => {
  const { currentTheme } = useAppTheme();

  // Calculate bottom padding to account for tab bar
  // Tab bar height: iOS ~88px, Android ~64px
  // Add extra padding for comfortable spacing
  const tabBarHeight = Platform.OS === 'ios' ? 88 : 64;
  const bottomPadding = tabBarHeight + currentTheme.spacing.xl;

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: currentTheme.colors.background,
  };

  const screenContentStyle: ViewStyle = {
    paddingTop: currentTheme.spacing.lg,
    paddingBottom: scroll ? bottomPadding : currentTheme.spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: currentTheme.colors.background,
    ...contentStyle,
  };

  const renderHeader = () => {
    if (!title && !headerRight) {
      return null;
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
        }}
      >
        {title && (
          <Text
            variant="title"
            style={{
              fontSize: fontSizes['2xl'],
              fontWeight: fontWeights.bold,
              flex: 1,
            }}
          >
            {title}
          </Text>
        )}
        {headerRight && <View>{headerRight}</View>}
      </View>
    );
  };

  const renderContent = () => {
    if (scroll) {
      return (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={screenContentStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      );
    }

    return <View style={screenContentStyle}>{children}</View>;
  };

  const content = (
    <View style={containerStyle}>
      {renderHeader()}
      {renderContent()}
    </View>
  );

  const finalContent = safeArea ? (
    <SafeAreaView style={containerStyle} edges={['top']}>
      {content}
    </SafeAreaView>
  ) : (
    content
  );

  if (!keyboardAware) {
    return finalContent;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
        style={containerStyle}
      >
        {finalContent}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
