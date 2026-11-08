import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Building, Package } from '@/components/icons';
import { ImagePlaceholder } from './image-placeholder';
import { OptionCard, OptionCardGroup } from './option-card';

const meta = {
  title: 'Components/Card/Option Card',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Selectable card: a radio option (or a checkbox) with more context. The whole card is the click target; selected = 2 px primary border + checked control, never color alone. Layout default, media (280, preview on top) or compact (12 padding, 32 tile). Group 2-4 in a radiogroup with a label; arrow keys move between options. Figma: Card page / Option Card. Guide: eggux build-ui/components/card.md' } },
  },
} satisfies Meta;
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
type Playground = {
  control: 'radio' | 'checkbox';
  layout: 'default' | 'media' | 'compact';
  options: number;
  showIcon: boolean;
  showDescription: boolean;
  disableLast: boolean;
};

const shipping = [
  { value: 'standard', title: 'Standard shipping', description: 'Delivered in 3-5 business days.', icon: <Building /> },
  { value: 'express', title: 'Express shipping', description: 'Delivered tomorrow.', icon: <Package /> },
  { value: 'pickup', title: 'Pick-up point', description: 'Collect it from 2,400 lockers.', icon: <Building /> },
  { value: 'same-day', title: 'Same day', description: 'Order before 12:00 in Bucharest.', icon: <Package /> },
];

function PlaygroundCards(a: Playground) {
  const [value, setValue] = React.useState('standard');
  const shown = shipping.slice(0, a.options);
  const card = (s: (typeof shipping)[number], i: number) => (
    <OptionCard
      key={s.value}
      value={a.control === 'radio' ? s.value : undefined}
      control={a.control}
      defaultChecked={a.control === 'checkbox' ? i === 0 : undefined}
      layout={a.layout}
      media={a.layout === 'media' ? <ImagePlaceholder ratio="16:9" /> : undefined}
      title={s.title}
      description={a.showDescription ? s.description : undefined}
      icon={a.showIcon && a.layout !== 'media' ? s.icon : undefined}
      disabled={a.disableLast && i === shown.length - 1}
    />
  );
  if (a.control === 'checkbox') {
    return (
      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-2 text-sm font-medium">Delivery options</legend>
        {shown.map(card)}
      </fieldset>
    );
  }
  return (
    <OptionCardGroup value={value} onValueChange={setValue} aria-label="Delivery" className={a.layout === 'media' ? 'grid-flow-col' : undefined}>
      {shown.map(card)}
    </OptionCardGroup>
  );
}

/** Playground: every Option Card option in Controls. */
export const Default: StoryObj<Playground> = {
  argTypes: {
    control: { name: 'Control', control: 'inline-radio', options: ['radio', 'checkbox'], description: 'radio: one choice in a group. checkbox: several.', table: { category: 'Option Card' } },
    layout: { name: 'Layout', control: 'inline-radio', options: ['default', 'media', 'compact'], description: 'media: 280 wide, preview on top. compact: 12 padding, 32 tile.', table: { category: 'Option Card' } },
    options: { name: 'Number of cards', control: { type: 'range', min: 2, max: 4, step: 1 }, table: { category: 'Option Card' } },
    showIcon: { name: 'Show icon', control: 'boolean', description: 'Not with Layout media', table: { category: 'Option Card' } },
    showDescription: { name: 'Show description', control: 'boolean', table: { category: 'Option Card' } },
    disableLast: { name: 'Disable last card', control: 'boolean', table: { category: 'Option Card' } },
  },
  args: { control: 'radio', layout: 'default', options: 2, showIcon: true, showDescription: true, disableLast: false },
  render: a => <PlaygroundCards key={`${a.control}-${a.layout}`} {...a} />,
};

// The checks that used to run on Default (hidden; the playground has no play function).
export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Group />,
  play: async ({ canvas, canvasElement }) => {
    const standard = canvas.getByRole('radio', { name: 'Standard shipping' });
    // Measure the unselected card: Standard starts selected and its 2 px border makes it 82 (see Selected).
    // The height does not depend on the font: text-sm has a fixed 20 px line height.
    const el = cardOf(canvas.getByRole('radio', { name: 'Express shipping' }));
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
  parameters: { controls: { disable: true } },
  render: () => <Group />,
  play: async ({ canvas }) => {
    const el = cardOf(canvas.getByRole('radio', { name: 'Standard shipping' }));
    await expect(getComputedStyle(el).borderTopWidth).toBe('2px');
    await expect(getComputedStyle(el).borderTopColor).toBe(probe('border-primary border').border);
    await expect(Math.round(box(el).height)).toBe(82);
  },
};

