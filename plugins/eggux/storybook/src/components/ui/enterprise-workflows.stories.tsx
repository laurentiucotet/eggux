import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { ApprovalInbox as ApprovalInboxBlock, ApprovalRequest as ApprovalRequestBlock, WorkflowBuilder as WorkflowBuilderBlock } from './enterprise-blocks';
import { RecordForm as RecordFormBlock } from './enterprise-blocks-more';
import { AtWidths, appBlock, box, frames, multi, padding1440, twoColumns } from './enterprise-checks';

const meta = {
  title: 'Blocks/Enterprise/Workflows',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Enterprise workflow blocks, inside an app page (Back office look): Approval Request (details, line items, attachments, approval chain, decision; Reject needs a comment), Approval Inbox (approver queue oldest first, list 384 and the open request), Workflow Builder (flow of Workflow Nodes, rules, Side Panel 320 for the selected step), Record Form (section nav, two-column fields, danger zone, Save Bar). Each block is a region named by its h2. Figma: BLOCKS / Enterprise. Guides: eggux build-ui/patterns/approvals.md, enterprise-apps.md, record-page.md' } },
  },
} satisfies Meta;
export default meta;

const text = (name: string, description: string) => ({ name, description, control: 'text' as const, table: { category: 'Content' } });

/* Visible stories: one per block, no play function. */

type RequestArgs = { title: string; submitted: string; chainRule: string };
export const ApprovalRequest: StoryObj<RequestArgs> = {
  args: { title: 'Purchase request PR-2041', submitted: 'Submitted by Radu Georgescu on 20 Oct 2026 · Engineering', chainRule: 'Over €15,000 needs a director' },
  argTypes: { title: text('Title', 'Request name and id.'), submitted: text('Submitted', 'Who submitted it and when.'), chainRule: text('Chain rule', 'Why these approvers.') },
  render: a => <ApprovalRequestBlock title={a.title} submitted={a.submitted} chainRule={a.chainRule} />,
};

type InboxArgs = { title: string; description: string; pageSize: number };
export const ApprovalInbox: StoryObj<InboxArgs> = {
  args: { title: 'Approvals', description: 'Requests waiting for your decision, oldest first. Approvals over €10,000 need a comment.', pageSize: 10 },
  argTypes: {
    title: text('Title', 'Block title.'),
    description: text('Description', 'Order and rules.'),
    pageSize: { name: 'Rows before Show more', description: 'Requests listed before "Show N more".', control: { type: 'range', min: 3, max: 12 }, table: { category: 'Content' } },
  },
  render: a => <ApprovalInboxBlock key={a.pageSize} title={a.title} description={a.description} pageSize={a.pageSize} />,
};

type WorkflowArgs = { title: string; description: string };
export const WorkflowBuilder: StoryObj<WorkflowArgs> = {
  args: { title: 'Invoice approval', description: 'Runs on every supplier invoice. Last published by Ana Popescu on 22 Oct 2026.' },
  argTypes: { title: text('Title', 'Workflow name.'), description: text('Description', 'What it runs on and who published it.') },
  render: a => <WorkflowBuilderBlock title={a.title} description={a.description} />,
};

type RecordArgs = { title: string; lastChanged: string };
export const RecordForm: StoryObj<RecordArgs> = {
  args: { title: 'Edit customer · Northwind Traders', lastChanged: 'Last changed by Ana Popescu on 21 Oct 2026. Changes are logged.' },
  argTypes: { title: text('Title', 'What is edited.'), lastChanged: text('Last changed', 'Provenance: who changed it last and when.') },
  render: a => <RecordFormBlock title={a.title} lastChanged={a.lastChanged} />,
};

/* Hidden checks: each block at 1440, 768 and 390, and its interactions with the keyboard. */

