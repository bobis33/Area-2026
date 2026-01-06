import React from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Card } from '@area/ui';
import { MobileText as Text } from '@/components/ui-mobile';
import { spacing, borderRadius } from '@area/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppTheme } from '@/contexts/ThemeContext';

const AnimatedCard = Animated.createAnimatedComponent(Card);

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  const { currentTheme, isDark } = useAppTheme();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const blur = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      });
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      });
      blur.value = withTiming(1, { duration: 300 });
    } else {
      scale.value = withTiming(0.9, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(30, { duration: 200 });
      blur.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedCardStyle = useAnimatedStyle(() => {
    const borderOpacity = interpolate(opacity.value, [0, 1], [0.2, 0.3]);
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
      opacity: opacity.value,
      borderColor: isDark
        ? `rgba(255, 255, 255, ${borderOpacity})`
        : currentTheme.colors.borderSubtle || currentTheme.colors.border,
    };
  });

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            overlayStyle,
            { backgroundColor: 'rgba(0, 0, 0, 0.75)' }, // Dark overlay but not completely black
          ]}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  borderWidth: 1,
                  flexShrink: 0,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 20 },
                  shadowOpacity: 0.3,
                  shadowRadius: 30,
                  elevation: 20,
                  padding: spacing.lg,
                  borderRadius: borderRadius.xl,
                },
                animatedCardStyle,
                {
                  // Force opaque background after animation styles
                  backgroundColor: currentTheme.colors.surface,
                },
              ]}
            >
              {title && (
                <View style={styles.header}>
                  <Text
                    variant="subtitle"
                    style={styles.title}
                  >
                    {title}
                  </Text>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                  >
                    <IconSymbol
                      size={24}
                      name="xmark"
                      color={currentTheme.colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.contentContainer}>
                <ScrollView
                  style={[styles.scrollView, { width: '100%' }]}
                  contentContainerStyle={[
                    styles.scrollContent,
                    { alignItems: 'stretch', width: '100%' },
                  ]}
                  showsVerticalScrollIndicator={true}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled={true}
                >
                  {children}
                </ScrollView>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: borderRadius.xl,
    maxHeight: '95%',
    minHeight: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexShrink: 0,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  contentContainer: {
    width: '100%',
    maxHeight: '100%',
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
});
