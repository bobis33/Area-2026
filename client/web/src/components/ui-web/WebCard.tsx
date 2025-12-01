import React from 'react';
import { Card, type CardProps } from '@area/ui';

/**
 * WebCard - Web wrapper for the shared Card component
 *
 * This wraps the Card from @area/ui and adds web-specific features
 * while maintaining visual consistency with the mobile app.
 */
export interface WebCardProps extends CardProps {
  /**
   * Optional CSS class name (web-specific)
   */
  className?: string;
  /**
   * Optional HTML id attribute (web-specific)
   */
  id?: string;
}

export const WebCard: React.FC<WebCardProps> = ({
  className,
  id,
  children,
  ...cardProps
}) => {
  return (
    <div className={className} id={id} style={{ display: 'block' }}>
      <Card {...cardProps}>{children}</Card>
    </div>
  );
};
