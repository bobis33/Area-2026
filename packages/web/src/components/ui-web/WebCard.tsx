import React from "react";
import "./WebCard.css";

/**
 * WebCard - Pure web card component
 *
 * A simple card component for web without React Native dependencies.
 */
export interface WebCardProps {
  /**
   * Content of the card
   */
  children: React.ReactNode;
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Optional HTML id attribute
   */
  id?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Optional inline styles
   */
  style?: React.CSSProperties;
}

export const WebCard: React.FC<WebCardProps> = ({
  children,
  className = "",
  id,
  onClick,
  style,
}) => {
  return (
    <div
      id={id}
      className={`web-card ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};
