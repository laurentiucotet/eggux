import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Building, Package } from '@/components/icons';
import { ImagePlaceholder } from './image-placeholder';
import { OptionCard, OptionCardGroup } from './option-card';

const meta = {
  title: 'Components/Card/Option Card',
  component: OptionCard,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Selectable card: a radio option (or a checkbox) with more context. The whole card is the click target; selected = 2 px primary border + checked control, never color alone. Layout default, media (280, preview on top) or compact (12 padding, 32 tile). Group 2-4 in a radiogroup with a label; arrow keys move between options. Figma: Card page / Option Card. Guide: eggux build-ui/components/card.md' } },
  },
  args: { title: 'Standard shipping', description: 'Delivered in 3-5 business days.', icon: <Building /> },
} satisfies Meta<typeof OptionCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const cardOf = (el: HTMLElement) => el.closest('[data-slot="option-card"]') as HTMLElement;
const probe = (cls: string) => {
  const p = document.createElement('span');
  p.className = cls;
  document.body.append(p);
  const s = getComputedStyle(p);
  const r = { bg: s.backgroundColor, border: s.borderTopColor, opacity: s.opacity };
  p.remove();
  return r;
};

const Group = ({ layout, disabledValue }: { layout?: 'default' | 'media' | 'compact'; disabledValue?: string }) => {
  const [value, setValue] = React.useState('standard');
  const media = layout === 'media' ? <ImagePlaceholder ratio="16:9" /> : undefined;
  return (
    <OptionCardGroup value={value} onValueChange={setValue} aria-label="Delivery" className={layout === 'media' ? 'grid-flow-col' : undefined}>
      <OptionCard value="standard" layout={layout} media={media} title="Standard shipping" description="Delivered in 3-5 business days." icon={layout === 'media' ? undefined : <Building />} disabled={disabledValue === 'standard'} />
      <OptionCard value="express" layout={layout} media={media} title="Express shipping" description="Delivered tomorrow." icon={layout === 'media' ? undefined : <Package />} disabled={disabledValue === 'express'} />
    </OptionCardGroup>
  );
};

// Figma State=default (Control=radio, Layout=default): 384 x 80, 16 padding, radius 12, icon box 40.
export const Default: Story = {
  render: () => <Group />,
  play: async ({ canvas, canvasElement }) => {
    const standard = canvas.getByRole('radio', { name: 'Standard shipping' });
    const el = cardOf(standard);
    await expect(Math.round(box(el).width)).toBe(384);
    await expect(Math.round(box(el).height)).toBe(80);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="option-card-icon"]')!).width)).toBe(40);
    await expect(standard).toBeChecked();
    await expect(standard).toHaveAccessibleDescription('Delivered in 3-5 business days.');
    await expect(canvas.getByRole('radiogroup', { name: 'Delivery' })).toBeVisible();
    // Unselected: 1 px border color. Clicking the card (not the control) selects it.
    const other = cardOf(canvas.getByRole('radio', { name: 'Express shipping' }));
    await expect(getComputedStyle(other).borderTopWidth).toBe('1px');
    await expect(getComputedStyle(other).borderTopColor).toBe(probe('border border-border').border);
    await userEvent.click(canvas.getByText('Delivered tomorrow.'));
    await expect(canvas.getByRole('radio', { name: 'Express shipping' })).toBeChecked();
  },
};

// State=selected: 2 px primary border (82 high), checked radio.
export const Selected: Story = {
  render: () => <Group />,
  play: async ({ canvas }) => {
    const el = cardOf(canvas.getByRole('radio', { name: 'Standard shipping' }));
    await expect(getComputedStyle(el).borderTopWidth).toBe('2px');
    await expect(getComputedStyle(el).borderTopColor).toBe(probe('border-primary border').border);
    await expect(Math.round(box(el).height)).toBe(82);
  },
};

// State=hover: accent fill.
export const Hover: Story = {
  render: () => <Group />,
  play: async ({ canvas }) => {
    const el = cardOf(canvas.getByRole('radio', { name: 'Express shipping' }));
    await userEvent.hover(el);
    await waitFor(() => expect(getComputedStyle(el).backgroundColor).toBe(probe('bg-accent').bg));
  },
};

// Keyboard: Tab reaches the group, arrows move and select, the focus ring shows on the card.
export const Keyboard: Story = {
  render: () => <Group />,
  play: async ({ canvas }) => {
    await userEvent.tab();
    const standard = canvas.getByRole('radio', { name: 'Standard shipping' });
    await expect(standard).toHaveFocus();
    await expect(getComputedStyle(cardOf(standard)).boxShadow).not.toBe('none');
    // Radix moves focus in a timeout and checks the radio while the arrow key is still down: hold the key.
    await userEvent.keyboard('{ArrowDown>}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Express shipping' })).toHaveFocus());
    await userEvent.keyboard('{/ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Express shipping' })).toBeChecked();
  },
};

