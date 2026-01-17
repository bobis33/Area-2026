import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeContext';

export const render = (ui: React.ReactElement, options = {}) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
