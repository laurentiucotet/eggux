import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { ColumnMapper, SKIP, type ColumnMapping, type MapperColumn, type MapperField } from './column-mapper';

type Args = { startWith: 'Nothing mapped' | 'Matched' | 'Duplicate'; columnCount: number; width: number };

const allColumns: MapperColumn[] = [
  { id: 'c1', header: 'email', samples: ['ana@acme.com', 'ion@acme.com', 'maria@northwind.com'] },
  { id: 'c2', header: 'Full Name', samples: ['Ana Popescu', 'Ion Marin'] },
  { id: 'c3', header: 'Company', samples: ['Acme Ltd', 'Northwind'] },
  { id: 'c4', header: 'Plan tier', samples: ['team', 'free', 'business'] },
  { id: 'c5', header: 'Spend', samples: ['1200', '0', '5400'] },
  { id: 'c6', header: 'Joined', samples: ['2025-03-14', '2025-03-15'] },
];

const fields: MapperField[] = [
  { id: 'email', label: 'Email', required: true },
  { id: 'full_name', label: 'Full name', required: true },
  { id: 'company', label: 'Company' },
  { id: 'plan', label: 'Plan' },
  { id: 'monthly_budget_eur', label: 'Monthly budget (EUR)' },
  { id: 'signed_up_on', label: 'Signed up on' },
];

const starts: Record<Args['startWith'], ColumnMapping> = {
  'Nothing mapped': {},
  Matched: { c1: 'email', c2: 'full_name', c3: 'company', c4: 'plan', c5: 'monthly_budget_eur', c6: SKIP },
  Duplicate: { c1: 'email', c2: 'full_name', c3: 'email' },
};

const meta = {
  title: 'Components/Data Transfer/Column Mapper',
  parameters: {
    docs: {
      description: {
        component:
          'The import step that matches each file column to a field: file column with sample values, a Select of fields (or Do not import), required fields marked, an error on both rows when two columns take the same field, and a Match automatically button that fills empty rows by name. Controlled with value / onValueChange or uncontrolled. Code only (no Figma component yet).',
      },
    },
  },
  args: { startWith: 'Nothing mapped', columnCount: 6, width: 640 },
  argTypes: {
    startWith: { name: 'Start with', control: 'inline-radio', options: ['Nothing mapped', 'Matched', 'Duplicate'], description: 'The mapping the step opens with.', table: { category: 'Mapper' } },
    columnCount: { name: 'File columns', control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'Columns in the file.', table: { category: 'Mapper' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 800, step: 4 }, description: 'Container width in px.', table: { category: 'Mapper' } },
  },
  render: ({ startWith, columnCount, width }) => (
    <div style={{ width }} className="max-w-full">
      <ColumnMapper key={startWith} columns={allColumns.slice(0, columnCount)} fields={fields} defaultValue={starts[startWith]} onValueChange={fn()} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <ColumnMapper columns={allColumns} fields={fields} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Match your columns' })).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('0 of 2 required fields matched. Still needed: Email, Full name.');
    // Sample values are shown in mono next to the header.
    await expect(canvas.getByText('ana@acme.com, ion@acme.com, maria@northwind.com')).toBeVisible();
    // Automatic match fills the three columns whose names equal a field.
    await userEvent.click(canvas.getByRole('button', { name: 'Match automatically' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Matched 3 columns by name.'));
    await expect(canvas.getByRole('combobox', { name: 'Field for column Full Name' })).toHaveTextContent('Full name');
    await expect(canvas.getByRole('combobox', { name: 'Field for column Plan tier' })).toHaveTextContent('Choose a field');
  },
};

/** Two columns on the same field: both rows show the error. */
export const DuplicateMapping: Story = { args: { startWith: 'Duplicate' } };

export const DuplicateCheck: Story = {
  tags: ['!dev'],
  render: () => <ColumnMapper columns={allColumns} fields={fields} defaultValue={{ c1: 'email', c2: 'full_name' }} />,
  play: async ({ canvas }) => {
    const company = canvas.getByRole('combobox', { name: 'Field for column Company' });
    await expect(company).not.toHaveAttribute('aria-invalid');
    // Keyboard path: Enter opens, arrows move, Enter picks "Email" (first option).
    company.focus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('listbox');
    await userEvent.keyboard('{Home}');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await waitFor(() => expect(company).toHaveAttribute('aria-invalid', 'true'));
    await expect(canvas.getByRole('combobox', { name: 'Field for column email' })).toHaveAttribute('aria-invalid', 'true');
    await expect(company).toHaveAccessibleDescription(/Already used by email/);
    await expect(canvas.getByRole('status')).toHaveTextContent('1 field is used twice.');
    // Pick another field: the error goes away.
    await userEvent.click(company);
    const again = await screen.findByRole('listbox');
    await userEvent.click(within(again).getByRole('option', { name: 'Company' }));
    await waitFor(() => expect(company).not.toHaveAttribute('aria-invalid'));
  },
};

export const SkipCheck: Story = {
  tags: ['!dev'],
  render: function Render() {
    const [m, setM] = React.useState<ColumnMapping>({ c1: 'email', c2: 'full_name' });
    return (
      <>
        <ColumnMapper columns={allColumns.slice(0, 3)} fields={fields} value={m} onValueChange={setM} />
        <p data-testid="mapping">{JSON.stringify(m)}</p>
      </>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('2 of 2 required fields matched.');
    await userEvent.click(canvas.getByRole('combobox', { name: 'Field for column Company' }));
    const list = await screen.findByRole('listbox');
    await userEvent.click(within(list).getByRole('option', { name: 'Do not import' }));
    await waitFor(() => expect(canvas.getByTestId('mapping')).toHaveTextContent('"c3":"skip"'));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ColumnMapper
      title="Match the columns of the quarterly customer file"
      columns={[
        { id: 'a', header: 'subscription_renewal_date_in_local_time_zone', samples: ['2025-03-14T00:00:00+02:00', '2025-03-15T00:00:00+02:00'] },
        { id: 'b', header: 'email', samples: ['a-very-long-address.for.testing.purposes@subdomain.example-company.com'] },
      ]}
      fields={[{ id: 'renewal', label: 'Subscription renewal date in the local time zone of the office', required: true }, ...fields]}
      defaultValue={{ a: 'renewal', b: 'renewal' }}
    />
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('region');
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
    await expect(canvas.getAllByText(/Already used by/)).toHaveLength(2);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
