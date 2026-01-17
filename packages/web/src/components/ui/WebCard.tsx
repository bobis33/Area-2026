import React from 'react';
import { Card, type CardProps } from '@area/ui';
import { useWebTheme } from '@/context/ThemeContext';
import { lightColors, darkColors } from '@area/ui';
import type { ViewStyle } from 'react-native';

export interface WebCardProps extends CardProps {
  hoverable?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function WebCard({
  children,
  className = '',
  padding = 'md',
  hoverable = false,
  onClick,
  header,
  footer,
  ...cardProps
}: WebCardProps) {
  const { mode } = useWebTheme();
  const colors = mode === 'light' ? lightColors : darkColors;

  const getCardStyle = (): ViewStyle => {
    return {
      backgroundColor: colors.surface,
      borderColor: (colors as any).borderSubtle || colors.border,
      borderWidth: 1,
    };
  };

  return (
    <Card
      padding={padding}
      elevated={hoverable}
      border={true}
      onPress={onClick}
      style={getCardStyle()}
      {...cardProps}
    >
      {header && <div style={{ marginBottom: 'var(--spacing-md)' }}>{header}</div>}
      <div>{children}</div>
      {footer && <div style={{ marginTop: 'var(--spacing-md)' }}>{footer}</div>}
    </Card>
  );
}
