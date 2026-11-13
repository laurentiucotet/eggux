import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ActivityFeed, ActivityFeedItem } from './activity-feed-item';

type Args = { actorName: string; verb: string; objectLabel: string; showSuffix: boolean; showAttachment: boolean; unread: boolean; width: number };

const meta = {
  title: 'Components/Community/Activity Feed Item',
  parameters: {
    docs: {
      description: {
        component:
          'One line of who did what: avatar, "Actor verb object" with the object as a link, the time, an optional attachment preview and an unread dot. Activity Feed is the list around the items. Code only (no Figma component yet).',
      },
    },
  },
  args: { actorName: 'Sofia Bran', verb: 'commented on', objectLabel: 'Q3 pricing proposal', showSuffix: true, showAttachment: false, unread: true, width: 480 },
  argTypes: {
    actorName: { name: 'Actor', control: 'text', description: 'Who did it.', table: { category: 'Item' } },
    verb: { name: 'Verb', control: 'text', description: 'What happened, past tense.', table: { category: 'Item' } },
    objectLabel: { name: 'Object', control: 'text', description: 'What it happened to (a link).', table: { category: 'Item' } },
    unread: { name: 'Unread', control: 'boolean', description: 'The dot on the right.', table: { category: 'Item' } },
    showSuffix: { name: 'Show suffix', control: 'boolean', description: '"in Billing" after the object.', table: { category: 'Parts' } },
    showAttachment: { name: 'Show attachment', control: 'boolean', description: 'A file preview under the line.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 640, step: 4 }, description: 'Column width in px.', table: { category: 'Item' } },
  },
  render: ({ actorName, verb, objectLabel, showSuffix, showAttachment, unread, width }) => (
    <div style={{ width }}>
      <ActivityFeed>
        <ActivityFeedItem
          actor={{ name: actorName }}
          verb={verb}
          object={{ label: objectLabel, href: '#proposal' }}
          suffix={showSuffix ? 'in Billing' : undefined}
          time="2 hours ago"
          dateTime="2026-03-04T10:00"
          unread={unread}
          attachment={showAttachment ? { title: 'pricing-proposal-v3.pdf', meta: 'PDF · 2.4 MB', href: '#file' } : undefined}
        />
      </ActivityFeed>
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  args: { showAttachment: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('list', { name: 'Recent activity' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Q3 pricing proposal' })).toHaveAttribute('href', '#proposal');
    await expect(canvas.getByText('Unread')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /pricing-proposal-v3.pdf/ })).toBeVisible();
    await expect(canvas.getByText('2 hours ago').tagName).toBe('TIME');
    await expect(Math.round(canvas.getByRole('listitem').getBoundingClientRect().width)).toBe(480);
  },
};

/** A feed with the four kinds of line: comment, upload, join and a read item. */
export const Feed: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[480px]">
      <ActivityFeed aria-label="Team activity">
        <ActivityFeedItem actor={{ name: 'Sofia Bran' }} verb="commented on" object={{ label: 'Q3 pricing proposal', href: '#a' }} suffix="in Billing" time="2 hours ago" unread />
        <ActivityFeedItem actor={{ name: 'Marc Dupont' }} verb="uploaded" object={{ label: 'Invoice template', href: '#b' }} time="Yesterday" unread attachment={{ title: 'invoice-template.docx', meta: 'DOCX · 84 KB', href: '#f' }} />
        <ActivityFeedItem actor={{ name: 'Ana Popescu' }} verb="joined the Acme workspace" time="Monday" />
        <ActivityFeedItem actor={{ name: 'Tom Lee' }} verb="closed" object={{ label: 'Refund policy review', href: '#c' }} time="2 March" />
      </ActivityFeed>
    </div>
  ),
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ActivityFeed>
      <ActivityFeedItem
        actor={{ name: 'Maximilian Alexander von Hohenzollern-Sigmaringen' }}
        verb="commented on"
        object={{ label: 'A very long document title that keeps going well past one line of text', href: '#x' }}
        suffix="in Finance operations and reporting"
        time="2 hours ago"
        unread
        attachment={{ title: 'quarterly-reconciliation-report-final-final-v12-reviewed.pdf', meta: 'PDF · 12.4 MB', href: '#f' }}
      />
      <ActivityFeedItem actor={{ name: 'Li' }} verb="joined" time="Now" />
    </ActivityFeed>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list');
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