// State=disabled: the control is disabled and the card fades to 50%; clicks do nothing.
export const Disabled: Story = {
  render: () => <Group disabledValue="express" />,
  play: async ({ canvas }) => {
    const express = canvas.getByRole('radio', { name: 'Express shipping' });
    await expect(express).toBeDisabled();
    await expect(getComputedStyle(cardOf(express)).opacity).toBe('0.5');
    await userEvent.click(canvas.getByText('Delivered tomorrow.'));
    await expect(express).not.toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Standard shipping' })).toBeChecked();
  },
};

// Control=checkbox: any number selected.
const Checkboxes = () => {
  const [a, setA] = React.useState(false);
  const [b, setB] = React.useState(true);
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
      <legend className="sr-only">Add-ons</legend>
      <OptionCard control="checkbox" checked={a} onCheckedChange={setA} title="Gift wrap" description="Wrapped in recycled paper." icon={<Package />} />
      <OptionCard control="checkbox" checked={b} onCheckedChange={setB} title="Insurance" description="Covers loss and damage up to EUR 500." icon={<Building />} />
    </fieldset>
  );
};
export const CheckboxControl: Story = {
  render: () => <Checkboxes />,
  play: async ({ canvas }) => {
    const gift = canvas.getByRole('checkbox', { name: 'Gift wrap' });
    const insurance = canvas.getByRole('checkbox', { name: 'Insurance' });
    await expect(gift).not.toBeChecked();
    await expect(insurance).toBeChecked();
    await userEvent.click(canvas.getByText('Wrapped in recycled paper.'));
    await expect(gift).toBeChecked();
    await expect(insurance).toBeChecked();
    await expect(Math.round(box(cardOf(gift)).height)).toBe(82);
  },
};

// Layout=media: 280 wide, a 16:9 preview on top, then title, description and control.
export const Media: Story = {
  render: () => <Group layout="media" />,
  play: async ({ canvas, canvasElement }) => {
    const el = cardOf(canvas.getByRole('radio', { name: 'Standard shipping' }));
    await expect(Math.round(box(el).width)).toBe(280);
    const media = canvasElement.querySelector('[data-slot="option-card-media"]') as HTMLElement;
    await expect(Math.round(box(media).width)).toBe(246);
    await expect(Math.abs(box(media).height - (246 * 9) / 16)).toBeLessThan(1);
    await expect(canvasElement.querySelector('[data-slot="option-card-icon"]')).toBeNull();
  },
};

// Layout=compact: 12 padding, 32 tile, description on one line; 384 x 68 (selected 70).
export const Compact: Story = {
  render: () => <Group layout="compact" />,
  play: async ({ canvas, canvasElement }) => {
    const [selected, other] = [canvas.getByRole('radio', { name: 'Standard shipping' }), canvas.getByRole('radio', { name: 'Express shipping' })].map(cardOf);
    await expect(Math.round(box(selected).height)).toBe(70);
    await expect(Math.round(box(other).height)).toBe(68);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="option-card-icon"]')!).width)).toBe(32);
  },
};

// Stress test: long title and description wrap in the default layout and truncate to one line in compact.
const long = { title: 'Express delivery to a pick-up point of your choice within the European Union', description: 'Delivered in 1-2 business days to more than twelve thousand pick-up points, with a text message when it arrives.' };
export const LongTextNarrow: Story = { tags: ['!dev'],
  render: () => (
    <OptionCardGroup defaultValue="a" aria-label="Delivery" className="w-[276px]">
      <OptionCard value="a" {...long} icon={<Package />} className="w-full" />
      <OptionCard value="b" {...long} icon={<Package />} layout="compact" className="w-full" />
    </OptionCardGroup>
  ),
  play: async ({ canvas }) => {
    const radios = canvas.getAllByRole('radio');
    const [a, b] = radios.map(cardOf);
    await expect(a.scrollWidth).toBeLessThanOrEqual(a.clientWidth);
    await expect(b.scrollWidth).toBeLessThanOrEqual(b.clientWidth);
    await expect(Math.round(box(b).height)).toBeLessThanOrEqual(90);
    await expect(Math.round(box(radios[0]).width)).toBe(16);
  },
};

const AllStates = () => (
  <div className="flex flex-col gap-6">
    <Group />
    <Group layout="compact" disabledValue="express" />
    <Checkboxes />
  </div>
);
export const AllStatesLight: Story = { render: () => <AllStates />, name: 'All states' };
export const AllStatesDark: Story = { render: () => <AllStates />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'All states (Dark)' };
export const AllStatesCorporate: Story = { render: () => <AllStates />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'All states (Corporate Light)' };
