import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('filters falsy', () => {
    expect(cn('a', false, 'b', undefined, null)).toBe('a b');
  });

  it('handles tailwind merge (later wins)', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
});
