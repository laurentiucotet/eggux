import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DateSeparator } from './date-separator';

type Args = { daysAgo: number; variant: 'pill' | 'line'; sticky: boolean };

// A fixed "now" keeps the labels the same on every run.
const NOW = new Date(2026, 9, 14, 15, 30);
const dayAgo = (n: number) => new Date(2026, 9, 14 - n, 9, 0);

const meta = {
  title: 'Components/Messaging/Date Separator',
  parameters: {
    docs: {
      description: {
        component:
          'The day label in a message list: Today, Yesterday or 12 Oct 2026, worked out from a fixed now. A pill or a line, sticky to the top of the scroll area by default. The label is a time element and the wrapper is a separator named by it. Code only (no Figma component yet).',
      },
    },
  },
  args: { daysAgo: 0, variant: 'pill', sticky: true },
  argTypes: {
    daysAgo: { name: 'Days ago', control: { type: 'range', min: 0, max: 40, step: 1 }, description: '0 is Today, 1 is Yesterday, older shows the date (now is 14 Oct 2026).', table: { category: 'Separator' } },
    variant: { name: 'Look', control: 'inline-radio', options: ['pill', 'line'], description: 'A centered chip, or a rule with the label in the middle.', table: { category: 'Separator' } },
    sticky: { name: 'Sticky', control: 'boolean', description: 'Stick to the top of the scroll area.', table: { category: 'Separator' } },
  },
  render: ({ daysAgo, variant, sticky }) => <DateSeparator date={dayAgo(daysAgo)} now={NOW} variant={variant} sticky={sticky} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col">
      <DateSeparator date={dayAgo(0)} now={NOW} />
      <DateSeparator date={dayAgo(1)} now={NOW} variant="line" />
      <DateSeparator date={dayAgo(2)} now={NOW} />
      <DateSeparator date={new Date(2025, 11, 31, 23, 59)} now={NOW} variant="line" />
      <DateSeparator date="2026-10-14T00:05:00" now="2026-10-14T23:59:00" />
      <DateSeparator date={dayAgo(9)} now={NOW} label="Last week" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('separator', { name: 'Yesterday' })).toBeVisible();
    await expect(canvas.getByRole('separator', { name: '12 Oct 2026' })).toBeVisible();
    await expect(canvas.getByRole('separator', { name: '31 Dec 2025' })).toBeVisible();
    // Midnight edge: 00:05 and 23:59 are the same calendar day.
    await expect(canvas.getAllByRole('separator', { name: 'Today' })).toHaveLength(2);
    await expect(canvas.getByRole('separator', { name: 'Last week' })).toBeVisible();
    await expect(canvas.getByText('Yesterday')).toHaveAttribute('datetime', '2026-10-13');
  },
};

/** Scroll the list: the day label stays at the top. */
export const InAList: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="h-64 w-[360px] max-w-full overflow-auto rounded-lg border border-border bg-background px-3" tabIndex={0} role="region" aria-label="Messages">
      {[3, 1, 0].map(n => (
        <div key={n}>
          <DateSeparator date={dayAgo(n)} now={NOW} />
          {[1, 2, 3, 4].map(i => (
            <p key={i} className="m-0 mb-2 w-fit max-w-[80%] rounded-xl rounded-bl-sm bg-muted px-3 py-2 text-sm leading-5 text-foreground">
              Message {i} of the day
            </p>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <DateSeparator date={dayAgo(30)} now={NOW} variant="line" label="A very long custom label for the day that goes on" />,
  play: async ({ canvas }) => {
    const sep = canvas.getByRole('separator');
    await expect(sep.scrollWidth).toBeLessThanOrEqual(sep.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
