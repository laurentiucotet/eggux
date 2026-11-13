import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { FollowButton } from './follow-button';

type Args = { name: string; startFollowing: boolean; followers: number; showCount: boolean; size: 'sm' | 'default'; loading: boolean; disabled: boolean };

const meta = {
  title: 'Components/Community/Follow Button',
  parameters: {
    docs: {
      description: {
        component:
          'Follow toggle with the follower count beside it. "Follow" (primary, plus) becomes "Following" (outline, check) and the count goes up by one. The name is read after the label ("Following Acme Design"). Loading sets aria-busy and ignores clicks. Code only (no Figma component yet).',
      },
    },
  },
  args: { name: 'Acme Design', startFollowing: false, followers: 1203, showCount: true, size: 'default', loading: false, disabled: false },
  argTypes: {
    name: { name: 'Name', control: 'text', description: 'Who or what is followed.', table: { category: 'Button' } },
    startFollowing: { name: 'Following', control: 'boolean', description: 'Start in the following state.', table: { category: 'Button' } },
    followers: { name: 'Followers', control: { type: 'range', min: 0, max: 50000, step: 1 }, description: 'Followers without you.', table: { category: 'Button' } },
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'default'], description: '32 or 36 high.', table: { category: 'Button' } },
    loading: { name: 'Loading', control: 'boolean', description: 'A request is running.', table: { category: 'Button' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Blocks the button.', table: { category: 'Button' } },
    showCount: { name: 'Show count', control: 'boolean', description: 'The follower count.', table: { category: 'Parts' } },
  },
  render: ({ startFollowing, ...args }) => <FollowButton key={String(startFollowing)} defaultFollowing={startFollowing} {...args} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <FollowButton name="Acme Design" followers={1203} onFollowingChange={fn()} />,
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Follow Acme Design' });
    await expect(Math.round(button.getBoundingClientRect().height)).toBe(36);
    await expect(canvas.getByRole('status')).toHaveTextContent('1,203 followers');
    await userEvent.click(button);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Following Acme Design' })).toBeVisible());
    await expect(canvas.getByRole('status')).toHaveTextContent('1,204 followers');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Follow Acme Design' })).toBeVisible());
    await expect(canvas.getByRole('status')).toHaveTextContent('1,203 followers');
  },
};

export const StatesCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const onChange = fn();
    return (
      <div className="flex flex-col gap-3">
        <FollowButton name="Busy" loading onFollowingChange={onChange} />
        <FollowButton name="Off" disabled followers={9999} />
        <FollowButton name="Big" followers={12399} defaultFollowing size="sm" />
        <FollowButton name="Nobody" showCount={false} />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const busy = canvas.getByRole('button', { name: 'Follow Busy' });
    await expect(busy).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(busy);
    await expect(canvas.getByRole('button', { name: 'Follow Busy' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Follow Off' })).toBeDisabled();
    // 12,399 + you = 12,400, compact.
    await expect(canvas.getByText('12.4K')).toBeVisible();
    await expect(Math.round(canvas.getByRole('button', { name: 'Following Big' }).getBoundingClientRect().height)).toBe(32);
    await expect(canvas.getAllByRole('status')).toHaveLength(3);
  },
};

/** The two states side by side, with a count that formats. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3">
      <FollowButton name="Acme Design" followers={1203} />
      <FollowButton name="Acme Design" followers={1203} defaultFollowing />
      <FollowButton name="Acme Engineering" followers={48210} />
    </div>
  ),
};

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [on, setOn] = React.useState(false);
    return <FollowButton name="Acme Design" followers={5} following={on} onFollowingChange={setOn} />;
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <FollowButton name="A topic with a very long name that never ends" followers={123456789} defaultFollowing />,
  play: async ({ canvas }) => {
    const root = canvas.getByRole('button').parentElement as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
