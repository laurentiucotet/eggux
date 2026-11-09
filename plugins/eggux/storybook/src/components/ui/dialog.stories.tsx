import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { UserPlus } from '@/components/icons';
import { Button } from './button';
import { Field } from './field';
import { Input } from './input';
import { Textarea } from './textarea';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogHeaderIcon,
  DialogTrigger,
  type DialogSize,
} from './dialog';

const meta = {
  title: 'Components/Dialog/Dialog',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A short, focused task over a Scrim: Dialog Header, a Content body and Dialog Footer, 24 px padding, 16 px gaps. Size sm 384, default 512, lg 672, xl 896, fullscreen for mobile. Focus moves to the first field and stays inside; Escape, the X and a click on the scrim close it; focus returns to the trigger. Long content scrolls between a fixed header and footer. Never open a dialog from a dialog. Figma: Dialog page, "Dialog / Component". Guide: build-ui/components/dialog.md.',
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const onSend = fn();

const InviteDialog = ({ size, trigger = 'Invite member' }: { size?: DialogSize; trigger?: string }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">{trigger}</Button>
    </DialogTrigger>
    <DialogContent size={size}>
      <DialogHeader title="Invite member" description="They will get an email with a link to join the workspace." />
      <DialogBody>
        <Field label="Email">
          <Input type="email" placeholder="name@acme.com" />
        </Field>
        <Field label="Message" optional>
          <Textarea placeholder="Add a note to the invitation" />
        </Field>
      </DialogBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={onSend}>Send invite</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const px = (v: string) => parseFloat(v);

type Playground = {
  open: boolean;
  size: DialogSize;
  title: string;
  showDescription: boolean;
  description: string;
  showMedia: boolean;
  showClose: boolean;
  body: 'fields' | 'long text' | 'none';
  showCancel: boolean;
  action: string;
};

/** Playground: every Dialog option in Controls. Open the dialog with the button, or switch Open on. */
export const Default: StoryObj<Playground> = {
  argTypes: {
    open: { name: 'Open', control: 'boolean', description: 'Open on load', table: { category: 'Dialog' } },
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'default', 'lg', 'xl', 'fullscreen'], description: 'sm 384, default 512, lg 672, xl 896', table: { category: 'Dialog' } },
    body: { name: 'Content', control: 'inline-radio', options: ['fields', 'long text', 'none'], description: 'DialogBody: fields, long text that scrolls, or no body', table: { category: 'Dialog' } },
    title: { name: 'Title', control: 'text', table: { category: 'Dialog Header' } },
    showDescription: { name: 'Show description', control: 'boolean', table: { category: 'Dialog Header' } },
    description: { name: 'Description', control: 'text', if: { arg: 'showDescription' }, table: { category: 'Dialog Header' } },
    showMedia: { name: 'Show media', control: 'boolean', description: 'Dialog Header `media`: a Dialog Header Icon', table: { category: 'Dialog Header' } },
    showClose: { name: 'Show close', control: 'boolean', description: 'Dialog Header `showClose`: the X', table: { category: 'Dialog Header' } },
    showCancel: { name: 'Show cancel', control: 'boolean', table: { category: 'Dialog Footer' } },
    action: { name: 'Action label', control: 'text', table: { category: 'Dialog Footer' } },
  },
  args: {
    open: false,
    size: 'default',
    title: 'Invite member',
    showDescription: true,
    description: 'They will get an email with a link to join the workspace.',
    showMedia: false,
    showClose: true,
    body: 'fields',
    showCancel: true,
    action: 'Send invite',
  },
  render: a => (
    // key: remount when Open changes, so defaultOpen applies again.
    <Dialog key={String(a.open)} defaultOpen={a.open}>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent size={a.size}>
        <DialogHeader
          title={a.title}
          description={a.showDescription ? a.description : undefined}
          media={a.showMedia ? <DialogHeaderIcon><UserPlus /></DialogHeaderIcon> : undefined}
          showClose={a.showClose}
        />
        {a.body === 'fields' ? (
          <DialogBody>
            <Field label="Email">
              <Input type="email" placeholder="name@acme.com" />
            </Field>
            <Field label="Message" optional>
              <Textarea placeholder="Add a note to the invitation" />
            </Field>
          </DialogBody>
        ) : null}
        {a.body === 'long text' ? (
          <DialogBody>
            {terms.map(t => (
              <section key={t.heading} className="flex flex-col gap-1">
                <h3 className="font-semibold">{t.heading}</h3>
                <p className="text-muted-foreground">{t.text}</p>
              </section>
            ))}
          </DialogBody>
        ) : null}
        <DialogFooter>
          {a.showCancel ? (
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          ) : null}
          <Button onClick={onSend}>{a.action}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// The checks that used to run on Default (hidden; the playground has no play function).
export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <InviteDialog />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Invite member' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Invite member' });
    // Title and description are the accessible name and description.
    const title = document.getElementById(dialog.getAttribute('aria-labelledby')!)!;
    await expect(title).toHaveTextContent('Invite member');
    const description = document.getElementById(dialog.getAttribute('aria-describedby')!)!;
    await expect(description).toHaveTextContent('They will get an email with a link to join the workspace.');
    // Modal: the page behind is hidden from assistive technology while it is open.
    await expect(trigger.closest('[aria-hidden="true"]')).not.toBeNull();
    // Focus moves to the first field, not to the close X.
    const email = screen.getByRole('textbox', { name: 'Email' });
    await waitFor(() => expect(email).toHaveFocus());
    // Figma surface: 24 px padding, 16 px between the slots, radius lg, border, shadow lg.
    const style = getComputedStyle(dialog);
    await expect(style.paddingTop).toBe('24px');
    await expect(style.paddingLeft).toBe('24px');
    await expect(style.rowGap).toBe('16px');
    await expect(style.borderTopWidth).toBe('1px');
    await expect(style.borderTopLeftRadius).toBe(getComputedStyle(document.documentElement).getPropertyValue('--radius-lg').trim());
    await expect(style.boxShadow).not.toBe('none');
    // The scrim covers the viewport behind it.
    const overlay = document.querySelector<HTMLElement>('[data-slot="dialog-overlay"]')!;
    await expect(overlay.getBoundingClientRect().width).toBe(window.innerWidth);
    await expect(overlay.getBoundingClientRect().height).toBe(window.innerHeight);
    // Focus trap: Tab from the last control wraps to the first, Shift+Tab goes back.
    const send = screen.getByRole('button', { name: 'Send invite' });
    send.focus();
    await userEvent.tab();
    await expect(dialog.contains(document.activeElement)).toBe(true);
    await expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(send).toHaveFocus();
    // The primary action works.
    await userEvent.click(send);
    await expect(onSend).toHaveBeenCalled();
    // Escape closes and returns focus to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

