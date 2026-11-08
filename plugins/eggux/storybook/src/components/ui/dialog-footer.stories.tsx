import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { DialogFooter } from './dialog-footer';

const meta = {
  title: 'Components/Dialog/Dialog Footer',
  decorators: [
    Story => (
      <div className="w-[464px] max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Bottom of Dialog, Alert Dialog, Sheet and Drawer: the Actions slot, right aligned, 8 px apart. Cancel (outline) left of the one primary action; a left-side item (checkbox, link) goes first with mr-auto. Figma: Dialog page, "Dialog / Component". Guides: build-ui/components/dialog.md, drawer.md.',
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type Playground = {
  showCancel: boolean;
  action: string;
  destructive: boolean;
  leftItem: 'none' | 'checkbox' | 'link';
};

/** Playground: every Dialog Footer arrangement in Controls. */
export const Default: StoryObj<Playground> = {
  argTypes: {
    showCancel: { name: 'Show cancel', control: 'boolean', table: { category: 'Dialog Footer' } },
    action: { name: 'Action label', control: 'text', description: 'The one primary action, named with its verb', table: { category: 'Dialog Footer' } },
    destructive: { name: 'Destructive', control: 'boolean', description: 'The action deletes or cannot be undone', table: { category: 'Dialog Footer' } },
    leftItem: { name: 'Left item', control: 'inline-radio', options: ['none', 'checkbox', 'link'], description: 'An item before the buttons (mr-auto)', table: { category: 'Dialog Footer' } },
  },
  args: { showCancel: true, action: 'Send invite', destructive: false, leftItem: 'none' },
  render: a => (
    <DialogFooter>
      {a.leftItem === 'checkbox' ? <Checkbox label="Send me a copy" wrapperClassName="mr-auto" /> : null}
      {a.leftItem === 'link' ? <Button variant="link" className="mr-auto px-0">Learn about roles</Button> : null}
      {a.showCancel ? <Button variant="outline">Cancel</Button> : null}
      <Button variant={a.destructive ? 'destructive' : 'default'}>{a.action}</Button>
    </DialogFooter>
  ),
};

// The checks that used to run on Default (hidden; the playground has no play function).
export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Send invite</Button>
    </DialogFooter>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = canvasElement.querySelector<HTMLElement>('[data-slot="dialog-footer"]')!;
    const cancel = canvas.getByRole('button', { name: 'Cancel' });
    const send = canvas.getByRole('button', { name: 'Send invite' });
    // Figma: 464 x 36, buttons right aligned, primary last, 8 px apart.
    await expect(footer.getBoundingClientRect().width).toBe(464);
    await expect(Math.round(footer.getBoundingClientRect().height)).toBe(36);
    await expect(send.getBoundingClientRect().right).toBe(footer.getBoundingClientRect().right);
    await expect(Math.round(send.getBoundingClientRect().left - cancel.getBoundingClientRect().right)).toBe(8);
    // Tab order follows the visual order: Cancel, then the primary action.
    cancel.focus();
    await userEvent.tab();
    await expect(send).toHaveFocus();
  },
};

/** A left-side item (here an opt-in checkbox) goes first and pushes the buttons right. */
export const WithLeftItem: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DialogFooter>
      <label className="mr-auto flex items-center gap-2 text-sm">
        <Checkbox /> Send me a copy
      </label>
      <Button variant="outline">Cancel</Button>
      <Button>Send invite</Button>
    </DialogFooter>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = canvasElement.querySelector<HTMLElement>('[data-slot="dialog-footer"]')!;
    const checkbox = canvas.getByRole('checkbox', { name: 'Send me a copy' });
    await expect(Math.round(checkbox.getBoundingClientRect().left)).toBe(Math.round(footer.getBoundingClientRect().left));
    await expect(canvas.getByRole('button', { name: 'Send invite' }).getBoundingClientRect().right).toBe(footer.getBoundingClientRect().right);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };

/** Figma stress test: one button; the 276 column with long labels wraps, still right aligned. */
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div data-testid="single">
        <DialogFooter>
          <Button>Got it</Button>
        </DialogFooter>
      </div>
      <div data-testid="narrow" style={{ width: 276 }}>
        <DialogFooter>
          <Button variant="outline">Keep editing the draft</Button>
          <Button>Discard all changes</Button>
        </DialogFooter>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const single = canvas.getByTestId('single').querySelector<HTMLElement>('[data-slot="dialog-footer"]')!;
    await expect(canvas.getByRole('button', { name: 'Got it' }).getBoundingClientRect().right).toBe(single.getBoundingClientRect().right);
    const narrow = canvas.getByTestId('narrow').querySelector<HTMLElement>('[data-slot="dialog-footer"]')!;
    await expect(narrow.scrollWidth).toBeLessThanOrEqual(narrow.clientWidth);
    const primary = canvas.getByRole('button', { name: 'Discard all changes' });
    await expect(primary.getBoundingClientRect().right).toBe(narrow.getBoundingClientRect().right);
    // Wrapped onto a second row, 8 px below the first.
    const keep = canvas.getByRole('button', { name: 'Keep editing the draft' });
    await expect(Math.round(primary.getBoundingClientRect().top - keep.getBoundingClientRect().bottom)).toBe(8);
  },
};