const onDecision = fn();
export const ApprovalRequestCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => (
    <div className="flex flex-col gap-8">
      <AtWidths><ApprovalRequestBlock onDecision={onDecision} /></AtWidths>
      <div data-approve style={{ width: 1440 }}><ApprovalRequestBlock /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await appBlock(canvasElement);
    await padding1440(canvasElement);
    await twoColumns(canvasElement, 'approval-body', { second: 400, gap: 24 });
    const wide = frames(canvasElement)[0]!;
    const c = within(wide);
    await expect(c.getByRole('list', { name: 'Approval chain' }).children).toHaveLength(3);
    await expect(c.getByText('Waiting for you')).toBeInTheDocument();
    await expect(wide.querySelector('tfoot')).toHaveTextContent('Total€18,400.00');
    // Keyboard: Reject without a comment is refused and focus goes to the comment.
    const decision = c.getByRole('heading', { name: 'Your decision' }).closest('[data-slot="card"]') as HTMLElement;
    const d = within(decision);
    d.getByRole('button', { name: 'Reject' }).focus();
    await userEvent.keyboard('{Enter}');
    const comment = d.getByRole('textbox', { name: 'Comment' });
    await waitFor(() => expect(comment).toHaveFocus());
    await expect(comment).toHaveAttribute('aria-invalid', 'true');
    await expect(onDecision).not.toHaveBeenCalled();
    await userEvent.keyboard('Split backups into a separate request.');
    d.getByRole('button', { name: 'Reject' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(onDecision).toHaveBeenCalledWith('reject', 'Split backups into a separate request.');
    await waitFor(() => expect(d.getByRole('status')).toHaveTextContent('You rejected this request. Radu Georgescu was notified'));
    await expect(c.getAllByText('Rejected')).toHaveLength(2);
    await expect(c.queryByRole('button', { name: 'Approve' })).toBeNull();
    // Approve (no comment needed): the director's step starts.
    const second = within(canvasElement.querySelector<HTMLElement>('[data-approve]')!);
    second.getAllByRole('button', { name: 'Approve' })[0]!.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(second.getByText('Waiting for Ana Popescu')).toBeInTheDocument());
    await expect(second.getByRole('status')).toHaveTextContent('You approved this request. Ana Popescu is next.');
  },
};

