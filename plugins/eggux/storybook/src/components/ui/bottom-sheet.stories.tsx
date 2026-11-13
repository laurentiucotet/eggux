import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
  type BottomSheetDetent,
} from './bottom-sheet';

type Args = { open: boolean; detent: BottomSheetDetent; title: string; description: string; showFooter: boolean; rows: number; allowPeek: boolean };

const customers = ['Northwind Traders', 'Brightside Studio', 'Lumen Labs', 'Harbor & Co', 'Fieldstone Bakery', 'Orchard Row', 'Kite Analytics', 'Pine & Quarry'];

const Rows = ({ rows }: { rows: number }) => (
  <ul className="m-0 flex list-none flex-col divide-y divide-border p-0">
    {Array.from({ length: rows }, (_, i) => (
      <li key={i} className="flex items-center justify-between gap-3 py-3 text-sm leading-5">
        <span className="min-w-0 truncate font-medium">{customers[i % customers.length]}</span>
        <span className="shrink-0 text-muted-foreground tabular-nums">INV-{2041 - i}</span>
      </li>
    ))}
  </ul>
);

const meta = {
  title: 'Components/Mobile/Bottom Sheet',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A Drawer you can drag. Grab the handle: drag down to close, or up and down to move between three detents (peek 30 %, half 50 %, full). The handle is a button, so it works without a pointer: ArrowUp and ArrowDown change the detent, Home and End jump, Escape closes. Radix Dialog underneath: focus trap and return, scrim, body scroll lock, outside tap to close, safe-area padding. Use it for content people may want to see more of (a list, filters, a map result); use Drawer for a short sheet and Action Sheet for a list of actions. Code only (no Figma component yet). Guide: eggux build-ui/patterns/mobile.md',
      },
    },
  },
  args: { open: false, detent: 'half', title: 'Recent invoices', description: 'Drag the handle to see more or less.', showFooter: true, rows: 6, allowPeek: true },
  argTypes: {
    open: { name: 'Open', control: 'boolean', description: 'Start with the sheet open.', table: { category: 'Sheet' } },
    detent: { name: 'Starting detent', control: 'inline-radio', options: ['peek', 'half', 'full'], description: 'Peek 30 %, half 50 %, full is the screen minus 48 px.', table: { category: 'Sheet' } },
    allowPeek: { name: 'Allow peek', control: 'boolean', description: 'Off: the lowest detent is half.', table: { category: 'Sheet' } },
    title: { name: 'Title', control: 'text', description: 'Names the sheet.', table: { category: 'Parts' } },
    description: { name: 'Description', control: 'text', description: 'One line under the title.', table: { category: 'Parts' } },
    rows: { name: 'Rows', control: { type: 'range', min: 1, max: 24, step: 1 }, description: 'How much content; past the height it scrolls.', table: { category: 'Parts' } },
    showFooter: { name: 'Show footer', control: 'boolean', description: 'A full-width primary button.', table: { category: 'Parts' } },
  },
  render: ({ open, detent, title, description, showFooter, rows, allowPeek }) => (
    <div className="flex min-h-[320px] items-start p-6">
      <BottomSheet key={[open, detent, allowPeek].join('|')} defaultOpen={open} defaultDetent={allowPeek ? detent : detent === 'peek' ? 'half' : detent} detents={allowPeek ? ['peek', 'half', 'full'] : ['half', 'full']}>
        <BottomSheetTrigger asChild>
          <Button variant="outline" size="touch">Open sheet</Button>
        </BottomSheetTrigger>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>{title}</BottomSheetTitle>
            <BottomSheetDescription>{description}</BottomSheetDescription>
          </BottomSheetHeader>
          <BottomSheetBody>
            <Rows rows={rows} />
          </BottomSheetBody>
          {showFooter ? (
            <BottomSheetFooter>
              <BottomSheetClose asChild>
                <Button size="touch">Done</Button>
              </BottomSheetClose>
            </BottomSheetFooter>
          ) : null}
        </BottomSheetContent>
      </BottomSheet>
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Open from the start at half height, as people see it on a phone. */
export const Open: Story = { args: { open: true } };

/** Full height with more rows than fit: the body scrolls, the handle and footer stay. */
export const LongContent: Story = { args: { open: true, detent: 'full', rows: 24 } };

const content = () => screen.getByRole('dialog');
const vh = () => window.innerHeight;
const near = (a: number, b: number) => Math.abs(a - b) <= 2;
const height = () => content().getBoundingClientRect().height;
const handle = () => screen.getByRole('button', { name: /^Sheet size/ });

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Recent invoices' });
    await expect(dialog).toBeVisible();
    // Focus lands inside the sheet; the body is scrollable by keyboard.
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    // Body scroll is locked behind the scrim.
    await waitFor(() => expect(getComputedStyle(document.body).overflow).toBe('hidden'));
    // Half detent: 50 % of the screen; the handle is at least 44 px tall.
    await waitFor(() => expect(near(height(), vh() * 0.5)).toBe(true));
    await expect(handle()).toHaveAccessibleName('Sheet size: half');
    await expect(handle().getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    // Keyboard: ArrowUp to full, ArrowDown back down to peek, ArrowDown at peek stays.
    handle().focus();
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(content()).toHaveAttribute('data-detent', 'full'));
    await waitFor(() => expect(near(height(), vh() - 48)).toBe(true));
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(content()).toHaveAttribute('data-detent', 'peek'));
    await waitFor(() => expect(near(height(), vh() * 0.3)).toBe(true));
    await userEvent.keyboard('{ArrowDown}');
    await expect(content()).toHaveAttribute('data-detent', 'peek');
    await expect(handle()).toHaveAccessibleName('Sheet size: peek');
    // Escape closes it and focus returns to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
    await waitFor(() => expect(getComputedStyle(document.body).overflow).not.toBe('hidden'));
  },
};

