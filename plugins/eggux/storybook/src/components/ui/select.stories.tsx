import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Globe } from '@/components/icons';
import { Field } from './field';
import { Select, SelectContent, SelectItem, SelectTrigger, type SelectProps } from './select';

const meta = {
  title: 'Components/Select/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One choice from 6-15 options, inside Field for the label and errors. Style default or filled (same as the other controls of the form); ghost only in toolbars and list headers ("Sort by: Newest"). Size default 36, sm 32, lg 40. The open list is the Menu, 4 px below, with a check on the selected option. Read-only shows a value people cannot change here; Show clear empties a filter. Enter, Space or arrows open, arrows move, Enter picks, Escape closes, a letter jumps to its option. Figma: Select page / Select. Guide: eggux build-ui/components/select.md' } },
  },
  decorators: [Story => <div className="w-[240px]"><Story /></div>],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const css = (el: Element) => getComputedStyle(el);
const probe = (className: string, prop: 'color' | 'backgroundColor' | 'borderTopColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};

const cities = ['București', 'Cluj-Napoca', 'Iași', 'Timișoara', 'Brașov', 'Constanța'];

function Cities(props: Partial<SelectProps> & { placeholder?: string; showClear?: boolean; className?: string; 'aria-label'?: string }) {
  const { placeholder, showClear, className, 'aria-label': ariaLabel, ...rest } = props;
  return (
    <Select {...rest}>
      <SelectTrigger placeholder={placeholder} showClear={showClear} aria-label={ariaLabel} className={className} />
      <SelectContent>
        {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

const onValueChange = fn();

// Figma Style=default, Size=default, placeholder "Select a location": 240 x 36, opens the Menu with
// a check on the pick; Escape closes and focus returns to the trigger.
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field label="Location">
      <Cities onValueChange={onValueChange} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Location' });
    await expect(box(trigger)).toEqual([240, 36]);
    await expect(trigger).toHaveTextContent('Select a location');
    await expect(css(trigger).color).toBe(probe('text-muted-foreground', 'color'));
    await expect(css(trigger).borderTopColor).toBe(probe('border border-input', 'borderTopColor'));
    await expect(box(trigger.querySelector('svg')!)).toEqual([16, 16]);
    await userEvent.click(trigger);
    const list = await screen.findByRole('listbox');
    await expect(within(list).getAllByRole('option')).toHaveLength(6);
    // Menu 4 px below, as wide as the trigger; Menu Item 32 high.
    await expect(list.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom).toBeCloseTo(4, 0);
    await expect(box(list)[0]).toBe(240);
    await expect(box(within(list).getByRole('option', { name: 'Iași' }))[1]).toBe(32);
    await userEvent.click(within(list).getByRole('option', { name: 'Cluj-Napoca' }));
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(onValueChange).toHaveBeenCalledWith('Cluj-Napoca');
    await expect(trigger).toHaveTextContent('Cluj-Napoca');
    await expect(css(trigger).color).toBe(probe('text-foreground', 'color'));
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.click(trigger);
    const picked = await screen.findByRole('option', { name: 'Cluj-Napoca' });
    await expect(picked).toHaveAttribute('aria-selected', 'true');
    await expect(picked.querySelector('svg')).not.toBeNull();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

// Keyboard only: Tab, Enter opens, arrows move, Enter picks; a letter on the closed trigger jumps.
export const Keyboard: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field label="Location">
      <Cities defaultValue="București" />
    </Field>
  ),
  play: async ({ canvas }) => {
    await userEvent.tab();
    const trigger = canvas.getByRole('combobox', { name: 'Location' });
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const list = await screen.findByRole('listbox');
    await waitFor(() => expect(within(list).getByRole('option', { name: 'București' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(within(list).getByRole('option', { name: 'Iași' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(trigger).toHaveTextContent('Iași');
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.keyboard('t');
    await waitFor(() => expect(trigger).toHaveTextContent('Timișoara'));
  },
};

// Figma Style: default (outlined), filled (muted fill, no border) and ghost (hugs its text, inline label).
function StylesShowcase() {
  return (
    <div className="flex w-[480px] flex-col gap-4">
      <Field label="Outlined"><Cities defaultValue="Cluj-Napoca" /></Field>
      <Field label="Filled"><Cities selectStyle="filled" /></Field>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Invoices</span>
        <Select selectStyle="ghost" defaultValue="newest">
          <SelectTrigger label="Sort by:" />
          <SelectContent align="end" className="w-44">
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export const Styles: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => <StylesShowcase />,
  play: async ({ canvas }) => {
    const filled = canvas.getByRole('combobox', { name: 'Filled' });
    await expect(css(filled).backgroundColor).toBe(probe('bg-muted', 'backgroundColor'));
    await expect(css(filled).borderTopColor).toBe('rgba(0, 0, 0, 0)');
    await expect(css(filled).color).toBe(probe('text-[var(--input-filled-muted-foreground)]', 'color'));
    await expect(box(filled)[1]).toBe(36);
    // Ghost: the inline label is part of the name; no border or fill; hugs its text; 8 px sides.
    const ghost = canvas.getByRole('combobox', { name: 'Sort by: Newest' });
    await expect(css(ghost).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await expect(css(ghost).paddingLeft).toBe('8px');
    await expect(box(ghost)[0]).toBeLessThan(160);
    await expect(css(ghost.querySelector('[data-slot="select-trigger-value"]')!).fontWeight).toBe('500');
    await expect(css(ghost.querySelector('[data-slot="select-label"]')!).color).toBe(probe('text-muted-foreground', 'color'));
    await userEvent.click(ghost);
    await userEvent.click(await screen.findByRole('option', { name: 'Amount' }));
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Sort by: Amount' })).toBeInTheDocument());
  },
};

// Figma Size: sm 32, default 36, lg 40 (16 px sides, body/default).
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3">
      <Cities size="sm" aria-label="Small" defaultValue="Iași" />
      <Cities aria-label="Default" defaultValue="Iași" />
      <Cities size="lg" aria-label="Large" defaultValue="Iași" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(box(canvas.getByRole('combobox', { name: 'Small' }))).toEqual([240, 32]);
    await expect(box(canvas.getByRole('combobox', { name: 'Default' }))).toEqual([240, 36]);
    const lg = canvas.getByRole('combobox', { name: 'Large' });
    await expect(box(lg)).toEqual([240, 40]);
    await expect(css(lg).paddingLeft).toBe('16px');
    await expect(css(lg).fontSize).toBe('16px');
    await expect(css(canvas.getByRole('combobox', { name: 'Small' })).paddingLeft).toBe('12px');
  },
};

// Figma Show status dot, Show avatar, Show leading icon: the same leading on every option, shown in the trigger too.
export const Leading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <Field label="Status">
        <Select defaultValue="paid">
          <SelectTrigger />
          <SelectContent>
            <SelectItem value="paid" status="success">Paid</SelectItem>
            <SelectItem value="due" status="warning">Due</SelectItem>
            <SelectItem value="overdue" status="error">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Assignee">
        <Select defaultValue="ab">
          <SelectTrigger />
          <SelectContent>
            <SelectItem value="ab" avatar={{ initials: 'AB' }}>Anna Berg</SelectItem>
            <SelectItem value="mi" avatar={{ initials: 'MI' }}>Mihai Ionescu</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Language">
        <Select defaultValue="en-GB">
          <SelectTrigger leading={<Globe />} />
          <SelectContent>
            <SelectItem value="en-GB" lang="en-GB">English (UK)</SelectItem>
            <SelectItem value="ro" lang="ro">Română</SelectItem>
            <SelectItem value="de" lang="de">Deutsch</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const status = canvas.getByRole('combobox', { name: 'Status' });
    await expect(status).toHaveTextContent('Paid');
    const dot = status.querySelector('[class*="rounded-full"]')!;
    await expect(box(dot)).toEqual([8, 8]);
    await expect(css(dot).backgroundColor).toBe(probe('bg-success', 'backgroundColor'));
    const assignee = canvas.getByRole('combobox', { name: 'Assignee' });
    await expect(box(assignee.querySelector('[data-slot="avatar"]')!)).toEqual([20, 20]);
    const language = canvas.getByRole('combobox', { name: 'Language' });
    await expect(box(language.querySelector('svg')!)).toEqual([16, 16]);
    await userEvent.click(status);
    const overdue = await screen.findByRole('option', { name: 'Overdue' });
    await expect(overdue.querySelector('[class*="bg-destructive"]')).not.toBeNull();
    await userEvent.click(overdue);
    await waitFor(() => expect(status).toHaveTextContent('Overdue'));
  },
};

// Figma State=error: the trigger is marked, the message comes from Field.
export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  name: 'Error',
  render: () => <Field label="Location" error="Choose where the event takes place."><Cities /></Field>,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Location' });
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await expect(trigger).toHaveAccessibleDescription('Choose where the event takes place.');
    await expect(css(trigger).borderTopColor).toBe(probe('border border-destructive', 'borderTopColor'));
  },
};

// Figma State=disabled: 50 %, cannot open.
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Field label="Location" disabled><Cities defaultValue="Iași" /></Field>,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Location' });
    await expect(trigger).toBeDisabled();
    await expect(css(trigger).opacity).toBe('0.5');
    await userEvent.click(trigger);
    await expect(screen.queryByRole('listbox')).toBeNull();
  },
};

// Figma State=read-only: muted fill, no chevron, value in foreground; focusable but never opens.
export const ReadOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Field label="Plan" hint="Change the plan in Billing."><Cities readOnly defaultValue="Cluj-Napoca" /></Field>,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Plan' });
    await expect(trigger).toHaveAttribute('aria-readonly', 'true');
    await expect(css(trigger).backgroundColor).toBe(probe('bg-muted', 'backgroundColor'));
    await expect(css(trigger).color).toBe(probe('text-foreground', 'color'));
    await expect(trigger.querySelector('svg')).toBeNull();
    await userEvent.click(trigger);
    await userEvent.keyboard('{Enter}{ArrowDown} ');
    await expect(screen.queryByRole('listbox')).toBeNull();
    await expect(trigger).toHaveTextContent('Cluj-Napoca');
  },
};

// Figma Show clear: an x before the chevron empties the value; focus goes back to the trigger.
export const Clearable: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Field label="City filter"><Cities showClear defaultValue="Brașov" /></Field>,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'City filter' });
    const clear = canvas.getByRole('button', { name: 'Clear selection' });
    await expect(box(clear.querySelector('svg')!)).toEqual([16, 16]);
    // The x sits before the chevron, inside the trigger, and the value never runs under it.
    await expect(clear.getBoundingClientRect().right).toBeLessThan(trigger.querySelector('svg')!.getBoundingClientRect().left);
    await userEvent.click(clear);
    await expect(trigger).toHaveTextContent('Select a location');
    await expect(trigger).toHaveFocus();
    await expect(canvas.queryByRole('button', { name: 'Clear selection' })).toBeNull();
  },
};

