import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './button';
import { AnnotationPin, Coachmark, Hotspot } from './tour';

const steps = [
  { target: 'Filters', title: 'Filter the list', description: 'Narrow invoices by status, client or date.' },
  { target: 'Save view', title: 'Save this filter as a view', description: 'Views keep your filters and columns. Find them again in the sidebar under Projects.' },
  { target: 'Export', title: 'Export what you see', description: 'Download the filtered list as CSV or PDF.' },
];

function TourDemo({ side = 'bottom' }: { side?: 'top' | 'bottom' }) {
  const [step, setStep] = React.useState<number | null>(0);
  return (
    <div className="flex h-72 items-start gap-3 p-4">
      {steps.map((s, i) => (
        <Coachmark
          key={s.target}
          open={step === i}
          onOpenChange={o => { if (!o) setStep(null); }}
          side={side}
          title={s.title}
          description={s.description}
          step={`${i + 1} of ${steps.length}`}
          onBack={i > 0 ? () => setStep(i - 1) : undefined}
          onNext={() => setStep(i < steps.length - 1 ? i + 1 : null)}
          nextLabel={i === steps.length - 1 ? 'Done' : 'Next'}
        >
          <Button variant="outline">{s.target}</Button>
        </Coachmark>
      ))}
      {step === null ? <Button variant="ghost" onClick={() => setStep(0)}>Restart tour</Button> : null}
    </div>
  );
}

const meta = {
  title: 'Components/Tour/Coachmark',
  component: Coachmark,
  parameters: { controls: { disable: true },
    layout: 'padded',
    docs: { description: { component: 'Product tours and feature tips. Coachmark: one step anchored to its target, with the benefit as title, one or two lines, the step count, Back and Next (Done on the last step); always closable. Hotspot: a pulsing beacon on a new feature that opens its Coachmark; one per screen, removed once opened. Annotation Pin: a numbered marker on a design or document where a comment lives. Figma: Tour page.' } },
  },
  args: { open: true, title: 'Save this filter as a view', description: 'Views keep your filters and columns.', children: null },
  render: () => <TourDemo />,
} satisfies Meta<typeof Coachmark>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// A 3-step tour: dialog named by the title, 320 wide, Next / Back / Done, Escape ends it.
export const Default: Story = {
  play: async ({ canvas }) => {
    const body = within(document.body);
    const first = await body.findByRole('dialog', { name: 'Filter the list' });
    await expect(Math.round(box(first).width)).toBe(320);
    await expect(first).toHaveAccessibleDescription('Narrow invoices by status, client or date.');
    await expect(within(first).queryByRole('button', { name: 'Back' })).toBeNull();
    await userEvent.click(within(first).getByRole('button', { name: 'Next' }));
    const second = await body.findByRole('dialog', { name: 'Save this filter as a view' });
    await expect(within(second).getByText('2 of 3')).toBeInTheDocument();
    await userEvent.click(within(second).getByRole('button', { name: 'Back' }));
    await body.findByRole('dialog', { name: 'Filter the list' });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await userEvent.click(canvas.getByRole('button', { name: 'Restart tour' }));
    await body.findByRole('dialog', { name: 'Filter the list' });
  },
};

// Hotspot opens its coachmark and goes away; annotation pins in three states.
export const HotspotAndPins: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    const [seen, setSeen] = React.useState(false);
    return (
      <div className="flex h-64 items-start gap-10 p-4">
        <div className="flex items-center gap-2">
          <Coachmark open={open} onOpenChange={setOpen} title="New: saved views" description="Save filters and columns as a view." onNext={() => { setOpen(false); setSeen(true); }} nextLabel="Got it" side="right">
            <span className="inline-flex">{!seen ? <Hotspot label="New: saved views" onClick={() => setOpen(true)} /> : null}</span>
          </Coachmark>
          <span className="text-sm">Views</span>
        </div>
        <div className="relative h-40 w-64 rounded-lg bg-muted">
          <AnnotationPin number={1} state="resolved" className="absolute top-4 left-6" />
          <AnnotationPin number={2} className="absolute top-14 left-28" />
          <AnnotationPin number={3} state="active" className="absolute top-24 left-44" />
        </div>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const hotspot = canvas.getByRole('button', { name: 'New: saved views' });
    await expect(Math.round(box(hotspot).width)).toBe(24);
    await userEvent.click(hotspot);
    const dialog = await within(document.body).findByRole('dialog', { name: 'New: saved views' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Got it' }));
    await waitFor(() => expect(canvas.queryByRole('button', { name: 'New: saved views' })).toBeNull());
    await expect(Math.round(box(canvas.getByRole('button', { name: 'Comment 2' })).height)).toBe(28);
    await expect(canvas.getByRole('button', { name: 'Comment 3' })).toHaveAttribute('aria-expanded', 'true');
    await expect(Math.round(box(canvas.getByRole('button', { name: 'Comment 3' })).height)).toBe(32);
    await expect(canvas.getByRole('button', { name: 'Comment 1, resolved' })).toBeInTheDocument();
  },
};

export const SideTop: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], render: () => <div className="pt-48"><TourDemo side="top" /></div> };
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
