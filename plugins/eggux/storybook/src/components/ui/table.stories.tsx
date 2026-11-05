import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableHeaderLabel,
  TableRow,
  type TableSort,
} from './table';
import { TableCellAmount, TableCellLink, TableCellStack, TableCellText } from './table-cells';

const meta = {
  title: 'Components/Table/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Semantic table: th scope, td, aria-sort on the sorted column header. Header cells 40 high, body cells 8 px vertical padding (density tokens: compact is 32 and 4). Sortable headers are buttons; the menu shows on hover and focus of the header. Text left, numbers right with the same decimals. Stripes and footer for wide read-only tables. Figma: Table page / Table Cell, Table Header Label. Guide: eggux build-ui/components/table.md' } },
  },
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

const rect = (el: Element) => el.getBoundingClientRect();
const h = (el: Element) => Math.round(rect(el).height);
const w = (el: Element) => Math.round(rect(el).width);

/** Compares a computed property of `el` with the same property of a probe carrying the token classes. */
async function sameAs(el: Element, classes: string, prop: 'backgroundColor' | 'borderTopColor' | 'color' | 'boxShadow') {
  const probe = document.createElement('span');
  probe.className = classes;
  document.body.append(probe);
  const expected = getComputedStyle(probe)[prop];
  probe.remove();
  await expect(getComputedStyle(el)[prop]).toBe(expected);
}

interface Invoice { id: string; customer: string; detail: string; date: string; amount: number }
const invoices: Invoice[] = [
  { id: 'INV-1041', customer: 'Acme Ltd', detail: 'Website redesign', date: '12 Nov 2026', amount: 12450 },
  { id: 'INV-1042', customer: 'Northwind', detail: 'Hosting, annual', date: '10 Nov 2026', amount: 1890.5 },
  { id: 'INV-1043', customer: 'Globex', detail: 'Support plan', date: '04 Nov 2026', amount: 640 },
  { id: 'INV-1044', customer: 'Initech', detail: 'Audit workshop', date: '29 Oct 2026', amount: 3200 },
];