const onInbox = fn();
export const ApprovalInboxCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><ApprovalInboxBlock onDecision={onInbox} /></AtWidths>,
  play: async ({ canvasElement }) => {
    await appBlock(canvasElement);
    await padding1440(canvasElement);
    await twoColumns(canvasElement, 'inbox-split', { first: 384, gap: 0 });
    const wide = frames(canvasElement)[0]!;
    const c = within(wide);
    const list = c.getByRole('list', { name: 'Requests' });
    await expect(list.children).toHaveLength(10);
    await expect(c.getByRole('radio', { name: 'Waiting (12)' })).toHaveAttribute('aria-checked', 'true');
    await expect(c.getByRole('heading', { level: 3, name: 'Purchase request PR-2041' })).toBeInTheDocument();
    // Keyboard: open another request.
    c.getByRole('button', { name: 'Travel expense TE-3307' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByRole('heading', { level: 3, name: 'Travel expense TE-3307' })).toBeInTheDocument());
    // Approve it: it leaves the queue and the next one opens.
    c.getByRole('button', { name: 'Approve' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(onInbox).toHaveBeenCalledWith('TE-3307', 'approve', '');
    await waitFor(() => expect(c.getByRole('radio', { name: 'Waiting (11)' })).toBeInTheDocument());
    await expect(c.queryByRole('button', { name: 'Travel expense TE-3307' })).toBeNull();
    // Reject needs a reason.
    c.getByRole('button', { name: 'Reject' }).focus();
    await userEvent.keyboard('{Enter}');
    const reason = await c.findByRole('textbox', { name: 'Reason for rejecting' });
    await waitFor(() => expect(reason).toHaveFocus());
    c.getByRole('button', { name: 'Reject request' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(reason).toHaveAttribute('aria-invalid', 'true'));
    // Search narrows the list; Show more lists the rest.
    c.getByRole('searchbox', { name: 'Search requests' }).focus();
    await userEvent.keyboard('travel');
    await waitFor(() => expect(list.children).toHaveLength(2));
    await userEvent.clear(c.getByRole('searchbox', { name: 'Search requests' }));
    c.getByRole('button', { name: 'Show 1 more' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(list.children).toHaveLength(11));
  },
};

const onSave = fn();
export const WorkflowBuilderCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><WorkflowBuilderBlock onSave={onSave} /></AtWidths>,
  play: async ({ canvasElement }) => {
    await appBlock(canvasElement);
    await padding1440(canvasElement);
    await twoColumns(canvasElement, 'workflow-body', { second: 320, gap: 24 });
    const wide = frames(canvasElement)[0]!;
    const c = within(wide);
    // Nodes are 260 wide; the error node says what is missing.
    const nodes = wide.querySelectorAll('[data-slot="workflow-node"]');
    await expect(nodes).toHaveLength(5);
    await expect(Math.round(box(nodes[0]!).width)).toBe(260);
    await expect(c.getByText(/Slack channel not found/)).toBeInTheDocument();
    const panel = c.getByRole('region', { name: 'Ask for approval' });
    // Keyboard: select another step, then back; change Due within and save.
    c.getByRole('button', { name: 'Action: Approve automatically' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByRole('region', { name: 'Approve automatically' })).toBeInTheDocument());
    c.getByRole('button', { name: 'Action: Ask for approval' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByRole('button', { name: 'Action: Ask for approval' })).toHaveAttribute('aria-pressed', 'true'));
    const due = within(c.getByRole('region', { name: 'Ask for approval' })).getByRole('combobox', { name: 'Due within' });
    due.focus();
    await userEvent.keyboard('{Enter}');
    const options = await screen.findByRole('listbox');
    await waitFor(() => expect(within(options).getByRole('option', { name: '2 business days' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(due).toHaveTextContent('5 business days'));
    c.getByRole('button', { name: 'Save' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ id: 'ask', detail: 'Finance lead, due in 5 business days' }));
    await waitFor(() => expect(c.getByText('Finance lead, due in 5 business days')).toBeInTheDocument());
    await expect(panel).toBeInTheDocument();
    // Zoom and the rule switches.
    c.getByRole('button', { name: 'Zoom in' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByRole('status', { name: 'Zoom level' })).toHaveTextContent('110%'));
    const dup = c.getByRole('switch', { name: 'Flag duplicate invoices' });
    dup.focus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(dup).toHaveAttribute('aria-checked', 'true'));
  },
};

const onRecord = fn();
export const RecordFormCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><RecordFormBlock onSave={onRecord} /></AtWidths>,
  play: async ({ canvasElement }) => {
    await appBlock(canvasElement);
    await padding1440(canvasElement);
    await twoColumns(canvasElement, 'record-body', { first: 200, gap: 32 });
    const wide = frames(canvasElement)[0]!;
    const c = within(wide);
    await expect(c.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument();
    // Two-column fields at 1440, one column at 390.
    const pair = (f: HTMLElement) => [within(f).getByRole('textbox', { name: 'Company name' }), within(f).getByRole('textbox', { name: 'Legal name' })].map(box);
    const [a, b] = pair(wide);
    await expect(Math.round(a!.top)).toBe(Math.round(b!.top));
    const [na, nb] = pair(frames(canvasElement)[2]!);
    await expect(nb!.top).toBeGreaterThan(na!.top);
    // Save Bar shows the unsaved changes.
    await expect(c.getByText('3 unsaved changes in Billing')).toBeInTheDocument();
    // Keyboard: an invalid email blocks the save and says how to fix it.
    const email = c.getByRole('textbox', { name: 'Billing email' });
    await userEvent.clear(email);
    await userEvent.keyboard('ap at northwind');
    c.getByRole('button', { name: 'Save changes' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(email).toHaveAttribute('aria-invalid', 'true'));
    await expect(onRecord).not.toHaveBeenCalled();
    await userEvent.clear(email);
    email.focus();
    await userEvent.keyboard('ap@northwind.com');
    c.getByRole('button', { name: 'Save changes' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(onRecord).toHaveBeenCalledWith(expect.objectContaining({ email: 'ap@northwind.com', terms: '30' }));
    await waitFor(() => expect(c.queryByText(/unsaved change/)).toBeNull());
    await expect(c.getByText('Last changed by you just now. Changes are logged.')).toBeInTheDocument();
    // Discard reverts a new change.
    const company = c.getByRole('textbox', { name: 'Company name' });
    company.focus();
    await userEvent.keyboard(' Ltd');
    await waitFor(() => expect(c.getByText('1 unsaved change in General')).toBeInTheDocument());
    c.getByRole('button', { name: 'Discard' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(company).toHaveValue('Northwind Traders'));
  },
};

/* Theme copies (axe contrast): Dark and Back office. */
const Gallery = () => (
  <div className="w-[1440px]">
    <ApprovalRequestBlock />
    <ApprovalInboxBlock />
    <WorkflowBuilderBlock />
    <RecordFormBlock />
  </div>
);
export const GalleryDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, parameters: { controls: { disable: true } }, render: () => <Gallery /> };
export const GalleryBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, parameters: { controls: { disable: true } }, render: () => <Gallery /> };
