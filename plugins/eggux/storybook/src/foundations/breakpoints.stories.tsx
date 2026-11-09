import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { breakpoints } from '../styles/breakpoints';
import { Mono, Page, Section } from './page';

const meta = {
  title: 'Foundations/Breakpoints',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'The widths the product is designed for. The same list fills the Size selector in the toolbar, so every component can be opened at each one. Edit src/styles/breakpoints.ts to match the product.' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/** The widest breakpoint whose width fits the frame this page is shown in. */
function currentFor(width: number) {
  return [...breakpoints].reverse().find(b => width >= b.width) ?? breakpoints[0]!;
}

function Breakpoints() {
  const [width, setWidth] = React.useState(() => window.innerWidth);
  React.useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const now = currentFor(width);
  const widest = breakpoints[breakpoints.length - 1]!.width;
  return (
    <Page
      themed={false}
      title="Breakpoints"
      intro={
        <>
          A component is designed to work at every width, from a phone to a wide desktop. Open the Size selector in the toolbar and pick a breakpoint to see any story at that width.
        </>
      }
    >
      <p className="m-0 text-sm leading-5">
        This frame is <strong data-testid="frame">{width} px</strong> wide: the <Mono>{now.prefix}</Mono> breakpoint ({now.label}).
      </p>
      <Section title="Sizes" note="Utility classes with a prefix (md:flex) apply from that width up. Without a prefix they apply at every width, so a component starts as its phone layout.">
        <table className="w-full border-collapse text-left text-sm leading-5">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-3 font-medium">Prefix</th>
              <th scope="col" className="py-2 pr-3 font-medium">Stands for</th>
              <th scope="col" className="py-2 pr-3 font-medium">From width</th>
              <th scope="col" className="py-2 font-medium">Scale</th>
            </tr>
          </thead>
          <tbody>
            {breakpoints.map(b => (
              <tr key={b.key} className="border-b border-border">
                <th scope="row" className="py-2 pr-3 font-normal"><Mono>{b.prefix === 'base' ? '(none)' : `${b.prefix}:`}</Mono></th>
                <td className="py-2 pr-3">{b.label}</td>
                <td className="py-2 pr-3">{b.width} px</td>
                <td className="py-2">
                  <span aria-hidden="true" className="block h-3 rounded-sm bg-primary" style={{ width: `${(b.width / widest) * 100}%` }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      <Section title="What to check at each size" note="The resize contract of every component: what fills, what stays fixed, what truncates and what wraps or stacks.">
        <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-sm leading-5">
          <li>Text columns shrink and truncate; icons, badges and buttons never shrink.</li>
          <li>Groups of actions wrap under the main column, or move under it below a breakpoint.</li>
          <li>Tables scroll sideways inside their own frame, never the page.</li>
          <li>Touch targets are at least 32 px tall on a phone; 24 px is the smallest allowed anywhere.</li>
          <li>Open the story at <Mono>base</Mono> and at <Mono>2xl</Mono>: the two extremes break first.</li>
        </ul>
      </Section>
    </Page>
  );
}

export const Overview: Story = {
  render: () => <Breakpoints />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 2, name: 'Breakpoints' })).toBeVisible();
    await expect(c.getAllByRole('row')).toHaveLength(breakpoints.length + 1);
    await expect(c.getByTestId('frame')).toHaveTextContent(/\d+ px/);
  },
};
