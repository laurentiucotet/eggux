import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Bot, Users } from '@/components/icons';
import { Avatar, type AvatarSize } from './avatar';

// Sample photo drawn inline (no external URLs): a neutral portrait silhouette.
const samplePhoto = (bg = '#9ec5d8', skin = '#e2b49a', hair = '#7a3b1e') =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><path d="M14 64c0-12 8-20 18-20s18 8 18 20z" fill="#1f2a44"/><circle cx="32" cy="28" r="13" fill="${hair}"/><circle cx="32" cy="30" r="10" fill="${skin}"/></svg>`,
  );

const meta = {
  title: 'Components/Avatar/Avatar',
  component: Avatar,
  parameters: {
    docs: { description: { component: 'A person, team or organization: photo, two initials (the default and the fallback) or an icon (guest, bot, team). Always next to the name or with `name` as its text equivalent. Circle for people, square for companies and workspaces. Status (online, away, busy, offline) or verified in the bottom-right corner, never both. Figma: Avatar page / Avatar, Avatar Status, Avatar Verified. Guide: eggux build-ui/components/avatar.md' } },
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['initials', 'image', 'icon'] },
    size: { control: 'select', options: ['xs', 'sm', 'default', 'lg', 'xl', '2xl', '3xl'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    status: { control: 'select', options: [undefined, 'online', 'away', 'busy', 'offline'] },
  },
  args: { initials: 'AP', name: 'Ana Popescu' },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const px = (n: number) => `${n}px`;
const sizes: [AvatarSize, number][] = [['xs', 20], ['sm', 24], ['default', 32], ['lg', 40], ['xl', 48], ['2xl', 64], ['3xl', 96]];

// Figma default: 32 x 32 circle, two initials (ui/label-small 12/16) on background/muted.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="avatar"]')!;
    const surface = root.querySelector('[data-slot="avatar-surface"]')!;
    await expect(Math.round(box(root).width)).toBe(32);
    await expect(Math.round(box(root).height)).toBe(32);
    await expect(getComputedStyle(surface).borderRadius).not.toBe('0px');
    await expect(canvas.getByText('AP')).toHaveAttribute('aria-hidden', 'true');
    // The text equivalent is the name, not the letters.
    await expect(canvas.getByText('Ana Popescu')).toHaveClass('sr-only');
    await expect(getComputedStyle(canvas.getByText('AP')).fontSize).toBe('12px');
  },
};

export const Sizes: Story = {
  render: args => (
    <div className="flex items-end gap-4">
      {sizes.map(([s]) => <Avatar key={s} {...args} size={s} />)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const avatars = canvasElement.querySelectorAll('[data-slot="avatar"]');
    const fonts = ['12px', '12px', '12px', '14px', '18px', '24px', '30px'];
    for (const [i, [, n]] of sizes.entries()) {
      await expect(Math.round(box(avatars[i]).width)).toBe(n);
      await expect(Math.round(box(avatars[i]).height)).toBe(n);
      await expect(getComputedStyle(avatars[i]).fontSize).toBe(fonts[i]);
    }
  },
};

// Type: initials, image (photo clipped to the shape) and icon (user, bot, users at half the size).
export const Types: Story = {
  render: args => (
    <div className="flex items-center gap-4">
      <Avatar {...args} />
      <Avatar {...args} type="image" src={samplePhoto()} name="Maria Ilie" initials="MI" />
      <Avatar {...args} type="icon" name="Guest" />
      <Avatar {...args} type="icon" icon={<Bot />} name="Acme assistant" />
      <Avatar {...args} type="icon" icon={<Users />} name="Finance team" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const img = await waitFor(() => {
      const el = canvasElement.querySelector('[data-slot="avatar-image"]') as HTMLImageElement;
      expect(el).toBeTruthy();
      return el;
    });
    await expect(Math.round(box(img).width)).toBe(32);
    await expect(img).toHaveAttribute('alt', '');
    const icons = canvasElement.querySelectorAll('[data-type="icon"] svg');
    await expect(icons).toHaveLength(3);
    for (const icon of icons) await expect(Math.round(box(icon).width)).toBe(16);
    await expect(icons[1]).toHaveAttribute('data-icon', 'bot');
  },
};

// Shape=square: radius md (8) up to default, lg (12) from lg up.
export const Shapes: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-4">{sizes.map(([s]) => <Avatar key={s} {...args} size={s} />)}</div>
      <div className="flex items-end gap-4">{sizes.map(([s]) => <Avatar key={s} {...args} size={s} shape="square" initials="AC" name="Acme" />)}</div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const squares = canvasElement.querySelectorAll('[data-shape="square"] [data-slot="avatar-surface"]');
    const radii = [8, 8, 8, 12, 12, 12, 12];
    for (const [i, r] of radii.entries()) await expect(getComputedStyle(squares[i]).borderTopLeftRadius).toBe(px(r));
  },
};

// Avatar Status: a dot in the bottom-right corner with a 2 px ring and the status as text.
export const Status: Story = {
  render: args => (
    <div className="flex items-center gap-4">
      <Avatar {...args} status="online" />
      <Avatar {...args} status="away" initials="MI" name="Mihai Ionescu" />
      <Avatar {...args} status="busy" initials="DC" name="Dana Cristea" />
      <Avatar {...args} status="offline" initials="EB" name="Elena Barbu" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const roots = canvasElement.querySelectorAll('[data-slot="avatar"]');
    const dots = canvasElement.querySelectorAll('[data-slot="avatar-status"]');
    await expect(dots).toHaveLength(4);
    for (const [i, dot] of dots.entries()) {
      await expect(Math.round(box(dot).width)).toBe(10);
      await expect(Math.round(box(dot).right)).toBe(Math.round(box(roots[i]).right));
      await expect(Math.round(box(dot).bottom)).toBe(Math.round(box(roots[i]).bottom));
      await expect(getComputedStyle(dot).boxShadow).toContain('0px 0px 0px 2px');
    }
    // Color is never the only signal: the status is in the text equivalent.
    await expect(roots[1]).toHaveTextContent('Mihai Ionescu, away');
    await expect(new Set([...dots].map(d => getComputedStyle(d).backgroundColor)).size).toBe(4);
    await expect(canvas.getByText(', busy')).toHaveClass('sr-only');
  },
};

const statusSizes = [7, 7, 10, 12, 14, 16, 20];
const verifiedSizes = [10, 12, 14, 16, 18, 22, 28];

// Status and Verified scale with the avatar (Figma instance sizes); verified hides when a status is set.
export const StatusAndVerifiedSizes: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-4">{sizes.map(([s]) => <Avatar key={s} {...args} size={s} status="online" />)}</div>
      <div className="flex items-end gap-4">{sizes.map(([s]) => <Avatar key={s} {...args} size={s} verified initials="AC" name="Acme" />)}</div>
      <Avatar {...args} status="away" verified data-testid="both" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const dots = canvasElement.querySelectorAll('[data-slot="avatar-status"]');
    for (const [i, n] of statusSizes.entries()) await expect(Math.round(box(dots[i]).width)).toBe(n);
    const ticks = canvasElement.querySelectorAll('[data-slot="avatar-verified"]');
    await expect(ticks).toHaveLength(7);
    for (const [i, n] of verifiedSizes.entries()) await expect(Math.round(box(ticks[i]).width)).toBe(n);
    await expect(ticks[0]).toHaveTextContent('verified');
    // Never both on one avatar.
    const both = canvas.getByTestId('both');
    await expect(both.querySelector('[data-slot="avatar-verified"]')).toBeNull();
  },
};

// Stress: long initials cut to two letters, a broken photo falls back to the initials, icon with no name.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar initials="Alexandra-Maria" name="Alexandra-Maria Popescu-Ionescu" size="xs" data-testid="long" />
      <Avatar initials="A" name="Ana" data-testid="short" />
      <Avatar type="image" src="data:image/png;base64,broken" initials="MI" name="Maria Ilie" data-testid="broken" />
      <Avatar type="icon" size="xs" />
      <Avatar size="3xl" status="busy" initials="WWW" name="William Walker" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('long')).toHaveTextContent(/^Al/);
    await expect(canvas.getByText('Al')).toBeVisible();
    await expect(Math.round(box(canvas.getByTestId('long')).width)).toBe(20);
    await expect(canvas.getByText('A')).toBeVisible();
    await waitFor(() => expect(canvas.getByText('MI')).toBeVisible());
    await expect(canvas.getByTestId('broken').querySelector('img')).toBeNull();
    await expect(canvas.getByText('WW')).toBeVisible();
  },
};

const themeStory: Story = { ...Status, tags: ['!dev'] };
export const StatusDark: Story = { tags: ['!dev'], ...themeStory, globals: { theme: 'Dark' } };
export const StatusCorporate: Story = { tags: ['!dev'], ...themeStory, globals: { theme: 'Corporate Light' } };
export const TypesDark: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Dark' } };
