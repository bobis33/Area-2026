import React from 'react';
import { Text, type TextProps } from '@area/ui';

/**
 * WebText - Web wrapper for the shared Text component
 *
 * This wraps the Text from @area/ui and adds web-specific features
 * while maintaining visual consistency with the mobile app.
 */
export interface WebTextProps extends TextProps {
  /**
   * Optional CSS class name (web-specific)
   */
  className?: string;
  /**
   * Optional HTML id attribute (web-specific)
   */
  id?: string;
}

export const WebText: React.FC<WebTextProps> = ({
  className,
  id,
  children,
  ...textProps
}) => {
  // The shared Text component from @area/ui handles all the styling
  return (
    <div className={className} id={id} style={{ display: 'inline' }}>
      <Text {...textProps}>{children}</Text>
    </div>
  );
};
