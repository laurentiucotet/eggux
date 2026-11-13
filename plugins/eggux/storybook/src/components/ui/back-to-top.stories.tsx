import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { BackToTop, type BackToTopPosition } from './back-to-top';

type Args = { threshold: number; position: BackToTopPosition; label: string; showLabel: boolean; height: number };

const sections = ['Overview', 'Billing', 'Team', 'Security', 'Integrations', 'Notifications', 'Audit log', 'Exports'];

function Article() {
  return (
    <div className="flex flex-col gap-4 p-4 text-sm text-foreground">
      {sections.map(s => (
        <section key={s} className="flex flex-col gap-1">
          <h3 className="text-base font-semibold">{s}</h3>
          <p className="text-muted-foreground">
            Acme keeps this section up to date. Invoices are issued in EUR on the first working day of the month and payment is due within 30 days.
          </p>
          <p className="text-muted-foreground">Changes to this section apply to every workspace in the organisation from the next billing period.</p>
        </section>
      ))}
    </div>
  );
}

function Demo({ threshold, position, label, showLabel, height }: Args) {
  const [scroller, setScroller] = React.useState<HTMLDivElement | null>(null);
  return (
    <div
      ref={setScroller}
      aria-label="Account settings"
      role="region"
      style={{ height }}
      tabIndex={0}
      className="relative w-[420px] max-w-full overflow-y-auto rounded-lg border border-border bg-background outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <Article />
      <BackToTop target={scroller} threshold={threshold} position={position} label={label} showLabel={showLabel} />
    </div>
  );
}

const meta = {
  title: 'Components/Layout/Back To Top',
  parameters: {
    docs: {
      description: {
        component:
          'A round button that appears after the page or a scroll area has moved past a threshold and scrolls back to the top: smooth, instant under prefers-reduced-motion. `fixed` pins it to the window corner; without it, it sticks to the corner of the scroll area it sits in (last child). Hidden means invisible and out of the tab order. Focus moves to the scroll area after the jump. Code only (no Figma component yet).',
      },
    },
  },
  args: { threshold: 120, position: 'right', label: 'Back to top', showLabel: false, height: 280 },
  argTypes: {
    threshold: { name: 'Threshold', control: { type: 'range', min: 40, max: 400, step: 20 }, description: 'Scroll distance in px before the button appears.', table: { category: 'Button' } },
    position: { name: 'Position', control: 'inline-radio', options: ['left', 'center', 'right'], description: 'Which bottom corner.', table: { category: 'Button' } },
    label: { name: 'Label', control: 'text', description: 'Accessible name, tooltip and pill text.', table: { category: 'Button' } },
    showLabel: { name: 'Show label', control: 'boolean', description: 'A pill with text instead of the arrow only.', table: { category: 'Parts' } },
    height: { name: 'Area height', control: { type: 'range', min: 200, max: 480, step: 20 }, description: 'Height of the scroll area in px.', table: { category: 'Area' } },
  },
  render: args => <Demo {...args} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas, canvasElement }) => {
    const region = canvas.getByRole('region', { name: 'Account settings' });
    const button = canvasElement.querySelector<HTMLButtonElement>('[data-slot="back-to-top"]')!;
    // Hidden at the top: not visible and not in the tab order.
    await expect(button).not.toBeVisible();
    await expect(button).toHaveAttribute('tabindex', '-1');
    await userEvent.tab();
    await expect(button).not.toHaveFocus();
    // Scrolling past the threshold shows it.
    region.scrollTop = 400;
    region.dispatchEvent(new Event('scroll'));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Back to top' })).toBeVisible());
    // It stays inside the area, in the bottom right corner.
    const b = button.getBoundingClientRect();
    const r = region.getBoundingClientRect();
    await expect(b.right).toBeLessThanOrEqual(r.right);
    await expect(b.bottom).toBeLessThanOrEqual(r.bottom);
    await expect(b.width).toBeGreaterThanOrEqual(36);
    // Click goes up and moves focus to the scroll area.
    await userEvent.click(button);
    await waitFor(() => expect(region.scrollTop).toBe(0), { timeout: 3000 });
    await waitFor(() => expect(button).not.toBeVisible());
    await expect(region).toHaveFocus();
  },
};

/** Pinned to the window corner: scroll the page. */
export const Fixed: Story = {
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
  render: () => (
    <div className="min-h-[1800px] p-6 text-sm text-foreground">
      <h2 className="text-lg font-semibold">Scroll this page</h2>
      <p className="text-muted-foreground">The button appears in the bottom right corner of the window after 200 px.</p>
      <BackToTop fixed showLabel />
    </div>
  ),
};

/* Hidden checks */

export const FixedCheck: Story = {
  ...Fixed,
  tags: ['!dev'],
  play: async ({ canvas, canvasElement }) => {
    const button = canvasElement.querySelector<HTMLButtonElement>('[data-slot="back-to-top"]')!;
    await expect(getComputedStyle(button).position).toBe('fixed');
    await expect(button).not.toBeVisible();
    window.scrollTo(0, 600);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Back to top' })).toBeVisible());
    await userEvent.keyboard('{Tab}');
    await userEvent.click(canvas.getByRole('button', { name: 'Back to top' }));
    // Smooth scrolling is throttled in a background tab: it must be heading up.
    await waitFor(() => expect(window.scrollY).toBeLessThan(500), { timeout: 3000 });
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  args: { showLabel: true, label: 'Back to the top of the settings page', position: 'center', height: 240 },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const region = canvas.getByRole('region', { name: 'Account settings' });
    region.scrollTop = 500;
    region.dispatchEvent(new Event('scroll'));
    const button = await canvas.findByRole('button', { name: /Back to the top/ });
    await waitFor(() => expect(button).toBeVisible());
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
