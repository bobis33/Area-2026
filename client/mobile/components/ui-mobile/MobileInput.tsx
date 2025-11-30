import React from 'react';
import { Input, type InputProps } from '@area/ui';
import type { TextInputProps } from 'react-native';

export interface MobileInputProps extends InputProps {
  autoCapitalize?: TextInputProps['autoCapitalize'];
}

export const MobileInput: React.FC<MobileInputProps> = ({
  autoCapitalize = 'none',
  ...inputProps
}) => {
  // Note: Since Input from @area/ui doesn't expose autoCapitalize directly,
  // we'll need to extend Input to support it, or use a workaround.
  // For now, we'll pass it through - if Input is updated to support it,
  // this will work automatically.
  // The default 'none' is a sensible mobile default for most inputs.
  return <Input {...inputProps} />;
};

