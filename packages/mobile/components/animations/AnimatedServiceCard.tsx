import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedServiceCardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  delay?: number;
  haptic?: boolean;
  glowColor?: string;
}

export const AnimatedServiceCard: React.FC<AnimatedServiceCardProps> = ({
  children,
  style,
  delay = 0,
  haptic = true,
  glowColor,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const glow = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 18,
        stiffness: 180,
        mass: 0.7,
      }),
    );
    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 18,
        stiffness: 180,
        mass: 0.7,
      }),
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(glow.value, [0, 1], [0.1, 0.3]);
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
      shadowOpacity: shadowOpacity,
      shadowRadius: interpolate(glow.value, [0, 1], [8, 16]),
      shadowOffset: {
        width: 0,
        height: interpolate(glow.value, [0, 1], [2, 8]),
      },
    };
  });

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 400,
    });
    glow.value = withTiming(1, { duration: 150 });
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
    glow.value = withTiming(0, { duration: 200 });
    onPressOut?.(e);
  };

  return (
    <AnimatedTouchable
      {...props}
      style={[
        animatedStyle,
        glowColor && {
          shadowColor: glowColor,
        },
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {children}
    </AnimatedTouchable>
  );
};
