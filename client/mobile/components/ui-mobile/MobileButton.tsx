import React from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Button, type ButtonProps } from '@area/ui';

export interface MobileButtonProps extends ButtonProps {
  haptics?: boolean;
  animateIn?: boolean;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  haptics = true,
  animateIn = false,
  onPress,
  ...buttonProps
}) => {
  const handlePress = () => {
    if (haptics && Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onPress();
  };

  const button = (
    <Button
      {...buttonProps}
      onPress={handlePress}
    />
  );

  if (animateIn) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        {button}
      </Animated.View>
    );
  }

  return button;
};

