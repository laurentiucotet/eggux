import type * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Bold, Calendar, Italic, LayoutGrid, List, Monitor, Moon, Sun, Underline } from '@/components/icons';
import { ToggleGroup, ToggleGroupItem, type ToggleGroupProps, type ToggleGroupSize, type ToggleGroupVariant } from './toggle-group';
import { TooltipProvider } from './tooltip';

// Story args: the single and multiple props in one shape (Storybook cannot infer a union).
type StoryArgs = Omit<ToggleGroupProps, 'type' | 'value' | 'defaultValue' | 'onValueChange'> & {
  type: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
};
const g = (args: StoryArgs) => args as unknown as ToggleGroupProps;

const meta: Meta<StoryArgs> = {
  title: 'Components/Toggle Group/Toggle Group',
  component: ToggleGroup as unknown as React.ComponentType<StoryArgs>,
  parameters: {
    docs: { description: { component: 'A group of Toggle Group Items that sets a value: view mode, period, formatting. type="single" (radios, one always selected) or "multiple" (toggle buttons). Variant default, outline (bordered group) or segmented (one muted track, 2-4 short options, the selected item a raised pill). Size is set once for every item: sm in toolbars and Chart Card headers, lg for billing period and theme. Switching panels is Tabs; independent actions are a Button Group; many options are a Select. Figma: Toggle Group page / Toggle Group, Toggle Group Item. Guide: eggux build-ui/components/tabs.md' } },
  },
  decorators: [Story => <TooltipProvider delayDuration={0}><Story /></TooltipProvider>],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'outline', 'segmented'] },
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
  },
  args: { type: 'single', 'aria-label': 'Period', defaultValue: 'week', onValueChange: fn() },
};
export default meta;
type Story = StoryObj<StoryArgs>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); const s = getComputedStyle(p); return { bg: s.backgroundColor, color: s.color, border: s.borderTopColor, remove: () => p.remove() }; };
const items = (root: Element) => [...root.querySelectorAll<HTMLElement>('[data-slot="toggle-group-item"]')];
const gap = (a: Element, b: Element) => Math.round(b.getBoundingClientRect().left - a.getBoundingClientRect().right);

const period = (
  <>
    <ToggleGroupItem value="day" label="Day" />
    <ToggleGroupItem value="week" label="Week" />
    <ToggleGroupItem value="month" label="Month" />
  </>
);

// Figma default: Day / Week / Month, Week selected, items 36 high with 10 px sides, 4 px apart.
export const Default: Story = {
  render: args => <ToggleGroup {...g(args)}>{period}</ToggleGroup>,
  play: async ({ canvas, args }) => {
    canvas.getByRole('radiogroup', { name: 'Period' });
    const week = canvas.getByRole('radio', { name: 'Week' });
    const month = canvas.getByRole('radio', { name: 'Month' });
    await expect(week).toHaveAttribute('aria-checked', 'true');
    await expect(week).toHaveAttribute('data-state', 'on');
    const all = canvas.getAllByRole('radio');
    for (const item of all) {
      await expect(box(item)[1]).toBe(36);
      await expect(getComputedStyle(item).paddingLeft).toBe('10px');
    }
    await expect(gap(all[0], all[1])).toBe(4);
    const ref = probe('bg-accent text-accent-foreground');
    await expect(getComputedStyle(week).backgroundColor).toBe(ref.bg);
    await expect(getComputedStyle(week).color).toBe(ref.color);
    ref.remove();
    await userEvent.click(month);
    await expect(args.onValueChange).toHaveBeenCalledWith('month');
    await expect(month).toHaveAttribute('aria-checked', 'true');
    await expect(week).toHaveAttribute('aria-checked', 'false');
    // Single choice never ends up empty: clicking the selected item keeps it.
    await userEvent.click(month);
    await expect(month).toHaveAttribute('aria-checked', 'true');
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
  },
};

const variants: ToggleGroupVariant[] = ['default', 'outline', 'segmented'];

