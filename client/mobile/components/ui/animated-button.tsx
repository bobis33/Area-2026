import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ThemedText } from '../themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
}

export function AnimatedButton({
  onPress,
  children,
  loading = false,
  disabled = false,
  style,
  variant = 'primary',
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const backgroundColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({ light: '#fff', dark: '#fff' }, 'text');
  const borderColor = useThemeColor({}, 'border');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 12, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 400 });
  };

  React.useEffect(() => {
    opacity.value = disabled || loading ? withTiming(0.6) : withTiming(1);
  }, [disabled, loading]);

  const getButtonStyle = () => {
    const baseStyle = [styles.button, style];
    
    if (variant === 'primary') {
      return [...baseStyle, { backgroundColor }];
    }
    
    if (variant === 'outline') {
      return [...baseStyle, { backgroundColor: 'transparent', borderWidth: 2, borderColor }];
    }
    
    return baseStyle;
  };

  const outlineTextColor = useThemeColor({}, 'text');
  const getTextColor = () => {
    if (variant === 'outline') {
      return outlineTextColor;
    }
    return textColor;
  };

  return (
    <AnimatedTouchable
      style={[getButtonStyle(), animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <ThemedText style={[styles.buttonText, { color: getTextColor() }]}>
          {children}
        </ThemedText>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

