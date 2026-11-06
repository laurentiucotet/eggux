import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Smile } from '@/components/icons';
import { ButtonIcon } from './button-icon';
import { EmojiPicker, type Emoji } from './emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const meta = {
  title: 'Components/Popover/Emoji Picker',
  component: EmojiPicker,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Pick an emoji for a status, a workspace icon or a comment: search, categories, recently used first, a grid of 8 per row. Opens in a Popover from a smiley Button Icon (PopoverContent className="w-80 p-2"); picking closes it. The search keeps focus while arrows move in the grid; Enter picks. Reactions use Reaction Bar. Figma: Popover page / Emoji Picker. Guide: eggux build-ui/components/popover.md' } },
  },
} satisfies Meta<typeof EmojiPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const surface = 'w-80 rounded-md border border-border bg-popover p-2 shadow-md';
const onPick = fn();

function StatusEmoji() {
  const [open, setOpen] = React.useState(false);
  const [emoji, setEmoji] = React.useState<Emoji | null>(null);
  return (
    <div className="flex items-center gap-2 text-sm">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ButtonIcon variant="ghost" icon={<Smile />} label="Pick a status emoji" />
        </PopoverTrigger>
        <PopoverContent aria-label="Emoji picker" className="w-80 p-2">
          <EmojiPicker onSelect={item => { setEmoji(item); onPick(item.name); setOpen(false); }} />
        </PopoverContent>
      </Popover>
      <span>Status: {emoji ? <span role="img" aria-label={emoji.name}>{emoji.char}</span> : 'none'}</span>
    </div>
  );
}

// Opens from the smiley button with focus in the search; Enter picks the highlighted emoji and closes.
export const Default: Story = {
  render: () => <StatusEmoji />,
  play: async ({ canvas }) => {
    onPick.mockClear();
    const trigger = canvas.getByRole('button', { name: 'Pick a status emoji' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Emoji picker' });
    const search = within(dialog).getByRole('combobox', { name: 'Search emoji' });
    await waitFor(() => expect(search).toHaveFocus());
    // Figma: 320 x 192 (two rows of Frequently used).
    await expect(box(dialog)[0]).toBe(320);
    const grid = within(dialog).getByRole('listbox', { name: 'Frequently used' });
    const cells = within(grid).getAllByRole('option');
    await expect(box(cells[0])).toEqual([34, 34]);
    // 8 per row: the ninth cell starts the second row.
    await expect(Math.round(cells[8].getBoundingClientRect().left)).toBe(Math.round(cells[0].getBoundingClientRect().left));
    await expect(cells[0]).toHaveAccessibleName('thumbs up');
    await expect(search).toHaveAttribute('aria-activedescendant', cells[0].id);
    // Right, Down: the cell under the second one.
    await userEvent.keyboard('{ArrowRight}{ArrowDown}');
    await expect(search).toHaveAttribute('aria-activedescendant', cells[9].id);
    await expect(search).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onPick).toHaveBeenCalledWith('light bulb');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('img', { name: 'light bulb' })).toBeVisible();
    await expect(trigger).toHaveFocus();
  },
};

// Search matches names and keywords across categories; no match says so.
export const Search: Story = {
  render: () => <div className={surface}><EmojiPicker onSelect={item => onPick(item.name)} /></div>,
  play: async ({ canvas }) => {
    onPick.mockClear();
    const search = canvas.getByRole('combobox', { name: 'Search emoji' });
    await userEvent.type(search, 'party');
    const grid = canvas.getByRole('listbox', { name: 'Search results' });
    await expect(within(grid).getAllByRole('option').map(o => o.getAttribute('aria-label'))).toEqual(['party popper', 'confetti ball']);
    // Pressed category tabs clear while searching.
    await expect(canvas.queryAllByRole('button', { pressed: true })).toHaveLength(0);
    await userEvent.clear(search);
    await userEvent.type(search, 'check');
    await expect(within(canvas.getByRole('listbox')).getAllByRole('option')[0]).toHaveAccessibleName('check mark button');
    await userEvent.keyboard('{Enter}');
    await expect(onPick).toHaveBeenCalledWith('check mark button');
    await userEvent.clear(search);
    await userEvent.type(search, 'spaceship engine');
    await expect(canvas.getByRole('status')).toHaveTextContent('No emoji found');
  },
};

// Category tabs: buttons with aria-label and aria-pressed; 32 x 28.
export const Categories: Story = {
  render: () => <div className={surface}><EmojiPicker /></div>,
  play: async ({ canvas }) => {
    const recent = canvas.getByRole('button', { name: 'Recent' });
    await expect(recent).toHaveAttribute('aria-pressed', 'true');
    await expect(box(recent)).toEqual([32, 28]);
    const hearts = canvas.getByRole('button', { name: 'Hearts and hands' });
    await userEvent.click(hearts);
    await expect(hearts).toHaveAttribute('aria-pressed', 'true');
    await expect(recent).toHaveAttribute('aria-pressed', 'false');
    await expect(within(canvas.getByRole('listbox', { name: 'Hearts and hands' })).getAllByRole('option')[0]).toHaveAccessibleName('red heart');
  },
};

// Narrow popover and long lists: the grid scrolls inside, 8 per row, never wider than the panel.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <div className={surface}>
      <EmojiPicker recent={Array.from({ length: 64 }, (_, i) => ({ char: ['👍', '🎉', '❤️', '🚀'][i % 4], name: `emoji ${i + 1}` }))} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector<HTMLElement>('[data-slot="emoji-picker"]')!;
    const grid = within(picker).getByRole('listbox');
    await expect(grid.scrollHeight).toBeGreaterThan(grid.clientHeight);
    await expect(picker.scrollWidth).toBeLessThanOrEqual(picker.clientWidth);
    const search = within(picker).getByRole('combobox');
    await userEvent.click(search);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}');
    const active = document.getElementById(search.getAttribute('aria-activedescendant')!)!;
    await expect(active).toHaveAccessibleName('emoji 49');
    await waitFor(() => expect(active.getBoundingClientRect().bottom).toBeLessThanOrEqual(grid.getBoundingClientRect().bottom + 1));
  },
};

export const SearchDark: Story = { ...Categories, tags: ['!dev'], globals: { theme: 'Dark' } };
export const SearchCorporate: Story = { ...Categories, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