// Stress test (Figma "Stress test / Select"): long values truncate to one line at 276 and 368, the
// chevron keeps its size; ghost truncates at 200 and stays one line.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-4">
      {[276, 368].map(w => (
        <div key={w} style={{ width: w }}>
          <Select defaultValue="long">
            <SelectTrigger aria-label={`Column ${w}`} />
            <SelectContent>
              <SelectItem value="long" avatar={{ initials: 'NT' }}>Northwind Traders International Logistics and Shipping Group</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
      <Select selectStyle="ghost" defaultValue="long">
        <SelectTrigger label="Period:" />
        <SelectContent>
          <SelectItem value="long">Last thirty days compared with the same period last year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const w of [276, 368]) {
      const trigger = canvas.getByRole('combobox', { name: `Column ${w}` });
      await expect(box(trigger)).toEqual([w, 36]);
      const label = trigger.querySelector('[data-slot="select-trigger-value"] .truncate') as HTMLElement;
      await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
      await expect(box(trigger.querySelector('svg')!)).toEqual([16, 16]);
      await expect(box(trigger.querySelector('[data-slot="avatar"]')!)).toEqual([20, 20]);
    }
    const ghost = canvas.getByRole('combobox', { name: /^Period:/ });
    const value = ghost.querySelector('[data-slot="select-trigger-value"]') as HTMLElement;
    await expect(box(value)[0]).toBe(200);
    await expect(box(ghost)[1]).toBe(36);
  },
};

export const StylesDark: Story = { ...Styles, tags: ['!dev'], globals: { theme: 'Dark' } };
export const StylesCorporate: Story = { ...Styles, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
