import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Bold, Italic, Pin, Star, Underline } from '@/components/icons';
import { Kbd, KbdGroup } from './kbd';
import { Toggle, type ToggleSize, type ToggleVariant } from './toggle';
import { TooltipProvider } from './tooltip';

const meta = {
  title: 'Components/Toggle Group/Toggle',
  component: Toggle,
  parameters: {
    docs: { description: { component: 'One on/off button with a pressed state: bold, pin, mute, captions, favorite. Icon only by default (square, aria-label and a Tooltip with the shortcut); Show label for text. default in toolbars and players, outline on plain surfaces. Pressed is background/accent with aria-pressed; the icon and the name do not change with the state. One choice out of several is a Toggle Group, a setting saved with a form is a Switch, a one-off action is a Button Icon. Figma: Toggle Group page / Toggle. Guides: eggux build-ui/components/button.md, rich-text-editor.md, tabs.md' } },
  },
  decorators: [Story => <TooltipProvider delayDuration={0}><Story /></TooltipProvider>],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
  },
  args: { label: 'Bold', icon: <Bold aria-hidden="true" />, onPressedChange: fn() },
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); const s = getComputedStyle(p); return { bg: s.backgroundColor, color: s.color, border: s.borderTopColor, remove: () => p.remove() }; };

// Figma default: Variant=default, Size=default, icon only (Icon/bold), 36 × 36, 16 px icon.
export const Default: Story = {
  args: { shortcut: <KbdGroup><Kbd>⌘</Kbd><Kbd>B</Kbd></KbdGroup> },
  play: async ({ canvas, args }) => {
    const toggle = canvas.getByRole('button', { name: 'Bold' });
    await expect(box(toggle)).toEqual([36, 36]);
    await expect(box(toggle.querySelector('svg')!)).toEqual([16, 16]);
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(toggle).toHaveAttribute('data-state', 'off');
    // Icon only: the tooltip repeats the name with the shortcut.
    await userEvent.hover(toggle);
    const tip = await screen.findByRole('tooltip');
    await expect(tip).toHaveTextContent('Bold');
    await expect(tip.parentElement!.querySelectorAll('kbd').length).toBeGreaterThan(0);
    await userEvent.unhover(toggle);
    await userEvent.click(toggle);
    await expect(args.onPressedChange).toHaveBeenCalledWith(true);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle).toHaveAttribute('data-state', 'on');
    // The name stays the same in both states.
    await expect(canvas.getByRole('button', { name: 'Bold' })).toBe(toggle);
    const ref = probe('bg-accent text-accent-foreground');
    await expect(getComputedStyle(toggle).backgroundColor).toBe(ref.bg);
    await expect(getComputedStyle(toggle).color).toBe(ref.color);
    ref.remove();
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  },
};

const variants: ToggleVariant[] = ['default', 'outline'];
const sizes: ToggleSize[] = ['sm', 'default', 'lg'];
const heights: Record<ToggleSize, number> = { sm: 32, default: 36, lg: 40 };
const sides: Record<ToggleSize, number> = { sm: 8, default: 10, lg: 12 };

// Figma Variant: default (no border) and outline (border/input, shadow/xs), icon only and with a label.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      {variants.map(v => (
        <div key={v} className="flex items-center gap-3" data-variant-row={v}>
          <Toggle variant={v} label="Bold" icon={<Bold aria-hidden="true" />} />
          <Toggle variant={v} label="Italic" icon={<Italic aria-hidden="true" />} defaultPressed />
          <Toggle variant={v} label="Pinned" showLabel icon={<Pin aria-hidden="true" />} />
          <Toggle variant={v} label="Favorite" showLabel icon={<Star aria-hidden="true" />} defaultPressed />
          <Toggle variant={v} label="Captions" showLabel />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const ref = probe('border border-input');
    for (const v of variants) {
      const row = canvasElement.querySelector(`[data-variant-row="${v}"]`)!;
      const toggles = [...row.querySelectorAll<HTMLElement>('[data-slot="toggle"]')];
      for (const t of toggles) await expect(box(t)[1]).toBe(36);
      await expect(box(toggles[0])).toEqual([36, 36]);
      // Label at 10 px from the edge, border included.
      const label = toggles[4].querySelector('span')!;
      await expect(Math.round(label.getBoundingClientRect().left - toggles[4].getBoundingClientRect().left)).toBe(10);
      const s = getComputedStyle(toggles[0]);
      if (v === 'outline') {
        await expect(s.borderTopWidth).toBe('1px');
        await expect(s.borderTopColor).toBe(ref.border);
        await expect(s.boxShadow).not.toBe('none');
      } else {
        await expect(s.borderTopWidth).toBe('0px');
        await expect(s.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      }
    }
    ref.remove();
  },
};

