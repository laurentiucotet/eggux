import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Comment, CommentComposer, CommentHighlight, CommentsPanel, CommentThread, RichTextEditor, SelectionToolbar } from './editor';

const meta = {
  title: 'Components/Editor/Editor',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Writing and commenting. Rich Text Editor: toolbar (Heading, Bold, Italic, Underline, List, Quote, Link), editable content and a footer with the hint and count. Comment and Comment Composer for record comments. Selection Toolbar over selected text, Comment Highlight on commented words, Comment Thread (default, active, resolved) and the Comments Panel with the Open / Resolved filter and an empty state. Figma: Editor page. Guide: eggux build-ui/components/rich-text-editor.md, comments-and-chat.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const onSubmit = fn();
const onResolve = fn();

const notes = '<h3>Kickoff notes</h3><p>We agreed to ship the new onboarding in two phases. Support gets trained first, then we enable it for all workspaces.</p><ul><li>Phase 1: internal beta, 2 weeks</li><li>Phase 2: all workspaces, with a checklist</li></ul>';

export const Editor: Story = {
  render: () => <RichTextEditor label="Meeting notes" defaultValue={notes} maxLength={2000} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const root = canvasElement.querySelector('[data-slot="rich-text-editor"]')!;
    await expect(box(root).width).toBe(640);
    const toolbar = c.getByRole('toolbar', { name: 'Meeting notes formatting' });
    await expect(within(toolbar).getAllByRole('button')).toHaveLength(7);
    const text = c.getByRole('textbox', { name: 'Meeting notes' });
    await expect(c.getByText(/ \/ 2000/)).toHaveTextContent('/ 2000');
    // Select a word and make it bold.
    const p = text.querySelector('p')!;
    const range = document.createRange();
    range.setStart(p.firstChild!, 0);
    range.setEnd(p.firstChild!, 2);
    text.focus();
    document.getSelection()!.removeAllRanges();
    document.getSelection()!.addRange(range);
    await userEvent.click(within(toolbar).getByRole('button', { name: 'Bold' }));
    await expect(p.querySelector('b, strong')).not.toBeNull();
    await expect(within(toolbar).getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    // Focus draws the ring.
    await expect(getComputedStyle(root).borderColor).not.toBe('rgb(229, 229, 229)');
  },
};

export const Comments: Story = {
  render: () => (
    <div className="flex w-160 flex-col gap-4">
      <Comment name="Sofia Barbu" time="2 h ago" dateTime="2026-11-07T10:00:00Z">
        Can we split the rollout in two phases? Support needs a week to get trained before everyone sees it.
      </Comment>
      <Comment type="reply" name="Mara Ionescu" time="1 h ago">
        Agreed. I will update the clause and ask legal to confirm.
      </Comment>
      <Comment name="Sofia Barbu" time="3 d ago" resolved>
        The old date was wrong.
      </Comment>
      <CommentComposer onSubmit={onSubmit} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const comments = c.getAllByRole('article');
    await expect(Math.round(box(comments[0]).height)).toBe(100);
    await expect(getComputedStyle(comments[1]).paddingLeft).toBe('44px');
    await expect(within(comments[2]).getByText('Resolved')).toBeVisible();
    await expect(c.getAllByRole('button', { name: /^Reply to/ })).toHaveLength(3);
    const send = c.getByRole('button', { name: 'Comment' });
    await expect(send).toBeDisabled();
    const box2 = c.getByRole('textbox', { name: 'Add a comment' });
    await userEvent.type(box2, 'Looks good');
    await expect(send).toBeEnabled();
    await userEvent.keyboard('{Control>}{Enter}{/Control}');
    await expect(onSubmit).toHaveBeenCalledWith('Looks good');
    await expect(box2).toHaveValue('');
  },
};

export const SelectionAndHighlight: Story = {
  render: () => {
    const [bold, setBold] = React.useState(false);
    return (
      <div className="flex flex-col gap-6">
        <SelectionToolbar bold={bold} onBoldChange={setBold} />
        <SelectionToolbar showFormatting={false} />
        <div className="flex flex-wrap gap-6 text-base leading-7">
          <CommentHighlight state="open">payment is due within 30 days</CommentHighlight>
          <CommentHighlight state="active">payment is due within 30 days</CommentHighlight>
          <CommentHighlight state="selected">payment is due within 30 days</CommentHighlight>
          <CommentHighlight state="resolved">payment is due within 30 days</CommentHighlight>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const [full] = c.getAllByRole('toolbar', { name: 'Selected text' });
    await expect(Math.round(box(full).height)).toBe(46);
    await userEvent.click(within(full).getByRole('button', { name: 'Bold' }));
    await expect(within(full).getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    await expect(c.getAllByRole('button', { name: 'Comment' })).toHaveLength(2);
    const marks = canvasElement.querySelectorAll('mark');
    await expect(getComputedStyle(marks[0]).backgroundColor).not.toBe(getComputedStyle(marks[1]).backgroundColor);
    await expect(getComputedStyle(marks[3]).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  },
};

function ThreadBody() {
  return (
    <>
      <Comment name="Sofia Barbu" time="2 h ago" showActions={false}>
        Should this be 45 days? Most of our suppliers are on 45.
      </Comment>
      <Comment type="reply" name="Mara Ionescu" time="1 h ago" showActions={false}>
        Agreed. I will update the clause and ask legal to confirm.
      </Comment>
    </>
  );
}

export const Threads: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <CommentThread quote="payment is due within 30 days of the invoice date" composer={<CommentComposer />} onResolve={onResolve}>
        <ThreadBody />
      </CommentThread>
      <CommentThread state="active" quote="payment is due within 30 days of the invoice date" composer={<CommentComposer />}>
        <ThreadBody />
      </CommentThread>
      <CommentThread state="resolved" quote="payment is due within 30 days of the invoice date" resolvedBy="Resolved by Ana Popescu · 2 d ago" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const [first, active, resolved] = Array.from(canvasElement.querySelectorAll('[data-slot="comment-thread"]'));
    await expect(box(first).width).toBe(320);
    await expect(active).toHaveAttribute('aria-current', 'true');
    await expect(Math.round(box(resolved).height)).toBe(86);
    await userEvent.click(within(first as HTMLElement).getByRole('button', { name: 'Resolve thread' }));
    await expect(onResolve).toHaveBeenCalled();
    await expect(c.getByRole('button', { name: /Reopen thread/ })).toBeVisible();
  },
};

function Panel({ empty = false }: { empty?: boolean }) {
  const [filter, setFilter] = React.useState<'open' | 'resolved'>('open');
  return (
    <div className="h-[900px]">
      <CommentsPanel openCount={empty ? 0 : 3} resolvedCount={empty ? 0 : 1} filter={filter} onFilterChange={setFilter} onFilterMenu={() => {}} onClose={() => {}}>
        {empty ? null : (
          <>
            <CommentThread quote="payment is due within 30 days of the invoice date">
              <ThreadBody />
            </CommentThread>
            <CommentThread state="active" quote="The launch moves to 14 October" composer={<CommentComposer />}>
              <Comment name="Radu Marin" time="20 min ago" showActions={false}>
                Can we keep 7 October and ship the help center a week later?
              </Comment>
            </CommentThread>
          </>
        )}
      </CommentsPanel>
    </div>
  );
}

export const Panels: Story = {
  parameters: { a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }, { id: 'landmark-complementary-is-top-level', enabled: false }] } } },
  render: () => (
    <div className="flex gap-8">
      <Panel />
      <Panel empty />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const [full, empty] = c.getAllByRole('complementary');
    await expect(box(full).width).toBe(360);
    await expect(within(full).getByRole('radio', { name: 'Open 3' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(within(full).getByRole('radio', { name: 'Resolved 1' }));
    await expect(within(full).getByRole('radio', { name: 'Resolved 1' })).toHaveAttribute('aria-checked', 'true');
    await expect(within(empty).getByText('No comments yet')).toBeVisible();
    await expect(within(full).getAllByRole('article', { name: /^Thread on/ })).toHaveLength(2);
  },
};

function Edge() {
  const long = 'Bartholomew Alexandrescu-Vasilescu de la Departamentul Juridic';
  return (
    <div className="flex flex-col gap-8">
      <RichTextEditor className="w-80" label="Notes" defaultValue="<p>Supercalifragilisticexpialidocious-unbroken-word-in-a-narrow-editor</p>" maxLength={10} placeholder="Write something" />
      <RichTextEditor className="w-80" label="Empty notes" placeholder="Write something" showFooter={false} />
      <div className="w-80">
        <Comment name={long} time="a very long time ago, before the migration">
          https://example.com/a/very/long/link/that/does/not/break/naturally/in/the/comment/text
        </Comment>
      </div>
      <CommentThread className="w-70" quote={`${long} said this whole paragraph should be rewritten before we send it to the client next week`} composer={<CommentComposer />}>
        <ThreadBody />
      </CommentThread>
      <CommentThread className="w-70" state="resolved" quote={long} resolvedBy={`Resolved by ${long} · 2 d ago`} />
    </div>
  );
}

export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => <Edge />,
  play: async ({ canvasElement }) => {
    for (const el of Array.from(canvasElement.querySelectorAll('[data-slot="rich-text-editor"], [data-slot="comment-thread"], [data-slot="comment"]'))) {
      await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth + 1);
    }
    // Over the limit the count turns destructive.
    const count = within(canvasElement).getByText(/\/ 10/);
    await expect(count.className).toContain('text-destructive');
  },
};

const All = () => (
  <div className="flex flex-col gap-8 bg-background p-6">
    <RichTextEditor label="Meeting notes" defaultValue={notes} maxLength={2000} />
    <div className="flex w-160 flex-col gap-4">
      <Comment name="Sofia Barbu" time="2 h ago">Can we split the rollout in two phases?</Comment>
      <Comment type="reply" name="Mara Ionescu" time="1 h ago" resolved>Agreed.</Comment>
      <CommentComposer />
    </div>
    <SelectionToolbar />
    <p className="m-0 text-base leading-7 text-foreground">
      The <CommentHighlight>payment is due</CommentHighlight>, <CommentHighlight state="active">within 30 days</CommentHighlight> of <CommentHighlight state="selected">the invoice date</CommentHighlight>.
    </p>
    <div className="flex flex-wrap items-start gap-6">
      <CommentThread state="active" quote="payment is due within 30 days" composer={<CommentComposer />}>
        <ThreadBody />
      </CommentThread>
      <CommentThread state="resolved" quote="payment is due within 30 days" resolvedBy="Resolved by Ana Popescu · 2 d ago" />
    </div>
    <Panel />
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
