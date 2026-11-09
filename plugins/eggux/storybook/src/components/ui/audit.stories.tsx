import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { ChangeItem, ReleaseNoteItem, ReleaseNoteLine, VersionItem } from './audit';

const versions = [
  { id: 12, meta: 'Elena Popa · 12 Oct 2026, 15:40', summary: 'Changed payment terms to 14 days', initials: 'EP' },
  { id: 11, meta: 'Dan Cristea · 10 Oct 2026, 09:12', summary: 'Added the cost center', initials: 'DC' },
  { id: 10, meta: 'Maria Ilie · 2 Oct 2026, 17:03', summary: 'Created the invoice', initials: 'MI' },
];

const meta = {
  title: 'Components/Audit/Version Item',
  component: VersionItem,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'History and change records. Version Item: one saved version (who, when, what), the current one marked and without Restore; selecting previews it, restoring adds a new version. Change Item: one changed field, old to new, "(empty)" and masked values. Release Note Item and Release Note Line: changelog and What\'s new entries, newest first, tagged New, Improved or Fixed. Figma: Audit page. Guide: eggux build-ui/patterns/content-and-docs.md' } },
  },
  args: { version: 'Version 12', meta: 'Elena Popa · 12 Oct 2026, 15:40' },
  render: function Render() {
    const [selected, setSelected] = React.useState<number | null>(11);
    const [restored, setRestored] = React.useState('');
    return (
      <div className="flex w-[480px] flex-col gap-6">
        <ul aria-label="Version history" className="m-0 flex flex-col p-0">
          {versions.map((v, i) => (
            <VersionItem
              key={v.id}
              version={`Version ${v.id}`}
              meta={v.meta}
              summary={v.summary}
              initials={v.initials}
              current={i === 0}
              selected={selected === v.id}
              onSelect={() => setSelected(v.id)}
              onRestore={() => setRestored(`Version ${v.id}`)}
            />
          ))}
        </ul>
        <p className="text-sm">Restored: {restored}</p>
        <div className="flex flex-col gap-2">
          <ChangeItem field="Due date" from="7 Oct 2026" to="21 Oct 2026" />
          <ChangeItem field="Purchase order" from={null} to="PO-0193" />
          <ChangeItem field="IBAN" from="RO49AAAA1B31007593840000" to="RO09BCYP0000001234567890" sensitive />
        </div>
      </div>
    );
  },
} satisfies Meta<typeof VersionItem>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 84 rows; current has a badge and no Restore; selecting and restoring; change items read as text.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="version-item"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(84);
    await expect(canvas.queryByRole('button', { name: 'Restore Version 12' })).toBeNull();
    await expect(canvas.getByRole('button', { name: 'Version 11' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Version 10' }));
    await expect(rows[2]).toHaveAttribute('data-state', 'selected');
    await userEvent.click(canvas.getByRole('button', { name: 'Restore Version 10' }));
    await expect(canvas.getByText('Restored: Version 10')).toBeInTheDocument();
    const changes = canvasElement.querySelectorAll('[data-slot="change-item"]');
    await expect(Math.round(box(changes[0]!).height)).toBe(24);
    await expect(changes[0]).toHaveTextContent('Due date: 7 Oct 2026 to 21 Oct 2026');
    await expect(changes[1]).toHaveTextContent('(empty)');
    await expect(changes[2]).not.toHaveTextContent('RO49');
  },
};

// Release notes: text entry with Read more, and an entry with Changes lines.
export const ReleaseNotes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[640px]">
      <ReleaseNoteItem
        type="new"
        meta="v2.14 · 12 Oct 2026"
        title="Payment reminders in the client's language"
        text="Reminders now go out in German, French or Romanian, based on the language set on the customer. Edit the templates in Settings → Reminders."
        href="#v2-14"
      />
      <ReleaseNoteItem
        type="improved"
        meta="v2.13 · 28 Sep 2026"
        title="Approvals"
        changes={
          <>
            <ReleaseNoteLine type="new">Delegate approvals to a deputy for a date range.</ReleaseNoteLine>
            <ReleaseNoteLine type="improved">Approval emails show the full amount and cost center.</ReleaseNoteLine>
            <ReleaseNoteLine type="fixed">Escalation timers no longer reset after an edit.</ReleaseNoteLine>
          </>
        }
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const item = canvasElement.querySelector('[data-slot="release-note-item"]')!;
    await expect(Math.round(box(item).height)).toBe(205);
    await expect(canvas.getByRole('link', { name: "Read more about Payment reminders in the client's language" })).toHaveAttribute('href', '#v2-14');
    await expect(canvas.getByRole('article', { name: 'Approvals' })).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('[data-slot="release-note-line"]')).toHaveLength(3);
  },
};

// Stress: long values truncate at 240; at 320 the change item wraps. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="w-[320px]">
      <ChangeItem field="Billing address line 2" from="Building C, floor 4, office 412, Pipera Business Park" to="Building A, floor 1, reception desk" />
      <ul className="m-0 p-0"><VersionItem version="Version 128 — imported from the legacy accounting system" meta="System import · 1 Jan 2026" onRestore={fn()} /></ul>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const chips = canvasElement.querySelectorAll('[data-slot="change-item"] [title]');
    await expect(Math.round(box(chips[0]!).width)).toBeLessThanOrEqual(240);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="change-item"]')!).height)).toBeGreaterThan(24);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const ReleaseNotesDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: ReleaseNotes.render };
