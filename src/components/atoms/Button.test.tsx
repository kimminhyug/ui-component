import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../theme/ThemeContext';
import { Button } from './Button';

const withTheme = (ui: React.ReactElement) => <ThemeProvider>{ui}</ThemeProvider>;

describe('Button', () => {
  it('renders children', () => {
    render(withTheme(<Button>Click</Button>));
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });

  it('applies variant primary by default', () => {
    render(withTheme(<Button>Ok</Button>));
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-blue-600');
  });

  it('applies disabled', () => {
    render(withTheme(<Button disabled>Ok</Button>));
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
