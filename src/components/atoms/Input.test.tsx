import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../theme/ThemeContext';
import { Input } from './Input';

const withTheme = (ui: React.ReactElement) => <ThemeProvider>{ui}</ThemeProvider>;

describe('Input', () => {
  it('renders with placeholder', () => {
    render(withTheme(<Input placeholder="Enter" />));
    expect(screen.getByPlaceholderText('Enter')).toBeInTheDocument();
  });

  it('supports controlled value', () => {
    render(withTheme(<Input value="test" onChange={() => {}} readOnly />));
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('applies error class when error', () => {
    render(withTheme(<Input error placeholder="x" />));
    const input = screen.getByPlaceholderText('x');
    expect(input).toHaveClass('border-red-500');
  });
});
