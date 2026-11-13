import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { PermissionDeniedNotice } from './permission-denied-notice';

type Args = {
  requiredLevel: string;
  action: string;
  showOwner: boolean;
  status: 'idle' | 'sending' | 'sent';
  width: number;
};

const owner = { name: 'Maria Ilie', initials: 'MI' };

const meta = {
  title: 'Components/Access/Permission Denied Notice',
  parameters: {
    docs: {
      description: {
        component:
          'An inline notice where someone cannot do something because of their access: "You need Editor access", who to ask (the owner) and a Request access button. After the request the button gives way to "Request sent". Inline, not a page: it takes the place of the blocked thing. Code only (no Figma component yet).',
      },
    },
  },
  args: { requiredLevel: 'Editor', action: 'Editing this plan', showOwner: true, status: 'idle', width: 480 },
  argTypes: {
    requiredLevel: { name: 'Required level', control: 'select', options: ['Commenter', 'Editor', 'Owner'], description: 'The access level that is missing.', table: { category: 'Permission Denied Notice' } },
    action: { name: 'Blocked action', control: 'text', description: 'A phrase that starts the second sentence; empty hides it.', table: { category: 'Permission Denied Notice' } },
    status: { name: 'Request status', control: 'inline-radio', options: ['idle', 'sending', 'sent'], description: 'Where the request is.', table: { category: 'Permission Denied Notice' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 640, step: 4 }, description: 'Notice width in px; the button wraps under about 400.', table: { category: 'Permission Denied Notice' } },
    showOwner: { name: 'Show owner', control: 'boolean', description: 'Name the owner to ask; off says "an owner".', table: { category: 'Parts' } },
  },
  render: ({ showOwner, width, action, status, ...args }) => (
    <div style={{ width }}>
      <PermissionDeniedNotice {...args} action={action || undefined} status={status} owner={showOwner ? owner : undefined} className="w-full" />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const onRequest = fn();
    return (
      <div className="w-[480px]">
        <PermissionDeniedNotice requiredLevel="Editor" action="Editing this plan" owner={owner} onRequest={onRequest} className="w-full" />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region', { name: 'You need Editor access' });
    await expect(region).toHaveTextContent('Editing this plan needs Editor access');
    await expect(region).toHaveTextContent('Maria Ilie');
    const button = canvas.getByRole('button', { name: 'Request access' });
    await expect(button).toBeEnabled();
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.queryByRole('button', { name: 'Request access' })).toBeNull());
    await expect(canvas.getByText('Request sent')).toBeVisible();
    await waitFor(() => expect(canvas.getByText('Request sent to Maria Ilie')).toBeInTheDocument());
  },
};

/** The request is on its way: the button keeps its label and is busy. */
export const Sending: Story = { args: { status: 'sending' } };

export const SendingCheck: Story = {
  ...Sending,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Request access' });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByText('Sending request')).toBeInTheDocument();
  },
};

/** After the request: a check and "Request sent" in place of the button. */
export const Sent: Story = { args: { status: 'sent' } };

export const SentCheck: Story = {
  ...Sent,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(canvas.getByText('Request sent')).toBeVisible();
  },
};

export const NoOwnerCheck: Story = {
  ...Default,
  tags: ['!dev'],
  args: { showOwner: false, requiredLevel: 'Owner', action: '' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'You need Owner access' })).toBeVisible();
    await expect(canvas.getByText('Ask an owner to give it to you.')).toBeVisible();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <PermissionDeniedNotice
      requiredLevel="Commenter"
      action="Leaving a comment on the Acme Europe regional accounts payable approval policy"
      owner={{ name: 'Alexandra-Maria Constantinescu-Vasilescu', initials: 'AC' }}
      className="w-full"
    />
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
    const name = canvas.getByText('Alexandra-Maria Constantinescu-Vasilescu');
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    await expect(canvas.getByRole('button', { name: 'Request access' })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const SentDark: Story = { ...SentCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const SentCorporate: Story = { ...SentCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
