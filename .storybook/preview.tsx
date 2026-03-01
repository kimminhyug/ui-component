import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../src/theme';
import { I18nProvider } from '../src/i18n';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light / Dark (Tailwind dark)',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const isDark =
        context.parameters?.darkMode === true ||
        context.globals?.theme === 'dark' ||
        context.globals?.backgrounds?.value === '#0f172a';
      const wrapperClass = isDark ? 'dark p-4 bg-gray-950 min-h-[100vh] text-gray-100' : 'p-4';
      return (
        <ThemeProvider>
          <I18nProvider>
            <div className={wrapperClass}>
              <Story />
            </div>
          </I18nProvider>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
