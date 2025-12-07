import React from "react";
import "./WebButton.css";

/**
 * WebButton - Custom Web wrapper for Button with current design style
 * Uses the shared Button logic but applies custom CSS styling
 */
export interface WebButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const WebButton: React.FC<WebButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  fullWidth = false,
  className = "",
  type = "button",
}) => {
  const getButtonClass = () => {
    const classes = ["web-button"];

    if (variant === "primary") classes.push("web-button-primary");
    if (variant === "secondary") classes.push("web-button-secondary");
    if (variant === "ghost") classes.push("web-button-ghost");
    if (fullWidth) classes.push("web-button-full");
    if (disabled) classes.push("web-button-disabled");
    if (className) classes.push(className);

    return classes.join(" ");
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getButtonClass()}
    >
      {label}
    </button>
  );
};
