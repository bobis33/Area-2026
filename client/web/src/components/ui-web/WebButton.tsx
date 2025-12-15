import React from "react";
import { Button } from "@area/ui";

/**
 * WebButton - Wrapper pour le composant Button partagé de @area/ui
 *
 * Ce composant utilise le Button de React Native via React Native Web.
 * Les styles sont automatiquement convertis du StyleSheet React Native vers CSS.
 */
export interface WebButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const WebButton: React.FC<WebButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  fullWidth = false,
  className = "",
}) => {
  // Le composant Button de @area/ui utilise 'onPress' au lieu de 'onClick'
  const handlePress = onClick || (() => {});

  return (
    <div className={className} style={{ width: fullWidth ? "100%" : "auto" }}>
      <Button
        label={label}
        onPress={handlePress}
        variant={variant}
        disabled={disabled}
        fullWidth={fullWidth}
      />
    </div>
  );
};