type Key = 'id' | 'amount';
const SortableInvoices = ({ striped = false, footer = false, fixed = false, onSort }: { striped?: boolean; footer?: boolean; fixed?: boolean; onSort?: (k: Key, d: TableSort) => void }) => {
  const [sort, setSort] = React.useState<{ key: Key; dir: 'ascending' | 'descending' } | null>({ key: 'id', dir: 'ascending' });
  const toggle = (key: Key) => {
    const dir = sort?.key === key && sort.dir === 'ascending' ? 'descending' : 'ascending';
    setSort({ key, dir });
    onSort?.(key, dir);
  };
  const rows = [...invoices].sort((a, b) => {
    const s = sort?.dir === 'descending' ? -1 : 1;
    return sort?.key === 'amount' ? (a.amount - b.amount) * s : a.id.localeCompare(b.id) * s;
  });
  const state = (k: Key): TableSort => (sort?.key === k ? sort.dir : 'sortable');
  const aria = (k: Key) => (sort?.key === k ? sort.dir : 'none');
  return (
    <Table fixed={fixed} aria-label="Invoices">
      <TableHeader>
        <TableRow>
          <TableHead sort={aria('id')}><TableHeaderLabel label="Invoice" sort={state('id')} onSortClick={() => toggle('id')} /></TableHead>
          <TableHead><TableHeaderLabel label="Customer" /></TableHead>
          <TableHead><TableHeaderLabel label="Date" /></TableHead>
          <TableHead sort={aria('amount')} className="text-right"><TableHeaderLabel label="Amount" align="right" sort={state('amount')} onSortClick={() => toggle('amount')} /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={r.id}>
            <TableCell striped={striped && i % 2 === 1}><TableCellLink href="#">{r.id}</TableCellLink></TableCell>
            <TableCell striped={striped && i % 2 === 1}><TableCellText textStyle="strong">{r.customer}</TableCellText></TableCell>
            <TableCell striped={striped && i % 2 === 1}><TableCellText textStyle="muted">{r.date}</TableCellText></TableCell>
            <TableCell striped={striped && i % 2 === 1}><TableCellAmount amount={r.amount} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
      {footer ? (
        <TableFooter>
          <TableRow>
            <TableCell type="footer" colSpan={3}><TableCellText textStyle="strong">Total, 4 invoices</TableCellText></TableCell>
            <TableCell type="footer"><TableCellAmount amount={rows.reduce((a, r) => a + r.amount, 0)} /></TableCell>
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  );
};

// Figma Table Cell: header 40, body 37 (20 text + 2 x 8 padding + 1 border).
export const Default: Story = {
  render: () => <SortableInvoices />,
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', { name: 'Invoices' });
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(4);
    await expect(h(canvas.getByRole('columnheader', { name: 'Customer' }))).toBe(40);
    const firstRow = canvas.getAllByRole('row')[1];
    await expect(canvas.getAllByRole('cell')[1]).toHaveTextContent('Acme Ltd');
    // Amount cell with the amount and no note is 20 + 16 + 1; text cells match.
    await expect(h(canvas.getAllByRole('cell')[2])).toBe(37);
    await expect(h(firstRow)).toBe(37);
    // Numbers align right, text left.
    await expect(getComputedStyle(canvas.getAllByRole('cell')[3].querySelector('[data-slot="table-cell-amount-value"]')!).textAlign).toBe('right');
    await expect(table.tagName).toBe('TABLE');
    await expect(canvas.getByRole('columnheader', { name: /Invoice/ })).toHaveAttribute('aria-sort', 'ascending');
  },
};

// Sorting: the header is a button; click, Enter and Space toggle aria-sort on the <th>.
export const Sorting: Story = {
  render: () => <SortableInvoices />,
  play: async ({ canvas }) => {
    const invoice = canvas.getByRole('columnheader', { name: /Invoice/ });
    const amount = canvas.getByRole('columnheader', { name: /Amount/ });
    await expect(invoice).toHaveAttribute('aria-sort', 'ascending');
    await expect(amount).toHaveAttribute('aria-sort', 'none');
    // Click.
    await userEvent.click(canvas.getByRole('button', { name: 'Invoice' }));
    await expect(invoice).toHaveAttribute('aria-sort', 'descending');
    await expect(canvas.getAllByRole('cell')[0]).toHaveTextContent('INV-1044');
    // Sorting another column resets the first.
    await userEvent.click(canvas.getByRole('button', { name: 'Amount' }));
    await expect(amount).toHaveAttribute('aria-sort', 'ascending');
    await expect(invoice).toHaveAttribute('aria-sort', 'none');
    // Keyboard: Tab reaches the button, Enter and Space activate it.
    canvas.getByRole('button', { name: 'Amount' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(amount).toHaveAttribute('aria-sort', 'descending');
    await userEvent.keyboard(' ');
    await expect(amount).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.tab({ shift: true });
    await expect(canvas.getByRole('button', { name: 'Invoice' })).toHaveFocus();
  },
};

// Table Header Label: every Sort x Align (Figma 160 x 20), the icons and their colors.
const HeaderLabels = () => (
  <div className="grid w-[360px] grid-cols-2 gap-6">
    {(['off', 'sortable', 'ascending', 'descending'] as TableSort[]).flatMap(sort =>
      (['left', 'right'] as const).map(align => (
        <div key={`${sort}-${align}`} className="w-[160px]" data-testid={`${sort}-${align}`}>
          <TableHeaderLabel label="Customer" sort={sort} align={align} />
        </div>
      )),
    )}
  </div>
);
export const HeaderLabelSorts: Story = {
  render: () => <HeaderLabels />,
  play: async ({ canvas, canvasElement }) => {
    for (const id of ['off-left', 'off-right', 'sortable-left', 'sortable-right', 'ascending-left', 'descending-right']) {
      await expect(h(canvasElement.querySelector(`[data-testid="${id}"] [data-slot="table-header-label"]`)!)).toBe(20);
    }
    // Off has no button; the others do.
    await expect(canvas.getAllByRole('button')).toHaveLength(6);
    const icon = (id: string) => canvasElement.querySelector(`[data-testid="${id}"] svg`)!;
    await expect(canvasElement.querySelector('[data-testid="off-left"] svg')).toBeNull();
    await expect(w(icon('sortable-left'))).toBe(16);
    // Inactive sort icon is muted, active ones foreground.
    await sameAs(icon('sortable-left'), 'text-muted-foreground', 'color');
    await sameAs(icon('ascending-left'), 'text-foreground', 'color');
    await sameAs(icon('descending-right'), 'text-foreground', 'color');
    // Medium weight label.
    await expect(getComputedStyle(canvasElement.querySelector('[data-testid="off-left"] [data-slot="table-header-text"] span')!).fontWeight).toBe('500');
    // Right aligned: the label sits at the far end of the 160 px box.
    const box = rect(canvasElement.querySelector('[data-testid="sortable-right"]')!);
    await expect(Math.round(box.right - rect(icon('sortable-right')).right)).toBe(0);
  },
};

// Show info and Show menu. The menu appears on hover and focus of the header cell.
export const HeaderInfoAndMenu: Story = {
  render: () => (
    <Table fixed aria-label="Totals">
      <TableHeader>
        <TableRow>
          <TableHead sort="none"><TableHeaderLabel label="Customer" sort="sortable" info="Who the invoice is addressed to." showMenu menuLabel="Column options for Customer" /></TableHead>
          <TableHead sort="descending"><TableHeaderLabel label="Amount" align="right" sort="descending" info="Total with tax, in EUR." showMenu onMenuClick={fn()} /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell><TableCellText>Acme Ltd</TableCellText></TableCell><TableCell><TableCellAmount amount={1200} /></TableCell></TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    const menu = canvas.getByRole('button', { name: 'Column options for Customer' });
    await expect(getComputedStyle(menu).opacity).toBe('0');
    // Keyboard focus inside the header cell shows the menu (hover uses the same group class).
    menu.focus();
    await waitFor(() => expect(getComputedStyle(menu).opacity).toBe('1'));
    await expect(w(menu)).toBe(28);
    await expect(canvas.getByRole('button', { name: 'More about Customer' })).toBeVisible();
    await expect(h(canvas.getByRole('button', { name: 'More about Customer' }))).toBe(20);
    // Keyboard focus also shows the menu.
    const amountMenu = canvas.getByRole('button', { name: 'Column options for Amount' });
    await expect(getComputedStyle(amountMenu).opacity).toBe('0');
    // Focusing the sort button of the Amount header (not the menu itself) also reveals its menu.
    canvas.getByRole('button', { name: 'Amount' }).focus();
    await waitFor(() => expect(getComputedStyle(amountMenu).opacity).toBe('1'));
    // In right-aligned columns the menu is at the start of the cell.
    await expect(rect(amountMenu).left).toBeLessThan(rect(canvas.getByRole('button', { name: 'Amount' })).left);
    // Info is a popover trigger.
    await userEvent.click(canvas.getByRole('button', { name: 'More about Customer' }));
    await expect(await screen.findByText('Who the invoice is addressed to.')).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};

// Table Cell states of Figma (hover, selected, editing, error, dragging, resizing) and their colors.
export const CellStates: Story = {
  render: () => (
    <Table fixed aria-label="States">
      <TableHeader>
        <TableRow>
          <TableHead state="default" data-testid="h-default">Default</TableHead>
          <TableHead state="hover" data-testid="h-hover">Hover</TableHead>
          <TableHead state="resizing" data-testid="h-resizing">Resizing</TableHead>
          <TableHead state="dragging" data-testid="h-dragging">Dragging</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell data-testid="b-default"><TableCellText>Default</TableCellText></TableCell>
          <TableCell state="hover" data-testid="b-hover"><TableCellText>Hover</TableCellText></TableCell>
          <TableCell state="selected" data-testid="b-selected"><TableCellText>Selected</TableCellText></TableCell>
          <TableCell striped data-testid="b-striped"><TableCellText>Striped</TableCellText></TableCell>
        </TableRow>
        <TableRow>
          <TableCell state="editing" data-testid="b-editing"><TableCellText>Editing</TableCellText></TableCell>
          <TableCell state="error" data-testid="b-error"><TableCellText>Error</TableCellText></TableCell>
          <TableCell colSpan={2}>{null}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={4} type="expanded" data-testid="b-expanded"><TableCellStack title="Detail row" description="One cell spanning all columns" /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    const t = (id: string) => canvas.getByTestId(id);
    // Heights: header 40, body 37, editing and error 40 (2 px border), expanded 71 (16 + 38 + 16 + 1).
    await expect(h(t('h-default'))).toBe(40);
    await expect(h(t('h-hover'))).toBe(40);
    await expect(h(t('h-resizing'))).toBe(40);
    await expect(h(t('h-dragging'))).toBe(40);
    await expect(h(t('b-default'))).toBe(37);
    await expect(h(t('b-hover'))).toBe(37);
    await expect(h(t('b-selected'))).toBe(37);
    await expect(h(t('b-editing'))).toBe(40);
    await expect(h(t('b-expanded'))).toBe(71);
    // Fills and borders per variant, against probes with the token classes.
    await sameAs(t('h-hover'), 'bg-[var(--table-row-hover)]', 'backgroundColor');
    await sameAs(t('h-dragging'), 'bg-muted', 'backgroundColor');
    await sameAs(t('b-hover'), 'bg-[var(--table-row-hover)]', 'backgroundColor');
    await sameAs(t('b-selected'), 'bg-muted', 'backgroundColor');
    await sameAs(t('b-striped'), 'bg-[var(--card-muted)]', 'backgroundColor');
    await sameAs(t('b-expanded'), 'bg-[var(--table-row-expanded)]', 'backgroundColor');
    await sameAs(t('b-editing'), 'bg-background', 'backgroundColor');
    await sameAs(t('b-editing'), 'border border-ring', 'borderTopColor');
    await sameAs(t('b-error'), 'border border-destructive', 'borderTopColor');
    await expect(getComputedStyle(t('b-editing')).borderTopWidth).toBe('2px');
    await sameAs(t('b-default'), 'border border-border', 'borderTopColor');
    await expect(getComputedStyle(t('b-default')).borderBottomWidth).toBe('1px');
    await expect(getComputedStyle(t('b-default')).borderTopWidth).toBe('0px');
    // Resize handle: 2 px, input color on hover, primary while resizing; none on the default header.
    const handle = (id: string) => t(id).querySelector('[data-slot="table-resize-handle"]');
    await expect(handle('h-default')).toBeNull();
    await expect(w(handle('h-hover')!)).toBe(2);
    await sameAs(handle('h-hover')!, 'bg-input', 'backgroundColor');
    await sameAs(handle('h-resizing')!, 'bg-primary', 'backgroundColor');
    // Dragging is lifted with the medium shadow.
    await sameAs(t('h-dragging'), 'shadow-md', 'boxShadow');
  },
};

// Hover and selected come from the row: every cell of the row follows.
export const RowStates: Story = {
  render: () => (
    <Table aria-label="Rows">
      <TableBody>
        <TableRow selected data-testid="selected"><TableCell>A</TableCell><TableCell>B</TableCell></TableRow>
        <TableRow data-testid="plain"><TableCell>C</TableCell><TableCell>D</TableCell></TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    const selected = canvas.getByTestId('selected');
    await expect(selected).toHaveAttribute('aria-selected', 'true');
    for (const c of Array.from(selected.children)) await sameAs(c, 'bg-muted', 'backgroundColor');
    // Hover is the same group class on the row: the cells carry the row-hover fill class.
    const plain = canvas.getByTestId('plain');
    for (const c of Array.from(plain.children)) {
      await expect(c.className).toContain('group-hover/row:bg-[var(--table-row-hover)]');
      await expect(getComputedStyle(c).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    }
  },
};

// Striped and footer: the muted fill; the footer has only a top border.
export const StripedWithFooter: Story = {
  render: () => <SortableInvoices striped footer />,
  play: async ({ canvas }) => {
    const rows = canvas.getAllByRole('row');
    const body = (i: number) => rows[i].querySelector('td')!;
    await sameAs(body(2), 'bg-[var(--card-muted)]', 'backgroundColor');
    await expect(getComputedStyle(body(1)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    const footer = canvas.getByRole('row', { name: /Total/ });
    const cell = footer.querySelector('td')!;
    await expect(cell.closest('tfoot')).not.toBeNull();
    await sameAs(cell, 'bg-[var(--card-muted)]', 'backgroundColor');
    await expect(getComputedStyle(cell).borderTopWidth).toBe('1px');
    await expect(getComputedStyle(cell).borderBottomWidth).toBe('0px');
    await expect(h(cell)).toBe(37);
    // Total is right aligned like the amount column.
    await expect(footer).toHaveTextContent('€18,180.50');
  },
};

// Density: .density-compact sets --table-header-height 32 and --cell-padding-y 4.
export const Compact: Story = {
  render: () => <SortableInvoices />,
  decorators: [
    Story => {
      React.useLayoutEffect(() => {
        document.documentElement.classList.add('density-compact');
        return () => document.documentElement.classList.remove('density-compact');
      }, []);
      return <Story />;
    },
  ],
  play: async ({ canvas }) => {
    await expect(h(canvas.getByRole('columnheader', { name: 'Customer' }))).toBe(32);
    await expect(h(canvas.getAllByRole('cell')[1])).toBe(29);
  },
};

// Stack cells make a 55 px row (38 + 16 + 1).
export const StackRow: Story = {
  render: () => (
    <Table aria-label="Projects">
      <TableBody>
        <TableRow><TableCell><TableCellStack title="Website redesign" description="Design · 2 h" /></TableCell></TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    await expect(h(canvas.getByRole('cell'))).toBe(55);
  },
};

// Stress test: long text truncates on one line at 368 and 276 px; row height stays 37.
const long = 'Northwind Traders International Holdings and Subsidiary Companies';
const Narrow = ({ width }: { width: number }) => (
  <div style={{ width }}>
    <Table fixed aria-label="Long text">
      <TableHeader>
        <TableRow>
          <TableHead><TableHeaderLabel label="Customer name for the invoice" align="right" sort="sortable" /></TableHead>
          <TableHead className="text-right"><TableHeaderLabel label="Amount" align="right" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell><TableCellText textStyle="strong" data-testid="long">{long}</TableCellText></TableCell>
          <TableCell><TableCellAmount amount={1234567.89} /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);
const checkTruncation = async (canvas: HTMLElement, width: number) => {
  const root = canvas.querySelector('[data-slot="table-container"]')!;
  await expect(w(root)).toBe(width);
  const el = canvas.querySelector('[data-testid="long"]') as HTMLElement;
  await expect(el.scrollWidth).toBeGreaterThan(el.clientWidth);
  await expect(getComputedStyle(el).textOverflow).toBe('ellipsis');
  await expect(h(el)).toBe(20);
  await expect(h(el.closest('td')!)).toBe(37);
  const table = canvas.querySelector('table')!;
  await expect(table.scrollWidth).toBeLessThanOrEqual(table.clientWidth);
};
export const Narrow368: Story = { tags: ['!dev'], render: () => <Narrow width={368} />, play: async ({ canvasElement }) => checkTruncation(canvasElement, 368) };
export const Narrow276: Story = { tags: ['!dev'], render: () => <Narrow width={276} />, play: async ({ canvasElement }) => checkTruncation(canvasElement, 276) };

// Theme copies for the contrast test (hidden in the sidebar, they still run in npm test).
export const DefaultDark: Story = { ...StripedWithFooter, name: 'Default (Dark)', tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...StripedWithFooter, name: 'Default (Corporate Light)', tags: ['!dev'], globals: { theme: 'Corporate Light' } };
