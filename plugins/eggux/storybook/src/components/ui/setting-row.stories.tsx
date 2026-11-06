import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Button } from './button';
import { SettingRow } from './setting-row';
import { Switch } from './switch';

const meta = {
  title: 'Components/Selection Controls/Setting Row',
  component: SettingRow,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One setting: title, optional description, and its control on the right (Switch for on/off, Select for a choice, Button for an action). Stack 3-8 rows in a section; divider off on the last row. Switches save at once unless the section has its own Save button. Figma: Selection controls page / Setting Row. Guide: eggux build-ui/patterns/settings-and-admin.md' } },
  },
  args: {
    title: 'Payment reminders',
    description: 'Email customers 3 days before and 7 days after the due date.',
  },
  decorators: [Story => <div className="w-[640px] max-w-full"><Story /></div>],
} satisfies Meta<typeof SettingRow>;
export default meta;
type Story = StoryObj<typeof meta>;

const size = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

// Figma default: 640 x 77 (16 + 20 + 4 + 20 + 16, plus the 1 px divider), Switch on the right, centered.
export const Default: Story = {
  args: { children: <Switch defaultChecked onCheckedChange={fn()} /> },
  play: async ({ canvas, canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot="setting-row"]')!;
    await expect(size(row)).toEqual([640, 77]);
    const sw = canvas.getByRole('switch', { name: 'Payment reminders' });
    await expect(sw).toHaveAccessibleDescription('Email customers 3 days before and 7 days after the due date.');
    await expect(Math.round(row.getBoundingClientRect().right - sw.getBoundingClientRect().right)).toBe(0);
    await expect(Math.round(sw.getBoundingClientRect().top - row.getBoundingClientRect().top)).toBe(28);
    const text = canvasElement.querySelector('[data-slot="setting-row-title"]')!.parentElement!;
    await expect(Math.round(sw.getBoundingClientRect().left - text.getBoundingClientRect().right)).toBe(24);
    await expect(canvasElement.querySelector('[data-slot="separator"]')).toBeInTheDocument();
    // Only the control toggles: clicking the title does nothing.
    await userEvent.click(canvas.getByText('Payment reminders'));
    await expect(sw).toBeChecked();
    await userEvent.click(sw);
    await expect(sw).not.toBeChecked();
    await userEvent.keyboard(' ');
    await expect(sw).toBeChecked();
  },
};

// Control slot with a Button: the button keeps its own name and is described by the row.
export const WithButton: Story = {
  args: {
    title: 'Billing email',
    description: 'Invoices and receipts go to billing@acme.com.',
    children: <Button variant="outline" size="sm" onClick={fn()}>Change</Button>,
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Change' });
    await expect(button).toHaveAccessibleDescription('Invoices and receipts go to billing@acme.com.');
    await userEvent.tab();
    await expect(button).toHaveFocus();
  },
};

// Show description off and Show divider off (the last row of a section): 52 high, no separator.
export const TitleOnly: Story = {
  args: { description: undefined, showDivider: false, children: <Switch /> },
  play: async ({ canvas, canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot="setting-row"]')!;
    await expect(size(row)).toEqual([640, 52]);
    await expect(canvasElement.querySelector('[data-slot="separator"]')).not.toBeInTheDocument();
    await expect(canvas.getByRole('switch', { name: 'Payment reminders' })).not.toHaveAttribute('aria-describedby');
  },
};

// A disabled row says why in the description; the switch cannot change.
export const Disabled: Story = {
  args: {
    title: 'SMS reminders',
    description: 'Not included in your plan. Upgrade to Business to send SMS reminders.',
    children: <Switch disabled />,
  },
  play: async ({ canvas }) => {
    const sw = canvas.getByRole('switch', { name: 'SMS reminders' });
    await expect(sw).toBeDisabled();
    await userEvent.click(sw);
    await expect(sw).not.toBeChecked();
  },
};

