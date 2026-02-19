import type { UIMessages } from './i18n.types';

export const mergeMessages = (base: UIMessages, override?: UIMessages | null): UIMessages => {
  if (!override || typeof override !== 'object') return base;

  const result: UIMessages = {};

  for (const key of Object.keys(base)) {
    const baseVal = base[key];
    const overrideVal = override[key];

    if (baseVal && typeof baseVal === 'object' && !Array.isArray(baseVal)) {
      const overrideObj =
        overrideVal && typeof overrideVal === 'object' && !Array.isArray(overrideVal)
          ? overrideVal
          : {};
      result[key] = { ...baseVal, ...overrideObj };
    } else {
      result[key] = overrideVal !== undefined ? overrideVal : baseVal;
    }
  }

  for (const key of Object.keys(override)) {
    if (result[key] === undefined) {
      result[key] = override[key];
    }
  }

  return result;
};
