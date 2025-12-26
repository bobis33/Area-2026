import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Text } from '@area/ui';
import { MobileScreen, MobileButton } from '@/components/ui-mobile';
import { SectionCard } from '@/components/layout/SectionCard';
import { FadeInView } from '@/components/animations';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme, type ThemeMode } from '@/contexts/ThemeContext';
import Constants from 'expo-constants';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { currentTheme, mode, setMode } = useAppTheme();

  const getInitials = (name?: string, email?: string): string => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name[0].toUpperCase();
    }
    return email?.[0].toUpperCase() || 'U';
  };

  const getProviderLabel = (provider: string): string => {
    const labels: Record<string, string> = {
      discord: 'Discord',
      github: 'GitHub',
      google: 'Google',
    };
    return labels[provider.toLowerCase()] || provider;
  };

  const themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  return (
    <MobileScreen scroll safeArea keyboardAware={false}>
      {/* Header */}
      <FadeInView delay={0} spring>
        <View style={styles.header}>
          <Text variant="title" style={styles.title}>
            Profile
          </Text>
        </View>
      </FadeInView>

      {/* User Card */}
      <FadeInView delay={100} spring>
        <SectionCard>
          <View style={styles.userInfo}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: currentTheme.colors.primary },
              ]}
            >
              <Text
                variant="title"
                style={
                  [
                    styles.avatarText,
                    { color: currentTheme.colors.primaryOn },
                  ] as any
                }
              >
                {getInitials(user?.name, user?.email)}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text variant="subtitle" style={styles.userName}>
                {user?.name || user?.email || 'User'}
              </Text>
              <Text variant="body" color="muted" style={styles.userEmail}>
                {user?.email}
              </Text>
              <View style={styles.providerBadge}>
                <Text variant="caption" color="muted">
                  Signed in with {getProviderLabel(user?.provider || 'email')}
                </Text>
              </View>
            </View>
          </View>
        </SectionCard>
      </FadeInView>

      {/* Device & App Section */}
      <FadeInView delay={200} spring>
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Device & app
          </Text>
          <SectionCard>
            <View
              style={[
                styles.infoRow,
                { borderBottomColor: currentTheme.colors.border },
              ]}
            >
              <Text variant="body" color="muted">
                Platform
              </Text>
              <Text variant="body">
                {Platform.OS === 'ios'
                  ? 'iOS'
                  : Platform.OS === 'android'
                    ? 'Android'
                    : 'Web'}
              </Text>
            </View>
            <View style={styles.infoRowLast}>
              <Text variant="body" color="muted">
                App version
              </Text>
              <Text variant="body">
                {Constants.expoConfig?.version || '1.0.0'}
              </Text>
            </View>
          </SectionCard>
        </View>
      </FadeInView>

      {/* Appearance / Theme Section */}
      <FadeInView delay={300} spring>
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Appearance
          </Text>
          <SectionCard>
            {themeOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setMode(option.value)}
                style={[
                  styles.themeOption,
                  index < themeOptions.length - 1 && {
                    borderBottomColor: currentTheme.colors.border,
                  },
                ]}
              >
                <View style={styles.themeOptionLeft}>
                  <Text variant="body">{option.label}</Text>
                  {option.value === 'system' && (
                    <Text variant="caption" color="muted">
                      Follow system setting
                    </Text>
                  )}
                </View>
                {mode === option.value && (
                  <IconSymbol
                    size={20}
                    name="checkmark.circle.fill"
                    color={currentTheme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </SectionCard>
        </View>
      </FadeInView>

      {/* Settings Section */}
      <FadeInView delay={400} spring>
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Settings
          </Text>
          <SectionCard>
            <View
              style={[
                styles.settingRow,
                { borderBottomColor: currentTheme.colors.border },
              ]}
            >
              <View style={styles.settingInfo}>
                <Text variant="body">Push notifications</Text>
                <Text variant="caption" color="muted">
                  Coming soon
                </Text>
              </View>
              <View
                style={[
                  styles.togglePlaceholder,
                  { backgroundColor: currentTheme.colors.surfaceMuted },
                ]}
              >
                <Text variant="caption" color="muted">
                  OFF
                </Text>
              </View>
            </View>
          </SectionCard>
        </View>
      </FadeInView>

      {/* Account Actions Section */}
      <FadeInView delay={500} spring>
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Account actions
          </Text>
          <SectionCard>
            <MobileButton
              label="Log out"
              onPress={logout}
              variant="ghost"
              fullWidth
              style={styles.logoutButton}
            />
          </SectionCard>
        </View>
      </FadeInView>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    marginBottom: 4,
  },
  providerBadge: {
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  themeOptionLeft: {
    flex: 1,
    gap: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    gap: 4,
  },
  togglePlaceholder: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  logoutButton: {
    marginTop: 4,
  },
});