/** Every way to close: the X, Cancel and a click on the scrim; focus returns each time. */
export const Closing: Story = {
  parameters: { controls: { disable: true } },
  render: () => <InviteDialog />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Invite member' });
    for (const how of ['close', 'cancel', 'scrim'] as const) {
      await userEvent.click(trigger);
      await screen.findByRole('dialog', { name: 'Invite member' });
      if (how === 'close') await userEvent.click(screen.getByRole('button', { name: 'Close' }));
      if (how === 'cancel') await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      if (how === 'scrim') await userEvent.click(document.querySelector<HTMLElement>('[data-slot="dialog-overlay"]')!);
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(trigger).toHaveFocus();
    }
    // Keyboard: Enter opens, Escape closes.
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('dialog', { name: 'Invite member' });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

const sizes: { size: DialogSize; width: number }[] = [
  { size: 'sm', width: 384 },
  { size: 'default', width: 512 },
  { size: 'lg', width: 672 },
  { size: 'xl', width: 896 },
];

/** Figma Size: sm 384, default 512, lg 672, xl 896; on a narrower screen 16 px from each edge. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {sizes.map(({ size }) => (
        <InviteDialog key={size} size={size} trigger={`Open ${size}`} />
      ))}
      <InviteDialog size="fullscreen" trigger="Open fullscreen" />
    </div>
  ),
  play: async ({ canvas }) => {
    for (const { size, width } of sizes) {
      await userEvent.click(canvas.getByRole('button', { name: `Open ${size}` }));
      const dialog = await screen.findByRole('dialog', { name: 'Invite member' });
      await expect(dialog).toHaveAttribute('data-size', size);
      await expect(getComputedStyle(dialog).maxWidth).toBe(`${width}px`);
      await expect(Math.round(dialog.getBoundingClientRect().width)).toBe(Math.min(width, window.innerWidth - 32));
      // Centered in the viewport.
      const r = dialog.getBoundingClientRect();
      await expect(Math.abs(r.left + r.width / 2 - window.innerWidth / 2)).toBeLessThanOrEqual(1);
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    }
    // Fullscreen: fills the viewport, 16 px padding, no radius, border or shadow, footer at the bottom.
    await userEvent.click(canvas.getByRole('button', { name: 'Open fullscreen' }));
    const dialog = await screen.findByRole('dialog', { name: 'Invite member' });
    const r = dialog.getBoundingClientRect();
    await expect([r.left, r.top, r.width, r.height]).toEqual([0, 0, window.innerWidth, window.innerHeight]);
    const style = getComputedStyle(dialog);
    await expect(style.paddingTop).toBe('16px');
    await expect(style.borderTopLeftRadius).toBe('0px');
    await expect(style.borderTopWidth).toBe('0px');
    await expect(style.boxShadow.replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px,?\s*/g, '')).toBe('');
    const footer = dialog.querySelector<HTMLElement>('[data-slot="dialog-footer"]')!;
    await expect(Math.round(footer.getBoundingClientRect().bottom)).toBe(window.innerHeight - 16);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

