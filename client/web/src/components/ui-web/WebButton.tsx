import React from 'react';
import { Button, type ButtonProps } from '@area/ui';

/**
 * WebButton - Web wrapper for the shared Button component
 *
 * This wraps the Button from @area/ui and adds web-specific features
 * while maintaining visual consistency with the mobile app.
 */
export interface WebButtonProps extends ButtonProps {
  /**
   * Optional tooltip text to show on hover (web-specific)
   */
  tooltip?: string;
}

export const WebButton: React.FC<WebButtonProps> = ({
  tooltip,
  ...buttonProps
}) => {
  return (
    <div
      title={tooltip}
      style={{
        display: 'inline-block',
        width: buttonProps.fullWidth ? '100%' : 'auto',
      }}
    >
      <Button {...buttonProps} />
    </div>
  );
};
