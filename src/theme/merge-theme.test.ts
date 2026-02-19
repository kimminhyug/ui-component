import { describe, it, expect } from 'vitest';
import { mergeTheme } from './merge-theme';
import type { UITheme } from './theme.types';

describe('mergeTheme', () => {
  it('returns base when override is null', () => {
    const base: UITheme = { button: { base: 'btn', primary: 'primary' } };
    expect(mergeTheme(base, null)).toBe(base);
    expect(mergeTheme(base, undefined)).toBe(base);
  });

  it('overrides only overlapping keys', () => {
    const base: UITheme = {
      button: { base: 'btn', primary: 'primary', sizeMd: 'size-md' },
    };
    const override: UITheme = {
      button: { primary: 'primary-override' },
    };
    const result = mergeTheme(base, override);
    expect(result.button?.base).toBe('btn');
    expect(result.button?.primary).toBe('primary-override');
    expect(result.button?.sizeMd).toBe('size-md');
  });

  it('adds keys only in override', () => {
    const base: UITheme = { button: { base: 'btn' } };
    const override: UITheme = {
      button: { base: 'btn' },
      input: { base: 'input' },
    };
    const result = mergeTheme(base, override);
    expect(result.input?.base).toBe('input');
  });
});
