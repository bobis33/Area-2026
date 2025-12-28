import React from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { StyleSheet, ViewStyle } from 'react-native';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 0.15,
  delay = 0,
  ...props
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      }),
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.glassCard,
        {
          backgroundColor: `rgba(255, 255, 255, ${intensity})`,
          borderColor: `rgba(255, 255, 255, ${intensity * 2})`,
        },
        animatedStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  glassCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
