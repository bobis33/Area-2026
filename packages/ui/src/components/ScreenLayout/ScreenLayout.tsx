import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ScreenLayoutProps } from './ScreenLayout.types';
import { colors, spacing, fontSizes, fontWeights } from '../../tokens';

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  title,
  scroll = false,
  safeArea = true,
  headerRight,
  contentStyle,
}) => {
  const renderHeader = () => {
    if (!title && !headerRight) {
      return null;
    }

    return (
      <View style={styles.header}>
        {title && <Text style={styles.title}>{title}</Text>}
        {headerRight && <View>{headerRight}</View>}
      </View>
    );
  };

  const renderContent = () => {
    if (scroll) {
      return (
        <ScrollView
          style={styles.content}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      );
    }

    return <View style={[styles.content, contentStyle]}>{children}</View>;
  };

  const content = (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </View>
  );

  if (safeArea) {
    return <SafeAreaView style={styles.container}>{content}</SafeAreaView>;
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.gray900,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
});