// Figma Variant: default, outline (border/input pill with shadow/xs) and segmented (background/muted
// track, 4 px padding, 28 high items, the selected one background/default with shadow/xs).
export const Variants: Story = {
  render: args => (
    <div className="flex flex-col items-start gap-4">
      {variants.map(v => (
        <ToggleGroup key={v} {...g(args)} variant={v} aria-label={`Period, ${v}`}>{period}</ToggleGroup>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const ref = probe('border border-input');
    const [def, outline, seg] = variants.map(v => canvas.getByRole('radiogroup', { name: `Period, ${v}` }));
    // All three groups are 36 high: the outline border is inside, the track adds 4 px around 28.
    for (const g of [def, outline, seg]) await expect(box(g)[1]).toBe(36);
    const border = getComputedStyle(outline, '::after');
    await expect(border.borderTopColor).toBe(ref.border);
    await expect(border.borderTopWidth).toBe('1px');
    await expect(border.position).toBe('absolute');
    await expect(getComputedStyle(outline).boxShadow).not.toBe('none');
    ref.remove();
    const muted = probe('bg-muted');
    await expect(getComputedStyle(seg).backgroundColor).toBe(muted.bg);
    muted.remove();
    await expect(getComputedStyle(seg).paddingLeft).toBe('4px');
    const segItems = items(seg);
    for (const i of segItems) await expect(box(i)[1]).toBe(28);
    await expect(getComputedStyle(segItems[0]).paddingLeft).toBe('12px');
    await expect(gap(segItems[0], segItems[1])).toBe(4);
    const bg = probe('bg-background');
    await expect(getComputedStyle(segItems[1]).backgroundColor).toBe(bg.bg);
    bg.remove();
    await expect(getComputedStyle(segItems[1]).boxShadow).not.toBe('none');
    await expect(getComputedStyle(segItems[0]).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  },
};

const sizes: ToggleGroupSize[] = ['sm', 'default', 'lg'];
const itemH: Record<ToggleGroupSize, number> = { sm: 32, default: 36, lg: 40 };
const segH: Record<ToggleGroupSize, number> = { sm: 24, default: 28, lg: 32 };
const sides: Record<ToggleGroupSize, string> = { sm: '8px', default: '10px', lg: '12px' };
const segSides: Record<ToggleGroupSize, string> = { sm: '10px', default: '12px', lg: '16px' };

// Figma Toggle Group Item Size: sm 32 / default 36 / lg 40 (segmented 24 / 28 / 32 in a track 4 px larger).
export const Sizes: Story = {
  render: args => (
    <div className="flex flex-col items-start gap-4">
      {sizes.map(s => (
        <div key={s} className="flex items-center gap-6">
          <ToggleGroup {...g(args)} size={s} aria-label={`Period ${s}`}>{period}</ToggleGroup>
          <ToggleGroup {...g(args)} size={s} variant="segmented" aria-label={`Period segmented ${s}`}>{period}</ToggleGroup>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const s of sizes) {
      const plain = canvas.getByRole('radiogroup', { name: `Period ${s}` });
      const seg = canvas.getByRole('radiogroup', { name: `Period segmented ${s}` });
      for (const i of items(plain)) {
        await expect(box(i)[1]).toBe(itemH[s]);
        await expect(getComputedStyle(i).paddingLeft).toBe(sides[s]);
      }
      for (const i of items(seg)) {
        await expect(box(i)[1]).toBe(segH[s]);
        await expect(getComputedStyle(i).paddingLeft).toBe(segSides[s]);
      }
      await expect(box(seg)[1]).toBe(segH[s] + 8);
    }
  },
};

// Figma "Example / view switch" and "theme switch": icons with labels, and icon-only square items
// with an aria-label and a tooltip.
export const WithIcons: Story = {
  render: args => (
    <div className="flex flex-col items-start gap-4">
      <ToggleGroup {...g({ ...args, defaultValue: "board" })} variant="outline" aria-label="View">
        <ToggleGroupItem value="list" label="List" icon={<List aria-hidden="true" />} />
        <ToggleGroupItem value="board" label="Board" icon={<LayoutGrid aria-hidden="true" />} />
        <ToggleGroupItem value="calendar" label="Calendar" icon={<Calendar aria-hidden="true" />} />
      </ToggleGroup>
      <ToggleGroup {...g({ ...args, defaultValue: "system" })} variant="outline" aria-label="Theme">
        <ToggleGroupItem value="light" label="Light" showLabel={false} icon={<Sun aria-hidden="true" />} />
        <ToggleGroupItem value="dark" label="Dark" showLabel={false} icon={<Moon aria-hidden="true" />} />
        <ToggleGroupItem value="system" label="System" showLabel={false} icon={<Monitor aria-hidden="true" />} />
      </ToggleGroup>
      <ToggleGroup {...g({ ...args, defaultValue: "light" })} variant="segmented" aria-label="Theme, segmented">
        <ToggleGroupItem value="light" label="Light" showLabel={false} icon={<Sun aria-hidden="true" />} />
        <ToggleGroupItem value="dark" label="Dark" showLabel={false} icon={<Moon aria-hidden="true" />} />
        <ToggleGroupItem value="system" label="System" showLabel={false} icon={<Monitor aria-hidden="true" />} />
      </ToggleGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const theme = canvas.getByRole('radiogroup', { name: 'Theme' });
    const dark = canvas.getAllByRole('radio', { name: 'Dark' })[0];
    for (const i of items(theme)) await expect(box(i)).toEqual([36, 36]);
    for (const i of items(canvas.getByRole('radiogroup', { name: 'Theme, segmented' }))) await expect(box(i)).toEqual([28, 28]);
    await expect(box(dark.querySelector('svg')!)).toEqual([16, 16]);
    // The tooltip and the selected state both survive the tooltip wrapper.
    await expect(canvas.getAllByRole('radio', { name: 'System' })[0]).toHaveAttribute('data-state', 'on');
    await userEvent.hover(dark);
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('Dark');
    await userEvent.unhover(dark);
    await userEvent.click(dark);
    await expect(dark).toHaveAttribute('aria-checked', 'true');
    await expect(dark).toHaveAttribute('data-state', 'on');
  },
};

// type="multiple": formatting; a toolbar of toggle buttons with aria-pressed.
export const Multiple: Story = {
  args: { type: 'multiple', defaultValue: ['bold'], 'aria-label': 'Text formatting', size: 'sm' },
  render: args => (
    <ToggleGroup {...g(args)}>
      <ToggleGroupItem value="bold" label="Bold" showLabel={false} icon={<Bold aria-hidden="true" />} />
      <ToggleGroupItem value="italic" label="Italic" showLabel={false} icon={<Italic aria-hidden="true" />} />
      <ToggleGroupItem value="underline" label="Underline" showLabel={false} icon={<Underline aria-hidden="true" />} />
    </ToggleGroup>
  ),
  play: async ({ canvas, args }) => {
    canvas.getByRole('toolbar', { name: 'Text formatting' });
    const bold = canvas.getByRole('button', { name: 'Bold' });
    const italic = canvas.getByRole('button', { name: 'Italic' });
    await expect(box(bold)).toEqual([32, 32]);
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(italic);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['bold', 'italic']);
    await expect(italic).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(bold);
    await expect(bold).toHaveAttribute('aria-pressed', 'false');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['italic']);
  },
};

// Keyboard: one Tab stop on the selected item; arrows move focus (and wrap); Space or Enter
// selects; Tab leaves the group.
export const Keyboard: Story = {
  render: args => (
    <div className="flex items-center gap-3">
      <ToggleGroup {...g(args)}>{period}</ToggleGroup>
      <button type="button" className="text-sm">After</button>
    </div>
  ),
  play: async ({ canvas, args }) => {
    const [day, week, month] = canvas.getAllByRole('radio');
    await userEvent.tab();
    await expect(week).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(week).boxShadow).toContain('0px 0px 0px 4px'));
    await userEvent.keyboard('{ArrowRight}');
    await expect(month).toHaveFocus();
    await expect(week).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard(' ');
    await expect(month).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowRight}');
    await expect(day).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(day).toHaveAttribute('aria-checked', 'true');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('day');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'After' })).toHaveFocus();
  },
};

