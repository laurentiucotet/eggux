import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { AuditLog as AuditLogBlock, FilterBuilder as FilterBuilderBlock, ImportMapping as ImportMappingBlock } from './enterprise-blocks';
import { Report as ReportBlock, VersionHistory as VersionHistoryBlock } from './enterprise-blocks-more';
import { AtWidths, appBlock, box, frames, multi, padding1440, twoColumns } from './enterprise-checks';

const meta = {
  title: 'Blocks/Enterprise/Data',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Enterprise data blocks, inside an app page (Back office look): Filter Builder (conditions with and / or, one nested group, live count, Save as view), Import Mapping (map file columns to fields, problems before Continue), Audit Log (read-only, expandable rows with field changes, export of the view), Report (period, comparison, KPIs, trend chart, breakdown with share and total), Version History (versions newest first, diff against current, Restore makes a new version). Each block is a region named by its h2. Figma: BLOCKS / Enterprise. Guides: eggux build-ui/patterns/enterprise-apps.md, search-and-filter.md, audit-log.md, reports.md' } },
  },
} satisfies Meta;
export default meta;

const text = (name: string, description: string) => ({ name, description, control: 'text' as const, table: { category: 'Content' } });

/* Visible stories: one per block, no play function. */

type FilterArgs = { noun: string };
export const FilterBuilder: StoryObj<FilterArgs> = {
  args: { noun: 'invoices' },
  argTypes: { noun: text('Object', 'Plural name in the live count.') },
  render: a => <div className="p-8"><FilterBuilderBlock noun={a.noun} /></div>,
};

type ImportArgs = { title: string; fileName: string; product: string };
export const ImportMapping: StoryObj<ImportArgs> = {
  args: { title: 'Import customers', fileName: 'customers-oct-2026.csv', product: 'Acme' },
  argTypes: { title: text('Title', 'What is imported.'), fileName: text('File name', 'The uploaded file.'), product: text('Product', 'Names the fields column.') },
  render: a => <ImportMappingBlock title={a.title} fileName={a.fileName} product={a.product} />,
};

type AuditArgs = { title: string; description: string };
export const AuditLog: StoryObj<AuditArgs> = {
  args: { title: 'Audit log', description: 'Every change in the workspace, kept for 400 days. Read only.' },
  argTypes: { title: text('Title', 'Block title.'), description: text('Description', 'Scope and retention.') },
  render: a => <AuditLogBlock title={a.title} description={a.description} />,
};

type ReportArgs = { title: string; scope: string };
export const Report: StoryObj<ReportArgs> = {
  args: { title: 'Revenue report', scope: 'All entities · EUR · updated 22 Oct 2026, 06:00' },
  argTypes: { title: text('Title', 'The question the report answers.'), scope: text('Scope', 'Entities, currency and when the data was updated.') },
  render: a => <ReportBlock title={a.title} scope={a.scope} />,
};

type VersionArgs = { title: string; file: string };
export const VersionHistory: StoryObj<VersionArgs> = {
  args: { title: 'Version history', file: 'Master services agreement.docx' },
  argTypes: { title: text('Title', 'Block title.'), file: text('File', 'Document compared.') },
  render: a => <VersionHistoryBlock title={a.title} file={a.file} />,
};

/* Hidden checks: each block at 1440, 768 and 390, and its interactions with the keyboard. */

