import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { MobileText as Text } from '@/components/ui-mobile';
import { MobileScreen, MobileButton } from '@/components/ui-mobile';
import { SectionCard } from '@/components/layout/SectionCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FadeInView } from '@/components/animations';
import { useAppTheme } from '@/contexts/ThemeContext';

// Component for animated glow border
const GlowCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const phase = progress.value * 3; // 0 to 3
    
    let r = 58; // Blue default
    let g = 86;
    let b = 210;
    
    if (phase < 1) {
      const t = phase;
      r = Math.round(58 + (255 - 58) * t);
      g = Math.round(86 + (255 - 86) * t);
      b = Math.round(210 + (255 - 210) * t);
    } else if (phase < 2) {
      const t = phase - 1;
      r = Math.round(255 - (255 - 224) * t);
      g = Math.round(255 - (255 - 52) * t);
      b = Math.round(255 - (255 - 52) * t);
    } else {
      const t = phase - 2;
      r = Math.round(224 - (224 - 58) * t);
      g = Math.round(52 - (52 - 86) * t);
      b = Math.round(52 - (52 - 210) * t);
    }

    return {
      shadowColor: `rgba(${r}, ${g}, ${b}, 0.4)`,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 6,
      borderWidth: 1.5,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.4)`,
    };
  });

  return (
    <Animated.View style={[styles.glowCardContainer, animatedStyle]}>
      <View style={styles.glowCardContent}>{children}</View>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const { currentTheme } = useAppTheme();

  return (
    <MobileScreen scroll safeArea keyboardAware={false}>
      {/* Hero Section */}
      <FadeInView delay={0} spring>
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/main_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text variant="caption" color="muted" style={styles.label}>
            AREA • Automation
          </Text>
          <Text variant="title" style={styles.mainTitle}>
            Automatise ta vie{'\n'}digitale.
          </Text>
        </View>
      </FadeInView>

      <FadeInView delay={100} spring>
        <View style={styles.widgetContainer}>
          <Image
            source={require('@/assets/images/widget1.png')}
            style={styles.widgetImage}
            resizeMode="contain"
          />
        </View>
      </FadeInView>

      {/* Feature Cards - Full Width */}
      <View style={styles.cardsContainer}>
        <FadeInView delay={200} spring>
          <GlowCard>
            <SectionCard>
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.cardIcon,
                    { backgroundColor: currentTheme.colors.primarySoft },
                  ]}
                >
                  <IconSymbol
                    size={28}
                    name="link"
                    color={currentTheme.colors.primary}
                  />
                </View>
                <View style={styles.cardTextContent}>
                  <Text variant="subtitle" style={styles.cardTitle}>
                    Connect services
                  </Text>
                  <Text variant="body" color="muted" style={styles.cardText}>
                    Lie tes comptes Discord, GitHub, Google et bien d'autres
                    services pour créer des automatisations puissantes.
                  </Text>
                </View>
              </View>
            </SectionCard>
          </GlowCard>
        </FadeInView>

        <FadeInView delay={300} spring>
          <GlowCard>
            <SectionCard>
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.cardIcon,
                    { backgroundColor: currentTheme.colors.primarySoft },
                  ]}
                >
                  <IconSymbol
                    size={28}
                    name="bolt.fill"
                    color={currentTheme.colors.primary}
                  />
                </View>
                <View style={styles.cardTextContent}>
                  <Text variant="subtitle" style={styles.cardTitle}>
                    Create automations
                  </Text>
                  <Text variant="body" color="muted" style={styles.cardText}>
                    Construis des flux Action → Réaction pour automatiser tes
                    tâches quotidiennes et gagner du temps.
                  </Text>
                </View>
              </View>
            </SectionCard>
          </GlowCard>
        </FadeInView>
      </View>
      <FadeInView delay={400} spring>
        <View style={styles.ctaSection}>
          <MobileButton
            label="Go to AREA"
            onPress={() => router.push('/(tabs)/area')}
            variant="primary"
            fullWidth
          />
        </View>
      </FadeInView>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    marginBottom: 32,
    gap: 16,
    paddingTop: 20,
    zIndex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'left',
    fontWeight: '600',
  },
  mainTitle: {
    fontSize: 42,
    lineHeight: 50,
    marginBottom: 12,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  widgetContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  widgetImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    maxHeight: 400,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 32,
    zIndex: 1,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContent: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    marginBottom: 2,
    fontSize: 18,
    fontWeight: '600',
  },
  cardText: {
    lineHeight: 22,
    fontSize: 15,
  },
  ctaSection: {
    marginTop: 8,
    marginBottom: 32,
    zIndex: 1,
  },
  glowCardContainer: {
    borderRadius: 16,
    marginBottom: 0,
  },
  glowCardContent: {
    borderRadius: 14,
    overflow: 'hidden',
  },
});