/** Pointer drag on the handle: up to full, down to peek, far down closes. */
export const DragCheck: Story = {
  tags: ['!dev'],
  args: { open: true },
  play: async () => {
    await screen.findByRole('dialog', { name: 'Recent invoices' });
    const drag = async (dy: number) => {
      const r = handle().getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      await userEvent.pointer([
        { keys: '[MouseLeft>]', target: handle(), coords: { clientX: x, clientY: y } },
        { coords: { clientX: x, clientY: y + dy / 2 } },
        { coords: { clientX: x, clientY: y + dy } },
        { keys: '[/MouseLeft]', coords: { clientX: x, clientY: y + dy } },
      ]);
    };
    await waitFor(() => expect(near(height(), vh() * 0.5)).toBe(true));
    // Up by 60 % of the screen: full.
    await drag(-vh() * 0.6);
    await waitFor(() => expect(content()).toHaveAttribute('data-detent', 'full'));
    // Down by a little more than half the screen from full: lands near peek.
    await drag(vh() * 0.65);
    await waitFor(() => expect(content()).toHaveAttribute('data-detent', 'peek'));
    // A drag below the peek height closes the sheet.
    await drag(vh() * 0.25);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

export const ClickCheck: Story = {
  tags: ['!dev'],
  args: { open: true },
  play: async () => {
    await screen.findByRole('dialog');
    // A tap on the handle steps up; from full it goes back to the lowest.
    await userEvent.click(handle());
    await waitFor(() => expect(content()).toHaveAttribute('data-detent', 'full'));
    await userEvent.click(handle());
    await waitFor(() => expect(content()).toHaveAttribute('data-detent', 'peek'));
    // Outside tap on the scrim closes it.
    await userEvent.click(document.querySelector('[data-slot="bottom-sheet-overlay"]') as HTMLElement);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  args: { open: true, detent: 'peek', rows: 24, title: 'A very long sheet title that goes on and on for several words so it has to wrap inside the sheet header' },
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(near(dialog.getBoundingClientRect().height, vh() * 0.3)).toBe(true));
    // Never wider than the screen; the body scrolls instead of growing the sheet.
    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(window.innerWidth);
    const body = dialog.querySelector('[data-slot="bottom-sheet-body"]') as HTMLElement;
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
