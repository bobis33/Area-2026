import React from 'react';
import { StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { ThemedView } from '../themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  delay?: number;
  onPress?: () => void;
}

export function AnimatedCard({ children, style, delay = 0, onPress }: AnimatedCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const backgroundColor = useThemeColor({}, 'card');
  const shadowColor = useThemeColor({ light: 'rgba(0,0,0,0.1)', dark: 'rgba(0,0,0,0.3)' }, 'cardShadow');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.96, { damping: 12, stiffness: 400 });
      opacity.value = withTiming(0.85, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 12, stiffness: 400 });
      opacity.value = withTiming(1, { duration: 150 });
    }
  };

  const content = (
    <ThemedView
      style={[
        styles.card,
        { backgroundColor, shadowColor },
        style,
      ]}>
      {children}
    </ThemedView>
  );

  if (onPress) {
    return (
      <Animated.View
        entering={FadeInDown.delay(delay).springify()}
        style={[animatedStyle]}>
        <AnimatedPressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}>
          {content}
        </AnimatedPressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={[animatedStyle]}>
      {content}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
});

