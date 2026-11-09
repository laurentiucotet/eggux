import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Mono, Page, Section } from './page';
import { contrast, edgeGrade, over, parseColor, readToken, textGrade, toHex, useThemeVersion } from './tokens';

const meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Every color token with its value and its contrast, read from the page as it is now: switch Scheme and Look in the toolbar. Pairs are a surface and the text that sits on it; single tokens are checked against the page background.' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const WHITE: [number, number, number, number] = [255, 255, 255, 1];

/** Surface and the text color that goes on it. */
const pairs: { title: string; note: string; rows: [string, string][] }[] = [
  {
    title: 'Surfaces',
    note: 'Pages, cards, menus and the quiet fills behind them. Text on a surface uses its own foreground token.',
    rows: [
      ['--background', '--foreground'],
      ['--card', '--card-foreground'],
      ['--popover', '--popover-foreground'],
      ['--muted', '--muted-foreground'],
      ['--accent', '--accent-foreground'],
      ['--secondary', '--secondary-foreground'],
      ['--sidebar', '--sidebar-foreground'],
      ['--sidebar-accent', '--sidebar-accent-foreground'],
    ],
  },
  {
    title: 'Actions and status',
    note: 'Primary actions and the four message colors. Never use the fill as text color; use the foreground token that pairs with it.',
    rows: [
      ['--primary', '--primary-foreground'],
      ['--destructive', '--destructive-foreground'],
      ['--success', '--success-foreground'],
      ['--warning', '--warning-foreground'],
      ['--info', '--info-foreground'],
      ['--sidebar-primary', '--sidebar-primary-foreground'],
    ],
  },
  {
    title: 'Soft badges',
    note: 'Quiet status colors for badges, chips and tags.',
    rows: ['success', 'info', 'warning', 'destructive', 'neutral'].map(n => [`--badge-soft-${n}-bg`, `--badge-soft-${n}-fg`] as [string, string]),
  },
  {
    title: 'Categories',
    note: 'Eight tag colors for categories that need telling apart. The label is always the first signal; color only helps.',
    rows: Array.from({ length: 8 }, (_, i) => [`--badge-category-${i + 1}-bg`, `--badge-category-${i + 1}-fg`] as [string, string]),
  },
];

const singles: { title: string; note: string; tokens: string[]; text: boolean }[] = [
  { title: 'Lines and focus', note: 'Borders, field outlines and the focus ring. Checked against the page background; interface edges need 3:1.', tokens: ['--border', '--input', '--ring', '--sidebar-border'], text: false },
  { title: 'Brand', note: 'The brand color as text or as an accent on the page background.', tokens: ['--brand'], text: true },
  { title: 'Charts', note: 'Eight series colors, in the order charts use them.', tokens: Array.from({ length: 8 }, (_, i) => `--chart-${i + 1}`), text: false },
];

function Chip({ color }: { color: string }) {
  return <span aria-hidden="true" className="inline-block h-8 w-14 rounded-md border border-border" style={{ background: `var(${color})` }} />;
}

function PairTable({ rows }: { rows: [string, string][] }) {
  const bg = parseColor(readToken('--background')) ?? WHITE;
  return (
    <table className="w-full border-collapse text-left text-sm leading-5">
      <thead>
        <tr className="border-b border-border">
          <th scope="col" className="py-2 pr-3 font-medium">Token</th>
          <th scope="col" className="py-2 pr-3 font-medium">Fill and text</th>
          <th scope="col" className="py-2 pr-3 font-medium">Fill</th>
          <th scope="col" className="py-2 pr-3 font-medium">Text</th>
          <th scope="col" className="py-2 font-medium">Contrast</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([fill, text]) => {
          const f = parseColor(readToken(fill));
          const t = parseColor(readToken(text));
          const surface = f ? over(f, bg) : null;
          const ratio = surface && t ? contrast(t, surface) : null;
          return (
            <tr key={fill} className="border-b border-border">
              <th scope="row" className="py-2 pr-3 font-normal"><Mono>{fill}</Mono></th>
              <td className="py-2 pr-3">
                <span className="flex items-center gap-1"><Chip color={fill} /><Chip color={text} /></span>
              </td>
              <td className="py-2 pr-3"><Mono>{f ? toHex(f) : readToken(fill) || 'not set'}</Mono></td>
              <td className="py-2 pr-3"><Mono>{t ? toHex(t) : readToken(text) || 'not set'}</Mono></td>
              <td className="py-2">{ratio ? `${ratio.toFixed(2)}:1, ${textGrade(ratio)}` : '-'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SingleTable({ tokens, text }: { tokens: string[]; text: boolean }) {
  const bg = parseColor(readToken('--background')) ?? WHITE;
  return (
    <table className="w-full border-collapse text-left text-sm leading-5">
      <thead>
        <tr className="border-b border-border">
          <th scope="col" className="py-2 pr-3 font-medium">Token</th>
          <th scope="col" className="py-2 pr-3 font-medium">Color</th>
          <th scope="col" className="py-2 pr-3 font-medium">Value</th>
          <th scope="col" className="py-2 font-medium">On the page background</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map(token => {
          const c = parseColor(readToken(token));
          const ratio = c ? contrast(c, bg) : null;
          return (
            <tr key={token} className="border-b border-border">
              <th scope="row" className="py-2 pr-3 font-normal"><Mono>{token}</Mono></th>
              <td className="py-2 pr-3"><Chip color={token} /></td>
              <td className="py-2 pr-3"><Mono>{c ? toHex(c) : readToken(token) || 'not set'}</Mono></td>
              <td className="py-2">{ratio ? `${ratio.toFixed(2)}:1, ${text ? textGrade(ratio) : edgeGrade(ratio)}` : '-'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Colors() {
  useThemeVersion();
  return (
    <Page title="Colors" intro="Colors are tokens, never raw values. A component reads a semantic token (primary, muted, border) and the theme decides the color: the same component changes with Scheme and Look.">
      {pairs.map(p => (
        <Section key={p.title} title={p.title} note={p.note}>
          <PairTable rows={p.rows} />
        </Section>
      ))}
      {singles.map(s => (
        <Section key={s.title} title={s.title} note={s.note}>
          <SingleTable tokens={s.tokens} text={s.text} />
        </Section>
      ))}
    </Page>
  );
}

export const Overview: Story = {
  render: () => <Colors />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 2, name: 'Colors' })).toBeVisible();
    // Primary and its text read from the real tokens, with a contrast ratio.
    const row = c.getByRole('row', { name: /--primary-foreground|--primary\b/ });
    await expect(row).toHaveTextContent(/:1,/);
    await expect(c.getAllByRole('table').length).toBeGreaterThanOrEqual(6);
  },
};

export const OverviewDark: Story = { ...Overview, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OverviewBackOffice: Story = { ...Overview, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const OverviewBackOfficeDark: Story = { ...Overview, tags: ['!dev'], globals: { theme: 'Corporate Dark' } };
export const OverviewShowcase: Story = { ...Overview, tags: ['!dev'], globals: { theme: 'Showcase Light' } };
