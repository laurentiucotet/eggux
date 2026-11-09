import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Folder } from '@/components/icons';
import { MentionOption, splitMatch } from './mention-option';

const meta = {
  title: 'Components/Popover/Mention Option',
  component: MentionOption,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'One suggestion in Mention Menu: an Avatar (person) or an icon tile (item), the name with the typed part in brand color, and a muted description. State highlighted = keyboard highlight (aria-selected). Figma: Popover page / Mention Option. Guide: eggux build-ui/components/comments-and-chat.md' } },
  },
  decorators: [Story => <div role="listbox" aria-label="People" className="w-[264px] bg-popover"><Story /></div>],
  args: { match: 'An', name: 'na Berg', description: '@anna · Design' },
} satisfies Meta<typeof MentionOption>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };

// Figma: 264 x 48, Avatar 32, the match in foreground/brand; the name reads in full.
export const Default: Story = {
  args: { onSelect: fn() },
  play: async ({ canvas, args }) => {
    const option = canvas.getByRole('option', { name: /Anna Berg/ });
    await expect(box(option)).toEqual([264, 48]);
    await expect(option).toHaveAttribute('aria-selected', 'false');
    await expect(box(option.querySelector('[data-slot="avatar"], [data-slot=avatar]') ?? option.firstElementChild!)).toEqual([32, 32]);
    const brand = probe('text-brand');
    await expect(getComputedStyle(option.querySelector('mark')!).color).toBe(brand.style.color);
    brand.remove();
    await userEvent.click(option);
    await expect(args.onSelect).toHaveBeenCalledTimes(1);
  },
};

// The four Figma variants: Type person | item x State default | highlighted.
export const Variants: Story = {
  render: args => (
    <div className="flex flex-col gap-1">
      <MentionOption {...args} />
      <MentionOption {...args} highlighted />
      <MentionOption {...args} type="item" match="An" name="nual report 2026.pdf" description="File · Finance" />
      <MentionOption {...args} type="item" match="An" name="alytics" description="Folder · Shared" icon={<Folder />} highlighted />
    </div>
  ),
  play: async ({ canvas }) => {
    const options = canvas.getAllByRole('option');
    await expect(options.map(o => o.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false', 'true']);
    const accent = probe('bg-accent');
    await expect(getComputedStyle(options[1]).backgroundColor).toBe(accent.style.backgroundColor);
    accent.remove();
    // Item: 32 px muted icon tile with a 16 px icon.
    const tile = options[2].querySelector<HTMLElement>('[data-slot="icon-tile"]')!;
    await expect(box(tile)).toEqual([32, 32]);
    await expect(box(tile.querySelector('svg')!)).toEqual([16, 16]);
  },
};

// Show description off: one line, the row stays 48 with the avatar.
export const WithoutDescription: Story = {
  tags: ['!dev'],
  args: { description: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('@anna · Design')).toBeNull();
    await expect(box(canvas.getByRole('option'))[1]).toBe(44);
  },
};

// splitMatch finds the typed part, ignoring case and accents.
export const Stress: Story = {
  tags: ['!dev'],
  render: args => (
    <div className="flex flex-col gap-1">
      <MentionOption {...args} {...splitMatch('Ștefania Constantinescu-Vasilescu de la Acme Holdings', 'ste')} description="@stefania.constantinescu · Finance operations, Bucharest office" />
      <MentionOption {...args} type="item" {...splitMatch('Annual report of Acme Holdings International 2026 final version.pdf', 'xyz')} description="File · Finance · Shared with the whole company" />
    </div>
  ),
  play: async ({ canvas }) => {
    const [first, second] = canvas.getAllByRole('option');
    await expect(first.querySelector('mark')).toHaveTextContent('Ște');
    await expect(second.querySelector('mark')).toBeNull();
    for (const option of [first, second]) {
      await expect(box(option)).toEqual([264, 48]);
      const name = within(option).getByText((_, el) => el?.getAttribute('data-slot') === 'mention-option-name');
      await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    }
  },
};

export const VariantsDark: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Dark' } };
export const VariantsCorporate: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
