import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import type { InputProps } from '@area/ui';
import type { TextInputProps } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius, fontSizes, fontWeights } from '@area/ui';
import { MobileText as Text } from './MobileText';

export interface MobileInputProps extends Omit<InputProps, 'containerStyle' | 'inputStyle'> {
  autoCapitalize?: TextInputProps['autoCapitalize'];
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  helperText,
  errorMessage,
  disabled = false,
  multiline = false,
  leftIcon,
  rightIcon,
  keyboardType,
  containerStyle,
  inputStyle,
  autoCapitalize = 'none',
}) => {
  const { currentTheme } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(errorMessage);
  const showHelperText = Boolean(helperText && !hasError);

  const handleFocus = () => {
    if (!disabled) {
      setIsFocused(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChangeText = (text: string) => {
    if (!disabled) {
      onChangeText(text);
    }
  };

  // Theme-based styles
  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    borderWidth: isFocused && !hasError ? 2 : 1,
    borderRadius: borderRadius.md,
    backgroundColor: currentTheme.colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: multiline ? spacing.md : spacing.sm,
    minHeight: multiline ? 100 : 44,
    borderColor: hasError
      ? currentTheme.colors.danger
      : isFocused && !hasError
      ? currentTheme.colors.primary
      : (currentTheme.colors as any).borderSubtle || currentTheme.colors.border,
    opacity: disabled ? 0.6 : 1,
    ...containerStyle,
  };

  const textInputStyle: TextStyle = {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    color: currentTheme.colors.text, // Force white text in dark mode
    padding: 0,
    margin: 0,
    textAlignVertical: multiline ? 'top' : 'center',
    ...inputStyle,
  };

  const placeholderColor = currentTheme.colors.textMuted;

  return (
    <View style={styles.container}>
      {label && (
        <Text
          variant="body"
          style={{
            fontSize: fontSizes.sm,
            fontWeight: fontWeights.medium,
            color: currentTheme.colors.text,
            marginBottom: spacing.xs,
          }}
        >
          {label}
        </Text>
      )}

      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={styles.iconContainer}>{leftIcon}</View>
        )}

        <TextInput
          style={textInputStyle}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {rightIcon && (
          <View style={styles.iconContainer}>{rightIcon}</View>
        )}
      </View>

      {showHelperText && (
        <Text
          variant="caption"
          color="muted"
          style={{ marginTop: spacing.xs }}
        >
          {helperText}
        </Text>
      )}

      {hasError && (
        <Text
          variant="caption"
          style={{
            color: currentTheme.colors.danger,
            marginTop: spacing.xs,
          }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
});
