import React, { useState } from 'react';
import { TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColor } from '@/hooks/use-theme-color';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedInputProps extends TextInputProps {
  error?: boolean;
}

export function AnimatedInput({ error = false, style, ...props }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(1);
  
  const backgroundColor = useThemeColor({}, 'input');
  const backgroundColorFocus = useThemeColor({}, 'inputFocus');
  const borderColor = useThemeColor({}, 'border');
  const borderColorFocus = useThemeColor({}, 'primary');
  const borderColorError = useThemeColor({ light: '#ef4444', dark: '#f87171' }, 'error');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#94a3b8', dark: '#64748b' }, 'textSecondary');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      borderWidth: borderWidth.value,
      backgroundColor: isFocused
        ? withTiming(backgroundColorFocus, { duration: 200 })
        : withTiming(backgroundColor, { duration: 200 }),
      borderColor: error
        ? withTiming(borderColorError, { duration: 200 })
        : isFocused
        ? withTiming(borderColorFocus, { duration: 200 })
        : withTiming(borderColor, { duration: 200 }),
    };
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    scale.value = withSpring(1.01, { damping: 15, stiffness: 400 });
    borderWidth.value = withTiming(2.5, { duration: 250 });
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    borderWidth.value = withTiming(1, { duration: 250 });
    props.onBlur?.(e);
  };

  return (
    <AnimatedTextInput
      {...props}
      style={[
        styles.input,
        { color: textColor },
        animatedStyle,
        style,
      ]}
      placeholderTextColor={placeholderColor}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 14,
    padding: 18,
    fontSize: 16,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});

