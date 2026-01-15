import React from 'react';
import styles from './PageLayout.module.css';

export interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * PageLayout component - Provides consistent page structure
 * Uses @area/ui tokens via CSS variables
 */
export function PageLayout({
  children,
  className = '',
  maxWidth = 'lg',
}: PageLayoutProps) {
  const classNames = [
    styles.layout,
    styles[`maxWidth-${maxWidth}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames}>{children}</div>;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader component - Consistent page header with title and optional action
 */
export function PageHeader({
  title,
  subtitle,
  action,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`${styles.header} ${className}`}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.headerAction}>{action}</div>}
    </div>
  );
}

export interface ContentGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * ContentGrid component - Responsive grid layout for content
 */
export function ContentGrid({
  children,
  columns = 2,
  gap = 'md',
  className = '',
}: ContentGridProps) {
  const classNames = [
    styles.grid,
    styles[`columns-${columns}`],
    styles[`gap-${gap}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames}>{children}</div>;
}
