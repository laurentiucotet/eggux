import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Byline, type BylineSize } from './byline';

const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#9ec5d8"/><path d="M14 64c0-12 8-20 18-20s18 8 18 20z" fill="#1f2a44"/><circle cx="32" cy="28" r="13" fill="#7a3b1e"/><circle cx="32" cy="30" r="10" fill="#e2b49a"/></svg>');

const meta = {
  title: 'Components/Avatar/Byline',
  component: Byline,
  parameters: {
    docs: { description: { component: 'Who wrote, said or owns something: Avatar, name and one detail (role and company, or date · reading time). sm in dense grids, default under titles and on cards, lg under testimonials. The name links to the profile; the avatar is decorative. Several people: Avatar Group with a label. Figma: Avatar page / Byline. Guide: eggux build-ui/components/avatar.md' } },
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] } },
  args: { name: 'Maria Ilie', description: 'Product designer, Acme' },
} satisfies Meta<typeof Byline>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Size=default: 32 avatar, 12 gap, name 14/20 medium over a 12/16 muted detail: 36 high.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="byline"]')!;
    const avatar = root.querySelector('[data-slot="avatar"]')!;
    const name = canvas.getByText('Maria Ilie');
    await expect(Math.round(box(root).height)).toBe(36);
    await expect(Math.round(box(avatar).width)).toBe(32);
    await expect(Math.round(box(name).left - box(avatar).right)).toBe(12);
    await expect(getComputedStyle(name).fontWeight).toBe('500');
    await expect(getComputedStyle(canvas.getByText('Product designer, Acme')).fontSize).toBe('12px');
    // The avatar is decorative next to the name; its initials come from the name.
    await expect(avatar).toHaveAttribute('aria-hidden', 'true');
    await expect(avatar).toHaveTextContent('MI');
  },
};

const sizes: [BylineSize, number, number, number][] = [['sm', 24, 8, 36], ['default', 32, 12, 36], ['lg', 40, 12, 40]];

export const Sizes: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      {sizes.map(([s]) => <Byline key={s} {...args} size={s} />)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const roots = canvasElement.querySelectorAll('[data-slot="byline"]');
    for (const [i, [, a, g, h]] of sizes.entries()) {
      const avatar = roots[i].querySelector('[data-slot="avatar"]')!;
      const name = roots[i].querySelector('[data-slot="byline-name"]')!;
      await expect(Math.round(box(avatar).width)).toBe(a);
      await expect(Math.round(box(name).left - box(avatar).right)).toBe(g);
      await expect(Math.round(box(roots[i]).height)).toBe(h);
    }
  },
};

// The name links to the profile; dates go in <time>; a photo avatar.
export const WithLinkAndDate: Story = {
  args: {
    href: '#profile-maria-ilie',
    avatar: { type: 'image', src: photo },
    description: <><time dateTime="2026-10-12">12 Oct 2026</time> · 6 min read</>,
  },
  play: async ({ canvas, canvasElement }) => {
    const link = canvas.getByRole('link', { name: 'Maria Ilie' });
    await expect(link).toHaveAttribute('href', '#profile-maria-ilie');
    await expect(canvasElement.querySelector('time')).toHaveAttribute('dateTime', '2026-10-12');
    link.addEventListener('click', e => e.preventDefault());
    const onClick = fn();
    link.addEventListener('click', onClick);
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onClick).toHaveBeenCalledTimes(1);
  },
};

// Show description and Show avatar off: the name alone, 20 high.
export const NameOnly: Story = {
  args: { showDescription: false, showAvatar: false },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="byline"]')!;
    await expect(root.querySelector('[data-slot="avatar"]')).toBeNull();
    await expect(root.querySelector('[data-slot="byline-description"]')).toBeNull();
    await expect(Math.round(box(root).height)).toBe(20);
  },
};

// Stress: long name and detail truncate to one line in 276 and 128 columns; the avatar keeps its size.
export const Stress: Story = {
  tags: ['!dev'],
  render: args => (
    <div className="flex flex-col gap-4">
      {[276, 128].map(w => (
        <div key={w} className="flex" style={{ width: w }}>
          <Byline {...args} name="Alexandra-Maria Popescu-Ionescu" description="Principal product designer, Acme Payments and Billing" data-testid={`w${w}`} />
        </div>
      ))}
      <div className="flex"><Byline {...args} size="sm" name="Ana" description="CFO" data-testid="short" /></div>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const w of [276, 128]) {
      const root = canvas.getByTestId(`w${w}`);
      await expect(Math.round(box(root).width)).toBeLessThanOrEqual(w);
      await expect(Math.round(box(root).height)).toBe(36);
      await expect(Math.round(box(root.querySelector('[data-slot="avatar"]')!).width)).toBe(32);
      const name = root.querySelector('[data-slot="byline-name"]')!;
      await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    }
    // Hugs short text.
    await expect(Math.round(box(canvas.getByTestId('short')).width)).toBeLessThan(80);
  },
};

export const DefaultDark: Story = { ...WithLinkAndDate, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...WithLinkAndDate, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
