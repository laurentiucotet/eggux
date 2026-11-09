import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Mono, Page, Section } from './page';
import { readToken, useThemeVersion } from './tokens';

const meta = {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'The three font families (tokens) and the type scale the components use, measured from the page as it is now. The families change with the Look: Platform uses Plus Jakarta Sans, Back office uses Inter.' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const families = [
  { token: '--font-sans', use: 'Interface text, headings, body', sample: 'Invoices overdue this quarter' },
  { token: '--font-serif', use: 'Editorial quotes and long reading', sample: 'The audit closed in five days' },
  { token: '--font-mono', use: 'Code, ids, amounts in logs', sample: 'INV-1048 EUR 2,450.00' },
];
const weights = [
  { label: 'Regular', cls: 'font-normal' },
  { label: 'Medium', cls: 'font-medium' },
  { label: 'Semibold', cls: 'font-semibold' },
  { label: 'Bold', cls: 'font-bold' },
];
// The scale the components are built on. The numbers shown come from the rendered text.
const scale = [
  { cls: 'text-xs leading-4', name: 'text-xs', use: 'Captions, hints, timestamps, badge labels (ui/caption, ui/label-small with Medium)' },
  { cls: 'text-sm leading-5', name: 'text-sm', use: 'Body in apps, table cells, buttons and labels (body/small, ui/label with Medium)' },
  { cls: 'text-base leading-6', name: 'text-base', use: 'Long reading, large fields, dialog descriptions' },
  { cls: 'text-lg leading-7', name: 'text-lg', use: 'Card and dialog titles' },
  { cls: 'text-xl leading-7', name: 'text-xl', use: 'Section titles' },
  { cls: 'text-2xl leading-8', name: 'text-2xl', use: 'Page titles, large numbers' },
  { cls: 'text-3xl leading-9', name: 'text-3xl', use: 'Page titles on wide screens, stat values' },
];

function Measured({ cls, children }: { cls: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const [size, setSize] = React.useState('');
  React.useLayoutEffect(() => {
    const s = ref.current ? getComputedStyle(ref.current) : null;
    if (s) setSize(`${Math.round(parseFloat(s.fontSize))} / ${Math.round(parseFloat(s.lineHeight))} px`);
  }, [cls]);
  return (
    <>
      <p ref={ref} className={`m-0 truncate ${cls}`}>{children}</p>
      <span className="text-sm leading-5" data-testid="measured">{size}</span>
    </>
  );
}

function Typography() {
  useThemeVersion();
  return (
    <Page title="Typography" intro="Three families, one scale. Components use the scale classes, never a raw font size, so a Look change (Platform to Back office) swaps the family and the rest follows.">
      <Section title="Families" note="Each is a token, so a brand can replace it in one place.">
        <div className="flex flex-col gap-6">
          {families.map(f => {
            const name = readToken(f.token).replace(/["']/g, '');
            return (
              <div key={f.token} className="flex flex-col gap-2 border-b border-border pb-4">
                <p className="m-0 text-sm leading-5">
                  <Mono>{f.token}</Mono>: <strong>{name || 'not set'}</strong>. {f.use}.
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-1" style={{ fontFamily: `var(${f.token})` }}>
                  {weights.map(w => (
                    <span key={w.label} className={`text-xl leading-7 ${w.cls}`}>{w.label}</span>
                  ))}
                </div>
                <p className="m-0 text-2xl leading-8" style={{ fontFamily: `var(${f.token})` }}>{f.sample}</p>
              </div>
            );
          })}
        </div>
      </Section>
      <Section title="Type scale" note="Font size and line height in pixels, measured from each sample. Line heights sit on the 4 px grid.">
        <div className="grid grid-cols-[8rem_1fr_7rem] items-baseline gap-x-6 gap-y-4 text-sm leading-5">
          {scale.map(s => (
            <React.Fragment key={s.name}>
              <Mono>{s.name}</Mono>
              <div className="flex min-w-0 flex-col gap-1">
                <Measured cls={s.cls}>The quick brown fox jumps over the lazy dog</Measured>
                <span className="text-sm leading-5">{s.use}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </Section>
    </Page>
  );
}

export const Overview: Story = {
  render: () => <Typography />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 2, name: 'Typography' })).toBeVisible();
    // The scale is measured, not typed: text-sm is 14 / 20.
    const measured = c.getAllByTestId('measured').map(e => e.textContent);
    await expect(measured).toContain('14 / 20 px');
    await expect(measured).toContain('12 / 16 px');
  },
};
export const OverviewBackOffice: Story = { ...Overview, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const OverviewDark: Story = { ...Overview, tags: ['!dev'], globals: { theme: 'Dark' } };
