import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { Plus, Search } from '@/components/icons';
import { Button } from './button';
import { Kbd, KbdGroup } from './kbd';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, type TooltipVariant } from './tooltip';

const meta = {
  title: 'Components/Tooltip/Tooltip',
  component: TooltipContent,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Short plain-text hint on hover and keyboard focus, after a short delay; Escape hides it. Same text as the accessible label of an icon-only button. Never links or buttons (use Popover), never the only place for information (touch has no hover). Variant default (primary fill) or light (popover surface), one per product. Title makes it rich, wraps at 280; shortcut adds a Kbd. Figma: Tooltip page / Tooltip. Guide: eggux build-ui/components/tooltip.md' } },
  },
  decorators: [Story => <TooltipProvider delayDuration={0}><Story /></TooltipProvider>],
} satisfies Meta<typeof TooltipContent>;
export default meta;
type Story = StoryObj<typeof meta>;

const content = () => document.body.querySelector('[data-slot="tooltip-content"]') as HTMLElement;
const allContent = () => [...document.body.querySelectorAll<HTMLElement>('[data-slot="tooltip-content"]')];
const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height) };
};

const AddButton = (props: React.ComponentProps<typeof Button>) => (
  <Button size="icon" variant="outline" aria-label="Add to calendar" {...props}><Plus /></Button>
);

// The main behavior: hover and keyboard focus show it, Escape hides it. The visible text is the
// accessible label of the icon-only button.
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild><AddButton /></TooltipTrigger>
      <TooltipContent>Add to calendar</TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Add to calendar' });
    await expect(allContent()).toHaveLength(0);
    await userEvent.hover(button);
    const tip = await screen.findByRole('tooltip');
    await expect(tip).toHaveTextContent('Add to calendar');
    await expect(button).toHaveAttribute('aria-describedby', tip.id);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(allContent()).toHaveLength(0));
    await userEvent.unhover(button);
  },
};

// Keyboard: Tab to the trigger shows the tooltip, Escape hides it, focus stays.
export const Keyboard: Story = {
  ...Default,
  play: async ({ canvas }) => {
    await userEvent.tab();
    const button = canvas.getByRole('button', { name: 'Add to calendar' });
    await expect(button).toHaveFocus();
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('Add to calendar');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(allContent()).toHaveLength(0));
    await expect(button).toHaveFocus();
  },
};

// Delay: with the default 300 ms it is not open straight after hover.
export const ShortDelay: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <TooltipProvider delayDuration={300}><Story /></TooltipProvider>],
  render: Default.render,
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Add to calendar' });
    await userEvent.hover(button);
    await expect(allContent()).toHaveLength(0);
    await waitFor(() => expect(allContent()).toHaveLength(1), { timeout: 1500 });
    await userEvent.unhover(button);
  },
};

type Side = 'top' | 'bottom' | 'left' | 'right';
const sides: Side[] = ['top', 'bottom', 'left', 'right'];

// Open on mount so every Side is on screen. Figma default: 115 x 33 (top/bottom), left/right 28 high.
const Sides = ({ variant }: { variant: TooltipVariant }) => (
  <div className="grid grid-cols-2 gap-x-48 gap-y-24 p-24">
    {sides.map(side => (
      <Tooltip key={side} open>
        <TooltipTrigger asChild><Button variant="outline" size="sm">{side}</Button></TooltipTrigger>
        <TooltipContent side={side} variant={variant}>Add to calendar</TooltipContent>
      </Tooltip>
    ))}
  </div>
);

