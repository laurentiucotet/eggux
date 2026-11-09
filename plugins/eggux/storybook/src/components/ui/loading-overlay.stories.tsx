import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { LoadingOverlay } from './loading-overlay';

const meta = {
  title: 'Components/Spinner/Loading Overlay',
  component: LoadingOverlay,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Covers one region while its content reloads (a table after a filter change, a chart after a period change), keeping the old content faded underneath so the layout does not jump. Spinner and a short label that says what loads. Show it after about 300 ms; first loads use Skeleton, long work uses Background Job. Figma: Spinner page / Loading Overlay. Guide: eggux build-ui/patterns/loading-states.md' } },
  },
  args: { loading: true, label: 'Loading invoices…' },
  render: args => (
    <LoadingOverlay {...args} className="h-[240px] w-[480px] overflow-hidden rounded-lg border border-border bg-background">
      <ul className="m-0 flex list-none flex-col gap-3 p-6 text-sm">
        <li>INV-0412 · Northwind Traders · €1,240.00</li>
        <li>INV-0411 · Contoso Retail · €980.00</li>
        <li>INV-0410 · Fabrikam · €3,410.00</li>
        <li><a href="#inv-0409">INV-0409 · Tailspin Toys · €215.00</a></li>
      </ul>
    </LoadingOverlay>
  ),
} satisfies Meta<typeof LoadingOverlay>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 480 × 240 region, scrim over the old content, Spinner 20 over the label 8 apart; aria-busy, content inert.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const region = canvasElement.querySelector('[data-slot="loading-overlay"]')!;
    await expect(region).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading invoices…');
    const spinner = canvasElement.querySelector('[data-slot="spinner"]')!;
    await expect(Math.round(box(spinner).width)).toBe(20);
    const label = canvas.getByText('Loading invoices…');
    await expect(Math.round(box(label).top - box(spinner).bottom)).toBe(8);
    await expect(canvasElement.querySelector('[data-slot="loading-overlay-content"]')).toHaveAttribute('inert');
  },
};

// Reload on demand: the overlay comes and goes, the list stays in place.
export const Toggle: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [loading, setLoading] = React.useState(false);
    return (
      <div className="flex flex-col items-start gap-3">
        <Button variant="outline" onClick={() => setLoading(l => !l)}>{loading ? 'Done' : 'Refresh'}</Button>
        <LoadingOverlay loading={loading} label="Refreshing invoices…" className="w-[480px] rounded-lg border border-border bg-background">
          <p className="m-0 p-6 text-sm">12 invoices, €18,420.00 open</p>
        </LoadingOverlay>
      </div>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('status')).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Refresh' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Refreshing invoices…'));
    await userEvent.click(canvas.getByRole('button', { name: 'Done' }));
    await expect(canvas.queryByRole('status')).toBeNull();
  },
};

// Stress: at 276 a long label clamps to 2 lines; Show label off keeps it for screen readers. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex gap-4">
      <LoadingOverlay loading label="Loading invoices, credit notes and payments for all customers in Europe…" className="h-[240px] w-[276px] rounded-lg border border-border bg-background">
        <p className="m-0 p-6 text-sm">Old content</p>
      </LoadingOverlay>
      <LoadingOverlay loading label="Loading chart" showLabel={false} className="h-[240px] w-[276px] rounded-lg border border-border bg-background">
        <p className="m-0 p-6 text-sm">Old chart</p>
      </LoadingOverlay>
    </div>
  ),
  play: async ({ canvas }) => {
    const label = canvas.getByText(/Loading invoices, credit notes/);
    await expect(Math.round(box(label).height)).toBe(40);
    await expect(canvas.getByText('Loading chart')).toHaveClass('sr-only');
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
