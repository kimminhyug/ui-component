import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../src/theme';
import { I18nProvider } from '../src/i18n';
import './preview.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <I18nProvider>
          <div className="p-4">
            <Story />
          </div>
        </I18nProvider>
      </ThemeProvider>
    ),
  ],
};

export default preview;
