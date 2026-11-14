import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Bell, MapPin } from '@/components/icons';
import { Button } from './button';
import { PermissionRationaleSheet } from './permission-rationale-sheet';

type Args = { open: boolean; kind: 'camera' | 'location' | 'notifications'; reasons: number };

const copy = {
  camera: { icon: undefined, title: 'Allow camera access?', description: 'Acme uses the camera to scan receipts and attach them to an expense.', reasons: ['Photos stay on your phone until you send them', 'Only used while the scanner is open', 'You can turn it off in Settings'] },
  location: { icon: <MapPin />, title: 'Allow location access?', description: 'Acme uses your location to show the nearest office and delivery points.', reasons: ['Only while the app is open', 'Never shared with other companies', 'You can turn it off in Settings'] },
  notifications: { icon: <Bell />, title: 'Allow notifications?', description: 'Acme sends a message when an invoice is paid or a payment is late.', reasons: ['At most a few a week', 'Quiet hours are respected', 'You can turn it off in Settings'] },
};

const meta = {
  title: 'Components/Mobile/Permission Rationale Sheet',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A bottom sheet that explains why the app needs a permission before the system asks: icon, a title naming the permission, one sentence, up to three reasons, Allow and Not now. Allow calls onAllow (ask the system now); Not now only closes, so the one-time system prompt is not used up. Built on the Drawer. After a refusal use the Permission Denied Notice. Code only (no Figma component yet).',
      },
    },
  },
  args: { open: false, kind: 'camera', reasons: 3 },
  argTypes: {
    open: { name: 'Open', control: 'boolean', description: 'Start with the sheet open.', table: { category: 'Sheet' } },
    kind: { name: 'Permission', control: 'inline-radio', options: ['camera', 'location', 'notifications'], description: 'Which permission the sheet explains.', table: { category: 'Sheet' } },
    reasons: { name: 'Reasons', control: { type: 'range', min: 0, max: 3, step: 1 }, description: 'Short reasons under the sentence.', table: { category: 'Parts' } },
  },
  render: ({ open, kind, reasons }) => (
    <PermissionRationaleSheet
      key={`${open}-${kind}`}
      defaultOpen={open}
      icon={copy[kind].icon}
      title={copy[kind].title}
      description={copy[kind].description}
      reasons={copy[kind].reasons.slice(0, reasons)}
      trigger={<Button variant="outline">Scan a receipt</Button>}
    />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Open from the start, as people see it on a phone. */
export const Open: Story = { args: { open: true } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onAllow = fn();
    const onDeny = fn();
    return (
      <>
        <PermissionRationaleSheet
          title="Allow camera access?"
          description="Acme uses the camera to scan receipts."
          reasons={copy.camera.reasons}
          onAllow={() => { onAllow(); document.body.dataset.perm = 'allowed'; }}
          onDeny={() => { onDeny(); document.body.dataset.perm = 'denied'; }}
          trigger={<Button variant="outline">Scan a receipt</Button>}
        />
      </>
    );
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Scan a receipt' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Allow camera access?' });
    await expect(screen.getByText('Photos stay on your phone until you send them')).toBeVisible();
    for (const name of ['Allow', 'Not now']) await expect(Math.round(screen.getByRole('button', { name }).getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    await expect(dialog).toBeVisible();
    // Not now closes without allowing, and focus returns to the trigger.
    await userEvent.click(screen.getByRole('button', { name: 'Not now' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(document.body.dataset.perm).toBe('denied');
    await waitFor(() => expect(trigger).toHaveFocus());
    // Allow runs onAllow and closes.
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('button', { name: 'Allow' }));
    await waitFor(() => expect(document.body.dataset.perm).toBe('allowed'));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    delete document.body.dataset.perm;
  },
};

export const EscapeCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onDeny = fn();
    return <PermissionRationaleSheet defaultOpen title="Allow camera access?" description="Acme uses the camera to scan receipts." onDeny={onDeny} />;
  },
  play: async () => {
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <PermissionRationaleSheet
      defaultOpen
      title="Allow Acme to use the camera of this device to scan every receipt and delivery note?"
      description="A long sentence that explains in detail what the camera is used for, so that the text has to wrap over several lines in the narrow sheet."
      reasons={['Averyveryveryverylongreasonwithoutanybreaksatalltotestthatnothingoverflows', 'A second reason that is also fairly long and needs to wrap onto more than one line', 'Short reason']}
    />
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(window.innerWidth);
    await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth + 1);
    await expect(screen.getByRole('button', { name: 'Not now' })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
