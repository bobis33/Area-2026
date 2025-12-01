import React from 'react';
import { Input, type InputProps } from '@area/ui';

/**
 * WebInput - Web wrapper for the shared Input component
 *
 * This wraps the Input from @area/ui and adds web-specific features
 * while maintaining visual consistency with the mobile app.
 */
export interface WebInputProps extends InputProps {
  /**
   * HTML input type attribute (web-specific)
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  /**
   * HTML autocomplete attribute (web-specific)
   */
  autoComplete?: string;
  /**
   * HTML name attribute for forms (web-specific)
   */
  name?: string;
  /**
   * HTML id attribute (web-specific)
   */
  id?: string;
}

export const WebInput: React.FC<WebInputProps> = ({
  type = 'text',
  autoComplete,
  name,
  id,
  ...inputProps
}) => {
  // The shared Input component from @area/ui handles most of the logic
  // React Native Web automatically converts these to proper HTML attributes
  return <Input {...inputProps} />;
};