// Figma Size: sm 32, default 36, lg 40; icon only is square; label sides 8 / 10 / 12.
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      {sizes.map(s => (
        <div key={s} className="flex items-center gap-3" data-size-row={s}>
          <Toggle size={s} label="Bold" icon={<Bold aria-hidden="true" />} />
          <Toggle size={s} variant="outline" label="Underline" icon={<Underline aria-hidden="true" />} />
          <Toggle size={s} label="Pinned" showLabel icon={<Pin aria-hidden="true" />} />
          <Toggle size={s} variant="outline" label="Pinned" showLabel icon={<Pin aria-hidden="true" />} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const s of sizes) {
      const toggles = [...canvasElement.querySelectorAll<HTMLElement>(`[data-size-row="${s}"] [data-slot="toggle"]`)];
      await expect(box(toggles[0])).toEqual([heights[s], heights[s]]);
      await expect(box(toggles[1])).toEqual([heights[s], heights[s]]);
      for (const t of toggles.slice(2)) {
        await expect(box(t)[1]).toBe(heights[s]);
        const icon = t.querySelector('svg')!;
        await expect(Math.round(icon.getBoundingClientRect().left - t.getBoundingClientRect().left)).toBe(sides[s]);
        // 8 px between icon and label.
        await expect(Math.round(t.querySelector('span')!.getBoundingClientRect().left - icon.getBoundingClientRect().right)).toBe(8);
      }
    }
  },
};

// Keyboard: Tab reaches it with the focus ring; Space and Enter toggle.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const toggle = canvas.getByRole('button', { name: 'Bold' });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(toggle).boxShadow).toContain('0px 0px 0px 4px'));
    await userEvent.keyboard(' ');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(args.onPressedChange).toHaveBeenCalledTimes(2);
  },
};

// Figma State=disabled: 50 % opacity, the state cannot change.
export const Disabled: Story = {
  render: args => (
    <div className="flex items-center gap-3">
      <Toggle {...args} disabled />
      <Toggle {...args} variant="outline" label="Pinned" showLabel icon={<Pin aria-hidden="true" />} disabled defaultPressed />
    </div>
  ),
  play: async ({ canvas, args }) => {
    const bold = canvas.getByRole('button', { name: 'Bold' });
    await expect(bold).toBeDisabled();
    await expect(getComputedStyle(bold).opacity).toBe('0.5');
    await userEvent.click(bold, { pointerEventsCheck: 0 });
    await expect(bold).toHaveAttribute('aria-pressed', 'false');
    await expect(args.onPressedChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole('button', { name: 'Pinned' })).toHaveAttribute('aria-pressed', 'true');
  },
};

// Stress test (Figma "Stress test / Toggle"): long text stays on one line and the toggle never
// shrinks in a narrow column; the icon-only toggle stays square; all options on and off.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex w-[276px] items-center gap-2 overflow-x-auto rounded-md border border-dashed p-3">
      <Toggle label="Bold" icon={<Bold aria-hidden="true" />} />
      <Toggle label="Extra long value 1234567" showLabel icon={<Bold aria-hidden="true" />} />
      <Toggle variant="outline" label="Pinned to the top of the list" showLabel />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const toggles = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="toggle"]')];
    await expect(box(toggles[0])).toEqual([36, 36]);
    for (const t of toggles.slice(1)) {
      await expect(box(t)[1]).toBe(36);
      const label = t.querySelector('span')!;
      // One line, never cut: the toggle hugs the whole label.
      await expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth);
      await expect(box(label)[1]).toBe(20);
    }
  },
};

export const VariantsDark: Story = { ...Variants, play: undefined, tags: ['!dev'], globals: { theme: 'Dark' } };
export const VariantsCorporate: Story = { ...Variants, play: undefined, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