export const SidesDefault: Story = {
  name: 'Sides',
  render: () => <Sides variant="default" />,
  parameters: { controls: { disable: true }, layout: 'padded' },
  play: async () => {
    const tips = allContent();
    await expect(tips.map(t => t.getAttribute('data-side')).sort()).toEqual(['bottom', 'left', 'right', 'top']);
    // Figma bubble 28 high (6 + 16 + 6); width hugs the label.
    for (const t of tips) await expect(box(t).h).toBe(28);
    await expect(tips[0].querySelector('svg')).not.toBeNull();
    // Primary fill with the matching foreground.
    const ref = document.createElement('span');
    ref.className = 'bg-primary text-primary-foreground rounded-md';
    document.body.append(ref);
    const r = getComputedStyle(ref);
    const s = getComputedStyle(tips[0]);
    await expect(s.backgroundColor).toBe(r.backgroundColor);
    await expect(s.color).toBe(r.color);
    await expect(s.borderTopLeftRadius).toBe(r.borderTopLeftRadius);
    await expect(s.paddingLeft).toBe('12px');
    await expect(s.paddingTop).toBe('6px');
    ref.remove();
  },
};

// Variant=light: popover surface, 1 px border, shadow/md. Figma 116 x 34 (bubble 30 + arrow).
export const SidesLight: Story = {
  name: 'Sides (light)',
  render: () => <Sides variant="light" />,
  parameters: { controls: { disable: true }, layout: 'padded' },
  play: async () => {
    const tips = allContent();
    await expect(tips).toHaveLength(4);
    for (const t of tips) await expect(box(t).h).toBe(30);
    const ref = document.createElement('span');
    ref.className = 'bg-popover text-popover-foreground border border-border shadow-md rounded-md';
    document.body.append(ref);
    const r = getComputedStyle(ref);
    const s = getComputedStyle(tips[0]);
    await expect(s.backgroundColor).toBe(r.backgroundColor);
    await expect(s.color).toBe(r.color);
    await expect(s.borderTopColor).toBe(r.borderTopColor);
    await expect(s.borderTopWidth).toBe('1px');
    await expect(s.boxShadow).toBe(r.boxShadow);
    ref.remove();
  },
};

// Rich tooltip (Figma "Example / rich tooltip and shortcut"): title, up to three lines, wraps at 280.
const richText = 'Adds the event to your Acme calendar and sends an invitation to everyone on the invoice review.';
export const Rich: Story = {
  render: () => (
    <div className="p-24">
      <Tooltip open>
        <TooltipTrigger asChild><AddButton /></TooltipTrigger>
        <TooltipContent title="Schedule">{richText}</TooltipContent>
      </Tooltip>
    </div>
  ),
  parameters: { controls: { disable: true }, layout: 'padded' },
  play: async () => {
    const tip = content();
    await expect(tip.querySelector('[data-slot="tooltip-title"]')).toHaveTextContent('Schedule');
    // Title 20 + 2 gap + three 16 px lines + 12 padding.
    await expect(box(tip).w).toBeLessThanOrEqual(280 + 24);
    await expect(box(tip).h).toBeGreaterThan(28 + 20);
    await expect(getComputedStyle(tip.querySelector('[data-slot="tooltip-title"]')!).fontWeight).toBe('500');
  },
};

// Show shortcut: a Kbd after the text (Figma 99 x 37 for "Search" + ⌘K). The Kbd keeps its muted key look.
export const WithShortcut: Story = {
  render: () => (
    <div className="p-24">
      <Tooltip open>
        <TooltipTrigger asChild><Button size="icon" variant="outline" aria-label="Search"><Search /></Button></TooltipTrigger>
        <TooltipContent shortcut={<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>}>Search</TooltipContent>
      </Tooltip>
    </div>
  ),
  parameters: { controls: { disable: true }, layout: 'padded' },
  play: async () => {
    const tip = content();
    const group = tip.querySelector('[data-slot="kbd-group"]')!;
    await expect(tip.querySelectorAll('kbd')).toHaveLength(2);
    await expect(box(group).h).toBe(20);
    // 6 + 20 + 6 high: the key is taller than the 16 px label.
    await expect(box(tip).h).toBe(32);
    const ref = document.createElement('span');
    ref.className = 'bg-muted text-foreground';
    document.body.append(ref);
    const key = getComputedStyle(tip.querySelector('kbd')!);
    await expect(key.backgroundColor).toBe(getComputedStyle(ref).backgroundColor);
    await expect(key.color).toBe(getComputedStyle(ref).color);
    ref.remove();
  },
};

