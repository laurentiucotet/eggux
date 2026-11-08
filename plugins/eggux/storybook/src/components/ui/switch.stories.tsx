import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Switch } from './switch';

const meta = {
  title: 'Components/Selection Controls/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'On/off that applies at once; the label names the setting, not the action. Inside a form that saves on submit use Checkbox. One Size per list: default for settings pages, sm in dense tables and toolbars, lg for touch. Figma: Selection controls page / Switch. Guide: eggux build-ui/patterns/settings-and-admin.md' } },
  },
  args: { label: 'Email notifications' },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

const size = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
// Probe element carrying the token classes, to compare computed colors against.
const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const thumbOf = (el: Element) => el.querySelector('[data-slot="switch-thumb"]') as HTMLElement;
const offset = (thumb: Element, track: Element) => Math.round(thumb.getBoundingClientRect().left - track.getBoundingClientRect().left);

// Figma Checked=false, Size=default, State=default: 36 x 20 track, 16 px thumb, 8 px gap, label 14/20 medium.
export const Default: Story = {
  args: { onCheckedChange: fn() },
  play: async ({ canvas, args }) => {
    const sw = canvas.getByRole('switch', { name: 'Email notifications' });
    await expect(size(sw)).toEqual([36, 20]);
    await expect(size(thumbOf(sw))).toEqual([16, 16]);
    await expect(sw).toHaveAttribute('aria-checked', 'false');
    const track = probe('bg-input');
    await expect(getComputedStyle(sw).backgroundColor).toBe(track.style.backgroundColor);
    track.remove();
    const thumb = probe('bg-[var(--switch-thumb-unchecked)]');
    await expect(getComputedStyle(thumbOf(sw)).backgroundColor).toBe(thumb.style.backgroundColor);
    thumb.remove();
    await expect(offset(thumbOf(sw), sw)).toBe(2);
    const label = canvas.getByText('Email notifications');
    await expect(Math.round(label.getBoundingClientRect().left - sw.getBoundingClientRect().right)).toBe(8);
    await expect(getComputedStyle(label).lineHeight).toBe('20px');
    await userEvent.click(label);
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
    await userEvent.click(sw);
    await expect(sw).toHaveAttribute('aria-checked', 'false');
  },
};

// Figma Checked=true: primary track, thumb on the right in background.
export const Checked: Story = {
  args: { defaultChecked: true },
  play: async ({ canvas }) => {
    const sw = canvas.getByRole('switch');
    await expect(sw).toBeChecked();
    const ref = probe('bg-primary');
    await expect(getComputedStyle(sw).backgroundColor).toBe(ref.style.backgroundColor);
    ref.remove();
    const thumbRef = probe('bg-background');
    await expect(getComputedStyle(thumbOf(sw)).backgroundColor).toBe(thumbRef.style.backgroundColor);
    thumbRef.remove();
    // Wait for the slide transition to finish.
    await new Promise(r => setTimeout(r, 300));
    await expect(offset(thumbOf(sw), sw)).toBe(18);
  },
};

// Figma Size: sm 28 x 16 (12 px thumb, 12/16 label), default 36 x 20, lg 44 x 24 (20 px thumb, label centered).
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-2 gap-x-10 gap-y-4">
      <Switch size="sm" label="Show archived" />
      <Switch size="sm" defaultChecked label="Compact rows" />
      <Switch label="Email notifications" />
      <Switch defaultChecked label="Payment reminders" />
      <Switch size="lg" label="Push notifications" />
      <Switch size="lg" defaultChecked label="Location access" />
    </div>
  ),
  play: async ({ canvas }) => {
    const sm = canvas.getByRole('switch', { name: 'Show archived' });
    const md = canvas.getByRole('switch', { name: 'Email notifications' });
    const lg = canvas.getByRole('switch', { name: 'Push notifications' });
    await expect(size(sm)).toEqual([28, 16]);
    await expect(size(thumbOf(sm))).toEqual([12, 12]);
    await expect(size(md)).toEqual([36, 20]);
    await expect(size(lg)).toEqual([44, 24]);
    await expect(size(thumbOf(lg))).toEqual([20, 20]);
    await expect(getComputedStyle(canvas.getByText('Show archived')).fontSize).toBe('12px');
    await expect(getComputedStyle(canvas.getByText('Show archived')).lineHeight).toBe('16px');
    // lg: 20 px label line centered on the 24 px track.
    const lgLabel = canvas.getByText('Push notifications');
    // The label box starts at the track top with 2 px padding: its 20 px line is centered (2 + 10 = 12).
    await expect(Math.round(lgLabel.getBoundingClientRect().top - lg.getBoundingClientRect().top)).toBe(0);
    await expect(getComputedStyle(lgLabel).paddingTop).toBe('2px');
    await new Promise(r => setTimeout(r, 300));
    await expect(offset(thumbOf(canvas.getByRole('switch', { name: 'Compact rows' })), canvas.getByRole('switch', { name: 'Compact rows' }))).toBe(14);
    await expect(offset(thumbOf(canvas.getByRole('switch', { name: 'Location access' })), canvas.getByRole('switch', { name: 'Location access' }))).toBe(22);
  },
};

