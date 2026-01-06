import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '@area/ui';
import { MobileText as Text } from '@/components/ui-mobile';
import { spacing, borderRadius } from '@area/ui';
import type { CardProps } from '@area/ui';
import { useAppTheme } from '@/contexts/ThemeContext';

interface SectionCardProps extends Omit<CardProps, 'children'> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  children,
  ...cardProps
}) => {
  const { currentTheme } = useAppTheme();

  return (
    <Card
      padding="md"
      elevated
      style={[
        styles.card,
        {
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
          borderWidth: 1,
        },
        cardProps.style,
      ] as any}
      {...cardProps}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text variant="subtitle" style={styles.title}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="body" color="muted" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    width: '100%',
  },
  header: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    lineHeight: 20,
  },
});
