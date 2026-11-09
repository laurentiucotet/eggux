import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Mono, Page, Section } from './page';
import { readToken, useThemeVersion } from './tokens';

const meta = {
  title: 'Foundations/Shape and spacing',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Corner radius, the spacing grid and the size tokens of controls and rows, read from the page as it is now. Switch Look to see the radius change (Back office is square).' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const radii = [
  { token: '--radius-sm', use: 'Small chips, kbd, inner corners' },
  { token: '--radius-md', use: 'Menus, popovers, list rows' },
  { token: '--radius-lg', use: 'Dialogs, sheets' },
  { token: '--radius-xl', use: 'Cards and large surfaces' },
  { token: '--button-radius', use: 'Buttons: pill on Platform, square on Back office' },
  { token: '--input-radius', use: 'Fields: same rule as buttons' },
];
// Tailwind spacing steps, 4 px each.
const steps = [1, 2, 3, 4, 6, 8, 12, 16];
const sizes = [
  ['--control-height', 'Buttons, fields, selects'],
  ['--table-header-height', 'Table header row'],
  ['--cell-padding-y', 'Table cell, top and bottom'],
  ['--list-padding-y', 'List item, top and bottom'],
  ['--menu-padding-y', 'Menu item, top and bottom'],
  ['--card-padding', 'Card inside space'],
  ['--card-padding-sm', 'Small card inside space'],
  ['--card-gap', 'Space between card parts'],
  ['--card-gap-sm', 'Space between parts of a small card'],
] as const;

function Shape() {
  useThemeVersion();
  return (
    <Page title="Shape and spacing" intro="Corners come from radius tokens, space from a 4 px grid, and the heights of controls and rows from size tokens. A component never sets its own number.">
      <Section title="Radius" note="The same box in each radius token.">
        <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-3">
          {radii.map(r => (
            <li key={r.token} className="flex flex-col gap-2">
              <span aria-hidden="true" className="block h-20 w-full border-2 border-foreground bg-muted" style={{ borderRadius: `var(${r.token})` }} />
              <span className="text-sm leading-5"><Mono>{r.token}</Mono>: <strong>{readToken(r.token) || 'not set'}</strong></span>
              <span className="text-sm leading-5">{r.use}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Spacing" note="Gaps and padding are multiples of 4 px: Tailwind's scale, so p-4 is 16 px.">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {steps.map(n => (
            <li key={n} className="flex items-center gap-4 text-sm leading-5">
              <span className="w-24"><Mono>{`gap-${n}`}</Mono></span>
              <span aria-hidden="true" className="h-4 rounded-sm bg-primary" style={{ width: n * 4 }} />
              <span>{n * 4} px</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Control and row sizes" note="One density for the whole product: these tokens set the heights and padding of controls, rows and cards.">
        <table className="w-full border-collapse text-left text-sm leading-5">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-3 font-medium">Token</th>
              <th scope="col" className="py-2 pr-3 font-medium">Now</th>
              <th scope="col" className="py-2 pr-3 font-medium">Size</th>
              <th scope="col" className="py-2 font-medium">Used for</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map(([token, use]) => (
              <tr key={token} className="border-b border-border">
                <th scope="row" className="py-2 pr-3 font-normal"><Mono>{token}</Mono></th>
                <td className="py-2 pr-3" data-testid={token}>{readToken(token) || 'not set'}</td>
                <td className="py-2 pr-3"><span aria-hidden="true" className="block rounded-sm bg-primary" style={{ width: 80, height: `var(${token})`, maxHeight: 48 }} /></td>
                <td className="py-2">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </Page>
  );
}

export const Overview: Story = {
  render: () => <Shape />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 2, name: 'Shape and spacing' })).toBeVisible();
    // Platform: pill controls and 36 px; the values come from the tokens, not from the page.
    await expect(c.getByTestId('--control-height')).toHaveTextContent('36px');
  },
};
export const OverviewBackOffice: Story = {
  ...Overview,
  tags: ['!dev'],
  globals: { theme: 'Corporate Light' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('--button-radius', { exact: false }).closest('li')).toHaveTextContent('4px');
  },
};
export const OverviewDark: Story = { ...Overview, tags: ['!dev'], globals: { theme: 'Dark' } };
