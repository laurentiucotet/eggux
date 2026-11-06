import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Chip, type ChipSize, type ChipTone } from './chip';

const meta = {
  title: 'Components/Chip/Chip',
  component: Chip,
  parameters: {
    docs: { description: { component: 'A pill for quick filters, multi-selection and tags. Tone=default with State=selected marks an active filter (fill and check, not color alone); soft and category tones are tags by meaning. Options: avatar for people filters, leading icon, count ("Open 12") and remove ("Remove <value>"). Hugs its content up to 320; the label truncates. Not clickable: use Badge. Figma: Chip page / Chip. Guide: eggux build-ui/components/badge.md, patterns/search-and-filter.md' } },
  },
  argTypes: {
    tone: { control: 'select', options: ['default', 'soft-info', 'soft-success', 'soft-warning', 'soft-neutral', 'category-1', 'category-2', 'category-3', 'category-4', 'category-5', 'category-6', 'category-7', 'category-8'] },
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
  },
  args: { label: 'This week', onSelectedChange: fn(), defaultSelected: false },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); const s = getComputedStyle(p); return { bg: s.backgroundColor, color: s.color, remove: () => p.remove() }; };

// Figma default: 32 high, 12 px sides, ui/label, border/input on background; click toggles aria-pressed.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const button = canvas.getByRole('button', { name: 'This week' });
    const chip = canvasElement.querySelector('[data-slot="chip"]')!;
    await expect(Math.round(box(chip).height)).toBe(32);
    await expect(Math.round(box(canvas.getByText('This week')).left - box(chip).left)).toBe(13);
    await expect(getComputedStyle(chip).borderRadius).not.toBe('0px');
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onSelectedChange).toHaveBeenCalledWith(true);
    const ref = probe('bg-primary text-primary-foreground');
    // Colors transition (duration-fast): wait for the end state.
    await waitFor(() => expect(getComputedStyle(chip).backgroundColor).toBe(ref.bg));
    await waitFor(() => expect(getComputedStyle(chip).color).toBe(ref.color));
    ref.remove();
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'false');
  },
};

const tones: ChipTone[] = ['default', 'soft-info', 'soft-success', 'soft-warning', 'soft-neutral', 'category-1', 'category-2', 'category-3', 'category-4', 'category-5', 'category-6', 'category-7', 'category-8'];
const toneLabels: Record<ChipTone, string> = {
  default: 'All', 'soft-info': 'Design', 'soft-success': 'Approved', 'soft-warning': 'Needs review', 'soft-neutral': 'Other',
  'category-1': 'Payments', 'category-2': 'Billing', 'category-3': 'Support', 'category-4': 'Sales', 'category-5': 'Marketing', 'category-6': 'Finance', 'category-7': 'Legal', 'category-8': 'People',
};