// Figma State=focus: 2 px background gap plus 4 px ring on keyboard focus; Space toggles.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const sw = canvas.getByRole('switch');
    await userEvent.tab();
    await expect(sw).toHaveFocus();
    await expect(getComputedStyle(sw).boxShadow).toContain('0px 0px 0px 4px');
    await userEvent.keyboard(' ');
    await expect(sw).toBeChecked();
    await userEvent.keyboard('{Enter}');
    await expect(sw).not.toBeChecked();
  },
};

// Figma State=disabled: control and label at 50 %, no toggling; the description says why and stays readable.
export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true, onCheckedChange: fn(), description: 'Your plan does not include SMS. Upgrade to turn it on.', label: 'SMS reminders' },
  play: async ({ canvas, canvasElement, args }) => {
    const sw = canvas.getByRole('switch', { name: 'SMS reminders' });
    await expect(sw).toBeDisabled();
    await expect(getComputedStyle(sw.parentElement!).opacity).toBe('0.5');
    await expect(getComputedStyle(canvas.getByText('SMS reminders')).opacity).toBe('0.5');
    await expect(getComputedStyle(canvasElement.querySelector('[data-slot="switch-description"]')!).opacity).toBe('1');
    await userEvent.click(canvas.getByText('SMS reminders'));
    await userEvent.click(sw);
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
    await expect(sw).toBeChecked();
  },
};

// Show description: one sentence under the label, linked with aria-describedby; the switch aligns to the first line.
export const WithDescription: Story = {
  args: { description: 'Get an email when a customer pays an invoice.' },
  play: async ({ canvas }) => {
    const sw = canvas.getByRole('switch');
    await expect(sw).toHaveAccessibleDescription('Get an email when a customer pays an invoice.');
    const label = canvas.getByText('Email notifications');
    const desc = canvas.getByText(/Get an email/);
    await expect(Math.round(sw.getBoundingClientRect().top - label.getBoundingClientRect().top)).toBe(0);
    await expect(Math.round(desc.getBoundingClientRect().left - label.getBoundingClientRect().left)).toBe(0);
    await expect(Math.round(desc.getBoundingClientRect().top - label.getBoundingClientRect().bottom)).toBe(0);
    await expect(getComputedStyle(desc).fontWeight).toBe('400');
  },
};

// All Checked x State x Size variants in one grid (focus is shown live with the keyboard).
export const AllStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-2 gap-x-10 gap-y-4">
      {(['sm', 'default', 'lg'] as const).flatMap(s => [
        <Switch key={`${s}-off`} size={s} label={`Off, ${s}`} />,
        <Switch key={`${s}-off-d`} size={s} disabled label={`Off, ${s}, disabled`} />,
        <Switch key={`${s}-on`} size={s} defaultChecked label={`On, ${s}`} />,
        <Switch key={`${s}-on-d`} size={s} defaultChecked disabled label={`On, ${s}, disabled`} />,
      ])}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('switch')).toHaveLength(12);
    await expect(canvas.getByRole('switch', { name: 'On, lg, disabled' })).toBeDisabled();
    await expect(canvas.getByRole('switch', { name: 'On, sm' })).toBeChecked();
  },
};

