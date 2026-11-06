import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './button';
import { Field } from './field';
import { Input } from './input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  type AlertDialogType,
} from './alert-dialog';

const meta = {
  title: 'Components/Dialog/Alert Dialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A decision the user must answer before going on. Type confirm (Cancel + action), destructive (Cancel + destructive action, irreversible) or acknowledge (one button). Dialog Header with the status icon and no close X, title as a question, action named with its verb. Closes only through its buttons or Escape (as Cancel), never on a scrim click; focus starts on Cancel. Figma: Dialog page, "Alert Dialog / Component". Guides: build-ui/components/dialog.md, patterns/delete-confirmation.md.',
      },
    },
  },
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

const onAction = fn();

const presets: Record<AlertDialogType, { trigger: string; title: string; description: string; action: string }> = {
  confirm: {
    trigger: 'Send reminders',
    title: 'Send reminders to 24 customers?',
    description: 'Each customer gets an email about their unpaid invoice.',
    action: 'Send reminders',
  },
  destructive: {
    trigger: 'Delete project',
    title: 'Delete project?',
    description: 'The project "Website redesign" and its 24 tasks will be deleted for everyone. This cannot be undone.',
    action: 'Delete project',
  },
  acknowledge: {
    trigger: 'Show import result',
    title: 'Import complete',
    description: '248 contacts were added. 3 rows were skipped because the email address is missing.',
    action: 'Got it',
  },
};

const Example = ({ type }: { type: AlertDialogType }) => {
  const p = presets[type];
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={type === 'destructive' ? 'destructive' : 'outline'}>{p.trigger}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent type={type}>
        <AlertDialogHeader title={p.title} description={p.description} />
        <AlertDialogFooter>
          {type === 'acknowledge' ? null : <AlertDialogCancel />}
          <AlertDialogAction onClick={onAction}>{p.action}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const Default: Story = {
  render: () => <Example type="confirm" />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Send reminders' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('alertdialog', { name: 'Send reminders to 24 customers?' });
    // Title and description are announced: aria-labelledby and aria-describedby.
    await expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)).toHaveTextContent('Send reminders to 24 customers?');
    await expect(document.getElementById(dialog.getAttribute('aria-describedby')!)).toHaveTextContent('Each customer gets an email about their unpaid invoice.');
    // No close X. Focus starts on Cancel.
    await expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    await waitFor(() => expect(cancel).toHaveFocus());
    // Figma: 512 wide (16 px from the edges on a narrow screen), 24 px padding, 16 px gaps.
    await expect(getComputedStyle(dialog).maxWidth).toBe('512px');
    await expect(Math.round(dialog.getBoundingClientRect().width)).toBe(Math.min(512, window.innerWidth - 32));
    await expect(getComputedStyle(dialog).paddingTop).toBe('24px');
    await expect(getComputedStyle(dialog).rowGap).toBe('16px');
    await expect(getComputedStyle(dialog).borderTopWidth).toBe('1px');
    // Info icon in the Media slot, Cancel outline left of the primary action.
    const icon = dialog.querySelector<HTMLElement>('[data-slot="dialog-header-icon"]')!;
    await expect(icon.getBoundingClientRect().width).toBe(40);
    await expect(icon.querySelector('svg')).toHaveAttribute('data-icon', 'info');
    const action = screen.getByRole('button', { name: 'Send reminders' });
    await expect(action.className).toContain('bg-primary');
    await expect(cancel.getBoundingClientRect().right).toBeLessThan(action.getBoundingClientRect().left);
    // Focus trap between the two buttons.
    await userEvent.tab();
    await expect(action).toHaveFocus();
    await userEvent.tab();
    await expect(cancel).toHaveFocus();
    // A click on the scrim does not close it.
    await userEvent.click(document.querySelector<HTMLElement>('[data-slot="alert-dialog-overlay"]')!);
    await expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    // Escape closes as Cancel; focus returns to the trigger; the action did not run.
    onAction.mockClear();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await expect(trigger).toHaveFocus();
    await expect(onAction).not.toHaveBeenCalled();
    // The action runs and closes it.
    await userEvent.click(trigger);
    await userEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Send reminders' }));
    await expect(onAction).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

