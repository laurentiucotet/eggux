import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { TemplateDownloadCard, type TemplateColumn } from './template-download-card';

type Args = {
  title: string;
  description: string;
  showFormats: 'CSV' | 'CSV and XLSX' | 'CSV, XLSX and JSON';
  showFile: boolean;
  columnCount: number;
  asLink: boolean;
  columnsOpen: boolean;
  width: number;
};

const allColumns: TemplateColumn[] = [
  { name: 'email', required: true, description: 'Work email. Used to match existing customers.', example: 'ana@acme.com' },
  { name: 'full_name', required: true, description: 'First and last name.', example: 'Ana Popescu' },
  { name: 'company', description: 'Company the customer works for.', example: 'Acme Ltd' },
  { name: 'plan', description: 'One of free, team or business.', example: 'team' },
  { name: 'monthly_budget_eur', description: 'Whole euros, no currency symbol.', example: '1200' },
  { name: 'signed_up_on', description: 'Date as YYYY-MM-DD.', example: '2025-03-14' },
];

const onDownload = fn();

const meta = {
  title: 'Components/Data Transfer/Template Download Card',
  parameters: {
    docs: {
      description: {
        component:
          'A card that offers a sample file before an import: title, one sentence, format badges, file name and size, a Download button and a "What columns are needed" disclosure with each column marked Required or Optional. Nothing is generated here: the button calls onDownload with the first format or follows a link. Code only (no Figma component yet).',
      },
    },
  },
  args: {
    title: 'Customer import template',
    description: 'Start from this file so the columns match what the import expects.',
    showFormats: 'CSV and XLSX',
    showFile: true,
    columnCount: 6,
    asLink: false,
    columnsOpen: false,
    width: 420,
  },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'What the template is for.', table: { category: 'Card' } },
    description: { name: 'Description', control: 'text', description: 'One sentence under the title.', table: { category: 'Card' } },
    showFormats: { name: 'Formats', control: 'select', options: ['CSV', 'CSV and XLSX', 'CSV, XLSX and JSON'], description: 'The format badges.', table: { category: 'Card' } },
    columnCount: { name: 'Columns', control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'How many columns the disclosure lists.', table: { category: 'Card' } },
    columnsOpen: { name: 'Columns open', control: 'boolean', description: 'Start with the column list open.', table: { category: 'Card' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 520, step: 4 }, description: 'Container width in px.', table: { category: 'Card' } },
    showFile: { name: 'Show file name', control: 'boolean', description: 'File name and size under the badges.', table: { category: 'Parts' } },
    asLink: { name: 'Download as link', control: 'boolean', description: 'A real link instead of a button with a callback.', table: { category: 'Parts' } },
  },
  render: ({ showFormats, showFile, columnCount, asLink, columnsOpen, width, ...args }) => (
    <div style={{ width }} className="max-w-full">
      <TemplateDownloadCard
        key={String(columnsOpen)}
        {...args}
        formats={showFormats.split(/, | and /)}
        fileName={showFile ? 'customers-template.csv' : undefined}
        fileSize={showFile ? '2 KB' : undefined}
        columns={allColumns.slice(0, columnCount)}
        href={asLink ? '#template' : undefined}
        defaultColumnsOpen={columnsOpen}
        onDownload={fn()}
      />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <TemplateDownloadCard
      title="Customer import template"
      formats={['CSV', 'XLSX']}
      fileName="customers-template.csv"
      fileSize="2 KB"
      columns={allColumns}
      onDownload={onDownload}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Customer import template' })).toBeVisible();
    await expect(canvas.getByText('XLSX')).toBeVisible();
    const toggle = canvas.getByRole('button', { name: 'What columns are needed' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByText('full_name')).not.toBeVisible();
    // Keyboard: Tab reaches Download, then the disclosure; Enter opens it.
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Download template' })).toHaveFocus();
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(toggle).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByText('full_name')).toBeVisible();
    await expect(canvas.getAllByText('Required')).toHaveLength(2);
    await userEvent.click(canvas.getByRole('button', { name: 'Download template' }));
    await waitFor(() => expect(onDownload).toHaveBeenCalledWith('CSV'));
  },
};

/** The same card with the column list open, as it reads before an import. */
export const ColumnsOpen: Story = {
  args: { columnsOpen: true },
};

export const AsLink: Story = {
  tags: ['!dev'],
  args: { asLink: true },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Download template' });
    await expect(link).toHaveAttribute('download', 'customers-template.csv');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <TemplateDownloadCard
      title="Quarterly customer and subscription import template for every regional office"
      description="Start from this file so the columns match what the import expects, including the long ones."
      formats={['CSV', 'XLSX', 'JSON']}
      fileName="quarterly-customer-and-subscription-import-template-2025.csv"
      fileSize="12 KB"
      defaultColumnsOpen
      columns={[{ name: 'subscription_renewal_date_in_local_time_zone', required: true, description: 'Date as YYYY-MM-DD in the office time zone.', example: '2025-03-14T00:00:00+02:00' }, ...allColumns]}
    />
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('region');
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
    const file = canvas.getByText('quarterly-customer-and-subscription-import-template-2025.csv');
    await expect(file.scrollWidth).toBeGreaterThan(file.clientWidth);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
