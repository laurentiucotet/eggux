import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ValidationErrorList, type ValidationError, type ValidationGroupBy } from './validation-error-list';

type Args = { groupBy: ValidationGroupBy; errorCount: number; title: string; width: number };

const all: ValidationError[] = [
  { id: 'e1', row: 3, column: 'email', message: 'This is not a valid email address.', value: 'ana@acme' },
  { id: 'e2', row: 3, column: 'plan', message: 'Plan must be free, team or business.', value: 'gold' },
  { id: 'e3', row: 7, column: 'email', message: 'Email is required.', value: '' },
  { id: 'e4', row: 12, column: 'signed_up_on', message: 'Date must look like 2025-03-14.', value: '14/03/2025' },
  { id: 'e5', row: 19, column: 'email', message: 'This email appears twice in the file.', value: 'ion@acme.com' },
  { id: 'e6', row: 21, column: 'monthly_budget_eur', message: 'Budget must be a whole number of euros.', value: '1,200.50' },
];

const onJump = fn();

const meta = {
  title: 'Components/Data Transfer/Validation Error List',
  parameters: {
    docs: {
      description: {
        component:
          'The errors found in a file before an import, grouped by row or by column with a segmented switch. Each error has the message, the offending value in mono and a "Go to row" action that calls onJump(row, column). Errors are data; nothing is validated here. Code only (no Figma component yet).',
      },
    },
  },
  args: { groupBy: 'row', errorCount: 6, title: 'Fix these before importing', width: 560 },
  argTypes: {
    groupBy: { name: 'Group by', control: 'inline-radio', options: ['row', 'column'], description: 'Start grouped by row or by column.', table: { category: 'List' } },
    errorCount: { name: 'Errors', control: { type: 'range', min: 0, max: 6, step: 1 }, description: 'How many of the sample errors to show. Zero shows the empty state.', table: { category: 'List' } },
    title: { name: 'Title', control: 'text', description: 'The heading.', table: { category: 'List' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 720, step: 4 }, description: 'Container width in px.', table: { category: 'List' } },
  },
  render: ({ groupBy, errorCount, width, title }) => (
    <div style={{ width }} className="max-w-full">
      <ValidationErrorList key={groupBy} title={title} errors={all.slice(0, errorCount)} defaultGroupBy={groupBy} onJump={onJump} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <ValidationErrorList errors={all} onJump={onJump} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: /Fix these before importing/ })).toBeVisible();
    await expect(canvas.getByText('6 errors')).toBeVisible();
    // Grouped by row: row 3 holds two errors.
    const row3 = canvas.getByRole('heading', { name: /Row 3/ }).closest('li') as HTMLElement;
    await expect(within(row3).getAllByRole('listitem')).toHaveLength(2);
    await expect(within(row3).getByText('ana@acme')).toBeVisible();
    // An empty value is named, not left blank.
    await expect(canvas.getByText('(empty)')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Go to row 12, column signed_up_on' }));
    await waitFor(() => expect(onJump).toHaveBeenCalledWith(12, 'signed_up_on'));
  },
};

/** Grouped by column: every email problem together. */
export const ByColumn: Story = { args: { groupBy: 'column' } };

export const ByColumnCheck: Story = {
  tags: ['!dev'],
  render: () => <ValidationErrorList errors={all} defaultGroupBy="row" onJump={onJump} />,
  play: async ({ canvas }) => {
    // Keyboard: the switch is a radio group; the arrow moves focus, Space picks.
    const byRow = canvas.getByRole('radio', { name: 'By row' });
    await expect(byRow).toBeChecked();
    byRow.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'By column' })).toHaveFocus());
    await userEvent.keyboard(' ');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'By column' })).toBeChecked());
    const email = canvas.getByRole('heading', { name: /Column email/ }).closest('li') as HTMLElement;
    await expect(within(email).getAllByRole('listitem')).toHaveLength(3);
    await expect(canvas.queryByRole('heading', { name: /Row 3/ })).toBeNull();
  },
};

export const EmptyCheck: Story = {
  tags: ['!dev'],
  args: { errorCount: 0 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No errors found. The file is ready to import.')).toBeVisible();
    await expect(canvas.queryByRole('radio')).toBeNull();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ValidationErrorList
      title="Fix these before importing the quarterly customer file"
      errors={[
        { id: 'a', row: 1204, column: 'subscription_renewal_date_in_local_time_zone', message: 'The renewal date must be a real calendar date written as YYYY-MM-DD.', value: '2025-02-30T00:00:00+02:00-not-a-date' },
        { id: 'b', row: 1204, column: 'email', message: 'Email is required.', value: '' },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('region');
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
    await expect(canvas.getAllByRole('button', { name: /Go to row/ })).toHaveLength(2);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
