import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../theme/ThemeContext';
import { Badge } from './Badge';

const withTheme = (ui: React.ReactElement) => <ThemeProvider>{ui}</ThemeProvider>;

describe('Badge', () => {
  it('renders children', () => {
    render(withTheme(<Badge>Label</Badge>));
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    render(withTheme(<Badge>x</Badge>));
    expect(screen.getByText('x')).toHaveClass('bg-gray-100');
  });

  it('applies primary variant', () => {
    render(withTheme(<Badge variant="primary">x</Badge>));
    expect(screen.getByText('x')).toHaveClass('bg-blue-100');
  });
});
