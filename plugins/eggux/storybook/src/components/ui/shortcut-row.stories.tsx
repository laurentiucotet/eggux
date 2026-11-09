import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ShortcutList, ShortcutRow } from './shortcut-row';

const meta = {
  title: 'Components/Kbd/Shortcut Row',
  component: ShortcutRow,
  parameters: { controls: { disable: true },
    layout: 'padded',
    docs: { description: { component: 'One keyboard shortcut in the shortcuts dialog (opened with ?) or a help page: what it does, then the keys. Group rows by area with a heading per group; show ⌘ on Mac and Ctrl on Windows; list only shortcuts that work. Menu shortcuts use Menu Item; button hints use Tooltip with Kbd. Figma: Kbd page / Shortcut Row. Guide: eggux build-ui/components/indicators.md' } },
  },
  args: { action: 'Open command menu', keys: ['⌘', 'K'] },
  render: () => (
    <div className="w-[400px]">
      <h3 className="m-0 mb-1 text-xs leading-4 font-medium text-muted-foreground">Navigation</h3>
      <ShortcutList>
        <ShortcutRow action="Open command menu" keys={['⌘', 'K']} />
        <ShortcutRow action="Go to inbox" keys={['G', 'I']} sequence />
        <ShortcutRow action="Show keyboard shortcuts" keys={['?']} />
      </ShortcutList>
    </div>
  ),
} satisfies Meta<typeof ShortcutRow>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 400 × 37, keys 4 apart on the right, "⌘" read as Command, a sequence reads "G then I".
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="shortcut-row"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(37);
    const keys = rows[0]!.querySelectorAll('kbd');
    await expect(Math.round(box(keys[1]!).left - box(keys[0]!).right)).toBe(4);
    await expect(Math.round(box(keys[1]!).right)).toBe(Math.round(box(rows[0]!).right));
    await expect(canvas.getByText('Command')).toBeInTheDocument();
    await expect(rows[1]!.querySelector('dd')).toHaveTextContent(/^Gthen ?I$/);
  },
};

// Stress: a long action wraps at 276, keys stay on one line. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <ShortcutList className="w-[276px]">
      <ShortcutRow action="Move the selected rows to the archive and close the panel" keys={['Ctrl', 'Shift', 'Enter']} />
    </ShortcutList>
  ),
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot="shortcut-row"]')!;
    await expect(box(row).height).toBeGreaterThan(37);
    await expect(Math.round(box(row.querySelector('dd')!).height)).toBe(20);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
