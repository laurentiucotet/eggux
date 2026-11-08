import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { Field } from './field';
import { Input } from './input';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetContentProps,
} from './sheet';

const meta = {
  title: 'Components/Drawer/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Side drawer over the page: edit or inspect one object without leaving the list (right), navigation on mobile (left). Full height, 384 wide (480 forms, 640 a record or table), header and footer fixed, content scrolls; Escape, outside click and Cancel close it and focus returns to the trigger. Figma: Drawer page / Sheet. Guide: eggux build-ui/components/drawer.md',
      },
    },
  },
} satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;

const onSave = fn();

function EditContact({ side, size, open, trigger = 'Edit contact', fields = 2 }: Pick<SheetContentProps, 'side' | 'size'> & { open?: boolean; trigger?: string; fields?: number }) {
  return (
    <Sheet defaultOpen={open}>
      <SheetTrigger asChild>
        <Button variant="outline">{trigger}</Button>
      </SheetTrigger>
      <SheetContent side={side} size={size}>
        <SheetHeader>
          <SheetTitle>Edit contact</SheetTitle>
          <SheetDescription>Changes are saved to the contact record.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Field label="Name">
            <Input defaultValue="Ana Popescu" />
          </Field>
          <Field label="Email">
            <Input type="email" defaultValue="ana@acme.example" />
          </Field>
          {Array.from({ length: Math.max(0, fields - 2) }, (_, i) => (
            <Field key={i} label={`Note ${i + 1}`}>
              <Input defaultValue="Prefers invoices in EUR" />
            </Field>
          ))}
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={onSave}>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const content = () => document.querySelector<HTMLElement>('[data-slot="sheet-content"]')!;
const px = (n: number) => Math.round(n);

// Figma Side=right: 384 × full height, against the right edge, 24 padding, 16 gap, left border.
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <EditContact />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Edit contact' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Edit contact' });
    await expect(dialog).toHaveAccessibleDescription('Changes are saved to the contact record.');
    // Focus moves to the first field.
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus());
    const box = dialog.getBoundingClientRect();
    await expect(px(box.right)).toBe(window.innerWidth);
    await expect(px(box.height)).toBe(window.innerHeight);
    await expect(px(box.width)).toBe(window.innerWidth >= 640 ? 384 : window.innerWidth);
    const cs = getComputedStyle(dialog);
    await expect(cs.paddingTop).toBe('24px');
    await expect(cs.rowGap).toBe('16px');
    await expect(cs.borderLeftWidth).toBe('1px');
    await expect(cs.borderRightWidth).toBe('0px');
    await expect(cs.minWidth).toBe('320px');
    await expect(cs.boxShadow).not.toBe('none');
    // Overlay behind it.
    await expect(document.querySelector('[data-slot="sheet-overlay"]')).not.toBeNull();
    // Footer: primary right, Cancel to its left.
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const save = screen.getByRole('button', { name: 'Save changes' });
    await expect(cancel.getBoundingClientRect().right).toBeLessThan(save.getBoundingClientRect().left);
    await expect(px(box.right - save.getBoundingClientRect().right)).toBe(24);
    // Save works; Cancel closes and focus returns to the trigger.
    await userEvent.click(save);
    await expect(onSave).toHaveBeenCalled();
    await userEvent.click(cancel);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

// Keyboard: Enter opens, Tab stays inside (focus trap), Escape closes, focus returns.
export const Keyboard: Story = {
  parameters: { controls: { disable: true } },
  render: () => <EditContact />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Edit contact' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog', { name: 'Edit contact' });
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus());
    // Name, Email, Cancel, Save changes, Close (header), then Name again: never leaves the sheet.
    const seen: string[] = [];
    for (let i = 0; i < 6; i += 1) {
      await userEvent.tab();
      await expect(dialog.contains(document.activeElement)).toBe(true);
      seen.push((document.activeElement as HTMLElement).getAttribute('aria-label') ?? (document.activeElement as HTMLElement).textContent ?? '');
    }
    await expect(seen).toContain('Close');
    await userEvent.tab({ shift: true });
    await expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

// Close X has an accessible label; an outside click on the overlay closes it too.
export const CloseAndOutsideClick: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => <EditContact />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Edit contact' });
    await userEvent.click(trigger);
    await screen.findByRole('dialog');
    const close = screen.getByRole('button', { name: 'Close' });
    await expect(px(close.getBoundingClientRect().width)).toBe(24);
    await userEvent.click(close);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await screen.findByRole('dialog');
    const overlay = document.querySelector<HTMLElement>('[data-slot="sheet-overlay"]')!;
    await userEvent.pointer({ keys: '[MouseLeft]', target: overlay, coords: { clientX: 5, clientY: 5 } });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

// Figma Side=left: against the left edge, border on the right.
export const Left: Story = {
  parameters: { controls: { disable: true } },
  render: () => <EditContact side="left" trigger="Open menu" />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    const dialog = await screen.findByRole('dialog', { name: 'Edit contact' });
    await expect(px(dialog.getBoundingClientRect().left)).toBe(0);
    await expect(getComputedStyle(dialog).borderRightWidth).toBe('1px');
    await expect(getComputedStyle(dialog).borderLeftWidth).toBe('0px');
    await expect(dialog).toHaveAttribute('data-side', 'left');
  },
};

// Widths from the reference: 384 details and filters, 480 forms, 640 a record; full width under 640.
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex gap-2">
      <EditContact trigger="384" />
      <EditContact size="md" trigger="480" />
      <EditContact size="lg" trigger="640" />
    </div>
  ),
  play: async ({ canvas }) => {
    for (const [label, width] of [['384', 384], ['480', 480], ['640', 640]] as const) {
      await userEvent.click(canvas.getByRole('button', { name: label }));
      const dialog = await screen.findByRole('dialog');
      const expected = window.innerWidth >= 640 ? Math.min(width, window.innerWidth) : window.innerWidth;
      await expect(px(dialog.getBoundingClientRect().width)).toBe(expected);
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    }
  },
};

// No field in the body: focus goes to the title, so the name is read first.
export const FocusTitle: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">View invoice</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invoice INV-1041</SheetTitle>
          <SheetDescription>Acme Ltd, EUR 1,240.00, due 30 Oct 2026.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <p className="text-sm">Paid in two parts. The second part is due on 30 Oct 2026.</p>
        </SheetBody>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View invoice' }));
    await screen.findByRole('dialog', { name: 'Invoice INV-1041' });
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Invoice INV-1041' })).toHaveFocus());
  },
};

// Stress: long content scrolls inside the body while header and footer stay in view; long title wraps.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => <EditContact fields={14} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Edit contact' }));
    const dialog = await screen.findByRole('dialog');
    const body = dialog.querySelector<HTMLElement>('[data-slot="sheet-body"]')!;
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    await expect(getComputedStyle(body).overflowY).toBe('auto');
    const save = screen.getByRole('button', { name: 'Save changes' });
    await expect(save.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight - 23);
    await expect(px(dialog.getBoundingClientRect().height)).toBe(window.innerHeight);
    // The last field scrolls into view when focused.
    const last = screen.getByRole('textbox', { name: 'Note 12' });
    last.focus();
    await expect(last.getBoundingClientRect().bottom).toBeLessThanOrEqual(body.getBoundingClientRect().bottom + 1);
    await expect(content()).toBe(dialog);
  },
};

const openStory: Story = {
  render: () => <EditContact open />,
  play: async () => {
    await screen.findByRole('dialog', { name: 'Edit contact' });
  },
};
export const OpenDark: Story = { ...openStory, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OpenCorporate: Story = { ...openStory, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
