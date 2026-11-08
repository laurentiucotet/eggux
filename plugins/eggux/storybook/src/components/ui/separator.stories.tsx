import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Button } from './button';
import { Separator } from './separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Line between groups inside cards, sidebars, popovers and toolbars. Decorative by default (hidden from screen readers); use decorative={false} only between real sections. Optional short label ("or continue with", "Today"). Not for single list items; inside a menu use Menu Separator. Figma: Separator page / Separator. Guide: eggux build-ui/components/card.md' } },
  },
  decorators: [Story => <div className="w-[224px]"><Story /></div>],
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;

const size = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };

// Figma Orientation=horizontal, Spacing=none: 224 x 1, border/default.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const line = canvasElement.querySelector('[data-slot="separator"]') as HTMLElement;
    await expect(size(line)).toEqual([224, 1]);
    const ref = probe('bg-border');
    await expect(getComputedStyle(line).backgroundColor).toBe(ref.style.backgroundColor);
    ref.remove();
    // Decorative: no separator role is exposed.
    await expect(line).toHaveAttribute('role', 'none');
  },
};

// Spacing sm = 4 each side (9 high), md = 8 (17 high).
export const Spacing: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col">
      <div data-testid="none"><Separator spacing="none" /></div>
      <div data-testid="sm"><Separator spacing="sm" /></div>
      <div data-testid="md"><Separator spacing="md" /></div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(size(canvas.getByTestId('none'))).toEqual([224, 1]);
    await expect(size(canvas.getByTestId('sm'))).toEqual([224, 9]);
    await expect(size(canvas.getByTestId('md'))).toEqual([224, 17]);
  },
};

// Vertical: 1 x 24 (fills the toolbar height), spacing adds width: sm 9, md 17.
export const Vertical: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-4">
      <div data-testid="none"><Separator orientation="vertical" /></div>
      <div data-testid="sm"><Separator orientation="vertical" spacing="sm" /></div>
      <div data-testid="md"><Separator orientation="vertical" spacing="md" /></div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(size(canvas.getByTestId('none'))).toEqual([1, 24]);
    await expect(size(canvas.getByTestId('sm'))).toEqual([9, 24]);
    await expect(size(canvas.getByTestId('md'))).toEqual([17, 24]);
    await expect(canvasElement.querySelector('[data-orientation="vertical"]')).toBeTruthy();
  },
};

export const InToolbar: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[360px]"><Story /></div>],
  render: () => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm">Bold</Button>
      <Button variant="ghost" size="sm">Italic</Button>
      <Separator orientation="vertical" spacing="sm" />
      <Button variant="ghost" size="sm">Link</Button>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('separator')).toBeNull();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveFocus();
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Link' })).toHaveFocus();
  },
};

// Semantic: only between real sections.
export const Semantic: Story = {
  args: { decorative: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('separator')).toBeVisible();
  },
};

// Show label: "or continue with" in the middle (ui/caption, foreground/muted), 12 px gaps, row 16 high + 8 px spacing.
export const WithLabel: Story = {
  args: { label: 'or continue with', spacing: 'md' },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const text = canvas.getByText('or continue with');
    await expect(size(canvasElement.querySelector('[data-slot="separator"]')!)).toEqual([368, 32]);
    await expect(size(text)[1]).toBe(16);
    const lines = canvasElement.querySelectorAll('[data-slot="separator-line"]');
    await expect(lines).toHaveLength(2);
    await expect(Math.round(lines[0].getBoundingClientRect().width)).toBeGreaterThan(100);
    await expect(Math.round(text.getBoundingClientRect().left - lines[0].getBoundingClientRect().right)).toBe(12);
    await expect(Math.round(lines[1].getBoundingClientRect().left - text.getBoundingClientRect().right)).toBe(12);
    const ref = probe('text-muted-foreground');
    await expect(getComputedStyle(text).color).toBe(ref.style.color);
    ref.remove();
    await expect(size(lines[0])[1]).toBe(1);
    await expect(canvasElement.querySelector('[role="separator"]')).toBeNull();
  },
};

export const LabelledSemantic: Story = {
  args: { label: 'Today', decorative: false, spacing: 'md' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('separator')).toHaveTextContent('Today');
  },
};

// Show start line off: the label at the start, a heading in a thread ("Earlier").
export const StartLineOff: Story = {
  args: { label: 'Earlier', showStartLine: false, spacing: 'md' },
  decorators: [Story => <div className="w-[564px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const text = canvas.getByText('Earlier');
    await expect(canvasElement.querySelectorAll('[data-slot="separator-line"]')).toHaveLength(1);
    await expect(Math.round(text.getBoundingClientRect().left - canvasElement.querySelector('[data-slot="separator"]')!.getBoundingClientRect().left)).toBe(0);
  },
};

// A ghost sm Button in the Label slot: a normal, focusable button; the row grows to 32 (48 with spacing).
export const ButtonLabel: Story = {
  args: { label: <Button variant="ghost" size="sm">Show 3 more</Button>, spacing: 'md' },
  decorators: [Story => <div className="w-[564px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    await expect(size(canvasElement.querySelector('[data-slot="separator"]')!)).toEqual([564, 48]);
    const button = canvas.getByRole('button', { name: 'Show 3 more' });
    await expect(size(button)).toEqual([107, 32]);
    await userEvent.tab();
    await expect(button).toHaveFocus();
  },
};

// Stress: 276 px column and a long label; labels are one line, the lines shrink to zero first.
const longLabel = 'or continue with your Acme workspace account';
export const Narrow276: Story = { tags: ['!dev'],
  args: { label: 'or continue with', spacing: 'md' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    await expect(size(canvasElement.querySelector('[data-slot="separator"]')!)).toEqual([276, 32]);
  },
};

export const LongLabel: Story = { tags: ['!dev'],
  args: { label: longLabel, spacing: 'md' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="separator"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    await expect(canvas.getByText(longLabel)).toBeVisible();
  },
};

// Narrow 50 %: 120 px line.
export const Narrow120: Story = { tags: ['!dev'],
  decorators: [Story => <div className="w-[120px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    await expect(size(canvasElement.querySelector('[data-slot="separator"]')!)).toEqual([120, 1]);
  },
};

// Theme copies: axe checks the labelled separators in each mode (hidden from the sidebar).
const AllThemes = () => (
  <div className="w-[368px]">
    <Separator label="or continue with" spacing="md" />
    <Separator spacing="sm" />
    <Separator label="Earlier" showStartLine={false} />
  </div>
);
export const LabelledDark: Story = { parameters: { controls: { disable: true } }, render: () => <AllThemes />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'Labelled (Dark)' };
export const LabelledCorporate: Story = { parameters: { controls: { disable: true } }, render: () => <AllThemes />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'Labelled (Corporate Light)' };
