import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ChangelogEntry, type ChangelogTag } from './changelog-entry';

type Args = { date: string; version: string; title: string; summary: string; showSummary: boolean; isNew: boolean; improved: boolean; fixed: boolean; changeCount: number; width: number };

const changes = [
  'Invoices can now be split across two cost centers.',
  'The approval queue loads twice as fast on large accounts.',
  'Fixed a rounding error on invoices in three currencies.',
  'CSV exports keep the column order you chose.',
  'Dates in emails follow the language of the recipient.',
];

const meta = {
  title: 'Components/Marketing/Changelog Entry',
  parameters: {
    docs: {
      description: {
        component:
          'One release of a product changelog: date, version, tags (New, Improved, Fixed), a title with a permalink, an optional summary and a list of changes. Stack entries newest first; each has its own anchor. Code only (no Figma component yet).',
      },
    },
  },
  args: {
    date: '2026-03-12',
    version: '2.4.0',
    title: 'Split invoices and a faster approval queue',
    summary: 'This release is about speed and about money landing in the right place.',
    showSummary: true,
    isNew: true,
    improved: true,
    fixed: true,
    changeCount: 4,
    width: 640,
  },
  argTypes: {
    date: { name: 'Date', control: 'text', description: 'ISO date, 2026-03-12.', table: { category: 'Entry' } },
    version: { name: 'Version', control: 'text', description: 'Release number.', table: { category: 'Entry' } },
    title: { name: 'Title', control: 'text', description: 'The release headline.', table: { category: 'Entry' } },
    summary: { name: 'Summary', control: 'text', description: 'One line under the title.', table: { category: 'Entry' } },
    changeCount: { name: 'Changes', control: { type: 'range', min: 1, max: 5, step: 1 }, description: 'Items in the list.', table: { category: 'Entry' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 800, step: 4 }, description: 'Container width in px.', table: { category: 'Entry' } },
    showSummary: { name: 'Show summary', control: 'boolean', description: 'The summary line.', table: { category: 'Parts' } },
    isNew: { name: 'Tag New', control: 'boolean', description: 'The New tag.', table: { category: 'Parts' } },
    improved: { name: 'Tag Improved', control: 'boolean', description: 'The Improved tag.', table: { category: 'Parts' } },
    fixed: { name: 'Tag Fixed', control: 'boolean', description: 'The Fixed tag.', table: { category: 'Parts' } },
  },
  render: ({ date, version, title, summary, showSummary, isNew, improved, fixed, changeCount, width }) => {
    const tags: ChangelogTag[] = [...(isNew ? (['New'] as const) : []), ...(improved ? (['Improved'] as const) : []), ...(fixed ? (['Fixed'] as const) : [])];
    return (
      <div style={{ width, maxWidth: '100%' }}>
        <ChangelogEntry date={date} version={version} title={title} summary={showSummary ? summary : undefined} tags={tags} changes={changes.slice(0, changeCount)} />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Entries stacked newest first, each with its own anchor. */
export const Timeline: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[640px] max-w-full flex-col gap-8">
      <ChangelogEntry date="2026-03-12" version="2.4.0" tags={['New', 'Improved']} title="Split invoices and a faster approval queue" changes={changes.slice(0, 3)} />
      <ChangelogEntry date="2026-02-20" version="2.3.1" tags={['Fixed']} title="Rounding and export fixes" changes={changes.slice(2, 4)} />
    </div>
  ),
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <ChangelogEntry date="2026-03-12" version="2.4.0" tags={['New', 'Improved', 'Fixed']} title="Split invoices and a faster approval queue" summary="Speed, and money landing in the right place." changes={changes.slice(0, 3)} />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('article', { name: 'Split invoices and a faster approval queue' })).toBeVisible();
    const time = canvas.getByText('12 March 2026');
    await expect(time.tagName).toBe('TIME');
    await expect(time).toHaveAttribute('datetime', '2026-03-12');
    await expect(canvas.getByText('2.4.0')).toBeVisible();
    for (const t of ['New', 'Improved', 'Fixed']) await expect(canvas.getByText(t)).toBeVisible();
    await expect(canvas.getAllByRole('listitem').length).toBeGreaterThanOrEqual(6);
    const link = canvas.getByRole('link', { name: 'Permalink to Split invoices and a faster approval queue' });
    await expect(link).toHaveAttribute('href', '#release-2-4-0');
    await link.focus();
    await expect(link).toHaveFocus();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ChangelogEntry
      date="2026-12-31"
      version="v10.24.118-beta.3+build.20261231"
      tags={['New', 'Improved', 'Fixed']}
      title="Consolidated multi-entity reporting, intercompany eliminations and a completely rebuilt approval workflow"
      summary="A very large release that touches reporting, approvals, exports and notifications across every plan."
      changes={['https://acme.example/docs/releases/2026/12/consolidated-multi-entity-reporting-and-intercompany-eliminations', changes[0]]}
    />
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('article');
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