export const RichWithShortcutLight: Story = {
  render: () => (
    <div className="p-24">
      <Tooltip open>
        <TooltipTrigger asChild><AddButton /></TooltipTrigger>
        <TooltipContent variant="light" title="Schedule" shortcut={<KbdGroup><Kbd>⌘</Kbd><Kbd>E</Kbd></KbdGroup>}>Add to calendar</TooltipContent>
      </Tooltip>
    </div>
  ),
  parameters: { controls: { disable: true }, layout: 'padded' },
  play: async () => {
    const tip = content();
    await expect(tip).toHaveAttribute('data-variant', 'light');
    await expect(tip.querySelectorAll('kbd')).toHaveLength(2);
    await expect(tip.querySelector('[data-slot="tooltip-title"]')).toHaveTextContent('Schedule');
  },
};

// Rule: a tooltip never holds links or buttons.
export const NoInteractiveContent: Story = {
  ...Default,
  play: async ({ canvas }) => {
    await userEvent.hover(canvas.getByRole('button', { name: 'Add to calendar' }));
    await screen.findByRole('tooltip');
    await expect(content().querySelector('a, button, input')).toBeNull();
    await userEvent.unhover(canvas.getByRole('button', { name: 'Add to calendar' }));
  },
};

// Stress (Figma "Stress test / Tooltip"): long text wraps at 280 in the 276 and 368 px columns.
const longLabel = 'Exports every invoice from the last twelve months for Acme Corporation, including credit notes, as one file that you can send to your accountant.';
const Stress = ({ width }: { width: number }) => (
  <div className="p-6" style={{ width }}>
    <div className="pt-28">
      <Tooltip open>
        <TooltipTrigger asChild><AddButton /></TooltipTrigger>
        <TooltipContent title="Export invoices">{longLabel}</TooltipContent>
      </Tooltip>
    </div>
  </div>
);
export const Narrow276: Story = { tags: ['!dev'],
  render: () => <Stress width={276} />,
  parameters: { controls: { disable: true }, layout: 'padded' },
  play: async () => {
    const tip = content();
    await expect(box(tip).w).toBeLessThanOrEqual(280 + 24);
    await expect(tip.scrollWidth).toBeLessThanOrEqual(tip.clientWidth);
    await expect(box(tip).h).toBeGreaterThan(60);
  },
};
export const Narrow368: Story = { tags: ['!dev'],
  render: () => <Stress width={368} />,
  parameters: { controls: { disable: true }, layout: 'padded' },
  play: async () => {
    const tip = content();
    await expect(box(tip).w).toBeLessThanOrEqual(280 + 24);
    await expect(tip.scrollWidth).toBeLessThanOrEqual(tip.clientWidth);
  },
};

// Theme copies (hidden from the sidebar, still run in npm test): axe checks the contrast of both
// Variants and of the shortcut key in each mode.
const Both = () => (
  <div className="flex gap-32 p-24 pt-28">
    {(['default', 'light'] as const).map(v => (
      <Tooltip key={v} open>
        <TooltipTrigger asChild><Button size="icon" variant="outline" aria-label={`Search ${v}`}><Search /></Button></TooltipTrigger>
        <TooltipContent variant={v} title="Search" shortcut={<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>}>Find anything in Acme</TooltipContent>
      </Tooltip>
    ))}
  </div>
);
const bothPlay = async () => {
  await expect(allContent()).toHaveLength(2);
};
export const BothVariantsDark: Story = { render: () => <Both />, parameters: { controls: { disable: true },  layout: 'padded' }, tags: ['!dev'], globals: { theme: 'Dark' }, play: bothPlay };
export const BothVariantsCorporate: Story = { render: () => <Both />, parameters: { controls: { disable: true },  layout: 'padded' }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, play: bothPlay };
export const BothVariantsLight: Story = { render: () => <Both />, parameters: { controls: { disable: true },  layout: 'padded' }, tags: ['!dev'], play: bothPlay };
