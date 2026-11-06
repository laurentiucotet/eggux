import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FileText } from '@/components/icons';
import { MentionMenu, MentionMenuGroup, findMentionQuery } from './mention-menu';
import { MentionOption, splitMatch } from './mention-option';

const meta = {
  title: 'Components/Popover/Mention Menu',
  component: MentionMenu,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'The suggestion list that opens while typing @: Mention Options with the typed part highlighted, people first, then files and records, at most 6 to 8, the first highlighted. The editor keeps focus (aria-activedescendant); Up / Down move, Enter or Tab picks, Esc closes and keeps the text. Figma: Popover page / Mention Menu. Guide: eggux build-ui/components/comments-and-chat.md' } },
  },
} satisfies Meta<typeof MentionMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

type Entry = { id: string; name: string; description: string; type: 'person' | 'item' };
const entries: Entry[] = [
  { id: 'anna', name: 'Anna Berg', description: '@anna · Design', type: 'person' },
  { id: 'anton', name: 'Anton Weber', description: '@anton · Sales', type: 'person' },
  { id: 'andrea', name: 'Andrea Costa', description: '@andrea · Finance', type: 'person' },
  { id: 'mihai', name: 'Mihai Ionescu', description: '@mihai · Support', type: 'person' },
  { id: 'report', name: 'Annual report 2026.pdf', description: 'File · Finance', type: 'item' },
];

// The Figma default: People header, three people and a file, the first highlighted.
export const Default: Story = {
  render: () => (
    <MentionMenu header="People">
      {entries.filter(e => e.name.startsWith('An')).map((e, i) => (
        <MentionOption key={e.id} type={e.type} {...splitMatch(e.name, 'An')} description={e.description} highlighted={i === 0} />
      ))}
    </MentionMenu>
  ),
  play: async ({ canvas }) => {
    const listbox = canvas.getByRole('listbox', { name: 'People' });
    // Figma: 280 x 230 (26 header, 2 gap, 4 x 48 options, 4 px padding, 1 px border).
    await expect(box(listbox.parentElement!)).toEqual([280, 230]);
    const options = within(listbox).getAllByRole('option');
    await expect(options).toHaveLength(4);
    await expect(options[0]).toHaveAttribute('aria-selected', 'true');
    await expect(box(options[0])).toEqual([270, 48]);
  },
};

// People first, then Files, each group with a header.
export const Groups: Story = {
  render: () => (
    <MentionMenu header="People">
      <MentionOption {...splitMatch('Anna Berg', 'an')} description="@anna · Design" highlighted />
      <MentionOption {...splitMatch('Anton Weber', 'an')} description="@anton · Sales" />
      <MentionMenuGroup header="Files">
        <MentionOption type="item" icon={<FileText />} {...splitMatch('Annual report 2026.pdf', 'an')} description="File · Finance" />
      </MentionMenuGroup>
    </MentionMenu>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Files' })).toBeVisible();
    await expect(canvas.getAllByRole('option')).toHaveLength(3);
  },
};

// No match: one muted line in a status region.
export const Empty: Story = {
  render: () => <MentionMenu header="People" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('No people match');
    await expect(canvas.queryAllByRole('option')).toHaveLength(0);
  },
};

const onMention = fn();

