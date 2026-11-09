import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ColorInput, ColorPicker, Swatch, SwatchPicker, chartPresets, hexToHsv, hsvToHex, normalizeHex } from './color-picker';

const meta = {
  title: 'Components/Color Picker/Color Picker',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Color Picker: saturation area, hue slider, hex input with opacity and preset swatches; the area and slider move with the arrow keys (Shift for 10), the hex input is the typing path. Color Input: a field with a swatch that opens the picker in a Popover; an invalid hex shows the error. Swatch Picker: a short set of chart colors as a radio group, the name under it. Swatch: a color dot or a short label (S, M, L), selected with a ring, unavailable faded and named "out of stock". Figma: Color Picker page. Guide: eggux build-ui/components/color-picker.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const onPick = fn();

// Figma: 264 × 294; area 160, hue 12, hex input, 8 presets.
export const Picker: Story = {
  name: 'Color Picker',
  render: () => <ColorPicker defaultValue="#2563EB" presets={chartPresets} onValueChange={onPick} />,
  play: async ({ canvas, canvasElement }) => {
    const picker = canvasElement.querySelector('[data-slot="color-picker"]')!;
    await expect(Math.round(box(picker).width)).toBe(264);
    await expect(Math.abs(Math.round(box(picker).height) - 294)).toBeLessThanOrEqual(2);
    const hex = canvas.getByRole('textbox', { name: 'Hex color' });
    await expect(hex).toHaveValue('2563EB');
    await expect(canvas.getByRole('button', { name: 'Blue' })).toHaveAttribute('aria-pressed', 'true');
    // Keyboard: hue +10 with Shift, saturation down.
    const hue = canvas.getByRole('slider', { name: 'Hue' });
    const before = Number(hue.getAttribute('aria-valuenow'));
    hue.focus();
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');
    await expect(Number(hue.getAttribute('aria-valuenow'))).toBe((before + 10) % 360);
    const area = canvas.getByRole('slider', { name: 'Saturation and brightness' });
    area.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(area.getAttribute('aria-valuetext')).toMatch(/brightness \d+%/);
    await expect(onPick).toHaveBeenCalled();
    // Typing a hex (3 digits on blur).
    await userEvent.clear(hex);
    await userEvent.type(hex, '#0a0');
    await userEvent.tab();
    await expect(hex).toHaveValue('00AA00');
    await expect(onPick).toHaveBeenLastCalledWith('#00AA00');
    await userEvent.click(canvas.getByRole('button', { name: 'Rose' }));
    await expect(hex).toHaveValue('F43F5E');
  },
};

// Figma: 240 × 36; the swatch opens the picker in a Popover; an invalid hex is an error.
export const Input: Story = {
  name: 'Color Input',
  render: () => (
    <div className="flex flex-col gap-4">
      <ColorInput label="Brand color" defaultValue="#2563EB" presets={chartPresets} />
      <ColorInput label="Overlay color" defaultValue="#0A0A0A" opacity={60} />
      <ColorInput label="Disabled color" defaultValue="#16A34A" disabled />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const field = canvasElement.querySelector('[data-slot="color-input"]')!;
    await expect(Math.round(box(field).width)).toBe(240);
    await expect(Math.round(box(field.firstElementChild!).height)).toBe(36);
    const input = canvas.getByRole('textbox', { name: 'Brand color' });
    await userEvent.clear(input);
    await userEvent.type(input, '#12');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await userEvent.type(input, '3456');
    await expect(input).not.toHaveAttribute('aria-invalid');
    const swatch = canvas.getByRole('button', { name: 'Pick brand color, #123456' });
    await userEvent.click(swatch);
    const dialog = await within(document.body).findByRole('dialog');
    await expect(within(dialog).getByRole('textbox', { name: 'Hex color' })).toHaveValue('123456');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Green' }));
    await expect(input).toHaveValue('#16A34A');
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByText('60%')).toBeInTheDocument();
    await expect(canvas.getByRole('textbox', { name: 'Disabled color' })).toBeDisabled();
  },
};

