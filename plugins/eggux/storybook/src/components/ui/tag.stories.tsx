import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Hash } from '@/components/icons';
import { Tag, type TagTone } from './tag';

const meta = {
  title: 'Components/Select/Tag',
  component: Tag,
  parameters: {
    docs: { description: { component: 'A removable value inside Tag Input, People Picker and multi-select. Tone default (secondary) or category-1 to 8 for labels with a fixed color; Size default 24 in fields, sm 20 in dense fields and table filters. Avatar for people or a leading icon for typed values, not both. The x is a button "Remove <value>" (Backspace and Delete work on it too). Hugs its label up to 192, then truncates. For filters outside a field use Chip; static labels are Badge. Figma: Select page / Tag. Guide: eggux build-ui/components/select.md' } },
  },
  args: { label: 'Design', onRemove: fn() },
} satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const css = (el: Element) => getComputedStyle(el);
const probe = (className: string, prop: 'color' | 'backgroundColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};

// Figma Tone=default, Size=default: 24 high, 8 left / 4 right, 4 gap, radius sm, ui/label-small,
// secondary fill; the x is a 16 px button with a 12 px icon named "Remove Design".
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const tag = canvasElement.querySelector('[data-slot="tag"]')!;
    await expect(box(tag)[1]).toBe(24);
    await expect([css(tag).paddingLeft, css(tag).paddingRight, css(tag).columnGap]).toEqual(['8px', '4px', '4px']);
    await expect(css(tag).backgroundColor).toBe(probe('bg-secondary', 'backgroundColor'));
    await expect(css(tag).color).toBe(probe('text-secondary-foreground', 'color'));
    await expect([css(tag).fontSize, css(tag).lineHeight, css(tag).fontWeight]).toEqual(['12px', '16px', '500']);
    const remove = canvas.getByRole('button', { name: 'Remove Design' });
    await expect(box(remove)).toEqual([16, 16]);
    await expect(box(remove.querySelector('svg')!)).toEqual([12, 12]);
    await userEvent.click(remove);
    await expect(args.onRemove).toHaveBeenCalledTimes(1);
    // Keyboard: Tab reaches the x; Enter, Backspace and Delete remove.
    remove.blur();
    await userEvent.tab();
    await expect(remove).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{Backspace}');
    await userEvent.keyboard('{Delete}');
    await expect(args.onRemove).toHaveBeenCalledTimes(4);
  },
};

const tones: TagTone[] = ['default', 'category-1', 'category-2', 'category-3', 'category-4', 'category-5', 'category-6', 'category-7', 'category-8'];

// Figma Tone: default and category-1..8 (badge/category-N tokens), Size default and sm, avatar and icon options.
function Showcase() {
  return (
    <div className="flex w-[520px] flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {tones.map((t, i) => <Tag key={t} tone={t} label={['Design', 'Sales', 'Urgent', 'Finance', 'Legal', 'Ops', 'Support', 'Marketing', 'Product'][i]} onRemove={() => {}} />)}
      </div>
      <div className="flex flex-wrap gap-2">
        <Tag label="Ana Popescu" avatar={{ initials: 'AP' }} onRemove={() => {}} />
        <Tag label="Approved" showLeadingIcon icon={<Hash />} onRemove={() => {}} />
        <Tag label="Read only" showRemove={false} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Tag size="sm" label="Design" onRemove={() => {}} />
        <Tag size="sm" label="Ana Popescu" avatar={{ initials: 'AP' }} onRemove={() => {}} />
        <Tag size="sm" tone="category-5" label="Marketing" onRemove={() => {}} />
      </div>
    </div>
  );
}

export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Showcase />,
  play: async ({ canvas, canvasElement }) => {
    const sales = canvas.getByText('Sales').closest('[data-slot="tag"]')!;
    await expect(css(sales).backgroundColor).toBe(probe('bg-[var(--badge-category-1-bg)]', 'backgroundColor'));
    await expect(css(sales).color).toBe(probe('text-[var(--badge-category-1-fg)]', 'color'));
    // Avatar xs, 2 px from the left edge, 4 px before the label.
    const person = canvas.getByText('Ana Popescu', { selector: '[data-slot="tag-label"]', ignore: '[data-size="sm"] *' }).closest('[data-slot="tag"]')!;
    const avatar = person.querySelector('[data-slot="avatar"]')!;
    await expect(box(avatar)).toEqual([20, 20]);
    await expect(Math.round(avatar.getBoundingClientRect().left - person.getBoundingClientRect().left)).toBe(2);
    const icon = canvas.getByText('Approved').closest('[data-slot="tag"]')!.querySelector('svg')!;
    await expect(box(icon)).toEqual([12, 12]);
    // No remove: symmetric 8 px sides.
    const plain = canvas.getByText('Read only').closest('[data-slot="tag"]')!;
    await expect(css(plain).paddingRight).toBe('8px');
    // Size=sm: 20 high, 6 / 2 px sides.
    const sm = canvasElement.querySelector('[data-slot="tag"][data-size="sm"]')!;
    await expect(box(sm)[1]).toBe(20);
    await expect([css(sm).paddingLeft, css(sm).paddingRight]).toEqual(['6px', '2px']);
  },
};

// Figma State=disabled: faded, the x is off.
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, canvasElement, args }) => {
    const tag = canvasElement.querySelector('[data-slot="tag"]')!;
    await expect(css(tag).opacity).toBe('0.5');
    await expect(tag).toHaveAttribute('aria-disabled', 'true');
    const remove = canvas.getByRole('button', { name: 'Remove Design' });
    await expect(remove).toBeDisabled();
    await userEvent.click(remove);
    await expect(args.onRemove).not.toHaveBeenCalled();
  },
};

// Stress test: a long label hugs up to 192 (max-w-48) and truncates on one line; the x keeps its size.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex w-[276px] flex-wrap gap-1">
      <Tag label="Customer success and account management" onRemove={() => {}} />
      <Tag label="Elena Radu-Constantinescu" avatar={{ initials: 'ER' }} onRemove={() => {}} />
      <Tag label="UX" onRemove={() => {}} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [long, person, short] = Array.from(canvasElement.querySelectorAll('[data-slot="tag"]'));
    await expect(box(long)).toEqual([192, 24]);
    const label = long.querySelector('[data-slot="tag-label"]') as HTMLElement;
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    await expect(box(long.querySelector('[data-slot="tag-remove"]')!)).toEqual([16, 16]);
    await expect(box(person)[0]).toBeLessThanOrEqual(192);
    await expect(box(short)[0]).toBeLessThan(60);
  },
};

export const TonesDark: Story = { ...Tones, tags: ['!dev'], globals: { theme: 'Dark' } };
export const TonesCorporate: Story = { ...Tones, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