// A comment composer: @ opens the menu under the field, typing filters, the editor keeps focus.
function Composer() {
  const [text, setText] = React.useState('');
  const [caret, setCaret] = React.useState(0);
  const [active, setActive] = React.useState(0);
  const [dismissed, setDismissed] = React.useState<number | null>(null);
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const listId = 'composer-mentions';
  const mention = findMentionQuery(text, caret);
  const open = mention !== null && dismissed !== mention.start;
  const matches = mention ? entries.filter(e => splitMatch(e.name, mention.query).match || mention.query === '').slice(0, 8) : [];
  const optionId = (i: number) => `${listId}-${matches[i]?.id}`;

  const pick = (entry: Entry) => {
    if (!mention) return;
    const insert = `@${entry.name} `;
    const next = text.slice(0, mention.start) + insert + text.slice(caret);
    const at = mention.start + insert.length;
    setText(next);
    setCaret(at);
    onMention(entry.id);
    requestAnimationFrame(() => ref.current?.setSelectionRange(at, at));
  };

  return (
    <div className="relative w-96">
      <label htmlFor="comment" className="mb-1.5 block text-sm font-medium">Comment</label>
      <textarea
        id="comment"
        ref={ref}
        value={text}
        rows={3}
        aria-controls={open ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={open && matches.length ? optionId(active) : undefined}
        onChange={event => { setText(event.target.value); setCaret(event.target.selectionStart); setActive(0); setDismissed(null); }}
        onSelect={event => setCaret(event.currentTarget.selectionStart)}
        onKeyDown={event => {
          if (!open || !mention) return;
          if (event.key === 'ArrowDown' && matches.length) { event.preventDefault(); setActive(a => Math.min(a + 1, matches.length - 1)); }
          else if (event.key === 'ArrowUp' && matches.length) { event.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
          else if ((event.key === 'Enter' || event.key === 'Tab') && matches.length) { event.preventDefault(); pick(matches[active]); }
          else if (event.key === 'Escape') { event.preventDefault(); setDismissed(mention.start); }
        }}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
      />
      {open ? (
        <MentionMenu header="People" listId={listId} className="absolute top-full left-0 z-10 mt-1">
          {matches.map((e, i) => (
            <MentionOption
              key={e.id}
              id={optionId(i)}
              type={e.type}
              {...splitMatch(e.name, mention!.query)}
              description={e.description}
              highlighted={i === active}
              onMouseMove={() => setActive(i)}
              onSelect={() => pick(e)}
            />
          ))}
        </MentionMenu>
      ) : null}
    </div>
  );
}

export const InComposer: Story = {
  render: () => <Composer />,
  play: async ({ canvas }) => {
    onMention.mockClear();
    const field = canvas.getByRole('textbox', { name: 'Comment' });
    await userEvent.click(field);
    await userEvent.type(field, 'Thanks @an');
    const listbox = canvas.getByRole('listbox', { name: 'People' });
    await expect(field).toHaveAttribute('aria-controls', listbox.id);
    const options = within(listbox).getAllByRole('option');
    await expect(options.map(o => o.querySelector('[data-slot="mention-option-name"]')!.textContent)).toEqual(['Anna Berg', 'Anton Weber', 'Andrea Costa', 'Annual report 2026.pdf']);
    await expect(field).toHaveAttribute('aria-activedescendant', options[0].id);
    await userEvent.keyboard('{ArrowDown}');
    await expect(field).toHaveAttribute('aria-activedescendant', options[1].id);
    await expect(field).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(field).toHaveValue('Thanks @Anton Weber ');
    await expect(onMention).toHaveBeenCalledWith('anton');
    await expect(canvas.queryByRole('listbox')).toBeNull();
    // Esc closes and keeps the typed text; Tab picks.
    await userEvent.type(field, '@mi');
    await expect(canvas.getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('listbox')).toBeNull();
    await expect(field).toHaveValue('Thanks @Anton Weber @mi');
    await userEvent.type(field, 'h');
    await userEvent.keyboard('{Tab}');
    await expect(field).toHaveValue('Thanks @Anton Weber @Mihai Ionescu ');
    await expect(field).toHaveFocus();
  },
};

// Many people and long names: 280 fixed, names and descriptions truncate to one line.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <MentionMenu header="People in the Acme Holdings finance and operations workspace">
      {Array.from({ length: 8 }, (_, i) => (
        <MentionOption key={i} {...splitMatch(`Alexandra Constantinescu-Vasilescu ${i + 1}`, 'al')} description="@alexandra.constantinescu · Finance operations, Bucharest office" highlighted={i === 0} />
      ))}
    </MentionMenu>
  ),
  play: async ({ canvasElement }) => {
    const menu = canvasElement.querySelector<HTMLElement>('[data-slot="mention-menu"]')!;
    await expect(box(menu)[0]).toBe(280);
    await expect(menu.scrollWidth).toBeLessThanOrEqual(menu.clientWidth);
    for (const option of within(menu).getAllByRole('option')) await expect(box(option)[1]).toBe(48);
    await expect(box(menu.querySelector('[data-slot="mention-menu-header"]')!)[1]).toBe(26);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
