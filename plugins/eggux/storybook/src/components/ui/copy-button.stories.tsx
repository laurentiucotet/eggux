import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, mocked, screen, spyOn, userEvent, waitFor } from 'storybook/test';
import { CopyButton, type CopyButtonSize, type CopyButtonVariant } from './copy-button';
import { TooltipProvider } from './tooltip';

const meta = {
  title: 'Components/Button/Copy Button',
  component: CopyButton,
  parameters: {
    docs: { description: { component: 'Copies one value (an ID, a key, a URL, a snippet) and confirms in place: a check in the success color for 2 s, the tooltip "Copy" reads "Copied", a polite announcement; no toast. ghost in content (code blocks, table cells), outline next to fields; Size default 36, sm 32, xs 28. The aria-label names the value. A labelled field people copy from is Copy Field. Figma: Button page / Copy Button. Guide: eggux build-ui/components/button.md' } },
  },
  decorators: [Story => <TooltipProvider delayDuration={0}><Story /></TooltipProvider>],
  args: { value: 'INV-1047', label: 'Copy invoice number', onCopy: fn() },
  // Stub the clipboard so the tests do not depend on browser permissions.
  beforeEach: () => {
    if (!navigator.clipboard) Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => undefined } });
    const spy = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    return () => spy.mockRestore();
  },
} satisfies Meta<typeof CopyButton>;
export default meta;
type Story = StoryObj<typeof meta>;

const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

// Click copies the full value; State=copied: check in the success color, "Copied" announced and in
// the tooltip; back to the copy icon after copiedDuration (2 s in product, shortened here).
export const Default: Story = {
  args: { copiedDuration: 600 },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Copy invoice number' });
    await expect(box(button)).toEqual([36, 36]);
    const status = canvas.getByRole('status');
    await expect(status).toHaveTextContent('');
    await userEvent.hover(button);
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('Copy');
    await userEvent.click(button);
    await expect(mocked(navigator.clipboard.writeText)).toHaveBeenCalledWith('INV-1047');
    await expect(args.onCopy).toHaveBeenCalledWith('INV-1047');
    await waitFor(() => expect(status).toHaveTextContent('Copied'));
    const check = button.querySelector('svg')!;
    const success = probe('text-success');
    await expect(getComputedStyle(check).color).toBe(success.style.color);
    success.remove();
    // Back to default.
    await waitFor(() => expect(status).toHaveTextContent(''), { timeout: 2000 });
    await userEvent.unhover(button);
  },
};

// Keyboard: Tab reaches it, Enter copies; focus stays.
export const Keyboard: Story = { tags: ['!dev'],
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Copy invoice number' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(args.onCopy).toHaveBeenCalledTimes(1));
    await expect(canvas.getByRole('status')).toHaveTextContent('Copied');
    await expect(button).toHaveFocus();
  },
};

const variants: CopyButtonVariant[] = ['ghost', 'outline'];
const sizes: CopyButtonSize[] = ['default', 'sm', 'xs'];

// Figma Variant x Size: ghost (no fill, no border) and outline (background, input border);
// 36, 32, 28 with a 16, 16, 14 px icon.
export const VariantsAndSizes: Story = {
  render: args => (
    <div className="flex flex-col gap-3">
      {variants.map(v => (
        <div key={v} className="flex items-center gap-3">
          {sizes.map(s => <CopyButton key={s} {...args} variant={v} size={s} label={`Copy invoice number (${v}, ${s})`} />)}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');
    await expect(buttons.map(box)).toEqual([[36, 36], [32, 32], [28, 28], [36, 36], [32, 32], [28, 28]]);
    await expect(buttons.map(b => box(b.querySelector('svg')!)[0])).toEqual([16, 16, 14, 16, 16, 14]);
    const outline = probe('bg-background border border-input');
    await waitFor(() => expect(getComputedStyle(buttons[3]).backgroundColor).toBe(outline.style.backgroundColor));
    await expect(getComputedStyle(buttons[3]).borderTopColor).toBe(outline.style.borderTopColor);
    await expect(getComputedStyle(buttons[0]).borderTopWidth).toBe('0px');
    outline.remove();
  },
};

// When the clipboard fails: "Press Ctrl+C to copy" in the tooltip and the live region.
export const CopyFails: Story = {
  play: async ({ canvas, args }) => {
    mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('denied'));
    await userEvent.click(canvas.getByRole('button', { name: 'Copy invoice number' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Press Ctrl+C to copy'));
    await expect(args.onCopy).not.toHaveBeenCalled();
  },
};

// Figma "Example / Copy Button": label, a masked or truncated mono value and a ghost sm Copy
// Button; the full value is copied even when the visible text is cut.
export const InRows: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <dl className="grid w-[368px] grid-cols-[120px_1fr] items-center gap-x-3 gap-y-2 text-sm">
      {[
        ['Workspace ID', 'ws_8f2k41x9', 'ws_8f2k41x9'],
        ['Invoice number', 'INV-1047', 'INV-1047'],
        ['Webhook secret', 'whsec_••••3f9a', 'whsec_51Hc0aZ3f9a'],
        ['Callback URL', 'https://api.acme.example/hooks/invoices/paid/europe', 'https://api.acme.example/hooks/invoices/paid/europe'],
      ].map(([term, shown, value]) => (
        <div key={term} className="contents">
          <dt className="text-muted-foreground">{term}</dt>
          <dd className="m-0 flex min-w-0 items-center gap-1">
            <code className="min-w-0 truncate font-mono font-semibold">{shown}</code>
            <CopyButton value={value} size="sm" label={`Copy ${term.toLowerCase()}`} />
          </dd>
        </div>
      ))}
    </dl>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Copy webhook secret' }));
    await expect(mocked(navigator.clipboard.writeText)).toHaveBeenCalledWith('whsec_51Hc0aZ3f9a');
    // The Copy Button keeps its 32 px next to a truncated value at 368.
    await expect(box(canvas.getByRole('button', { name: 'Copy callback url' }))).toEqual([32, 32]);
  },
};
