import React from "react";
import { Input } from "@area/ui";

/**
 * WebInput - Wrapper pour le composant Input partagé de @area/ui
 *
 * Ce composant utilise l'Input de React Native via React Native Web.
 * Les styles sont automatiquement convertis du StyleSheet React Native vers CSS.
 */
export interface WebInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  disabled?: boolean;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const WebInput: React.FC<WebInputProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  label,
  error,
  required = false,
  className = "",
  id: _id,
  name: _name,
}) => {
  // Le composant Input de @area/ui utilise 'onChangeText' au lieu de 'onChange'
  // et 'secureTextEntry' pour les mots de passe
  const isPassword = type === "password";

  return (
    <div className={className} style={{ width: "100%" }}>
      <Input
        label={label}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        secureTextEntry={isPassword}
        disabled={disabled}
        errorMessage={error}
        helperText={required ? "Requis" : undefined}
      />
    </div>
  );
};