// Show label off: needs an aria-label (table cells, Setting Row).
export const NoLabel: Story = {
  args: { label: undefined, 'aria-label': 'Payment reminders' },
  play: async ({ canvas }) => {
    const sw = canvas.getByRole('switch', { name: 'Payment reminders' });
    await expect(size(sw)).toEqual([36, 20]);
    await userEvent.click(sw);
    await expect(sw).toBeChecked();
  },
};

// Stress (Figma "Stress test / Switch"): long label 2 lines then ellipsis, description 3 lines, the track keeps
// its size, narrow 120 column, short label, no label, checked with long text; columns 276 and 368.
const longLabel = 'Email notifications with a much longer label than planned for this settings page';
const longDescription = 'Get an email when a customer pays an invoice, when a payment fails and when a refund is issued. Emails go to every admin of the workspace. This sentence is deliberately long to check the clamp.';
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <div data-case="long" className="w-[167px]"><Switch label={longLabel} /></div>
      <div data-case="short" className="w-[167px]"><Switch label="A" /></div>
      <div data-case="all-on" className="w-[167px]"><Switch label={longLabel} description={longDescription} /></div>
      <div data-case="all-off" className="w-[167px]"><Switch aria-label="Email notifications" /></div>
      <div data-case="narrow" className="w-[120px]"><Switch label={longLabel} /></div>
      <div data-case="checked" className="w-[167px]"><Switch defaultChecked label={longLabel} /></div>
      <div data-case="sm" className="w-[167px]"><Switch size="sm" label={longLabel} description={longDescription} /></div>
      <div data-case="w276" className="w-[276px]"><Switch size="lg" label={longLabel} description={longDescription} /></div>
      <div data-case="w368" className="w-[368px]"><Switch label={longLabel} description={longDescription} /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cases = canvasElement.querySelectorAll<HTMLElement>('[data-case]');
    for (const c of cases) {
      await expect(c.scrollWidth).toBeLessThanOrEqual(c.clientWidth);
      const sw = c.querySelector('[role="switch"]')!;
      const expected = c.dataset.case === 'sm' ? [28, 16] : c.dataset.case === 'w276' ? [44, 24] : [36, 20];
      await expect(size(sw)).toEqual(expected);
    }
    const q = (k: string, slot: string) => canvasElement.querySelector(`[data-case="${k}"] [data-slot="${slot}"]`) as HTMLElement;
    // Label: 2 lines max (40 px), then an ellipsis.
    await expect(Math.round(q('long', 'switch-label').getBoundingClientRect().height)).toBe(40);
    await expect(Math.round(q('narrow', 'switch-label').getBoundingClientRect().height)).toBe(40);
    await expect(q('narrow', 'switch-label').scrollHeight).toBeGreaterThan(q('narrow', 'switch-label').clientHeight);
    await expect(Math.round(q('short', 'switch-label').getBoundingClientRect().height)).toBe(20);
    // Description: 3 lines max.
    await expect(Math.round(q('all-on', 'switch-description').getBoundingClientRect().height)).toBe(60);
    await expect(Math.round(q('sm', 'switch-description').getBoundingClientRect().height)).toBe(48);
    await expect(Math.round(q('w368', 'switch-field').getBoundingClientRect().width)).toBe(368);
  },
};

// Theme copies: axe checks contrast in each mode (hidden from the sidebar).
export const AllStatesDark: Story = { ...AllStates, tags: ['!dev'], globals: { theme: 'Dark' } };
export const AllStatesCorporate: Story = { ...AllStates, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const DisabledDark: Story = { ...Disabled, tags: ['!dev'], globals: { theme: 'Dark' } };

// A controlled switch, as a settings page uses it: the change applies at once.
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => {
    const [on, setOn] = React.useState(false);
    return (
      <div className="flex flex-col gap-2">
        <Switch label="Payment reminders" checked={on} onCheckedChange={setOn} />
        <p className="text-sm text-muted-foreground">Payment reminders are {on ? 'on' : 'off'}.</p>
      </div>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('switch'));
    await expect(canvas.getByText('Payment reminders are on.')).toBeInTheDocument();
  },
};
