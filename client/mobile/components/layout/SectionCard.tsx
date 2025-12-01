import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from '@area/ui';
import { spacing, borderRadius } from '@area/ui';
import type { CardProps } from '@area/ui';

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
  return (
    <Card
      padding="md"
      elevated
      style={[styles.card, cardProps.style] as any}
      {...cardProps}>
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