export const Tones: Story = {
  render: args => (
    <div className="flex max-w-xl flex-wrap gap-2">
      {tones.map(t => <Chip key={t} {...args} tone={t} label={toneLabels[t]} />)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const chips = canvasElement.querySelectorAll('[data-slot="chip"]');
    await expect(chips).toHaveLength(13);
    for (const [i, t] of tones.entries()) {
      if (t === 'default') continue;
      const ref = probe(`bg-[var(--badge-${t}-bg)] text-[var(--badge-${t}-fg)]`);
      await waitFor(() => expect(getComputedStyle(chips[i]).backgroundColor).toBe(ref.bg));
      await waitFor(() => expect(getComputedStyle(chips[i]).color).toBe(ref.color));
      ref.remove();
    }
  },
};

const sizes: [ChipSize, number, number, number][] = [['sm', 24, 8, 12], ['default', 32, 12, 14], ['lg', 40, 16, 14]];

export const Sizes: Story = {
  render: args => (
    <div className="flex items-center gap-3">
      {sizes.map(([s]) => <Chip key={s} {...args} size={s} showLeadingIcon />)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const chips = canvasElement.querySelectorAll('[data-slot="chip"]');
    const iconSizes = [14, 16, 16];
    for (const [i, [, h, pad, font]] of sizes.entries()) {
      await expect(Math.round(box(chips[i]).height)).toBe(h);
      const icon = chips[i].querySelector('svg')!;
      // Padding is measured inside the 1 px border.
      await expect(Math.round(box(icon).left - box(chips[i]).left)).toBe(pad + 1);
      await expect(Math.round(box(icon).width)).toBe(iconSizes[i]);
      await expect(getComputedStyle(chips[i]).fontSize).toBe(`${font}px`);
    }
  },
};

// State=selected: primary fill, and with Show leading icon the icon becomes a check.
export const Selected: Story = {
  args: { defaultSelected: true, showLeadingIcon: true },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('button', { name: 'This week' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvasElement.querySelector('svg')).toHaveAttribute('data-icon', 'check');
    await expect(canvasElement.querySelector('[data-slot="chip"]')).toHaveAttribute('data-state', 'selected');
  },
};

// Options: avatar (people filter), count in the accessible name, remove as its own button.
export const Options: Story = {
  render: args => {
    const onRemove = fn();
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Chip {...args} label="Ana Popescu" avatar={{ initials: 'AP' }} />
        <Chip {...args} label="Open" count={12} />
        <Chip label="Unpaid" showRemove onRemove={onRemove} data-testid="removable" />
        <Chip {...args} size="lg" label="Mihai Ionescu" avatar={{ initials: 'MI' }} showRemove onRemove={onRemove} />
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const chips = canvasElement.querySelectorAll('[data-slot="chip"]');
    // Avatar xs (20) 6 px from the edge; sm (24) 8 px on lg.
    const a0 = chips[0].querySelector('[data-slot="avatar"]')!;
    await expect(Math.round(box(a0).width)).toBe(20);
    await expect(Math.round(box(a0).left - box(chips[0]).left)).toBe(6 + 1);
    const a3 = chips[3].querySelector('[data-slot="avatar"]')!;
    await expect(Math.round(box(a3).width)).toBe(24);
    await expect(Math.round(box(a3).left - box(chips[3]).left)).toBe(8 + 1);
    await expect(canvas.getByRole('button', { name: /^Open ?, 12 results$/ })).toBeVisible();
    const remove = canvas.getByRole('button', { name: 'Remove Unpaid' });
    await expect(Math.round(box(remove).width)).toBe(16);
    await expect(Math.round(box(chips[2]).right - box(remove).right)).toBe(12 + 1);
    // A chip with only remove has no toggle: the label is plain text.
    await expect(canvas.queryByRole('button', { name: 'Unpaid' })).toBeNull();
    await userEvent.click(remove);
  },
};

// Disabled: 50% opacity, neither the chip nor its x can be used.
export const Disabled: Story = {
  args: { disabled: true, showRemove: true, onRemove: fn() },
  play: async ({ canvas, canvasElement, args }) => {
    const button = canvas.getByRole('button', { name: 'This week' });
    await expect(button).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Remove This week' })).toBeDisabled();
    await expect(getComputedStyle(canvasElement.querySelector('[data-slot="chip"]')!).opacity).toBe('0.5');
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onSelectedChange).not.toHaveBeenCalled();
  },
};

// Keyboard: Tab reaches the chip (focus ring on the pill), Enter and Space toggle, Tab reaches the x.
export const Keyboard: Story = {
  args: { showRemove: true, onRemove: fn() },
  play: async ({ canvas, canvasElement, args }) => {
    const button = canvas.getByRole('button', { name: 'This week' });
    const chip = canvasElement.querySelector('[data-slot="chip"]')!;
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(chip).boxShadow).toContain('0px 0px 0px 4px'));
    await userEvent.keyboard('{Enter}');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard(' ');
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Remove This week' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onRemove).toHaveBeenCalledTimes(1);
  },
};

// Stress: a long label truncates at 320 and inside a 276 column; avatar, count and x keep their size.
export const Stress: Story = {
  tags: ['!dev'],
  render: args => (
    <div className="flex flex-col items-start gap-3">
      <Chip {...args} label="Invoices waiting for approval from the Acme finance team" data-testid="long" />
      <div className="flex w-[276px]">
        <Chip {...args} label="Alexandra-Maria Popescu-Ionescu" avatar={{ initials: 'AP' }} count={1284} showRemove onRemove={fn()} data-testid="all" />
      </div>
      <Chip {...args} label="EU" size="sm" data-testid="short" />
    </div>
  ),
  play: async ({ canvas }) => {
    const long = canvas.getByTestId('long').closest('[data-slot="chip"]')!;
    await expect(Math.round(box(long).width)).toBe(320);
    await expect(Math.round(box(long).height)).toBe(32);
    const label = long.querySelector('[data-slot="chip-label"]')!;
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    const all = canvas.getByTestId('all').closest('[data-slot="chip"]')!;
    await expect(Math.round(box(all).width)).toBeLessThanOrEqual(276);
    await expect(Math.round(box(all.querySelector('[data-slot="avatar"]')!).width)).toBe(20);
    await expect(Math.round(box(all.querySelector('[data-slot="chip-remove"]')!).width)).toBe(16);
    await expect(all.querySelector('[data-slot="chip-count"]')).toHaveTextContent('1284');
    const short = canvas.getByTestId('short').closest('[data-slot="chip"]')!;
    await expect(Math.round(box(short).height)).toBe(24);
  },
};

const themes = (story: Story) => ({ ...story, tags: ['!dev'] });
export const TonesDark: Story = { ...themes(Tones), globals: { theme: 'Dark' } };
export const TonesCorporate: Story = { ...themes(Tones), globals: { theme: 'Corporate Light' } };
export const SelectedDark: Story = { ...themes(Selected), globals: { theme: 'Dark' } };
export const OptionsDark: Story = { ...themes(Options), globals: { theme: 'Dark' } };
