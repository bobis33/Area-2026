import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { ScreenLayout, type ScreenLayoutProps } from '@area/ui';

export interface MobileScreenProps extends ScreenLayoutProps {
  keyboardAware?: boolean;
}

export const MobileScreen: React.FC<MobileScreenProps> = ({
  keyboardAware = true,
  children,
  ...screenLayoutProps
}) => {
  if (!keyboardAware) {
    return <ScreenLayout {...screenLayoutProps}>{children}</ScreenLayout>;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
        style={{ flex: 1 }}>
        <ScreenLayout {...screenLayoutProps}>{children}</ScreenLayout>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

