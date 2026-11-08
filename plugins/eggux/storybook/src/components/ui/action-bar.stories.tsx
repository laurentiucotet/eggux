import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { ActionBar } from './action-bar';
import { Button } from './button';

const meta = {
  title: 'Components/Button/Action Bar',
  component: ActionBar,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'The row of Buttons that ends a form, a step or a hero. end for forms and steps (Cancel, Save), start for heroes (primary first), center under centered heroes. One primary per bar, destructive actions in Leading, the same Button size throughout. sticky-mobile is the bottom bar of phone screens: summary line and xl Buttons sharing the width. Dialog footers use the Dialog footer; unsaved changes use Save Bar. Figma: Button page / Action Bar. Guide: eggux build-ui/components/button.md, mobile.md' } },
  },
  args: { align: 'end' },
  argTypes: {
    align: { control: 'inline-radio', options: ['end', 'start', 'center'] },
    barStyle: { control: 'inline-radio', options: ['default', 'sticky-mobile'] },
  },
} satisfies Meta<typeof ActionBar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right) }; };
const save = fn();
const cancel = fn();

// Figma Align=end: Cancel (outline) then Save (default), right aligned, 8 px apart, 36 high.
export const Default: Story = {
  render: args => (
    <div className="w-[560px]">
      <ActionBar {...args}>
        <Button variant="outline" onClick={cancel}>Cancel</Button>
        <Button onClick={save}>Save</Button>
      </ActionBar>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const bar = canvasElement.querySelector('[data-slot="action-bar"]')!;
    const c = canvas.getByRole('button', { name: 'Cancel' });
    const s = canvas.getByRole('button', { name: 'Save' });
    await expect(box(bar)).toMatchObject({ w: 560, h: 36 });
    await expect(box(s).r).toBe(box(bar).r);
    await expect(box(s).x - box(c).r).toBe(8);
    // Tab order follows the visual order: Cancel, then Save.
    await userEvent.tab();
    await expect(c).toHaveFocus();
    await userEvent.tab();
    await expect(s).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(save).toHaveBeenCalledTimes(1);
  },
};

// Figma Align: end, start (primary first), center.
export const Aligns: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[560px] flex-col gap-6">
      <ActionBar align="end"><Button variant="outline">Cancel</Button><Button>Save</Button></ActionBar>
      <ActionBar align="start"><Button>Get started</Button><Button variant="outline">Talk to sales</Button></ActionBar>
      <ActionBar align="center"><Button>Get started</Button><Button variant="outline">Talk to sales</Button></ActionBar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [end, start, center] = [...canvasElement.querySelectorAll('[data-slot="action-bar"]')];
    const first = (bar: Element) => box(bar.querySelectorAll('button')[0]);
    const last = (bar: Element) => box(bar.querySelectorAll('button')[1]);
    await expect(last(end).r).toBe(box(end).r);
    await expect(first(start).x).toBe(box(start).x);
    const left = first(center).x - box(center).x;
    const right = box(center).r - last(center).r;
    await expect(Math.abs(left - right)).toBeLessThanOrEqual(1);
  },
};

// Figma Show divider + Show leading (Example / form footer): line above, 16 px gap, a ghost
// destructive action on the left, away from the primary.
export const WithDividerAndLeading: Story = {
  args: { showDivider: true, leading: <Button variant="ghost">Remove contact</Button> },
  render: args => (
    <div className="w-[560px]">
      <ActionBar {...args}>
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </ActionBar>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const bar = canvasElement.querySelector('[data-slot="action-bar"]')!;
    await expect(box(bar).h).toBe(1 + 16 + 36);
    await expect(box(canvas.getByRole('button', { name: 'Remove contact' })).x).toBe(box(bar).x);
    await expect(box(canvas.getByRole('button', { name: 'Save changes' })).r).toBe(box(bar).r);
  },
};

// Figma Style=sticky-mobile (390 wide): summary line, xl Buttons that share the width,
// 12 px top, 16 px sides, 32 px bottom, top border.
export const StickyMobile: Story = {
  args: { barStyle: 'sticky-mobile', summaryLabel: 'Total (2 items)', summaryValue: '€48.00' },
  render: args => (
    <div className="w-[390px]">
      <ActionBar {...args}>
        <Button variant="outline" size="xl">Edit cart</Button>
        <Button size="xl">Checkout</Button>
      </ActionBar>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const bar = canvasElement.querySelector('[data-slot="action-bar"]') as HTMLElement;
    const s = getComputedStyle(bar);
    await expect([s.paddingTop, s.paddingLeft, s.paddingRight, s.paddingBottom, s.borderTopWidth, s.borderBottomWidth]).toEqual(['12px', '16px', '16px', '32px', '1px', '0px']);
    const edit = canvas.getByRole('button', { name: 'Edit cart' });
    const checkout = canvas.getByRole('button', { name: 'Checkout' });
    await expect(box(edit).h).toBe(48);
    await expect(Math.abs(box(edit).w - box(checkout).w)).toBeLessThanOrEqual(1);
    await expect(box(edit).w + box(checkout).w + 8).toBe(390 - 32);
    // Summary 28 high (body/large) + 12 gap + 48 buttons + 12/32 padding + 1 border.
    await expect(box(bar).h).toBe(133);
    await expect(canvas.getByText('€48.00')).toBeVisible();
  },
};

// Stress test (Figma "Stress test / Action Bar"): 276 and 368 columns; the bar fills the column
// and stays right aligned; the sticky summary label truncates, the value never wraps.
export const NarrowColumns: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      {[276, 368].map(w => (
        <div key={w} style={{ width: w }} className="rounded-md border border-dashed p-0">
          <ActionBar><Button variant="outline">Cancel</Button><Button>Save</Button></ActionBar>
        </div>
      ))}
      <div className="w-[320px]">
        <ActionBar barStyle="sticky-mobile" summaryLabel="Total (12 items), VAT and delivery to Acme Europe included" summaryValue="€12,480.00">
          <Button size="xl">Checkout</Button>
        </ActionBar>
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const bars = [...canvasElement.querySelectorAll('[data-slot="action-bar"]')];
    for (const bar of bars.slice(0, 2)) {
      await expect(box(bar).h).toBe(36);
      await expect(box(bar.querySelectorAll('button')[1]).r).toBe(box(bar).r);
    }
    const label = canvas.getByText(/Total \(12 items\)/);
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    await expect(box(canvas.getByText('€12,480.00')).h).toBe(28);
  },
};

export const StickyMobileDark: Story = { ...StickyMobile, tags: ['!dev'], globals: { theme: 'Dark' } };
export const WithDividerAndLeadingDark: Story = { ...WithDividerAndLeading, tags: ['!dev'], globals: { theme: 'Dark' } };
export const WithDividerAndLeadingCorporate: Story = { ...WithDividerAndLeading, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
