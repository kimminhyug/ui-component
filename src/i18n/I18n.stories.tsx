import type { Meta, StoryObj } from '@storybook/react';
import { I18nProvider, useT, useMessage } from './I18nContext';

const ShowT = () => {
  const t = useT();
  return (
    <div className="space-y-1 text-sm">
      <p>t(&apos;modal.close&apos;): {t('modal.close')}</p>
      <p>t(&apos;table.pageInfo&apos;, params): {t('table.pageInfo', { from: 1, to: 10, total: 100 })}</p>
    </div>
  );
};

const ShowUseMessage = () => {
  const close = useMessage('modal', 'close');
  const empty = useMessage('table', 'empty');
  return (
    <div className="space-y-1 text-sm">
      <p>useMessage(&apos;modal&apos;,&apos;close&apos;): {close}</p>
      <p>useMessage(&apos;table&apos;,&apos;empty&apos;): {empty}</p>
    </div>
  );
};

const meta: Meta = {
  title: 'I18n/Override',
  component: I18nProvider,
  parameters: {
    layout: 'centered',
    docs: { source: { type: 'code' } },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof I18nProvider>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `const t = useT();
const close = useMessage('modal', 'close');

// 사용
t('modal.close');
t('table.pageInfo', { from: 1, to: 10, total: 100 });`,
        language: 'tsx',
      },
    },
  },
  render: () => (
    <I18nProvider>
      <ShowT />
      <hr className="my-4" />
      <ShowUseMessage />
    </I18nProvider>
  ),
};

export const OverrideMessages: Story = {
  parameters: {
    docs: {
      source: {
        code: `<I18nProvider
  messages={{
    modal: { close: 'Close', confirm: 'OK', cancel: 'Cancel' },
    table: { empty: 'No data.', pageInfo: '{{from}}–{{to}} of {{total}}' },
  }}
>
  {children}
</I18nProvider>`,
        language: 'tsx',
      },
    },
  },
  render: () => (
    <I18nProvider
      messages={{
        modal: { close: 'Close', confirm: 'OK', cancel: 'Cancel' },
        table: { empty: 'No data.', pageInfo: '{{from}}–{{to}} of {{total}}' },
      }}
    >
      <ShowT />
      <hr className="my-4" />
      <ShowUseMessage />
    </I18nProvider>
  ),
};
