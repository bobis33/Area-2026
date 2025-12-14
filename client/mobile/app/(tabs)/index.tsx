import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@area/ui';
import { MobileScreen, MobileButton } from '@/components/ui-mobile';
import { SectionCard } from '@/components/layout/SectionCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FadeInView } from '@/components/animations';
import { useAppTheme } from '@/contexts/ThemeContext';

export default function HomeScreen() {
  const { currentTheme } = useAppTheme();

  return (
    <MobileScreen scroll safeArea keyboardAware={false}>
      {/* Hero Section */}
      <FadeInView delay={0} spring>
        <View style={styles.heroSection}>
          <Text variant="caption" color="muted" style={styles.label}>
            AREA • Automation
          </Text>
          <Text variant="title" style={styles.mainTitle}>
            Automatise ta vie digitale.
          </Text>
          <Text variant="body" color="muted" style={styles.description}>
            Connecte tes services préférés et crée des automatisations
            puissantes. Quand une Action se produit, une Réaction se déclenche
            automatiquement.
          </Text>
        </View>
      </FadeInView>

      {/* What is AREA Section */}
      <FadeInView delay={100} spring>
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            What is AREA ?
          </Text>
          <Text variant="body" color="muted" style={styles.sectionText}>
            AREA est une plateforme d'automatisation qui te permet de connecter
            différents services (Discord, GitHub, Google, etc.) et de créer des
            scénarios personnalisés. Quand une Action se produit sur un service,
            une Réaction se déclenche automatiquement sur un autre.
          </Text>
        </View>
      </FadeInView>

      {/* Feature Cards - Full Width */}
      <View style={styles.cardsContainer}>
        <FadeInView delay={200} spring>
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
        </FadeInView>

        <FadeInView delay={300} spring>
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
        </FadeInView>
      </View>

      {/* CTA Button */}
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
    marginBottom: 24,
    gap: 12,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 32,
    lineHeight: 38,
    marginBottom: 8,
  },
  description: {
    lineHeight: 24,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
    gap: 8,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionText: {
    lineHeight: 22,
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContent: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardText: {
    lineHeight: 20,
  },
  ctaSection: {
    marginTop: 16,
  },
});
