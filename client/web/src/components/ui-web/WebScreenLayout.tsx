import React from "react";
import { ScreenLayout } from "@area/ui";

/**
 * WebScreenLayout - Wrapper pour le composant ScreenLayout partagé de @area/ui
 *
 * Ce composant utilise le ScreenLayout de React Native via React Native Web.
 * Les styles sont automatiquement convertis du StyleSheet React Native vers CSS.
 */
export interface WebScreenLayoutProps {
  children: React.ReactNode;
  title?: string;
  scroll?: boolean;
  safeArea?: boolean;
  headerRight?: React.ReactNode;
  className?: string;
  contentClassName?: string; // Optionnel, pas utilisé actuellement
}

export const WebScreenLayout: React.FC<WebScreenLayoutProps> = ({
  children,
  title,
  scroll = false,
  safeArea = false, // Sur le web, safeArea n'est généralement pas nécessaire
  headerRight,
  className = "",
  contentClassName: _contentClassName = "",
}) => {
  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <ScreenLayout
        title={title}
        scroll={scroll}
        safeArea={safeArea}
        headerRight={headerRight}
      >
        {children}
      </ScreenLayout>
    </div>
  );
};
