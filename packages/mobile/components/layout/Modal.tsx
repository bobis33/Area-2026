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
  const { currentTheme } = useAppTheme();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0.9, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

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
            { backgroundColor: 'rgba(0,0,0,0.6)' },
          ]}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <AnimatedCard
              padding="lg"
              elevated
              style={[
                styles.modalContent,
                animatedCardStyle,
                {
                  backgroundColor: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
                  borderWidth: 1,
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
                  nestedScrollEnabled={true}>
                  {children}
                </ScrollView>
              </View>
            </AnimatedCard>
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
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: borderRadius.xl,
    maxHeight: '80%',
    flexShrink: 1,
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
    flex: 1,
    flexGrow: 1,
    minHeight: 100,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
});
