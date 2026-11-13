import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { RatingBreakdown } from './rating-breakdown';

type Args = { reviews: 'many' | 'few' | 'none'; interactive: boolean };

const sets = {
  many: [62, 20, 8, 4, 6] as [number, number, number, number, number],
  few: [1, 0, 1, 0, 0] as [number, number, number, number, number],
  none: [0, 0, 0, 0, 0] as [number, number, number, number, number],
};

const meta = {
  title: 'Components/Data Display/Rating Breakdown',
  parameters: {
    docs: {
      description: {
        component:
          'The summary above a list of reviews: average, number of reviews and one row per star level with a bar, a count and a share. With interactive on, the rows are buttons that filter by level (aria-pressed). Every number is text; bars never carry meaning alone. Code only (no Figma component yet).',
      },
    },
  },
  args: { reviews: 'many', interactive: true },
  argTypes: {
    reviews: { name: 'Reviews', control: 'inline-radio', options: ['many', 'few', 'none'], description: 'How many reviews there are.', table: { category: 'Data' } },
    interactive: { name: 'Interactive', control: 'boolean', description: 'Rows filter the reviews by level.', table: { category: 'Parts' } },
  },
  render: function Render({ reviews, interactive }) {
    const [selected, setSelected] = React.useState<number | null>(null);
    return (
      <div className="w-80 max-w-full">
        <RatingBreakdown counts={sets[reviews]} selected={selected} onSelect={interactive ? setSelected : undefined} />
        {selected ? <p role="status" className="m-0 mt-3 text-sm text-muted-foreground">Showing {selected}-star reviews</p> : null}
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/* Hidden checks */

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    // 62*5 + 20*4 + 8*3 + 4*2 + 6*1 = 428 over 100 reviews = 4.3.
    await expect(canvas.getByRole('region', { name: 'Customer reviews' })).toHaveTextContent('4.3');
    await expect(canvas.getByText(/from 100 reviews/)).toBeVisible();
    const five = canvas.getByRole('button', { name: /^5 stars.*62 reviews.*62%/ });
    await expect(five).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(five);
    await waitFor(() => expect(canvas.getByRole('button', { name: /^5 stars.*62 reviews.*62%/ })).toHaveAttribute('aria-pressed', 'true'));
    await expect(canvas.getByRole('status')).toHaveTextContent('Showing 5-star reviews');
    // Pressing it again clears the filter.
    await userEvent.click(canvas.getByRole('button', { name: /^5 stars.*62 reviews.*62%/ }));
    await waitFor(() => expect(canvas.queryByRole('status')).not.toBeInTheDocument());
  },
};

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /^5 stars/ })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /^4 stars/ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /^4 stars/ })).toHaveAttribute('aria-pressed', 'true'));
    // Row height is a comfortable target.
    await expect(canvas.getByRole('button', { name: /^4 stars/ }).getBoundingClientRect().height).toBeGreaterThanOrEqual(32);
  },
};

export const StaticCheck: Story = {
  tags: ['!dev'],
  args: { interactive: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('button')).toHaveLength(0);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(5);
  },
};

export const EdgeCheck: Story = {
  tags: ['!dev'],
  args: { reviews: 'none' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/from 0 reviews/)).toBeVisible();
    await expect(canvas.getByRole('region')).toHaveTextContent('0.0');
    await expect(canvas.getAllByText('(0%)')).toHaveLength(5);
  },
};

export const FewCheck: Story = {
  tags: ['!dev'],
  args: { reviews: 'few' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/from 2 reviews/)).toBeVisible();
    await expect(canvas.getByRole('region')).toHaveTextContent('4.0');
    await expect(canvas.getByRole('button', { name: /^5 stars.*1 review.*50%/ })).toBeVisible();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <RatingBreakdown counts={[1284300, 420000, 98000, 4000, 61000]} onSelect={() => undefined} />,
  play: async ({ canvasElement, canvas }) => {
    const root = canvasElement.firstElementChild as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    await expect(canvas.getByText('1,284,300')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
