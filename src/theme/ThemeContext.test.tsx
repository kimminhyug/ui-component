import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ThemeProvider,
  useTheme,
  useThemeKey,
  useThemeActions,
} from './ThemeContext';
import { Button } from '../components/atoms/Button';

const ShowThemeButton = () => {
  const theme = useTheme();
  return <span data-testid="has-theme">{theme?.button ? 'yes' : 'no'}</span>;
};

describe('ThemeProvider', () => {
  it('provides theme to children', () => {
    render(
      <ThemeProvider>
        <ShowThemeButton />
      </ThemeProvider>
    );
    expect(screen.getByTestId('has-theme')).toHaveTextContent('yes');
  });

  it('merges override with base by themeKey', () => {
    render(
      <ThemeProvider
        themes={{ violet: { button: { primary: 'bg-violet-600' } } }}
        defaultThemeKey="violet"
      >
        <Button variant="primary">Ok</Button>
      </ThemeProvider>
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-violet-600');
  });
});

describe('useThemeKey', () => {
  it('returns current theme key inside provider', () => {
    const ShowKey = () => {
      const key = useThemeKey();
      return <span data-testid="theme-key">{key}</span>;
    };
    render(
      <ThemeProvider
        themes={{ a: {}, b: {} }}
        defaultThemeKey="b"
      >
        <ShowKey />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-key')).toHaveTextContent('b');
  });

  it('returns "default" when outside provider', () => {
    const ShowKey = () => {
      const key = useThemeKey();
      return <span data-testid="theme-key">{key}</span>;
    };
    render(<ShowKey />);
    expect(screen.getByTestId('theme-key')).toHaveTextContent('default');
  });
});

describe('useThemeActions', () => {
  it('setThemeKey switches applied theme', () => {
    const themes = {
      violet: { button: { primary: 'bg-violet-600' } },
      green: { button: { primary: 'bg-green-600' } },
    };
    const Switcher = () => {
      const key = useThemeKey();
      const { setThemeKey } = useThemeActions();
      return (
        <>
          <span data-testid="key">{key}</span>
          <button type="button" onClick={() => setThemeKey('violet')}>
            Violet
          </button>
          <button type="button" onClick={() => setThemeKey('green')}>
            Green
          </button>
          <Button variant="primary">Apply</Button>
        </>
      );
    };
    render(
      <ThemeProvider themes={themes} defaultThemeKey="violet">
        <Switcher />
      </ThemeProvider>
    );
    const applyBtn = screen.getByRole('button', { name: 'Apply' });
    expect(applyBtn).toHaveClass('bg-violet-600');
    expect(screen.getByTestId('key')).toHaveTextContent('violet');

    fireEvent.click(screen.getByRole('button', { name: 'Green' }));
    expect(screen.getByTestId('key')).toHaveTextContent('green');
    expect(applyBtn).toHaveClass('bg-green-600');
  });

  it('updateTheme updates registry and applied theme when key is current', () => {
    const Switcher = () => {
      const { setThemeKey, updateTheme } = useThemeActions();
      return (
        <>
          <button
            type="button"
            onClick={() => {
              updateTheme('custom', { button: { primary: 'bg-amber-600' } });
              setThemeKey('custom');
            }}
          >
            Set custom
          </button>
          <Button variant="primary">Apply</Button>
        </>
      );
    };
    render(
      <ThemeProvider themes={{ custom: {} }} defaultThemeKey="default">
        <Switcher />
      </ThemeProvider>
    );
    const applyBtn = screen.getByRole('button', { name: 'Apply' });
    fireEvent.click(screen.getByRole('button', { name: 'Set custom' }));
    expect(applyBtn).toHaveClass('bg-amber-600');
  });
});
