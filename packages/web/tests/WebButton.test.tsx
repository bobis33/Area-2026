import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { WebButton } from '@/components/ui-web';

describe('WebButton', () => {
  it('renders the label', () => {
    render(<WebButton label="Click me" />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<WebButton label="Click" onClick={onClick} />);

    await userEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant by default', () => {
    render(<WebButton label="Primary" />);
    const btn = screen.getByRole('button', { name: 'Primary' });

    expect(btn).toHaveClass('web-button');
    expect(btn).toHaveClass('web-button-primary');
  });

  it('applies secondary variant', () => {
    render(<WebButton label="Secondary" variant="secondary" />);
    const btn = screen.getByRole('button', { name: 'Secondary' });

    expect(btn).toHaveClass('web-button-secondary');
  });

  it('applies ghost variant', () => {
    render(<WebButton label="Ghost" variant="ghost" />);
    const btn = screen.getByRole('button', { name: 'Ghost' });

    expect(btn).toHaveClass('web-button-ghost');
  });

  it('applies fullWidth class when enabled', () => {
    render(<WebButton label="Full" fullWidth />);
    const btn = screen.getByRole('button', { name: 'Full' });

    expect(btn).toHaveClass('web-button-full');
  });

  it('is disabled when disabled=true', () => {
    render(<WebButton label="Disabled" disabled />);
    const btn = screen.getByRole('button', { name: 'Disabled' });

    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('web-button-disabled');
  });

  it('supports custom className', () => {
    render(<WebButton label="Custom" className="my-class" />);
    const btn = screen.getByRole('button', { name: 'Custom' });

    expect(btn).toHaveClass('my-class');
  });

  it('uses the provided type', () => {
    render(<WebButton label="Submit" type="submit" />);
    const btn = screen.getByRole('button', { name: 'Submit' });

    expect(btn).toHaveAttribute('type', 'submit');
  });
});
