import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import type { InputProps } from './Input.types';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../../tokens';

export const Input: React.FC<InputProps> = ({
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
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(errorMessage);
  const showHelperText = Boolean(helperText && !hasError);

  const getInputContainerStyle = () => {
    return [
      styles.inputContainer,
      multiline && styles.inputContainerMultiline,
      hasError && styles.inputContainerError,
      isFocused && !hasError && styles.inputContainerFocused,
      disabled && styles.inputContainerDisabled,
    ];
  };

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

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.iconContainer}>{leftIcon}</View>
        )}

        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray400}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          multiline={multiline}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {rightIcon && (
          <View style={styles.iconContainer}>{rightIcon}</View>
        )}
      </View>

      {showHelperText && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      {hasError && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
    borderColor: colors.gray300,
  },
  inputContainerMultiline: {
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    minHeight: 100,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  inputContainerDisabled: {
    backgroundColor: colors.gray100,
    opacity: 0.6,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    color: colors.gray900,
    padding: 0,
    margin: 0,
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