const labelColors = [1, 2, 3, 4, 5, 6, 7, 8].map((i, k) => ({ value: `var(--chart-${i})`, name: ['Blue', 'Orange', 'Cyan', 'Amber', 'Fuchsia', 'Green', 'Violet', 'Rose'][k]! }));

// Figma: 252 × 52; a radio group of 28 swatches, the name under it; arrows move the choice.
export const Swatches: Story = {
  name: 'Swatch Picker',
  render: () => <SwatchPicker label="Label color" colors={labelColors} />,
  play: async ({ canvas, canvasElement }) => {
    const picker = canvasElement.querySelector('[data-slot="swatch-picker"]')!;
    await expect(Math.round(box(picker).width)).toBe(252);
    await expect(Math.round(box(picker).height)).toBe(52);
    const blue = canvas.getByRole('radio', { name: 'Blue' });
    await expect(blue).toBeChecked();
    await expect(Math.round(box(blue).width)).toBe(28);
    blue.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: 'Orange' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Orange' })).toHaveFocus();
    await expect(picker).toHaveTextContent('Orange');
  },
};

function Sizes() {
  const [size, setSize] = React.useState('M');
  return (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label="Size" className="flex gap-2">
        {['S', 'M', 'L', 'XL'].map(s => <Swatch key={s} label={s} name={s === 'XL' ? 'Extra large' : s} selected={size === s} unavailable={s === 'XL'} onClick={() => setSize(s)} />)}
      </div>
      <div role="group" aria-label="Color" className="flex gap-2">
        <Swatch color="var(--chart-1)" name="Ocean" selected showName />
        <Swatch color="var(--chart-2)" name="Sand" showName />
        <Swatch color="var(--chart-6)" name="Forest" unavailable showName />
      </div>
    </div>
  );
}

// Figma: color 36 (26 dot), label 36 high, selected 2 px ring, unavailable 40% and "out of stock".
export const SwatchStates: Story = {
  name: 'Swatch',
  render: () => <Sizes />,
  play: async ({ canvas }) => {
    const m = canvas.getByRole('button', { name: 'M' });
    await expect(m).toHaveAttribute('aria-pressed', 'true');
    await expect(Math.round(box(m).height)).toBe(36);
    const xl = canvas.getByRole('button', { name: 'XL, Extra large, out of stock' });
    await userEvent.click(xl);
    await expect(xl).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'L' }));
    await expect(canvas.getByRole('button', { name: 'L' })).toHaveAttribute('aria-pressed', 'true');
    await expect(Math.round(box(canvas.getByRole('button', { name: 'Ocean' })).width)).toBe(36);
    await expect(canvas.getByText('Sand')).toBeInTheDocument();
  },
};

// Color math round trips, short hex, bad input. Tests only.
export const ColorMath: Story = {
  tags: ['!dev'],
  render: () => <ColorPicker defaultValue="#808080" />,
  play: async ({ canvas }) => {
    await expect(normalizeHex('abc')).toBe('#AABBCC');
    await expect(normalizeHex('#2563eb')).toBe('#2563EB');
    await expect(normalizeHex('#12345')).toBeNull();
    for (const h of ['#2563EB', '#C2410C', '#000000', '#FFFFFF', '#16A34A']) await expect(hsvToHex(hexToHsv(h))).toBe(h);
    // A grey keeps its hue when saturation comes back.
    const hue = canvas.getByRole('slider', { name: 'Hue' });
    hue.focus();
    await userEvent.keyboard('{Shift>}{ArrowRight}{ArrowRight}{/Shift}');
    await expect(hue).toHaveAttribute('aria-valuenow', '20');
  },
};

const All = () => (
  <div className="flex items-start gap-8">
    <ColorPicker presets={chartPresets} />
    <div className="flex flex-col gap-6">
      <ColorInput label="Brand color" presets={chartPresets} />
      <SwatchPicker label="Label color" colors={labelColors} />
      <Sizes />
    </div>
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
