import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Table, TableBody, TableCell, TableRow } from './table';
import { TableCellAmount, TableCellDate, TableCellLink, TableCellStack, TableCellText } from './table-cells';

const meta = {
  title: 'Components/Table/Table Cells',
  component: TableCellText,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Contents of body cells: Text (default, strong, muted; left or right), Stack (title + detail), Amount (right aligned, tabular figures, note or trend), Date (one format per column, optional time), Link (underlined, one per row). One line each, truncated with an ellipsis; empty values show "-". Figma: Table page / Table Cell Text, Stack, Amount, Date, Link. Guide: eggux build-ui/components/table.md' } },
  },
  args: { children: 'Ana Popescu' },
} satisfies Meta<typeof TableCellText>;
export default meta;
type Story = StoryObj<typeof meta>;

const rect = (el: Element) => el.getBoundingClientRect();
const h = (el: Element) => Math.round(rect(el).height);
const w = (el: Element) => Math.round(rect(el).width);
async function sameAs(el: Element, classes: string, prop: 'color' | 'fontWeight' | 'textDecorationLine') {
  const probe = document.createElement('span');
  probe.className = classes;
  document.body.append(probe);
  const expected = getComputedStyle(probe)[prop];
  probe.remove();
  await expect(getComputedStyle(el)[prop]).toBe(expected);
}

const Box = ({ width = 160, children }: { width?: number; children: React.ReactNode }) => (
  <div style={{ width }} data-testid="box">{children}</div>
);

// Figma Table Cell Text, Style default, Align left: 160 x 20.
export const Default: Story = {
  render: args => <Box><TableCellText {...args} /></Box>,
  play: async ({ canvas }) => {
    const el = canvas.getByText('Ana Popescu');
    await expect(w(el)).toBe(160);
    await expect(h(el)).toBe(20);
    await expect(getComputedStyle(el).fontSize).toBe('14px');
    await expect(getComputedStyle(el).fontWeight).toBe('400');
    await sameAs(el, 'text-foreground', 'color');
  },
};

// Style x Align: strong is medium weight, muted is muted-foreground, right aligns the text.
export const TextStyles: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid w-[360px] grid-cols-2 gap-4">
      {(['default', 'strong', 'muted'] as const).flatMap(s => (['left', 'right'] as const).map(a => (
        <TableCellText key={`${s}${a}`} textStyle={s} align={a} data-testid={`${s}-${a}`}>Ana Popescu</TableCellText>
      )))}
    </div>
  ),
  play: async ({ canvas }) => {
    const t = (id: string) => canvas.getByTestId(id);
    await sameAs(t('strong-left'), 'font-medium', 'fontWeight');
    await sameAs(t('strong-left'), 'text-foreground', 'color');
    await sameAs(t('muted-left'), 'text-muted-foreground', 'color');
    await sameAs(t('muted-right'), 'text-muted-foreground', 'color');
    await sameAs(t('default-right'), 'text-foreground', 'color');
    await expect(getComputedStyle(t('default-left')).fontWeight).toBe('400');
    await expect(getComputedStyle(t('default-left')).textAlign).toBe('start');
    await expect(getComputedStyle(t('default-right')).textAlign).toBe('right');
    for (const id of ['default-left', 'strong-right', 'muted-left']) await expect(h(t(id))).toBe(20);
  },
};

// Empty values show "-", never blank.
export const Empty: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[240px] flex-col gap-2">
      <TableCellText>{''}</TableCellText>
      <TableCellStack title="Website redesign" description={null} />
      <TableCellAmount amount={undefined} />
      <TableCellDate date={undefined} />
      <TableCellLink>{null}</TableCellLink>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText('-')).toHaveLength(5);
  },
};

// Figma Table Cell Stack: 200 x 38 (20 title + 2 gap + 16 detail).
export const Stack: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Box width={200}><TableCellStack title="Website redesign" description="Design · 2 h" /></Box>,
  play: async ({ canvas }) => {
    const root = canvas.getByText('Website redesign').closest('[data-slot="table-cell-stack"]')!;
    await expect(w(root)).toBe(200);
    await expect(h(root)).toBe(38);
    await sameAs(canvas.getByText('Website redesign'), 'font-medium text-foreground', 'fontWeight');
    await sameAs(canvas.getByText('Website redesign'), 'text-foreground', 'color');
    await sameAs(canvas.getByText('Design · 2 h'), 'text-muted-foreground', 'color');
    await expect(getComputedStyle(canvas.getByText('Design · 2 h')).fontSize).toBe('12px');
  },
};

// Figma Table Cell Amount, Trend none / up / down: 160 x 38, right aligned, tabular figures.
export const Amounts: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[160px] flex-col gap-6">
      <TableCellAmount amount="€12,450.00" note="3 invoices" data-testid="none" />
      <TableCellAmount amount="€12,450.00" trend="up" note="+12.4% vs Sep" data-testid="up" />
      <TableCellAmount amount="€12,450.00" trend="down" note="−3.1% vs Sep" data-testid="down" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    for (const id of ['none', 'up', 'down']) {
      const el = canvas.getByTestId(id);
      await expect(w(el)).toBe(160);
      await expect(h(el)).toBe(38);
      const value = el.querySelector('[data-slot="table-cell-amount-value"]')!;
      // Right edge of text and note are the right edge of the cell.
      await expect(Math.round(rect(el).right - rect(value).right)).toBe(0);
      await expect(getComputedStyle(el).fontVariantNumeric).toContain('tabular-nums');
      await sameAs(value, 'font-medium', 'fontWeight');
      await sameAs(value, 'text-foreground', 'color');
      await sameAs(el.querySelector('[data-slot="table-cell-amount-note"]')!, 'text-muted-foreground', 'color');
    }
    await expect(canvas.getByTestId('none').querySelector('svg')).toBeNull();
    // Up and down carry a 14 px icon and the sign in the text; the icon is decorative.
    for (const id of ['up', 'down']) {
      const icon = canvas.getByTestId(id).querySelector('svg')!;
      await expect(w(icon)).toBe(14);
      await expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
    await expect(canvas.getByText('+12.4% vs Sep')).toBeVisible();
    await expect(canvas.getByText('−3.1% vs Sep')).toBeVisible();
    await expect(canvasElement.querySelectorAll('svg')).toHaveLength(2);
  },
};