const terms = Array.from({ length: 14 }, (_, i) => ({
  heading: `${i + 1}. ${['Scope', 'Fees', 'Invoices', 'Payment terms', 'Taxes', 'Data', 'Security', 'Support', 'Uptime', 'Liability', 'Termination', 'Notices', 'Changes', 'Law'][i]}`,
  text: 'Acme bills the workspace monthly in EUR. Invoices are due 30 days after the invoice date, and late payments may pause the workspace after a written notice of 14 days.',
}));

/** Long content scrolls inside the body; header and footer stay in view. */
export const LongContent: Story = { tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Read terms</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader title="Terms of service" description="Read the terms before you upgrade the workspace." />
        <DialogBody>
          {terms.map(t => (
            <section key={t.heading} className="flex flex-col gap-1">
              <h3 className="font-semibold">{t.heading}</h3>
              <p className="text-muted-foreground">{t.text}</p>
            </section>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Accept terms</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Read terms' }));
    const dialog = await screen.findByRole('dialog', { name: 'Terms of service' });
    const body = dialog.querySelector<HTMLElement>('[data-slot="dialog-body"]')!;
    // The dialog stays 16 px inside the viewport; the body scrolls.
    await expect(Math.round(dialog.getBoundingClientRect().height)).toBeLessThanOrEqual(window.innerHeight - 32);
    await waitFor(() => expect(body).toHaveAttribute('data-scrollable', 'true'));
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    await expect(getComputedStyle(body).overflowY).toBe('auto');
    // Header and footer stay inside the dialog.
    const header = dialog.querySelector<HTMLElement>('[data-slot="dialog-header"]')!;
    const footer = dialog.querySelector<HTMLElement>('[data-slot="dialog-footer"]')!;
    await expect(px(getComputedStyle(header).height)).toBeGreaterThan(0);
    await expect(footer.getBoundingClientRect().bottom).toBeLessThanOrEqual(dialog.getBoundingClientRect().bottom);
    // No field in the body: focus starts on the first control (the X). The scrolling body is
    // reachable with Tab so the keyboard can scroll it.
    await expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.tab();
    await expect(body).toHaveFocus();
    const headerTop = header.getBoundingClientRect().top;
    const footerTop = footer.getBoundingClientRect().top;
    body.scrollTop = body.scrollHeight;
    await waitFor(() => expect(body.scrollTop).toBeGreaterThan(0));
    // Scrolling moves only the body.
    await expect(header.getBoundingClientRect().top).toBe(headerTop);
    await expect(footer.getBoundingClientRect().top).toBe(footerTop);
    await expect(footer.getBoundingClientRect().bottom).toBeLessThanOrEqual(dialog.getBoundingClientRect().bottom);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };

/** Figma stress test: Size=sm with a long title and description wraps; nothing overflows. */
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader
          title="Invite a member to the Acme finance workspace for the 2026 audit"
          description="They will get an email with a link to join the workspace. The link expires after seven days and works once."
        />
        <DialogBody>
          <Field label="Email address of the person you invite">
            <Input type="email" defaultValue="maria.lopez-fernandez@finance.acme-holdings.com" />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Send invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog');
    const title = dialog.querySelector<HTMLElement>('[data-slot="dialog-title"]')!;
    await expect(title.getBoundingClientRect().height).toBeGreaterThan(28);
    await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);
    const close = screen.getByRole('button', { name: 'Close' });
    await expect(close.getBoundingClientRect().width).toBe(24);
    await expect(close.getBoundingClientRect().right).toBeLessThanOrEqual(dialog.getBoundingClientRect().right - 24);
  },
};
