import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Legend, type LegendItem } from './legend';

type Args = { items: number; toggleable: boolean; showValues: boolean };

const all: LegendItem[] = [
  { id: 'revenue', label: 'Revenue', value: 'EUR 84k' },
  { id: 'costs', label: 'Costs', value: 'EUR 51k' },
  { id: 'profit', label: 'Profit', value: 'EUR 33k' },
  { id: 'forecast', label: 'Forecast', value: 'EUR 90k' },
  { id: 'budget', label: 'Budget', value: 'EUR 80k' },
];

const meta = {
  title: 'Components/Data Display/Legend',
  parameters: {
    docs: {
      description: {
        component:
          'A standalone chart legend that can switch series on and off. Each item is a button with aria-pressed; a hidden series shows a hollow swatch and a struck-through label, so state is never color alone. At least one series stays visible. The chart filters its own data from the hidden list. Code only (no Figma component yet).',
      },
    },
  },
  args: { items: 3, toggleable: true, showValues: false },
  argTypes: {
    items: { name: 'Series', control: { type: 'range', min: 2, max: 5, step: 1 }, description: 'How many series.', table: { category: 'Legend' } },
    toggleable: { name: 'Toggleable', control: 'boolean', description: 'Items switch a series on and off. Off: a static list.', table: { category: 'Legend' } },
    showValues: { name: 'Show values', control: 'boolean', description: 'A value after each label.', table: { category: 'Parts' } },
  },
  render: function Render({ items, toggleable, showValues }) {
    return <Legend toggleable={toggleable} items={all.slice(0, items).map(i => ({ ...i, value: showValues ? i.value : undefined }))} />;
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The legend driving a chart's visible series. */
export const WithChart: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [hidden, setHidden] = React.useState<string[]>([]);
    const shown = all.slice(0, 3).filter(i => !hidden.includes(i.id));
    return (
      <div className="flex w-80 max-w-full flex-col gap-3">
        <Legend items={all.slice(0, 3)} hidden={hidden} onHiddenChange={setHidden} />
        <p className="m-0 text-sm text-foreground" role="status">
          Showing {shown.length} of 3 series: {shown.map(i => i.label).join(', ')}
        </p>
      </div>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Costs/ }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Showing 2 of 3 series: Revenue, Profit'));
  },
};

/* Hidden checks */

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list', { name: 'Chart legend' });
    await expect(list).toBeInTheDocument();
    const revenue = canvas.getByRole('button', { name: /Revenue/ });
    await expect(revenue).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(revenue);
    await waitFor(() => expect(canvas.getByRole('button', { name: /Revenue/ })).toHaveAttribute('aria-pressed', 'false'));
    await expect(canvas.getByText('Revenue')).toHaveClass('line-through');
    await userEvent.click(canvas.getByRole('button', { name: /Revenue/ }));
    await waitFor(() => expect(canvas.getByRole('button', { name: /Revenue/ })).toHaveAttribute('aria-pressed', 'true'));
  },
};

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onChange = fn();
    return <Legend items={all.slice(0, 3)} onHiddenChange={onChange} data-testid="legend" />;
  },
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /Revenue/ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /Revenue/ })).toHaveAttribute('aria-pressed', 'false'));
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /Costs/ })).toHaveFocus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(canvas.getByRole('button', { name: /Costs/ })).toHaveAttribute('aria-pressed', 'false'));
    // The last visible series cannot be switched off.
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('button', { name: /Profit/ })).toHaveAttribute('aria-pressed', 'true');
  },
};

export const StaticCheck: Story = {
  tags: ['!dev'],
  args: { toggleable: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('button')).toHaveLength(0);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <Legend
      defaultHidden={['costs']}
      items={[
        { id: 'a', label: 'Revenue from recurring subscriptions in all regions', value: 'EUR 1,284,300' },
        { id: 'costs', label: 'Costs', value: 'EUR 51k' },
        ...all.slice(2),
      ]}
    />
  ),
  play: async ({ canvasElement, canvas }) => {
    const ul = canvasElement.querySelector('ul')!;
    await expect(ul.scrollWidth).toBeLessThanOrEqual(ul.clientWidth + 1);
    await expect(canvas.getByRole('button', { name: /Costs/ })).toHaveAttribute('aria-pressed', 'false');
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