// A number is formatted with Intl.NumberFormat: same decimals in the column.
export const AmountFormat: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[160px] flex-col gap-2">
      <TableCellAmount amount={12450} />
      <TableCellAmount amount={640.5} />
      <TableCellAmount amount={1234.5} currency="USD" locale="en-US" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('€12,450.00')).toBeVisible();
    await expect(canvas.getByText('€640.50')).toBeVisible();
    await expect(canvas.getByText('$1,234.50')).toBeVisible();
  },
};

// Figma Table Cell Date: 160 x 20; Show time adds the muted caption line (38).
export const Dates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[160px] flex-col gap-4">
      <TableCellDate date="12 Nov 2026" dateTime="2026-11-12" data-testid="plain" />
      <TableCellDate date="12 Nov 2026" dateTime="2026-11-12T15:40" time="15:40" data-testid="time" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(h(canvas.getByTestId('plain'))).toBe(20);
    await expect(h(canvas.getByTestId('time'))).toBe(38);
    await expect(canvas.getAllByText('12 Nov 2026')[0].tagName).toBe('TIME');
    await expect(canvas.getAllByText('12 Nov 2026')[0]).toHaveAttribute('datetime', '2026-11-12');
    await sameAs(canvas.getByText('15:40'), 'text-muted-foreground', 'color');
    await sameAs(canvas.getAllByText('12 Nov 2026')[0], 'text-foreground', 'color');
  },
};

// Figma Table Cell Link: 160 x 20, underlined foreground text.
export const Link: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Box><TableCellLink href="#inv-1041">INV-1041</TableCellLink></Box>,
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'INV-1041' });
    await expect(h(link)).toBe(20);
    await sameAs(link, 'underline', 'textDecorationLine');
    await sameAs(link, 'text-foreground', 'color');
    link.focus();
    await expect(link).toHaveFocus();
  },
};

// Stress: 96 px text column (minimum), long values truncate on one line.
const longName = 'Northwind Traders International Holdings';
const AllCells = ({ width }: { width: number }) => (
  <div style={{ width }}>
    <Table fixed aria-label="Cells">
      <TableBody>
        <TableRow>
          <TableCell><TableCellText textStyle="strong" data-testid="text">{longName}</TableCellText></TableCell>
          <TableCell><TableCellStack title={longName} description="Annual hosting plan with premium support" data-testid="stack" /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell><TableCellLink href="#" data-testid="link">INV-1041-corrected-and-reissued</TableCellLink></TableCell>
          <TableCell><TableCellAmount amount={123456789.5} note="3 invoices from the last quarter" data-testid="amount" /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);
const check = async (canvas: HTMLElement, width: number) => {
  await expect(w(canvas.querySelector('[data-slot="table-container"]')!)).toBe(width);
  const text = canvas.querySelector('[data-testid="text"]') as HTMLElement;
  await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
  await expect(h(text)).toBe(20);
  const title = canvas.querySelector('[data-slot="table-cell-stack-title"]') as HTMLElement;
  await expect(h(title)).toBe(20);
  await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
  await expect(h(canvas.querySelector('[data-testid="stack"]')!)).toBe(38);
  const link = canvas.querySelector('a') as HTMLElement;
  await expect(h(link)).toBe(20);
  await expect(link.scrollWidth).toBeGreaterThan(link.clientWidth);
  await expect(h(canvas.querySelector('[data-testid="amount"]')!)).toBe(38);
  const table = canvas.querySelector('table')!;
  await expect(table.scrollWidth).toBeLessThanOrEqual(table.clientWidth);
};
export const Narrow368: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], render: () => <AllCells width={368} />, play: async ({ canvasElement }) => check(canvasElement, 368) };
export const Narrow276: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], render: () => <AllCells width={276} />, play: async ({ canvasElement }) => check(canvasElement, 276) };

// Theme copies for the contrast test (hidden in the sidebar, they still run in npm test).
const Everything = () => (
  <div className="flex w-[240px] flex-col gap-3">
    <TableCellText textStyle="strong">Ana Popescu</TableCellText>
    <TableCellText textStyle="muted" align="right">Ana Popescu</TableCellText>
    <TableCellStack title="Website redesign" description="Design · 2 h" />
    <TableCellAmount amount="€12,450.00" trend="up" note="+12.4% vs Sep" />
    <TableCellDate date="12 Nov 2026" time="15:40" />
    <TableCellLink href="#">INV-1041</TableCellLink>
  </div>
);
export const AllCellsDark: Story = { parameters: { controls: { disable: true } }, render: () => <Everything />, name: 'All cells (Dark)', tags: ['!dev'], globals: { theme: 'Dark' } };
export const AllCellsCorporate: Story = { parameters: { controls: { disable: true } }, render: () => <Everything />, name: 'All cells (Corporate Light)', tags: ['!dev'], globals: { theme: 'Corporate Light' } };