// Figma State=disabled: 50 % opacity, the value cannot change (one item, or the whole group).
export const Disabled: Story = {
  render: args => (
    <div className="flex flex-col items-start gap-4">
      <ToggleGroup {...g(args)} aria-label="Period, one disabled">
        <ToggleGroupItem value="day" label="Day" />
        <ToggleGroupItem value="week" label="Week" />
        <ToggleGroupItem value="month" label="Month" disabled />
      </ToggleGroup>
      <ToggleGroup {...g(args)} variant="segmented" aria-label="Period, all disabled" disabled>{period}</ToggleGroup>
    </div>
  ),
  play: async ({ canvas, args }) => {
    const one = canvas.getByRole('radiogroup', { name: 'Period, one disabled' });
    const month = items(one)[2];
    await expect(month).toBeDisabled();
    await expect(getComputedStyle(month).opacity).toBe('0.5');
    await userEvent.click(month, { pointerEventsCheck: 0 });
    await expect(month).toHaveAttribute('aria-checked', 'false');
    for (const i of items(canvas.getByRole('radiogroup', { name: 'Period, all disabled' }))) await expect(i).toBeDisabled();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

// Figma "Example / billing period": full width segmented; the items share the track equally.
export const FullWidth: Story = {
  args: { variant: 'segmented', size: 'lg', fullWidth: true, 'aria-label': 'Billing period', defaultValue: 'monthly' },
  render: args => (
    <div className="w-[368px]">
      <ToggleGroup {...g(args)}>
        <ToggleGroupItem value="monthly" label="Monthly" />
        <ToggleGroupItem value="yearly" label="Yearly, save 20%" />
      </ToggleGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Billing period' });
    await expect(box(group)).toEqual([368, 40]);
    const [a, b] = items(group);
    await expect(box(a)[0]).toBe(box(b)[0]);
    await expect(box(a)[1]).toBe(32);
  },
};

// Stress test (Figma "Stress test / Toggle Group"): long labels stay on one line, items never
// shrink, the group hugs its items; full width segmented truncates in a narrow column.
export const Stress: Story = {
  tags: ['!dev'],
  render: args => (
    <div className="flex flex-col items-start gap-4">
      {variants.map(v => (
        <ToggleGroup key={v} {...g(args)} variant={v} aria-label={`Long, ${v}`}>
          <ToggleGroupItem value="day" label="Day" />
          <ToggleGroupItem value="week" label="Week starting on Monday" />
          <ToggleGroupItem value="month" label="Month to date" />
        </ToggleGroup>
      ))}
      <div className="w-[276px]">
        <ToggleGroup {...g(args)} variant="segmented" fullWidth aria-label="Narrow">
          <ToggleGroupItem value="day" label="Daily summary" />
          <ToggleGroupItem value="week" label="Weekly summary" />
          <ToggleGroupItem value="month" label="Monthly summary report" />
        </ToggleGroup>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const v of variants) {
      const g = canvas.getByRole('radiogroup', { name: `Long, ${v}` });
      const all = items(g);
      for (const i of all) {
        const label = i.querySelector('span')!;
        await expect(box(label)[1]).toBe(20);
        await expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth);
      }
      await expect(box(g)[1]).toBe(36);
    }
    const narrow = canvas.getByRole('radiogroup', { name: 'Narrow' });
    await expect(box(narrow)[0]).toBe(276);
    const all = items(narrow);
    for (const i of all) await expect(box(i)[1]).toBe(28);
    const last = all[2].querySelector('span')!;
    await expect(last.scrollWidth).toBeGreaterThan(last.clientWidth);
    // The full label stays the accessible name.
    await expect(canvas.getByRole('radio', { name: 'Monthly summary report' })).toBe(all[2]);
  },
};

export const VariantsDark: Story = { ...Variants, play: undefined, tags: ['!dev'], globals: { theme: 'Dark' } };
export const VariantsCorporate: Story = { ...Variants, play: undefined, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const WithIconsDark: Story = { ...WithIcons, play: undefined, tags: ['!dev'], globals: { theme: 'Dark' } };
