import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/ThemeContext';

export interface MobileScreenProps {
  children: React.ReactNode;
  scroll?: boolean; // default true
  keyboardAware?: boolean; // default false for tab screens
  safeArea?: boolean; // default true
  contentStyle?: any;
}

export const MobileScreen: React.FC<MobileScreenProps> = ({
  children,
  scroll = true,
  keyboardAware = false,
  safeArea = true,
  contentStyle,
}) => {
  const { currentTheme } = useAppTheme();

  // Calculate bottom padding to account for tab bar
  // Tab bar height: iOS ~88px, Android ~64px
  // Add extra padding for comfortable spacing
  const tabBarHeight = Platform.OS === 'ios' ? 88 : 64;
  const bottomPadding = tabBarHeight + currentTheme.spacing.xl;

  const scrollContentStyle = [
    styles.scrollContent,
    {
      paddingHorizontal: currentTheme.spacing.lg,
      paddingTop: currentTheme.spacing.lg,
      paddingBottom: bottomPadding,
      backgroundColor: currentTheme.colors.background,
    },
    contentStyle,
  ];

  const nonScrollContentStyle = [
    styles.nonScrollContent,
    {
      paddingHorizontal: currentTheme.spacing.lg,
      paddingTop: currentTheme.spacing.lg,
      paddingBottom: currentTheme.spacing.lg,
      backgroundColor: currentTheme.colors.background,
    },
    contentStyle,
  ];

  const containerStyle = {
    flex: 1,
    backgroundColor: currentTheme.colors.background,
  };

  const renderContent = () => {
    if (scroll) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={scrollContentStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      );
    }

    return <View style={nonScrollContentStyle}>{children}</View>;
  };

  const content = safeArea ? (
    <SafeAreaView style={containerStyle} edges={['top']}>
      {renderContent()}
    </SafeAreaView>
  ) : (
    <View style={containerStyle}>{renderContent()}</View>
  );

  if (!keyboardAware) {
    return content;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
        style={containerStyle}>
        {content}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  nonScrollContent: {
    flex: 1,
  },
});