const onApply = fn();
export const FilterBuilderCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      {[1440, 390].map(w => <div key={w} data-w={w} style={{ width: w }} className="p-4"><FilterBuilderBlock onApply={onApply} /></div>)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [wide, narrow] = [1440, 390].map(w => canvasElement.querySelector<HTMLElement>(`[data-w="${w}"]`)!);
    // 880 wide panel, 16 padding; nothing scrolls sideways at 390.
    const panel = wide!.querySelector('[data-slot="filter-builder"]')!;
    await expect(Math.round(box(panel).width)).toBe(880);
    await expect(narrow!.scrollWidth).toBeLessThanOrEqual(390);
    const c = within(wide!);
    await expect(c.getByRole('group', { name: 'Filters' })).toBeInTheDocument();
    await expect(c.getByText('248 invoices match')).toBeInTheDocument();
    await expect(c.getByRole('group', { name: 'Condition group' })).toBeInTheDocument();
    await expect(c.getByRole('combobox', { name: 'Condition 2: operator' })).toHaveTextContent('is greater than');
    // Keyboard: Add condition, focus lands on the new field Select.
    c.getByRole('button', { name: 'Add condition' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByRole('combobox', { name: 'Condition 3: field' })).toHaveFocus());
    // Change the new field to Customer with the keyboard; the operators follow the type.
    await userEvent.keyboard('{Enter}');
    const list = await screen.findByRole('listbox');
    await userEvent.click(within(list).getByRole('option', { name: 'Customer' }));
    await waitFor(() => expect(c.getByRole('combobox', { name: 'Condition 3: operator' })).toHaveTextContent('contains'));
    c.getByRole('textbox', { name: 'Condition 3: value' }).focus();
    await userEvent.keyboard('Northwind');
    await waitFor(() => expect(c.getByText('160 invoices match')).toBeInTheDocument());
    // Remove condition 1: focus returns to Add condition.
    c.getByRole('button', { name: 'Remove condition 1' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByRole('button', { name: 'Add condition' })).toHaveFocus());
    await expect(c.getByText('248 invoices match')).toBeInTheDocument();
    // At most one nested group: Add group is gone while one exists.
    await expect(c.queryByRole('button', { name: 'Add group' })).toBeNull();
    c.getByRole('button', { name: 'Apply' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(onApply).toHaveBeenCalledTimes(1);
    await expect(onApply.mock.calls[0]![0]).toHaveLength(2);
    await expect(onApply.mock.calls[0]![1]).toHaveLength(2);
  },
};

const onContinue = fn();
export const ImportMappingCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><ImportMappingBlock onContinue={onContinue} /></AtWidths>,
  play: async ({ canvasElement }) => {
    await appBlock(canvasElement);
    await padding1440(canvasElement);
    const wide = frames(canvasElement)[0]!;
    const c = within(wide);
    // Figma columns 265 / 378 / 48 / 303 / 140 at the 1136 content width, rows of attention selected.
    const heads = wide.querySelectorAll('th');
    await expect(Math.round(box(heads[0]!).width)).toBeGreaterThanOrEqual(265);
    await expect(wide.querySelectorAll('tbody tr[aria-selected="true"]')).toHaveLength(2);
    await expect(c.getByRole('list', { name: 'Import steps' })).toBeInTheDocument();
    await expect(c.getByText('12 rows have an invalid VAT ID')).toBeInTheDocument();
    // Continue with Segment unmapped: says what to fix and moves focus to its Select.
    c.getByRole('button', { name: 'Continue to review' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(onContinue).not.toHaveBeenCalled();
    const segment = c.getByRole('combobox', { name: 'Acme field for Segment' });
    await waitFor(() => expect(segment).toHaveFocus());
    await expect(c.getByRole('alert')).toHaveTextContent('Choose a field or Skip this column for Segment.');
    await expect(segment).toHaveAttribute('aria-invalid', 'true');
    // Map it with the keyboard.
    await userEvent.keyboard('{Enter}');
    const list = await screen.findByRole('listbox');
    await waitFor(() => expect(within(list).getAllByRole('option')[0]).toHaveFocus());
    for (let i = 0; i < 7; i++) await userEvent.keyboard('{ArrowDown}');
    await expect(within(list).getByRole('option', { name: 'Customer segment' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(segment).toHaveTextContent('Customer segment'));
    const row = wide.querySelector('tr[data-source="Segment"]')!;
    await expect(row.querySelector('[data-slot="mapping-status"]')).toHaveTextContent('Matched');
    c.getByRole('button', { name: 'Continue to review' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(onContinue).toHaveBeenCalledWith(expect.objectContaining({ Segment: 'segment', 'Internal ID': 'skip' }), true);
  },
};

const onExport = fn();
export const AuditLogCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><AuditLogBlock onExport={onExport} /></AtWidths>,
  play: async ({ canvasElement }) => {
    await appBlock(canvasElement);
    await padding1440(canvasElement);
    const wide = frames(canvasElement)[0]!;
    const c = within(wide);
    // Gap 16 between toolbar and table; the INV-1024 row starts expanded with its field changes.
    const toggle = c.getByRole('button', { name: 'Hide details of invoice.updated on INV-1024' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const detail = wide.querySelector(`#${CSS.escape(toggle.getAttribute('aria-controls')!)}`)!;
    await expect(detail.querySelectorAll('[data-slot="change-item"]')).toHaveLength(3);
    await expect(detail).toHaveTextContent('Due date: 7 Oct 2026 to 21 Oct 2026');
    // Keyboard: collapse it, expand the SSO row (masked secret).
    toggle.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByRole('button', { name: 'Show details of invoice.updated on INV-1024' })).toHaveAttribute('aria-expanded', 'false'));
    c.getByRole('button', { name: 'Show details of sso.settings_updated on SSO provider' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByText(/Client secret/)).toHaveTextContent('Client secret: changed (hidden)'));
    // Search narrows to one event; export gets the current view.
    c.getByRole('searchbox', { name: 'Search by user, action or object' }).focus();
    await userEvent.keyboard('role.changed');
    await waitFor(() => expect(wide.querySelectorAll('tbody tr[data-entry]')).toHaveLength(1));
    await userEvent.click(c.getByRole('button', { name: 'Export' }));
    await expect(onExport.mock.calls[0]![0]).toHaveLength(1);
  },
};

const onDrill = fn();
export const ReportCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><ReportBlock onDrillDown={onDrill} /></AtWidths>,
  play: async ({ canvasElement }) => {
    await appBlock(canvasElement);
    await padding1440(canvasElement);
    const [wide, mid, narrow] = frames(canvasElement);
    // KPIs: four in a row 16 apart at 1440, two per row at 768, one at 390.
    const kpis = (f: HTMLElement) => Array.from(f.querySelectorAll('[data-slot="report-kpis"] > li')).map(box);
    const w = kpis(wide!);
    await expect(new Set(w.map(k => Math.round(k.top))).size).toBe(1);
    await expect(Math.round(w[1]!.left - w[0]!.right)).toBe(16);
    const m = kpis(mid!);
    await expect(Math.round(m[1]!.top)).toBe(Math.round(m[0]!.top));
    await expect(m[2]!.top).toBeGreaterThan(m[0]!.top);
    const n = kpis(narrow!);
    await expect(n[1]!.top).toBeGreaterThan(n[0]!.top);
    const c = within(wide!);
    await expect(c.getByRole('figure', { name: /Revenue, costs and profit by month/ })).toBeInTheDocument();
    await expect(wide!.querySelector('tfoot')).toHaveTextContent('Total€1,840,000+12.4%100%');
    // Keyboard: the period Select changes every number on the page.
    const period = c.getByRole('combobox', { name: 'Period' });
    period.focus();
    await userEvent.keyboard('{Enter}');
    const list = await screen.findByRole('listbox');
    await waitFor(() => expect(within(list).getByRole('option', { name: '1 Jul – 30 Sep 2026' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(period).toHaveTextContent('1 Apr – 30 Jun 2026'));
    await expect(c.getByText('€1.64M')).toBeInTheDocument();
    await expect(c.getByRole('columnheader', { name: 'vs Q1' })).toBeInTheDocument();
    // Drill down from a breakdown row.
    c.getByRole('button', { name: 'Acme UK Ltd' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(onDrill).toHaveBeenCalledWith('Acme UK Ltd');
  },
};

const onRestore = fn();
export const VersionHistoryCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><VersionHistoryBlock onRestore={onRestore} /></AtWidths>,
  play: async ({ canvasElement }) => {
    await appBlock(canvasElement);
    await padding1440(canvasElement);
    await twoColumns(canvasElement, 'version-body', { first: 400, gap: 24 });
    const wide = frames(canvasElement)[0]!;
    const c = within(wide);
    // v11 against v12: three lines added, two removed.
    const diff = c.getByRole('region', { name: 'Master services agreement.docx' });
    await expect(diff).toHaveTextContent('Lines added: +3');
    await expect(diff).toHaveTextContent('Lines removed: −2');
    await expect(c.getByRole('button', { name: 'v11' })).toHaveAttribute('aria-pressed', 'true');
    // Current is marked and has no Restore.
    await expect(c.queryByRole('button', { name: 'Restore v12' })).toBeNull();
    // Keyboard: select v10, Restore makes v13 the current version.
    c.getByRole('button', { name: 'v10' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByRole('button', { name: 'v10' })).toHaveAttribute('aria-pressed', 'true'));
    await expect(c.getAllByRole('button', { name: 'Restore v10' }).length).toBeGreaterThan(0);
    c.getAllByRole('button', { name: 'Restore v10' })[0]!.focus();
    await userEvent.keyboard('{Enter}');
    await expect(onRestore).toHaveBeenCalledWith('v10');
    await waitFor(() => expect(c.getByRole('list', { name: 'Versions, newest first' }).firstElementChild).toHaveTextContent('v13Current'));
    await expect(c.getByText('Restored from v10')).toBeInTheDocument();
    await expect(c.getByText('This is the current version. Select an older version to see what changed.')).toBeInTheDocument();
    // Show all lists the older versions.
    c.getByRole('button', { name: 'Show all 7 versions' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByRole('button', { name: 'v7' })).toBeInTheDocument());
  },
};

/* Theme copies (axe contrast): Dark and Back office. */
const Gallery = () => (
  <div className="w-[1440px]">
    <div className="p-8"><FilterBuilderBlock /></div>
    <ImportMappingBlock />
    <AuditLogBlock />
    <ReportBlock />
    <VersionHistoryBlock />
  </div>
);
export const GalleryDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, parameters: { controls: { disable: true } }, render: () => <Gallery /> };
export const GalleryBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, parameters: { controls: { disable: true } }, render: () => <Gallery /> };
