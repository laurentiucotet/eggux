import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { PopoverFooter } from './popover-footer';
import { PopoverHeader } from './popover-header';

const meta = {
  title: 'Components/Popover',
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'A surface that opens from a trigger: popover fill, border, radius md, shadow md, 4 px below the trigger. It has role="dialog", so give it an aria-label. Escape closes and returns focus to the trigger. Used by Date Picker, Time Picker, Date Range Picker and Date Time Picker. Not a Figma component of its own; the Calendar page opens it. Code mapping: shadcn Popover.' } },
  },
} satisfies Meta;
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

type Playground = {
  open: boolean;
  side: 'top' | 'right' | 'bottom' | 'left';
  align: 'start' | 'center' | 'end';
  showHeader: boolean;
  title: string;
  showDescription: boolean;
  showClose: boolean;
  showFooter: boolean;
  showFooterStart: boolean;
};

/** Playground: every Popover option in Controls, with Popover Header and Popover Footer. */
export const Default: StoryObj<Playground> = {
  argTypes: {
    open: { name: 'Open', control: 'boolean', description: 'Open on load', table: { category: 'Popover' } },
    side: { name: 'Side', control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'], description: 'PopoverContent `side`', table: { category: 'Popover' } },
    align: { name: 'Align', control: 'inline-radio', options: ['start', 'center', 'end'], description: 'PopoverContent `align`', table: { category: 'Popover' } },
    showHeader: { name: 'Show header', control: 'boolean', description: 'Popover Header (title names the popover)', table: { category: 'Popover Header' } },
    title: { name: 'Title', control: 'text', if: { arg: 'showHeader' }, table: { category: 'Popover Header' } },
    showDescription: { name: 'Show description', control: 'boolean', if: { arg: 'showHeader' }, table: { category: 'Popover Header' } },
    showClose: { name: 'Show close', control: 'boolean', if: { arg: 'showHeader' }, table: { category: 'Popover Header' } },
    showFooter: { name: 'Show footer', control: 'boolean', description: 'Popover Footer with the actions on the right', table: { category: 'Popover Footer' } },
    showFooterStart: { name: 'Show footer start', control: 'boolean', description: 'Popover Footer `start`: a link on the left', if: { arg: 'showFooter' }, table: { category: 'Popover Footer' } },
  },
  args: { open: false, side: 'bottom', align: 'center', showHeader: true, title: 'Invoice 1042', showDescription: true, showClose: true, showFooter: true, showFooterStart: false },
  render: a => (
    <Popover key={String(a.open)} defaultOpen={a.open}>
      <PopoverTrigger asChild><Button variant="outline">Open details</Button></PopoverTrigger>
      <PopoverContent side={a.side} align={a.align} aria-label={a.showHeader ? undefined : 'Invoice details'} aria-labelledby={a.showHeader ? 'playground-popover-title' : undefined} className="flex flex-col gap-3">
        {a.showHeader ? <PopoverHeader titleId="playground-popover-title" title={a.title} description={a.showDescription ? 'Acme Ltd, due 30 Oct 2026.' : undefined} showClose={a.showClose} /> : null}
        <p className="text-sm text-muted-foreground">EUR 1,240.00, 12 days overdue. The customer opened the last reminder.</p>
        {a.showFooter ? (
          <PopoverFooter start={a.showFooterStart ? <Button variant="link" size="sm" className="px-0">View invoice</Button> : undefined}>
            <Button size="sm" variant="outline">Later</Button>
            <Button size="sm">Send reminder</Button>
          </PopoverFooter>
        ) : null}
      </PopoverContent>
    </Popover>
  ),
};

// The checks that used to run on Default (hidden; the playground has no play function).
export const DefaultCheck: Story = {
  tags: ['!dev'],
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

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };

// Playground open with header and footer: the header title names the dialog (axe on the open popover).
export const OpenWithHeader: StoryObj<Playground> = {
  tags: ['!dev'],
  args: { ...Default.args, open: true, showFooterStart: true },
  render: Default.render,
  play: async () => {
    await expect(await screen.findByRole('dialog', { name: 'Invoice 1042' })).toBeVisible();
  },
};