// State=hover: accent fill.
// The background a :hover rule gives `el`, resolved to rgb. userEvent.hover only dispatches pointer
// events: Chromium does not enter the CSS :hover state for them, so the hover style is read from
// the stylesheet (Tailwind v4 nests it: .hover\:bg-accent { &:hover { @media (hover: hover) { ... } } }).
const hoverBackground = (el: Element) => {
  let found: string | undefined;
  const walk = (rules: CSSRuleList, parent: string) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        const selector = parent ? rule.selectorText.replace(/&/g, parent) : rule.selectorText;
        if (selector.includes(':hover')) {
          const base = selector.replace(/:hover/g, '');
          let matches = false;
          try { matches = el.matches(base); } catch { /* selector the DOM API cannot parse */ }
          if (matches && rule.style.backgroundColor) found = rule.style.backgroundColor;
        }
        walk(rule.cssRules, selector);
      } else if ('cssRules' in rule) {
        walk((rule as CSSGroupingRule).cssRules, parent);
      }
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try { walk(sheet.cssRules, ''); } catch { /* cross-origin sheet (Google Fonts) */ }
  }
  if (!found) return undefined;
  const p = document.createElement('span');
  p.style.backgroundColor = found;
  el.append(p);
  const value = getComputedStyle(p).backgroundColor;
  p.remove();
  return value;
};

export const Hover: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Group />,
  play: async ({ canvas }) => {
    const el = cardOf(canvas.getByRole('radio', { name: 'Express shipping' }));
    await userEvent.hover(el);
    await expect(hoverBackground(el)).toBe(probe('bg-accent').bg);
  },
};

// Keyboard: Tab reaches the group, arrows move and select, the focus ring shows on the card.
export const Keyboard: Story = {
  parameters: { controls: { disable: true } },
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

// State=disabled: the control is disabled; control, icon and title fade to 50%, the description keeps
// its muted color (faded it fails the 4.5:1 contrast); clicks do nothing.
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Group disabledValue="express" />,
  play: async ({ canvas }) => {
    const express = canvas.getByRole('radio', { name: 'Express shipping' });
    await expect(express).toBeDisabled();
    const card = cardOf(express);
    await expect(getComputedStyle(express).opacity).toBe('0.5');
    await expect(getComputedStyle(canvas.getByText('Express shipping')).opacity).toBe('0.5');
    await expect(getComputedStyle(card.querySelector('[data-slot="option-card-icon"]')!).opacity).toBe('0.5');
    await expect(getComputedStyle(canvas.getByText('Delivered tomorrow.')).opacity).toBe('1');
    await expect(getComputedStyle(card).opacity).toBe('1');
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
  parameters: { controls: { disable: true } },
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
  parameters: { controls: { disable: true } },
  render: () => <Group layout="media" />,
  play: async ({ canvas, canvasElement }) => {
    const el = cardOf(canvas.getByRole('radio', { name: 'Standard shipping' }));
    await expect(Math.round(box(el).width)).toBe(280);
    // The unselected card: 280 - 2 x 16 padding - 2 x 1 border = 246 (the selected one has a 2 px border: 244).
    const media = cardOf(canvas.getByRole('radio', { name: 'Express shipping' })).querySelector('[data-slot="option-card-media"]') as HTMLElement;
    await expect(Math.round(box(media).width)).toBe(246);
    await expect(Math.abs(box(media).height - (246 * 9) / 16)).toBeLessThan(1);
    await expect(canvasElement.querySelector('[data-slot="option-card-icon"]')).toBeNull();
  },
};

// Layout=compact: 12 padding, 32 tile, description on one line; 384 x 68 (selected 70).
export const Compact: Story = {
  parameters: { controls: { disable: true } },
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
export const LongTextNarrow: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'],
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
export const AllStatesLight: Story = { parameters: { controls: { disable: true } }, render: () => <AllStates />, name: 'All states' };
export const AllStatesDark: Story = { parameters: { controls: { disable: true } }, render: () => <AllStates />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'All states (Dark)' };
export const AllStatesCorporate: Story = { parameters: { controls: { disable: true } }, render: () => <AllStates />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'All states (Corporate Light)' };
