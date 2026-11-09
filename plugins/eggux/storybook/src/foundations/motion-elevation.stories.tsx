import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Mono, Page, Section } from './page';
import { readToken, useThemeVersion } from './tokens';

const meta = {
  title: 'Foundations/Motion and elevation',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Durations and easing curves (tokens) and the shadow steps. Motion is short and never the only signal; components turn transitions off when the person asks for reduced motion.' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const durations = [
  { token: '--duration-instant', use: 'Color changes on hover and press' },
  { token: '--duration-fast', use: 'Most transitions: focus, toggles, chevrons' },
  { token: '--duration-normal', use: 'Menus and popovers opening' },
  { token: '--duration-slow', use: 'Dialogs and sheets sliding in' },
  { token: '--duration-deliberate', use: 'Large moves, progress and charts' },
];
const eases = [
  { token: '--ease-standard', use: 'Things that move and stay on screen' },
  { token: '--ease-enter', use: 'Things that appear: they start fast and settle' },
  { token: '--ease-exit', use: 'Things that leave: they start slow and speed up' },
  { token: '--ease-linear', use: 'Spinners and progress' },
];
const shadows = [
  { cls: 'shadow-xs', name: 'shadow-xs', use: 'Fields, buttons and cards at rest' },
  { cls: 'shadow-sm', name: 'shadow-sm', use: 'Raised cards, selected tab' },
  { cls: 'shadow-md', name: 'shadow-md', use: 'Menus, popovers, dropdowns' },
  { cls: 'shadow-lg', name: 'shadow-lg', use: 'Dialogs, sheets, floating toolbars' },
  { cls: 'shadow-xl', name: 'shadow-xl', use: 'Rare: the highest layer' },
];

/** cubic-bezier(a, b, c, d) as a small curve: time goes right, progress goes up. */
function Curve({ value, label }: { value: string; label: string }) {
  const m = value.match(/cubic-bezier\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)/);
  const path = m ? `M0 60 C ${Number(m[1]) * 60} ${60 - Number(m[2]) * 60}, ${Number(m[3]) * 60} ${60 - Number(m[4]) * 60}, 60 0` : 'M0 60 L60 0';
  return (
    <svg role="img" aria-label={label} viewBox="-4 -4 68 68" className="size-16 shrink-0 text-primary">
      <rect x="0" y="0" width="60" height="60" fill="none" stroke="currentColor" strokeOpacity="0.25" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function Motion() {
  useThemeVersion();
  return (
    <Page title="Motion and elevation" intro="Motion explains a change (something opened, something moved) and is quick. Elevation says what sits above what: the higher the layer, the larger the shadow.">
      <Section title="Duration" note="The bar is as long as the duration, on a 500 ms scale.">
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {durations.map(d => {
            const ms = parseFloat(readToken(d.token)) || 0;
            return (
              <li key={d.token} className="flex items-center gap-4 text-sm leading-5">
                <span className="w-52 shrink-0"><Mono>{d.token}</Mono>: <strong>{readToken(d.token) || 'not set'}</strong></span>
                <span aria-hidden="true" className="h-3 rounded-sm bg-primary" style={{ width: `${(ms / 500) * 240}px` }} />
                <span>{d.use}</span>
              </li>
            );
          })}
        </ul>
      </Section>
      <Section title="Easing" note="How the speed changes over the duration. The curve shows time to the right and progress upward.">
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          {eases.map(e => (
            <li key={e.token} className="flex items-center gap-4 text-sm leading-5">
              <Curve value={readToken(e.token)} label={`${e.token} curve`} />
              <span><Mono>{e.token}</Mono><br />{e.use}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Elevation" note="Shadow steps from Tailwind's scale. A raised surface also keeps its border, so it reads in dark schemes where shadows are faint.">
        <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-3">
          {shadows.map(s => (
            <li key={s.name} className="flex flex-col gap-2">
              <span aria-hidden="true" className={`block h-20 rounded-lg border border-border bg-card ${s.cls}`} />
              <span className="text-sm leading-5"><Mono>{s.name}</Mono>: {s.use}</span>
            </li>
          ))}
        </ul>
      </Section>
    </Page>
  );
}

export const Overview: Story = {
  render: () => <Motion />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 2, name: 'Motion and elevation' })).toBeVisible();
    await expect(c.getByRole('img', { name: '--ease-standard curve' })).toBeVisible();
    await expect(c.getAllByText(/--duration-/).length).toBeGreaterThanOrEqual(5);
  },
};
export const OverviewDark: Story = { ...Overview, tags: ['!dev'], globals: { theme: 'Dark' } };
