import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Info } from '@/components/icons';
import { Dialog } from './dialog';
import { DialogHeader, DialogHeaderIcon } from './dialog-header';

const meta = {
  title: 'Components/Dialog/Dialog Header',
  component: DialogHeader,
  args: {
    title: 'Invite member',
    description: 'They will get an email with a link to join the workspace.',
    showClose: true,
  },
  // The header lives inside an overlay; here it sits in an open Dialog root without a surface,
  // 464 px wide like the Figma component.
  decorators: [
    (Story, ctx) => (
      <Dialog open onOpenChange={ctx.parameters.onOpenChange as ((open: boolean) => void) | undefined}>
        <div className="w-[464px] max-w-full">
          <Story />
        </div>
      </Dialog>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Top of Dialog, Alert Dialog, Sheet and Drawer: title (body/large) over the description (body/small, muted), optional Media (an icon in a 40 px circle, an Avatar) and a 24 px Close X. The title and description are the overlay\'s accessible name and description. Turn Close off in Alert Dialog. Figma: Dialog page, "Dialog / Component". Guides: build-ui/components/dialog.md, drawer.md.',
      },
    },
  },
} satisfies Meta<typeof DialogHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

const onOpenChange = fn();

export const Default: Story = {
  parameters: { onOpenChange },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvasElement.querySelector<HTMLElement>('[data-slot="dialog-header"]')!;
    const title = canvas.getByRole('heading', { name: 'Invite member' });
    const description = canvas.getByText('They will get an email with a link to join the workspace.');
    const close = canvas.getByRole('button', { name: 'Close' });
    // Figma: 464 x 56, title body/large 18/28 semibold, description body/small 14/20, 8 px apart.
    await expect(header.getBoundingClientRect().width).toBe(464);
    await expect(Math.round(header.getBoundingClientRect().height)).toBe(56);
    await expect(getComputedStyle(title).fontSize).toBe('18px');
    await expect(getComputedStyle(title).lineHeight).toBe('28px');
    await expect(getComputedStyle(title).fontWeight).toBe('600');
    await expect(getComputedStyle(description).fontSize).toBe('14px');
    await expect(getComputedStyle(description).lineHeight).toBe('20px');
    await expect(Math.round(description.getBoundingClientRect().top - title.getBoundingClientRect().bottom)).toBe(8);
    // Close X: 24 px, 16 px icon, 16 px from the text, top right.
    await expect(close.getBoundingClientRect().width).toBe(24);
    await expect(close.getBoundingClientRect().height).toBe(24);
    await expect(close.querySelector('svg')!.getBoundingClientRect().width).toBe(16);
    await expect(Math.round(close.getBoundingClientRect().left - title.getBoundingClientRect().right)).toBe(16);
    await expect(close.getBoundingClientRect().right).toBe(header.getBoundingClientRect().right);
    await expect(close.getBoundingClientRect().top).toBe(header.getBoundingClientRect().top);
    // The close X closes the overlay, by click and by keyboard.
    onOpenChange.mockClear();
    await userEvent.click(close);
    await expect(onOpenChange).toHaveBeenCalledWith(false);
    onOpenChange.mockClear();
    close.focus();
    await userEvent.keyboard('{Enter}');
    await expect(onOpenChange).toHaveBeenCalledWith(false);
  },
};

/** Figma Show media on (an icon in the Media slot), Show close off: the Alert Dialog header. */
export const WithMedia: Story = {
  args: {
    title: 'Send reminders to 24 customers?',
    description: 'Each customer gets an email about their unpaid invoice.',
    media: (
      <DialogHeaderIcon>
        <Info />
      </DialogHeaderIcon>
    ),
    showClose: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button', { name: 'Close' })).toBeNull();
    const icon = canvasElement.querySelector<HTMLElement>('[data-slot="dialog-header-icon"]')!;
    const title = canvas.getByRole('heading', { name: 'Send reminders to 24 customers?' });
    // Media: 40 px circle on background/muted, 20 px icon, 16 px before the text.
    await expect(icon.getBoundingClientRect().width).toBe(40);
    await expect(icon.getBoundingClientRect().height).toBe(40);
    await expect(getComputedStyle(icon).borderTopLeftRadius).not.toBe('0px');
    await expect(icon.querySelector('svg')!.getBoundingClientRect().width).toBe(20);
    await expect(Math.round(title.getBoundingClientRect().left - icon.getBoundingClientRect().right)).toBe(16);
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  },
};

/** Figma Show description off. */
export const TitleOnly: Story = {
  args: { description: undefined },
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('[data-slot="dialog-header"]')!;
    await expect(Math.round(header.getBoundingClientRect().height)).toBe(28);
    await expect(header.querySelector('p')).toBeNull();
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };

/** Figma stress test: long title and description in the 276 and 368 columns wrap; the X stays 24 px. */
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [
    () => (
      <Dialog open>
        <div className="flex flex-col gap-6">
          {[276, 368].map(width => (
            <div key={width} data-testid={`col-${width}`} style={{ width }}>
              <DialogHeader
                title="Invite a member to the Acme finance workspace for the 2026 audit"
                description="They will get an email with a link to join the workspace. The link expires after seven days and works once."
                media={
                  <DialogHeaderIcon>
                    <Info />
                  </DialogHeaderIcon>
                }
              />
            </div>
          ))}
        </div>
      </Dialog>
    ),
  ],
  play: async ({ canvasElement }) => {
    for (const width of [276, 368]) {
      const col = within(canvasElement).getByTestId(`col-${width}`);
      const header = col.querySelector<HTMLElement>('[data-slot="dialog-header"]')!;
      const title = col.querySelector<HTMLElement>('h2')!;
      const close = col.querySelector<HTMLElement>('[data-slot="dialog-close"]')!;
      // Wraps instead of overflowing.
      await expect(title.getBoundingClientRect().height).toBeGreaterThan(28);
      await expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
      await expect(header.getBoundingClientRect().width).toBe(width);
      await expect(close.getBoundingClientRect().width).toBe(24);
      await expect(col.querySelector<HTMLElement>('[data-slot="dialog-header-icon"]')!.getBoundingClientRect().width).toBe(40);
    }
  },
};
