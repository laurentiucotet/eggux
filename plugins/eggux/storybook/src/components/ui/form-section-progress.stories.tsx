import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { FormSectionProgress, type FormSectionProgressItem } from './form-section-progress';

const all: FormSectionProgressItem[] = [
  { id: 'fsp-company', title: 'Company details', completed: 6, total: 6 },
  { id: 'fsp-bank', title: 'Bank account', completed: 2, total: 4 },
  { id: 'fsp-invoice', title: 'Invoice style', completed: 0, total: 3 },
  { id: 'fsp-team', title: 'Team and permissions', completed: 1, total: 5 },
  { id: 'fsp-notify', title: 'Notifications', completed: 0, total: 2 },
];

type Args = { sections: number; activeIndex: number; sticky: boolean; width: number };

/** The form the list jumps to: plain headed blocks with the section ids. */
function FormBody({ sections }: { sections: FormSectionProgressItem[] }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      {sections.map(s => (
        <section key={s.id} id={s.id} aria-label={s.title} className="rounded-lg border bg-card p-4 text-sm text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <h3 className="m-0 text-base font-semibold">{s.title}</h3>
          <p className="m-0 mt-1 text-muted-foreground">{s.total} fields in this section.</p>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: 'Components/Wizard/Form Section Progress',
  parameters: {
    docs: {
      description: {
        component:
          'Sticky side list of the sections of a long form. Each row is a jump link with a count ("2 of 4", or "Complete"); the section in view has aria-current="location". A click scrolls to the section and moves focus there. Pass activeId, or set track to follow the page. Code only (no Figma component yet). Guide: eggux build-ui/patterns/wizard.md',
      },
    },
  },
  args: { sections: 5, activeIndex: 1, sticky: true, width: 260 },
  argTypes: {
    sections: { name: 'Sections', control: { type: 'range', min: 2, max: 5, step: 1 }, description: 'How many sections.', table: { category: 'List' } },
    activeIndex: { name: 'Section in view', control: { type: 'range', min: 0, max: 4, step: 1 }, description: 'Which row has aria-current, from 0.', table: { category: 'List' } },
    sticky: { name: 'Sticky', control: 'boolean', description: 'Stick to the top while the form scrolls.', table: { category: 'List' } },
    width: { name: 'Width', control: { type: 'range', min: 200, max: 320, step: 4 }, description: 'Container width in px.', table: { category: 'List' } },
  },
  render: ({ sections, activeIndex, sticky, width }) => {
    const list = all.slice(0, sections);
    return (
      <div style={{ width }} className="max-w-full">
        <FormSectionProgress key={`${sections}-${activeIndex}`} sections={list} defaultActiveId={list[Math.min(activeIndex, list.length - 1)].id} sticky={sticky} />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The list beside a long form: use a link, the page scrolls and the section takes focus. */
export const WithForm: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <div className="flex min-w-0 items-start gap-6">
      <div className="w-60 shrink-0"><FormSectionProgress sections={all} track /></div>
      <FormBody sections={all} />
    </div>
  ),
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const onJump = fn();
    (window as unknown as { __jump?: typeof onJump }).__jump = onJump;
    return (
      <div className="flex min-w-0 items-start gap-6">
        <div className="w-60 shrink-0"><FormSectionProgress sections={all} onJump={onJump} /></div>
        <FormBody sections={all} />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Form sections' });
    await expect(nav).toBeVisible();
    const links = canvas.getAllByRole('link');
    await expect(links).toHaveLength(5);
    // Counts in text.
    await expect(canvas.getByText('Complete')).toBeVisible();
    await expect(canvas.getByText('2 of 4')).toBeVisible();
    // The first section is current to start with.
    await expect(links[0]).toHaveAttribute('aria-current', 'location');
    await expect(links[1]).not.toHaveAttribute('aria-current');
    // Keyboard jump: Tab, Tab, Enter.
    await userEvent.tab();
    await userEvent.tab();
    await expect(links[1]).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(links[1]).toHaveAttribute('aria-current', 'location'));
    await expect(links[0]).not.toHaveAttribute('aria-current');
    await waitFor(() => expect(canvas.getByRole('region', { name: 'Bank account' })).toHaveFocus());
    const spy = (window as unknown as { __jump: ReturnType<typeof fn> }).__jump;
    await expect(spy).toHaveBeenCalledWith('fsp-bank');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <FormSectionProgress
      defaultActiveId="b"
      sections={[
        { id: 'a', title: 'Registered company address and the VAT number for every entity', completed: 3, total: 3 },
        { id: 'b', title: 'Averyveryverylongunbrokensectionnamewithnospaces0123456789', completed: 12, total: 40 },
        { id: 'c', title: 'Team', completed: 0, total: 1 },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation');
    await expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth + 1);
    await expect(nav.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(canvas.getByText('12 of 40')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
