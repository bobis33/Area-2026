import React from "react";
import { OAuthButton } from "@area/ui";

/**
 * WebOAuthButton - Wrapper pour le composant OAuthButton partagé de @area/ui
 *
 * Ce composant utilise l'OAuthButton de React Native via React Native Web.
 * Les styles sont automatiquement convertis du StyleSheet React Native vers CSS.
 */
export interface WebOAuthButtonProps {
  label: string;
  onClick?: () => void;
  provider: "google" | "discord" | "github" | "facebook" | "twitter";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

// Couleurs par défaut pour chaque provider
const providerColors = {
  google: {
    backgroundColor: "#ffffff",
    textColor: "#000000",
    borderColor: "#dadce0",
  },
  discord: {
    backgroundColor: "#5865F2",
    textColor: "#ffffff",
    borderColor: "#5865F2",
  },
  github: {
    backgroundColor: "#24292e",
    textColor: "#ffffff",
    borderColor: "#24292e",
  },
  facebook: {
    backgroundColor: "#1877F2",
    textColor: "#ffffff",
    borderColor: "#1877F2",
  },
  twitter: {
    backgroundColor: "#1DA1F2",
    textColor: "#ffffff",
    borderColor: "#1DA1F2",
  },
};

export const WebOAuthButton: React.FC<WebOAuthButtonProps> = ({
  label,
  onClick,
  provider,
  disabled = false,
  loading = false,
  icon,
  className = "",
}) => {
  // Le composant OAuthButton de @area/ui utilise 'onPress' au lieu de 'onClick'
  const handlePress = onClick || (() => {});

  const colors = providerColors[provider];

  return (
    <div className={className} style={{ width: "100%" }}>
      <OAuthButton
        label={label}
        onPress={handlePress}
        backgroundColor={colors.backgroundColor}
        textColor={colors.textColor}
        borderColor={colors.borderColor}
        disabled={disabled}
        loading={loading}
        icon={icon}
      />
    </div>
  );
};
