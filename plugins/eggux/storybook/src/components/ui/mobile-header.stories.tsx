import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Bell, Search } from '@/components/icons';
import { Avatar } from './avatar';
import { ButtonIcon } from './button-icon';
import { MobileHeader } from './mobile-header';

type Args = {
  type: 'app' | 'detail' | 'brand' | 'search';
  size: 'default' | 'large';
  title: string;
  showTrailing: boolean;
};

const frame = (Story: React.ComponentType) => (
  <div className="w-[390px] max-w-full overflow-hidden rounded-lg border border-border">
    <Story />
  </div>
);

const trailing = (
  <>
    <ButtonIcon variant="ghost" icon={<Bell />} label="Notifications" className="min-h-11 min-w-11" showTooltip={false} />
    <Avatar initials="DP" size="sm" />
  </>
);

const meta = {
  title: 'Components/Mobile/Mobile Header',
  decorators: [frame],
  parameters: {
    docs: {
      description: {
        component:
          'The top bar of a mobile screen (under 768 px), 56 high. app: menu, page title, notifications and avatar. detail: back, object title, actions. brand: the Logo on entry screens. search: back, a search field and Cancel. Size large puts the title under the bar for the top of a list. The title is the page heading. Figma: Mobile page / Mobile Header. Guide: eggux build-ui/patterns/mobile.md',
      },
    },
  },
  args: { type: 'app', size: 'default', title: 'Customers', showTrailing: true },
  argTypes: {
    type: { name: 'Type', control: 'select', options: ['app', 'detail', 'brand', 'search'], description: 'What the bar is for.', table: { category: 'Header' } },
    size: { name: 'Size', control: 'inline-radio', options: ['default', 'large'], description: 'Large puts the title under the bar (app and detail).', table: { category: 'Header' } },
    title: { name: 'Title', control: 'text', description: 'Page or object name; one line, up to two when large.', table: { category: 'Header' } },
    showTrailing: { name: 'Show trailing', control: 'boolean', description: 'Actions on the right (app, detail).', table: { category: 'Parts' } },
  },
  render: ({ type, size, title, showTrailing }) => <MobileHeader type={type} size={size} title={title} trailing={showTrailing ? trailing : undefined} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 1, name: 'Customers' });
    await expect(heading).toBeVisible();
    await expect(Math.round(canvas.getByRole('banner').getBoundingClientRect().height)).toBe(56);
    // Touch targets are at least 44 x 44.
    const menu = canvas.getByRole('button', { name: 'Open menu' });
    await expect(menu.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    await expect(menu.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await userEvent.tab();
    await expect(menu).toHaveFocus();
  },
};

/** The four types side by side, as the Figma set shows them. */
export const Types: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[390px] max-w-full flex-col gap-4"><Story /></div>],
  render: () => (
    <>
      <section aria-label="App" className="overflow-hidden rounded-lg border border-border"><MobileHeader type="app" title="Customers" trailing={trailing} /></section>
      <section aria-label="Detail" className="overflow-hidden rounded-lg border border-border"><MobileHeader type="detail" title="INV-2041" backLabel="Back to invoices" trailing={<ButtonIcon variant="ghost" icon={<Search />} label="Search in invoice" className="min-h-11 min-w-11" showTooltip={false} />} /></section>
      <section aria-label="Brand" className="overflow-hidden rounded-lg border border-border"><MobileHeader type="brand" /></section>
      <section aria-label="Search" className="overflow-hidden rounded-lg border border-border"><MobileHeader type="search" searchPlaceholder="Search customers" /></section>
    </>
  ),
};

/** Large title at the top of a list; it is the page heading. */
export const LargeTitle: Story = {
  args: { size: 'large', title: 'Customers', showTrailing: true },
};

/** Search: typing keeps the query, Cancel clears it. */
export const SearchMode: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [q, setQ] = React.useState('');
    return <MobileHeader type="search" query={q} onQueryChange={setQ} onCancel={() => setQ('')} />;
  },
};

/* Hidden checks */

export const SearchCheck: Story = {
  ...SearchMode,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('search')).toBeVisible();
    const field = canvas.getByRole('searchbox');
    await userEvent.type(field, 'north');
    await expect(field).toHaveValue('north');
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(canvas.getByRole('searchbox')).toHaveValue(''));
  },
};

export const LargeCheck: Story = {
  tags: ['!dev'],
  args: { size: 'large', title: 'Notifications' },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    await expect(canvas.getByRole('banner')).toHaveAttribute('data-size', 'large');
    await expect(canvas.getByRole('banner').getBoundingClientRect().height).toBeGreaterThan(56);
  },
};

export const TitleAsParagraphCheck: Story = {
  tags: ['!dev'],
  render: () => <MobileHeader title="Invoices" titleAs="p" />,
  play: async ({ canvas }) => {
    // The page has its own h1 under the bar: the bar title is plain text.
    await expect(canvas.queryByRole('heading', { level: 1 })).toBeNull();
    await expect(canvas.getByText('Invoices')).toBeVisible();
  },
};

export const ButtonsCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onMenu = fn();
    return <MobileHeader onMenu={onMenu} />;
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[276px] flex-col gap-4"><Story /></div>],
  render: () => (
    <>
      <section aria-label="Detail"><MobileHeader type="detail" title="A very long object name that cannot fit in one line of the bar" trailing={trailing} /></section>
      <section aria-label="Large"><MobileHeader size="large" title="A very long page title that wraps to a second line and then is cut after two lines of text" /></section>
    </>
  ),
  play: async ({ canvas }) => {
    const [bar, large] = canvas.getAllByRole('heading', { level: 1 });
    // One line in the bar, truncated; the large title stops at two lines.
    await expect(bar!.getBoundingClientRect().height).toBeLessThanOrEqual(28);
    await expect(large!.getBoundingClientRect().height).toBeLessThanOrEqual(80);
    await expect(canvas.getByRole('region', { name: 'Detail' }).getBoundingClientRect().width).toBeLessThanOrEqual(276);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
