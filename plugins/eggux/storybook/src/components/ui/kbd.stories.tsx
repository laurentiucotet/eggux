import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Kbd, KbdGroup } from './kbd';

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One keyboard key, or several in a Kbd Group. Use the key text of the platform the user is on (⌘ on Mac, Ctrl elsewhere). Uses the kbd element; symbols are read by name ("Command"). Text is foreground on muted. Figma: Kbd page / Kbd, Kbd Group. Guide: eggux build-ui/components/indicators.md' } },
  },
  args: { children: '⌘' },
} satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height) };
};

// Figma Kbd: 20 x 20, bg-muted, text-foreground.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const key = canvasElement.querySelector('kbd')!;
    await expect(key.tagName).toBe('KBD');
    // Figma 20 x 20; the ⌘ glyph of the fallback font can add a pixel (hugs the label, min 20).
    await expect(box(key).h).toBe(20);
    await expect(box(key).w).toBeGreaterThanOrEqual(20);
    await expect(box(key).w).toBeLessThanOrEqual(22);
    // The symbol is hidden from screen readers and replaced by its name.
    await expect(key).toHaveTextContent('⌘Command');
    await expect(key.querySelector('[aria-hidden="true"]')).toHaveTextContent('⌘');
    const ref = document.createElement('span');
    ref.className = 'bg-muted text-foreground rounded-sm';
    document.body.append(ref);
    const refStyle = getComputedStyle(ref);
    const style = getComputedStyle(key);
    await expect(style.backgroundColor).toBe(refStyle.backgroundColor);
    await expect(style.color).toBe(refStyle.color);
    await expect(style.borderTopLeftRadius).toBe(refStyle.borderTopLeftRadius);
    ref.remove();
  },
};

// The key hugs its label: min 20, 4 px side padding, height stays 20.
export const Labels: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd>K</Kbd><Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>Enter</Kbd><Kbd>⇧</Kbd><Kbd>⌥</Kbd><Kbd>⌃</Kbd>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const keys = [...canvasElement.querySelectorAll('kbd')];
    await expect(keys.map(k => box(k).h)).toEqual([20, 20, 20, 20, 20, 20, 20]);
    await expect(box(keys[0]).w).toBe(20);
    await expect(box(keys[1]).w).toBeGreaterThan(20);
    await expect(box(keys[3]).w).toBeGreaterThan(box(keys[1]).w);
    await expect(getComputedStyle(keys[1]).paddingLeft).toBe('4px');
    await expect(keys[6]).toHaveTextContent('Control');
  },
};

// Figma Kbd Group: 4 px gap, 44 x 20 for ⌘ K.
export const Group: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="kbd-group"]')!;
    await expect(box(group).h).toBe(20);
    await expect(box(group).w).toBeGreaterThanOrEqual(44);
    await expect(box(group).w).toBeLessThanOrEqual(46);
    const keys = group.querySelectorAll('kbd');
    await expect(keys).toHaveLength(2);
    await expect(Math.round(keys[1].getBoundingClientRect().left - keys[0].getBoundingClientRect().right)).toBe(4);
  },
};

export const GroupCtrlShift: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('kbd')).toHaveLength(3);
    await expect(box(canvasElement.querySelector('[data-slot="kbd-group"]')!).h).toBe(20);
  },
};

// Stress (Figma "Stress test / Kbd", "Stress test / Kbd Group"): long names and many keys in a
// narrow column. Keys never wrap their label and never shrink.
export const Stress276: Story = { tags: ['!dev'],
  render: () => (
    <div className="w-[276px]">
      <KbdGroup className="flex-wrap">
        <Kbd>Ctrl</Kbd><Kbd>Alt</Kbd><Kbd>Shift</Kbd><Kbd>Command</Kbd><Kbd>Option</Kbd><Kbd>Escape</Kbd><Kbd>PageDown</Kbd>
      </KbdGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="kbd-group"]') as HTMLElement;
    for (const k of canvasElement.querySelectorAll('kbd')) {
      await expect(box(k).h).toBe(20);
      await expect(k.scrollWidth).toBeLessThanOrEqual(k.clientWidth);
    }
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth);
    await expect(box(group).w).toBeLessThanOrEqual(276);
  },
};

export const Stress368: Story = { tags: ['!dev'],
  render: () => (
    <div className="w-[368px]">
      <KbdGroup>
        <Kbd>Ctrl</Kbd><Kbd>Alt</Kbd><Kbd>Shift</Kbd><Kbd>Enter</Kbd>
      </KbdGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="kbd-group"]') as HTMLElement;
    await expect(box(group).w).toBeLessThanOrEqual(368);
    await expect(box(group).h).toBe(20);
  },
};

// Theme copies (hidden from the sidebar, still run in npm test): axe checks key text contrast on
// muted in each mode (18:1 Light, 14.5:1 Dark, 16.3:1 Corporate Light).
export const GroupDark: Story = { ...Group, tags: ['!dev'], globals: { theme: 'Dark' } };
export const GroupCorporate: Story = { ...Group, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
