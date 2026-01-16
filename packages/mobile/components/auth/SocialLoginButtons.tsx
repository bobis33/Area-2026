import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { OAuthButton, spacing, colors } from '@area/ui';
import { MobileText as Text } from '@/components/ui-mobile';
import * as Haptics from 'expo-haptics';
import { API_BASE_URL } from '@/constants/api';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/I18nContext';

WebBrowser.maybeCompleteAuthSession();

type OAuthProvider = 'github' | 'google' | 'discord' | 'spotify' | 'gitlab';

interface SocialLoginButtonsProps {
  disabled?: boolean;
}

export function SocialLoginButtons({
  disabled = false,
}: SocialLoginButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(
    null,
  );
  const { handleOAuthRedirect } = useAuth();
  const t = useTranslation();

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    if (disabled || loadingProvider) return;

    setLoadingProvider(provider);

    try {
      const redirectUri = AuthSession.makeRedirectUri({
        path: `auth/${provider}/callback`,
      });

      const oauthUrl = `${API_BASE_URL}/auth/${provider}?redirect=${encodeURIComponent(redirectUri)}`;

      const result = await WebBrowser.openAuthSessionAsync(
        oauthUrl,
        redirectUri,
      );

      if (result.type === 'success' && result.url) {
        handleOAuthRedirect(result.url);
      } else if (result.type === 'locked') {
        Alert.alert(t('common.error'), t('area.browserLocked'));
      }
    } catch (error) {
      Alert.alert(
        t('area.connectionError'),
        t('area.connectionErrorMsg', { provider }),
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  const isLoading = loadingProvider !== null;

  const handlePress = (provider: OAuthProvider) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    handleOAuthLogin(provider);
  };

  return (
    <View style={styles.container}>
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text variant="caption" color="muted" style={styles.separatorText}>
          {t('login.orContinueWith')}
        </Text>
        <View style={styles.separatorLine} />
      </View>

      <View style={styles.buttonsContainer}>
        <OAuthButton
          label={t('oauth.continueWithDiscord')}
          onPress={() => handlePress('discord')}
          backgroundColor="#5865F2"
          textColor={colors.white}
          icon={<Ionicons name="logo-discord" size={20} color={colors.white} />}
          disabled={disabled}
          loading={isLoading && loadingProvider === 'discord'}
        />

        <OAuthButton
          label={t('oauth.continueWithGitHub')}
          onPress={() => handlePress('github')}
          backgroundColor="#18181B"
          textColor={colors.white}
          icon={<AntDesign name="github" size={20} color={colors.white} />}
          disabled={disabled}
          loading={isLoading && loadingProvider === 'github'}
        />

        <OAuthButton
          label={t('oauth.continueWithGoogle')}
          onPress={() => handlePress('google')}
          backgroundColor={colors.white}
          textColor={colors.gray900}
          borderColor={colors.gray200}
          icon={<AntDesign name="google" size={20} color={colors.gray900} />}
          disabled={disabled}
          loading={isLoading && loadingProvider === 'google'}
        />

        <OAuthButton
          label={t('oauth.continueWithSpotify')}
          onPress={() => handlePress('spotify')}
          backgroundColor="#1DB954"
          textColor={colors.white}
          icon={
            <MaterialCommunityIcons
              name="spotify"
              size={20}
              color={colors.white}
            />
          }
          disabled={disabled}
          loading={isLoading && loadingProvider === 'spotify'}
        />

        <OAuthButton
          label={t('oauth.continueWithGitLab')}
          onPress={() => handlePress('gitlab')}
          backgroundColor="#FC6D26"
          textColor={colors.white}
          icon={
            <MaterialCommunityIcons
              name="gitlab"
              size={20}
              color={colors.white}
            />
          }
          disabled={disabled}
          loading={isLoading && loadingProvider === 'gitlab'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: spacing.xl,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray200,
  },
  separatorText: {
    marginHorizontal: spacing.md,
  },
  buttonsContainer: {
    gap: spacing.md,
  },
});
