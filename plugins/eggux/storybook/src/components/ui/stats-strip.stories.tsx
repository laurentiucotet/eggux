import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { StatsStrip } from './stats-strip';

type Args = { count: number; showSource: boolean; countUp: boolean; width: number };

const stats = [
  { value: 12400, label: 'Teams closing their books on Acme' },
  { value: 98.6, suffix: '%', decimals: 1, label: 'Invoices matched without a human' },
  { value: 4, prefix: '€', suffix: 'M', label: 'Saved on late-payment fees in 2026' },
  { value: 36, suffix: ' hours', label: 'Saved per month by the median team' },
];
const source = 'Source: Acme customer survey, 1,240 respondents, March 2026.';

const meta = {
  title: 'Components/Marketing/Stats Strip',
  parameters: {
    docs: {
      description: {
        component:
          'Three or four big numbers with a label each and one source line, for a landing page. Numbers have thousands separators and an optional prefix or suffix. Count-up is off by default and never runs with reduced motion. Stat Card is the dashboard tile with a trend. Code only (no Figma component yet).',
      },
    },
  },
  args: { count: 4, showSource: true, countUp: false, width: 880 },
  argTypes: {
    count: { name: 'Stats', control: { type: 'range', min: 3, max: 4, step: 1 }, description: 'Three or four numbers.', table: { category: 'Strip' } },
    countUp: { name: 'Count up', control: 'boolean', description: 'Count from 0 once on mount. Off by default.', table: { category: 'Strip' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 1040, step: 4 }, description: 'Container width in px.', table: { category: 'Strip' } },
    showSource: { name: 'Show source', control: 'boolean', description: 'The source line under the numbers.', table: { category: 'Parts' } },
  },
  render: ({ count, showSource, countUp, width }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <StatsStrip key={String(countUp)} stats={stats.slice(0, count)} source={showSource ? source : undefined} countUp={countUp} duration={900} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Numbers count from 0 once; turned off by the reduced-motion setting. */
export const CountUp: Story = { args: { countUp: true } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <StatsStrip stats={stats} source={source} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Acme in numbers' })).toBeVisible();
    await expect(canvas.getByText('12,400')).toBeVisible();
    await expect(canvas.getByText('98.6%')).toBeVisible();
    await expect(canvas.getByText('€4M')).toBeVisible();
    await expect(canvas.getByText('Teams closing their books on Acme')).toBeVisible();
    await expect(canvas.getByText(source)).toBeVisible();
    await expect(canvas.getAllByRole('term')).toHaveLength(4);
  },
};

export const CountUpCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <StatsStrip stats={stats.slice(0, 3)} countUp duration={200} />,
  play: async ({ canvas, step }) => {
    await step('the final value is always readable', async () => {
      await expect(canvas.getAllByText('12,400', { selector: '.sr-only' })).toHaveLength(1);
    });
    await step('the visible number reaches the target', async () => {
      await canvas.findByText('12,400', { selector: '[aria-hidden="true"]' }, { timeout: 3000 });
    });
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <StatsStrip
      stats={[
        { value: 1234567890, label: 'Invoices processed across every customer account since launch' },
        { value: 99.99, suffix: '%', decimals: 2, label: 'Uptime' },
        { value: 7, label: 'Offices' },
      ]}
      source="Source: Acme internal operations report for the financial year ending 31 March 2026, audited by an independent firm."
    />
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
    await expect(canvas.getByText('1,234,567,890')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
