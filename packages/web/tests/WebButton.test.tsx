import { render, screen } from './test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui';

describe('Button', () => {
  it('renders the label (children)', () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled=true', () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button', { name: 'Disabled' });

    expect(btn).toBeDisabled();
  });

  it('is disabled when loading=true', () => {
    render(<Button loading>Loading</Button>);
    const btn = screen.getByRole('button');

    expect(btn).toBeDisabled();
  });

  it('shows spinner when loading', () => {
    render(<Button loading>Load</Button>);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('does not call onClick when loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Load
      </Button>,
    );

    const btn = screen.getByRole('button');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports custom className', () => {
    render(<Button className="my-class">Custom</Button>);
    const btn = screen.getByRole('button', { name: 'Custom' });

    expect(btn.className).toContain('my-class');
  });

  it('renders left and right icons', () => {
    render(
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
    render(
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
