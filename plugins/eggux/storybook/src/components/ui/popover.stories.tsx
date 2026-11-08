import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'A surface that opens from a trigger: popover fill, border, radius md, shadow md, 4 px below the trigger. It has role="dialog", so give it an aria-label. Escape closes and returns focus to the trigger. Used by Date Picker, Time Picker, Date Range Picker and Date Time Picker. Not a Figma component of its own; the Calendar page opens it. Code mapping: shadcn Popover.' } },
  },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

const Example = () => (
  <Popover>
    <PopoverTrigger asChild><Button variant="outline">Open details</Button></PopoverTrigger>
    <PopoverContent aria-label="Invoice details">
      <p className="text-sm font-medium">Invoice 1042</p>
      <p className="text-sm text-muted-foreground">Acme Ltd, EUR 1,240.00, due 30 Oct 2026.</p>
      <Button size="sm" className="mt-3">Send reminder</Button>
    </PopoverContent>
  </Popover>
);

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Example />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Open details' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Invoice details' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // 4 px below the trigger.
    await waitFor(() => expect(Math.round(dialog.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom)).toBe(4));
    await expect(getComputedStyle(dialog).borderTopWidth).toBe('1px');
    await expect(getComputedStyle(dialog).boxShadow).not.toBe('none');
    // Focus moves inside; Escape closes and returns focus to the trigger.
    await expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const KeyboardOpen: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Example />,
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Open details' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('dialog', { name: 'Invoice details' });
    await userEvent.tab();
    await expect(screen.getByRole('button', { name: 'Send reminder' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
