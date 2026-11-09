import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Figure } from './figure';

const meta = {
  title: 'Components/Description List/Figure',
  component: Figure,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A number with what it counts. Stacked (value over label, optional source and divider) for report headers and key facts; inline (value then label on one baseline) for counts in a profile or header. Every label reads on its own; add the source when the number is a claim. Tone on-primary for primary bands. A metric compared to a period goes in Stat Card. Figma: Description List page / Figure.' } },
  },
  args: { value: '47 days', label: 'average time to get paid' },
  render: args => <div className="w-[240px]"><Figure {...args} /></div>,
} satisfies Meta<typeof Figure>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Layout=stacked, Size=default: 56 high (32 value, 20 label, 4 gap).
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="figure"]')!).height)).toBe(56);
  },
};

// Sizes and layouts: stacked lg 60, inline 28, inline lg 32; source and divider.
export const Layouts: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <div className="w-[240px]"><Figure value="47 days" label="average time to get paid" size="lg" source="Acme survey, September 2026" divider /></div>
      <Figure layout="inline" value="42" label="articles" />
      <Figure layout="inline" size="lg" value="1.2k" label="followers" />
      <div className="w-[240px]"><Figure value="47 days" label="average time to get paid" size="lg" /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [withSource, inline, inlineLg, lg] = canvasElement.querySelectorAll('[data-slot="figure"]');
    await expect(Math.round(box(lg!).height)).toBe(60);
    await expect(Math.round(box(inline!).height)).toBe(28);
    await expect(Math.round(box(inlineLg!).height)).toBe(32);
    await expect(Math.round(box(withSource!).height)).toBe(60 + 4 + 16 + 4 + 1);
  },
};

// Tone=on-primary on a primary band.
export const OnPrimary: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex gap-10 rounded-xl bg-primary p-8">
      <div className="w-[200px]"><Figure tone="on-primary" value="12,400" label="teams on Acme" source="October 2026" /></div>
      <Figure tone="on-primary" layout="inline" value="99.98%" label="uptime" />
    </div>
  ),
};

// Stress: long value and label truncate at 160; inline stays on one line. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="w-[160px]"><Figure value="€12,480,000.00" label="total collected through automated reminders" /></div>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="figure"]')!;
    await expect(Math.round(box(root).height)).toBe(56);
    const label = root.querySelector<HTMLElement>('[title]')!;
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: OnPrimary.render };
export const DefaultCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: OnPrimary.render };
