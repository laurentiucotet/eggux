import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { ImportSummary } from './import-summary';

type Args = {
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  title: string;
  showFileName: boolean;
  reportAsLink: boolean;
  width: number;
};

const onDownloadReport = fn();

const meta = {
  title: 'Components/Data Transfer/Import Summary',
  parameters: {
    docs: {
      description: {
        component:
          'The result after an import: four stat tiles (Created, Updated, Skipped, Failed) with icon and text, an outcome badge and, when rows failed, the error report as a link or a button. Failed above zero is destructive. Counts are props; no file is written. Code only (no Figma component yet).',
      },
    },
  },
  args: { created: 40, updated: 5, skipped: 3, failed: 3, title: 'Import finished', showFileName: true, reportAsLink: false, width: 520 },
  argTypes: {
    created: { name: 'Created', control: { type: 'range', min: 0, max: 100000, step: 1 }, description: 'Rows added.', table: { category: 'Counts' } },
    updated: { name: 'Updated', control: { type: 'range', min: 0, max: 100000, step: 1 }, description: 'Existing rows changed.', table: { category: 'Counts' } },
    skipped: { name: 'Skipped', control: { type: 'range', min: 0, max: 100000, step: 1 }, description: 'Rows left out on purpose (duplicates).', table: { category: 'Counts' } },
    failed: { name: 'Failed', control: { type: 'range', min: 0, max: 100000, step: 1 }, description: 'Rows that could not be imported. Above zero the report download appears.', table: { category: 'Counts' } },
    title: { name: 'Title', control: 'text', description: 'The heading.', table: { category: 'Summary' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 640, step: 4 }, description: 'Container width in px.', table: { category: 'Summary' } },
    showFileName: { name: 'Show file name', control: 'boolean', description: 'Name the file in the sentence.', table: { category: 'Parts' } },
    reportAsLink: { name: 'Report as link', control: 'boolean', description: 'A download link instead of a button with a callback.', table: { category: 'Parts' } },
  },
  render: ({ showFileName, reportAsLink, width, ...args }) => (
    <div style={{ width }} className="max-w-full">
      <ImportSummary
        {...args}
        fileName={showFileName ? 'customers-2025.csv' : undefined}
        errorReportHref={reportAsLink ? '#error-report' : undefined}
        onDownloadReport={onDownloadReport}
      />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <ImportSummary created={1240} updated={5} skipped={3} failed={3} fileName="customers-2025.csv" onDownloadReport={onDownloadReport} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Import finished' })).toBeVisible();
    await expect(canvas.getByText('Finished with errors')).toBeVisible();
    await expect(canvas.getByText('1,251 rows processed', { exact: false })).toBeVisible();
    // Each tile reads as term plus value.
    const created = canvas.getByText('Created').closest('div');
    await expect(created).toHaveTextContent('1,240');
    await expect(canvas.getByText('Failed').closest('div')).toHaveTextContent('3');
    await userEvent.click(canvas.getByRole('button', { name: 'Download error report (3 rows)' }));
    await waitFor(() => expect(onDownloadReport).toHaveBeenCalled());
  },
};

/** Nothing failed: the badge turns green and there is no report to download. */
export const AllImported: Story = { args: { created: 120, updated: 0, skipped: 0, failed: 0 } };

export const AllImportedCheck: Story = {
  tags: ['!dev'],
  args: { created: 120, updated: 0, skipped: 0, failed: 0 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('All rows imported')).toBeVisible();
    await expect(canvas.queryByRole('button', { name: /error report/ })).toBeNull();
    await expect(canvas.queryByRole('link', { name: /error report/ })).toBeNull();
  },
};

export const ReportLink: Story = {
  tags: ['!dev'],
  args: { failed: 1, reportAsLink: true },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Download error report (1 row)' });
    await expect(link).toHaveAttribute('href', '#error-report');
    await expect(link).toHaveAttribute('download');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ImportSummary created={12_345_678} updated={2_345_678} skipped={345_678} failed={45_678} fileName="quarterly-customer-and-subscription-export-2025-final.csv" title="Import of the quarterly customer file finished" />
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('region');
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
    await expect(canvas.getByRole('button', { name: /Download error report/ })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
