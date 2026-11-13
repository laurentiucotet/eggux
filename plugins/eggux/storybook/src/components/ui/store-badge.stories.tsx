import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { StoreBadge } from './store-badge';

type Args = { store: 'app-store' | 'google-play' };

const meta = {
  title: 'Components/Mobile/Store Badge',
  parameters: {
    docs: {
      description: {
        component:
          'The app store download badge: store mark, a small line and the store name. It follows the theme (dark in Light, light in Dark), is never narrower than its artwork and links to the listing. One per store, same height, 8 to 12 px apart, App Store first. Figma: Mobile page / Store Badge. Guide: eggux build-ui/patterns/mobile.md',
      },
    },
  },
  args: { store: 'app-store' },
  argTypes: {
    store: { name: 'Store', control: 'inline-radio', options: ['app-store', 'google-play'], description: 'Which store the badge links to.', table: { category: 'Badge' } },
  },
  render: ({ store }) => <StoreBadge store={store} href="#listing" />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /Download on the App Store/ });
    await expect(link).toHaveAttribute('href', '#listing');
    await expect(Math.round(link.getBoundingClientRect().height)).toBe(58);
    await expect(link.getBoundingClientRect().width).toBeGreaterThanOrEqual(163);
    await expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
};

/** The two badges together, App Store first, 8 px apart. */
export const Pair: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <StoreBadge store="app-store" href="#app-store" />
      <StoreBadge store="google-play" href="#google-play" />
    </div>
  ),
};

/* Hidden checks */

export const PlayCheck: Story = {
  tags: ['!dev'],
  args: { store: 'google-play' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /Get it on Google Play/ });
    await expect(Math.round(link.getBoundingClientRect().height)).toBe(58);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[180px]"><Story /></div>],
  render: () => (
    <div className="flex flex-col gap-2">
      <StoreBadge store="app-store" />
      <StoreBadge store="google-play" />
    </div>
  ),
  play: async ({ canvas }) => {
    // Never narrower than the artwork: stacked, both keep 163 px or more and the same height.
    const [a, b] = canvas.getAllByRole('link');
    await expect(a!.getBoundingClientRect().width).toBeGreaterThanOrEqual(163);
    await expect(Math.round(a!.getBoundingClientRect().height)).toBe(Math.round(b!.getBoundingClientRect().height));
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
