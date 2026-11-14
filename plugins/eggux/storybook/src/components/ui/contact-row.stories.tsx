import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { ContactRow, type ContactAction } from './contact-row';

type Args = { name: string; number: string; actions: number; showStatus: boolean; width: number };

const order: ContactAction[] = ['call', 'message', 'video'];

const meta = {
  title: 'Components/Mobile/Contact Row',
  parameters: {
    docs: {
      description: {
        component:
          'One person in a contact list: avatar, name, phone number and Call, Message and Video buttons, each 44 x 44 and named after the person. No swipe is needed. Name and number stay on one line and truncate; the buttons never shrink. Put rows in a list. Code only (no Figma component yet).',
      },
    },
  },
  args: { name: 'Maya Lopez', number: '+40 721 555 014', actions: 3, showStatus: false, width: 360 },
  argTypes: {
    name: { name: 'Name', control: 'text', description: 'The person.', table: { category: 'Row' } },
    number: { name: 'Number', control: 'text', description: 'The phone number as shown.', table: { category: 'Row' } },
    actions: { name: 'Buttons', control: { type: 'range', min: 1, max: 3, step: 1 }, description: 'Call, then Message, then Video.', table: { category: 'Row' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 420, step: 4 }, description: 'Width of the row in px.', table: { category: 'Row' } },
    showStatus: { name: 'Show status', control: 'boolean', description: 'An online dot on the avatar.', table: { category: 'Parts' } },
  },
  render: ({ name, number, actions, showStatus, width }) => (
    <div style={{ width }} className="max-w-full rounded-lg border border-border">
      <ContactRow name={name} number={number} status={showStatus ? 'online' : undefined} actions={order.slice(0, actions)} onCall={fn()} onMessage={fn()} onVideo={fn()} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Rows in a list, as in an address book. */
export const List: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ul className="m-0 w-[360px] max-w-full list-none divide-y divide-border rounded-lg border border-border p-0">
      {[
        ['Maya Lopez', '+40 721 555 014', 'online'],
        ['Jonas Weber', '+49 151 5550 1234', 'away'],
        ['Priya Nair', '+44 7700 900123', undefined],
        ['Acme Support', '+1 555 010 0199', undefined],
      ].map(([n, num, s]) => (
        <li key={n}><ContactRow name={n as string} number={num as string} status={s as 'online' | 'away' | undefined} onCall={fn()} onMessage={fn()} onVideo={fn()} /></li>
      ))}
    </ul>
  ),
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onCall = fn();
    const onMessage = fn();
    const onVideo = fn();
    return (
      <div className="w-[360px]">
        <ContactRow name="Maya Lopez" number="+40 721 555 014" onCall={onCall} onMessage={onMessage} onVideo={onVideo} />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const names = ['Call Maya Lopez', 'Message Maya Lopez', 'Video call Maya Lopez'];
    for (const name of names) {
      const r = canvas.getByRole('button', { name }).getBoundingClientRect();
      await expect(Math.round(r.width)).toBeGreaterThanOrEqual(44);
      await expect(Math.round(r.height)).toBeGreaterThanOrEqual(44);
    }
    await expect(canvas.getByText('+40 721 555 014')).toBeVisible();
    // Tab reaches the buttons in order, Enter presses.
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: names[0] })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: names[1] })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(canvas.getByRole('button', { name: names[2] }));
  },
};

export const HandlerCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onCall = fn();
    return <ContactRow name="Maya Lopez" number="+40 721 555 014" actions={['call', 'video']} onCall={onCall} />;
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Message Maya Lopez' })).toBeNull();
    // An action with no handler is disabled; one with a handler works.
    await expect(canvas.getByRole('button', { name: 'Video call Maya Lopez' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Call Maya Lopez' })).toBeEnabled();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ContactRow
      name="Alexandrina-Maria Constantinescu-Vandenberghe of Acme International"
      number="+40 721 555 014 ext. 1234567890 (office, weekdays only)"
      status="busy"
      onCall={fn()}
      onMessage={fn()}
      onVideo={fn()}
    />
  ),
  play: async ({ canvas }) => {
    const row = canvas.getByRole('button', { name: /^Call / }).closest('[data-slot="contact-row"]') as HTMLElement;
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 1);
    // Name and number stay on one line; the buttons keep their size.
    await expect(Math.round(canvas.getByText(/^Alexandrina/).getBoundingClientRect().height)).toBeLessThanOrEqual(24);
    for (const b of canvas.getAllByRole('button')) await expect(Math.round(b.getBoundingClientRect().width)).toBe(44);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
