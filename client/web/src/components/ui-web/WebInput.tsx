import React from 'react';
import './WebInput.css';

/**
 * WebInput - Custom Web wrapper for Input with current design style
 * Uses custom CSS styling matching the web design system
 */
export interface WebInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
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
  type = 'text',
  disabled = false,
  label,
  error,
  required = false,
  className = '',
  id,
  name,
}) => {
  const inputId =
    id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  const getInputClass = () => {
    const classes = ['web-input'];
    if (error) classes.push('web-input-error');
    if (disabled) classes.push('web-input-disabled');
    if (className) classes.push(className);
    return classes.join(' ');
  };

  return (
    <div className="web-input-wrapper">
      {label && (
        <label htmlFor={inputId} className="web-input-label">
          {label}
          {required && <span className="web-input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={getInputClass()}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <span id={`${inputId}-error`} className="web-input-error-message">
          {error}
        </span>
      )}
    </div>
  );
};
