import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Command, CommandInput, CommandItem, CommandList } from './command';

const meta = {
  title: 'Components/Popover/Command Input',
  component: CommandInput,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Search field at the top of a Command list: borderless with a bottom divider, a muted search icon and the query. It is the combobox of the list (aria-activedescendant), so it lives inside <Command>. Figma: Popover page / Command Input. Guide: eggux build-ui/components/popover.md' } },
  },
  decorators: [
    Story => (
      <div className="w-72 rounded-md border border-border bg-popover">
        <Command label="Country">
          <Story />
          <CommandList className="sr-only">
            <CommandItem>Romania</CommandItem>
          </CommandList>
        </Command>
      </div>
    ),
  ],
  args: { placeholder: 'Search country…' },
} satisfies Meta<typeof CommandInput>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

// Figma: 288 x 36 (density control-height), 12 px sides, 16 px icon 8 px from the text, bottom divider.
export const Default: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Country' });
    const row = input.parentElement!;
    await expect(box(row)).toEqual([286, 36]);
    await expect(getComputedStyle(row).borderBottomWidth).toBe('1px');
    await expect(getComputedStyle(row).paddingLeft).toBe('12px');
    const icon = row.querySelector('svg')!;
    await expect(box(icon)).toEqual([16, 16]);
    await expect(Math.round(input.getBoundingClientRect().left - icon.getBoundingClientRect().right)).toBe(8);
    await expect(input).toHaveAttribute('placeholder', 'Search country…');
    await userEvent.type(input, 'Rom');
    await expect(input).toHaveValue('Rom');
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
