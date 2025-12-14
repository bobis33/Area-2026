import React from 'react';
import { View, ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

interface FadeInViewProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  fromY?: number;
  spring?: boolean;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  style,
  delay = 0,
  duration = 400,
  fromY = 20,
  spring = false,
  ...props
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(fromY);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration }));

    if (spring) {
      translateY.value = withDelay(
        delay,
        withSpring(0, {
          damping: 15,
          stiffness: 150,
          mass: 0.8,
        }),
      );
    } else {
      translateY.value = withDelay(delay, withTiming(0, { duration }));
    }
  }, [delay, duration, spring, fromY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
};
