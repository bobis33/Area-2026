import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Web Card component using @area/ui tokens via CSS variables
 * Matches the mobile Card styling and behavior
 */
export function Card({
  children,
  className = '',
  padding = 'md',
  hoverable = false,
  onClick,
  header,
  footer,
}: CardProps) {
  const classNames = [
    styles.card,
    styles[`padding-${padding}`],
    hoverable && styles.hoverable,
    onClick && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} onClick={onClick}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