// Figma "Example / settings section": rows stacked under a section title, divider off on the last one.
export const Section: Story = {
  render: () => {
    const [state, setState] = React.useState({ reminders: true, receipts: false });
    return (
      <section aria-labelledby="notifications-title" className="flex flex-col">
        <h2 id="notifications-title" className="text-base font-semibold text-foreground">Notifications</h2>
        <SettingRow title="Payment reminders" description="Email customers 3 days before and 7 days after the due date.">
          <Switch checked={state.reminders} onCheckedChange={v => setState(s => ({ ...s, reminders: v }))} />
        </SettingRow>
        <SettingRow title="Payment receipts" description="Send a receipt when a customer pays an invoice.">
          <Switch checked={state.receipts} onCheckedChange={v => setState(s => ({ ...s, receipts: v }))} />
        </SettingRow>
        <SettingRow title="Billing email" description="Invoices and receipts go to billing@acme.com." showDivider={false}>
          <Button variant="outline" size="sm">Change</Button>
        </SettingRow>
      </section>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-slot="setting-row"]')).toHaveLength(3);
    await expect(canvasElement.querySelectorAll('[data-slot="separator"]')).toHaveLength(2);
    const receipts = canvas.getByRole('switch', { name: 'Payment receipts' });
    await userEvent.tab();
    await expect(canvas.getByRole('switch', { name: 'Payment reminders' })).toHaveFocus();
    await userEvent.tab();
    await expect(receipts).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(receipts).toBeChecked();
  },
};

// Stress (Figma "Stress test / Setting Row"): long title and description wrap, the control keeps its size and
// stays centered; short text; no description; columns 276, 368 and 564.
const longTitle = 'Payment reminders with a much longer label than planned';
const longDescription = 'Email customers 3 days before and 7 days after the due date. Email customers 3 days before and 7 days after the due date.';
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [Story => <div className="w-[640px]"><Story /></div>],
  render: () => (
    <div className="flex flex-col gap-8">
      <div data-case="long"><SettingRow title={longTitle} description={longDescription}><Switch defaultChecked /></SettingRow></div>
      <div data-case="short"><SettingRow title="A" description="A"><Switch defaultChecked /></SettingRow></div>
      <div data-case="off"><SettingRow title="Payment reminders" showDivider={false}><Switch defaultChecked /></SettingRow></div>
      <div data-case="w276" className="w-[276px]"><SettingRow title={longTitle} description={longDescription}><Switch defaultChecked /></SettingRow></div>
      <div data-case="w368" className="w-[368px]"><SettingRow title={longTitle} description={longDescription}><Switch defaultChecked /></SettingRow></div>
      <div data-case="w564" className="w-[564px]"><SettingRow title={longTitle} description={longDescription}><Button variant="outline" size="sm">Connect</Button></SettingRow></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const center = (el: Element) => { const r = el.getBoundingClientRect(); return r.top + r.height / 2; };
    for (const c of canvasElement.querySelectorAll<HTMLElement>('[data-case]')) {
      const row = c.querySelector('[data-slot="setting-row"]') as HTMLElement;
      await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth);
      await expect(Math.round(row.getBoundingClientRect().width)).toBe(Math.round(c.getBoundingClientRect().width));
      const control = c.querySelector('[data-slot="setting-row-control"] > *')!;
      if (control.getAttribute('role') === 'switch') await expect(size(control)).toEqual([36, 20]);
      const text = c.querySelector('[data-slot="setting-row-title"]')!.parentElement!;
      await expect(Math.round(center(control) - center(text))).toBe(0);
    }
    const title = (k: string) => canvasElement.querySelector(`[data-case="${k}"] [data-slot="setting-row-title"]`)!;
    await expect(title('w276').getBoundingClientRect().height).toBeGreaterThan(20);
    await expect(Math.round(title('short').getBoundingClientRect().height)).toBe(20);
  },
};

// Theme copies: axe checks contrast in each mode (hidden from the sidebar).
export const SectionDark: Story = { ...Section, tags: ['!dev'], globals: { theme: 'Dark' } };
export const SectionCorporate: Story = { ...Section, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const DisabledDark: Story = { ...Disabled, tags: ['!dev'], globals: { theme: 'Dark' } };
