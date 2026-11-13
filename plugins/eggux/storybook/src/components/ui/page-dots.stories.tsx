import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { PageDots } from './page-dots';

type Args = { count: number; current: number; interactive: boolean };

const meta = {
  title: 'Components/Mobile/Page Dots',
  parameters: {
    docs: {
      description: {
        component:
          'Dots under a pager or carousel: which page of how many. 8 px dots in a 24 px hit area; the current one is a wider pill. With a select handler each dot is a button named "Page 2 of 5"; without it the dots only show the position. Use for 2 to 7 pages; more pages need a counter. Code only (no Figma component yet).',
      },
    },
  },
  args: { count: 5, current: 0, interactive: true },
  argTypes: {
    count: { name: 'Pages', control: { type: 'range', min: 2, max: 7, step: 1 }, description: 'How many pages.', table: { category: 'Dots' } },
    current: { name: 'Current page', control: { type: 'range', min: 0, max: 6, step: 1 }, description: 'Index of the current page.', table: { category: 'Dots' } },
    interactive: { name: 'Interactive', control: 'boolean', description: 'Dots are buttons that select a page.', table: { category: 'Dots' } },
  },
  render: function Render({ count, current, interactive }) {
    const [page, setPage] = React.useState(current);
    React.useEffect(() => setPage(Math.min(current, count - 1)), [current, count]);
    return <PageDots count={count} current={Math.min(page, count - 1)} onSelect={interactive ? setPage : undefined} />;
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const first = canvas.getByRole('button', { name: 'Page 1 of 5' });
    await expect(first).toHaveAttribute('aria-current', 'page');
    // Hit area is at least 24 x 24.
    await expect(first.getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
    await userEvent.click(canvas.getByRole('button', { name: 'Page 3 of 5' }));
    await expect(canvas.getByRole('button', { name: 'Page 3 of 5' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('button', { name: 'Page 1 of 5' })).not.toHaveAttribute('aria-current');
    canvas.getAllByRole('button')[0]!.focus();
    await expect(canvas.getAllByRole('button')[0]).toHaveFocus();
  },
};

export const ReadOnlyCheck: Story = {
  tags: ['!dev'],
  args: { interactive: false, current: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('button')).toHaveLength(0);
    await expect(canvas.getByText('Page 2 of 5')).toBeInTheDocument();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <PageDots count={7} current={6} onSelect={() => undefined} />,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(7);
    await expect(canvas.getByRole('button', { name: 'Page 7 of 7' })).toHaveAttribute('aria-current', 'page');
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
