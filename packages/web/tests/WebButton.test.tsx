import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui';
import { ThemeProvider } from '@/context/ThemeContext';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Button', () => {
  it('renders the label (children)', () => {
    renderWithTheme(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    renderWithTheme(<Button onClick={onClick}>Click</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({
        preventDefault: expect.any(Function),
        currentTarget: expect.any(HTMLElement),
        target: expect.any(HTMLElement),
      }),
    );
  });

  it('is disabled when disabled=true', () => {
    renderWithTheme(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button', { name: 'Disabled' });

    expect(btn).toBeDisabled();
  });

  it('is disabled when loading=true', () => {
    renderWithTheme(<Button loading>Loading</Button>);
    const btn = screen.getByRole('button');

    expect(btn).toBeDisabled();
  });

  it('shows spinner when loading', () => {
    const { container } = renderWithTheme(<Button loading>Load</Button>);
    const spinner = container.querySelector('div[style*="animation"]');
    expect(spinner).toBeInTheDocument();
  });

  it('does not call onClick when loading', () => {
    const onClick = vi.fn();
    renderWithTheme(
      <Button loading onClick={onClick}>
        Load
      </Button>,
    );

    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports custom className', () => {
    const { container } = renderWithTheme(
      <Button className="my-class">Custom</Button>,
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.className).toContain('my-class');
  });

  it('renders as button element', () => {
    renderWithTheme(<Button>Submit</Button>);
    const btn = screen.getByRole('button', { name: 'Submit' });

    expect(btn.tagName).toBe('BUTTON');
  });

  it('renders left and right icons', () => {
    renderWithTheme(
      <Button
        leftIcon={<span data-testid="left-icon" />}
        rightIcon={<span data-testid="right-icon" />}
      >
        Icon
      </Button>,
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('does not render icons when loading', () => {
    renderWithTheme(
      <Button
        loading
        leftIcon={<span data-testid="left-icon" />}
        rightIcon={<span data-testid="right-icon" />}
      >
        Icon
      </Button>,
    );

    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
  });
});