/** Figma Type: confirm, destructive, acknowledge. */
export const Types: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Example type="confirm" />
      <Example type="destructive" />
      <Example type="acknowledge" />
    </div>
  ),
  play: async ({ canvas }) => {
    const cases: { type: AlertDialogType; icon: string; iconClass?: string; actionClass: string; focus: string }[] = [
      { type: 'confirm', icon: 'info', actionClass: 'bg-primary', focus: 'Cancel' },
      { type: 'destructive', icon: 'triangle-alert', iconClass: 'text-destructive', actionClass: 'bg-destructive', focus: 'Cancel' },
      { type: 'acknowledge', icon: 'circle-check', iconClass: 'text-success', actionClass: 'bg-primary', focus: 'Got it' },
    ];
    for (const c of cases) {
      const p = presets[c.type];
      const trigger = canvas.getByRole('button', { name: p.trigger });
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('alertdialog', { name: p.title });
      await expect(dialog).toHaveAttribute('data-type', c.type);
      const svg = dialog.querySelector('[data-slot="dialog-header-icon"] svg')!;
      await expect(svg).toHaveAttribute('data-icon', c.icon);
      if (c.iconClass) await expect(svg.getAttribute('class')).toContain(c.iconClass);
      const buttons = dialog.querySelectorAll('[data-slot="dialog-footer"] button');
      await expect(buttons.length).toBe(c.type === 'acknowledge' ? 1 : 2);
      await expect(buttons[buttons.length - 1].className).toContain(c.actionClass);
      // Focus on Cancel, or on the only button.
      await waitFor(() => expect(dialog.querySelector(':focus')).toHaveTextContent(c.focus));
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
      await expect(trigger).toHaveFocus();
    }
  },
};

const TypeToConfirm = () => {
  const [value, setValue] = React.useState('');
  return (
    <AlertDialog onOpenChange={open => !open && setValue('')}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete workspace</Button>
      </AlertDialogTrigger>
      <AlertDialogContent type="destructive">
        <AlertDialogHeader
          title="Delete workspace?"
          description="All projects, invoices and members of Acme Finance will be deleted. This cannot be undone."
        />
        <AlertDialogBody>
          <Field label="Type Acme Finance to confirm">
            <Input value={value} onChange={e => setValue(e.target.value)} autoComplete="off" />
          </Field>
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel />
          <AlertDialogAction disabled={value !== 'Acme Finance'} onClick={onAction}>
            Delete workspace
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

/** Figma Show content: a type-to-confirm field for high-impact deletes; the action waits for a match. */
export const WithContent: Story = {
  render: () => <TypeToConfirm />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Delete workspace' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete workspace?' });
    // Focus still starts on Cancel.
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus());
    const action = screen.getAllByRole('button', { name: 'Delete workspace' }).find(b => dialog.contains(b))!;
    await expect(action).toBeDisabled();
    const input = screen.getByRole('textbox', { name: 'Type Acme Finance to confirm' });
    await userEvent.type(input, 'Acme Financ');
    await expect(action).toBeDisabled();
    await userEvent.type(input, 'e');
    await expect(action).toBeEnabled();
    // The content sits between header and footer, 16 px from each.
    const body = dialog.querySelector<HTMLElement>('[data-slot="dialog-body"]')!;
    const header = dialog.querySelector<HTMLElement>('[data-slot="dialog-header"]')!;
    await expect(Math.round(body.getBoundingClientRect().top + 4 - header.getBoundingClientRect().bottom)).toBe(16);
    onAction.mockClear();
    await userEvent.click(action);
    await expect(onAction).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const TypesDark: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Dark' } };

/** Figma stress test: a long question and long action labels wrap inside the dialog. */
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Open</Button>
      </AlertDialogTrigger>
      <AlertDialogContent type="destructive">
        <AlertDialogHeader
          title="Revoke access for all 48 members of the Acme finance workspace?"
          description="They will be signed out on every device at once and lose access to invoices, reports and shared files. This cannot be undone."
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Keep everyone's access</AlertDialogCancel>
          <AlertDialogAction>Revoke access for 48 members</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('alertdialog');
    const title = dialog.querySelector<HTMLElement>('[data-slot="dialog-title"]')!;
    await expect(title.getBoundingClientRect().height).toBeGreaterThan(28);
    await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);
    const footer = dialog.querySelector<HTMLElement>('[data-slot="dialog-footer"]')!;
    await expect(footer.scrollWidth).toBeLessThanOrEqual(footer.clientWidth);
    await waitFor(() => expect(screen.getByRole('button', { name: "Keep everyone's access" })).toHaveFocus());
  },
};
