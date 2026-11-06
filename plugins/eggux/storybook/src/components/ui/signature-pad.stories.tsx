import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { SignaturePad, type SignaturePoint } from './signature-pad';

const SIGNED_AT = new Date(2026, 9, 21, 10, 42);

// A drawn signature like the Figma State=signed vector: loops along the baseline.
const squiggle: SignaturePoint[] = Array.from({ length: 120 }, (_, i) => {
  const t = i / 119;
  return { x: 70 + t * 310 + 14 * Math.cos(t * 30), y: 100 - 34 * (1 - t * 0.7) * Math.abs(Math.sin(t * 15)) };
});

const meta = {
  title: 'Components/Input/Signature Pad',
  component: SignaturePad,
  parameters: {
    docs: { description: { component: 'Draw a signature for approvals, contracts and deliveries. The pad clips the stroke on purpose; "Type instead" (a typed name in a script face) is the keyboard and screen reader path; Clear restarts. After signing it says who signed and when; store the SVG with the timestamp and the document version. Figma: Input page / Signature Pad. Guide: eggux build-ui/components/input.md' } },
  },
  args: { signedBy: 'Ana Popescu', now: () => SIGNED_AT, onSign: fn(), onClear: fn() },
} satisfies Meta<typeof SignaturePad>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const probe = (className: string, prop: 'color') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};
const pointer = (target: Element, type: string, x: number, y: number) => {
  const r = target.getBoundingClientRect();
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, button: 0, buttons: 1, isPrimary: true, clientX: r.left + x, clientY: r.top + y }));
};

// Figma State=empty: 480 x 220, a dashed 180 pad with the hint, baseline and ×, the terms and two
// 32 px buttons. Drawing a stroke signs it.
export const Default: Story = {
  play: async ({ canvasElement, canvas, args }) => {
    const root = canvasElement.querySelector('[data-slot="signature-pad"]')!;
    await expect(box(root)).toEqual([480, 220]);
    const pad = root.querySelector('[data-slot="signature-pad-pad"]')!;
    await expect(box(pad)).toEqual([480, 180]);
    await expect(getComputedStyle(pad).borderTopStyle).toBe('dashed');
    await expect(getComputedStyle(pad).overflow).toBe('hidden');
    const baseline = root.querySelector('[data-slot="signature-pad-baseline"]')!;
    await expect(box(baseline)).toEqual([416, 1]);
    await expect(canvas.getByText('Sign here with your mouse, finger or stylus')).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('By signing you agree to the terms above.');
    await expect(box(canvas.getByRole('button', { name: 'Type instead' }))[1]).toBe(32);
    await expect(box(canvas.getByRole('button', { name: 'Clear' }))[1]).toBe(32);
    // Draw one stroke.
    const surface = canvas.getByRole('img', { name: 'Signature pad' });
    pointer(surface, 'pointerdown', 80, 110);
    for (let i = 1; i <= 10; i++) pointer(surface, 'pointermove', 80 + i * 20, 110 - (i % 2) * 30);
    pointer(surface, 'pointerup', 280, 110);
    await waitFor(() => expect(args.onSign).toHaveBeenCalledTimes(1));
    const value = (args.onSign as ReturnType<typeof fn>).mock.calls[0][0];
    await expect(value.method).toBe('drawn');
    await expect(value.strokes[0]).toHaveLength(11);
    await expect(value.signedAt).toEqual(SIGNED_AT);
    await expect(value.svg).toContain('<path');
    // Figma State=signed: solid border, the stroke in the foreground, who and when said in text.
    await expect(getComputedStyle(pad).borderTopStyle).toBe('solid');
    await expect(canvas.getByRole('img', { name: 'Signature of Ana Popescu' }).querySelectorAll('path')).toHaveLength(1);
    await expect(canvas.getByRole('status')).toHaveTextContent('Signed by Ana Popescu · 21 Oct 2026, 10:42');
    await expect(canvas.queryByText('Sign here with your mouse, finger or stylus')).toBeNull();
  },
};

// Figma State=signed. Clear restarts and keeps focus on Clear.
export const Signed: Story = {
  args: { defaultValue: { method: 'drawn', strokes: [squiggle], signedAt: SIGNED_AT } },
  play: async ({ canvas, args }) => {
    const signature = canvas.getByRole('img', { name: 'Signature of Ana Popescu' });
    const path = signature.querySelector('path')!;
    await expect(getComputedStyle(path).stroke).toBe(probe('text-foreground', 'color'));
    await expect(path).toHaveAttribute('stroke-width', '2.5');
    await expect(canvas.getByRole('status')).toHaveTextContent('Signed by Ana Popescu · 21 Oct 2026, 10:42');
    const clear = canvas.getByRole('button', { name: 'Clear' });
    await userEvent.click(clear);
    await expect(args.onClear).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole('img', { name: 'Signature pad' }).querySelectorAll('path')).toHaveLength(0);
    await expect(canvas.getByText('Sign here with your mouse, finger or stylus')).toBeVisible();
    await expect(clear).toHaveFocus();
  },
};

// Keyboard and screen readers: Type instead moves focus to the name field, Enter signs, the note
// says who signed, Clear empties the name and keeps focus there, Draw instead goes back.
export const TypeInstead: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    const toggle = canvas.getByRole('button', { name: 'Type instead' });
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const name = canvas.getByRole('textbox', { name: 'Type your full name' });
    await waitFor(() => expect(name).toHaveFocus());
    await expect(getComputedStyle(name).fontStyle).toBe('italic');
    await userEvent.keyboard('Ana Popescu{Enter}');
    await expect(args.onSign).toHaveBeenCalledTimes(1);
    const value = (args.onSign as ReturnType<typeof fn>).mock.calls[0][0];
    await expect(value).toMatchObject({ method: 'typed', name: 'Ana Popescu', signedAt: SIGNED_AT });
    await expect(value.svg).toContain('>Ana Popescu</text>');
    await expect(canvas.getByRole('status')).toHaveTextContent('Signed by Ana Popescu · 21 Oct 2026, 10:42');
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Clear' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(name).toHaveValue('');
    await expect(name).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent('By signing you agree to the terms above.');
    await userEvent.click(canvas.getByRole('button', { name: 'Draw instead' }));
    await expect(canvas.getByRole('img', { name: 'Signature pad' })).toBeVisible();
  },
};

// Stress test (Figma "Stress test / Signature Pad"): the 276 and 368 columns (hint up to 2 lines,
// the note wraps, buttons keep 32), a long signer name, a stroke drawn past the edge is clipped.
export const Stress: Story = {
  tags: ['!dev'],
  render: args => (
    <div className="flex flex-col gap-8">
      <div data-case="276" className="w-[276px]"><SignaturePad {...args} className="w-full" /></div>
      <div data-case="368" className="w-[368px]"><SignaturePad {...args} className="w-full" /></div>
      <div data-case="long" className="w-[368px]">
        <SignaturePad
          {...args}
          className="w-full"
          signedBy="Ana-Maria Popescu-Ionescu, Head of Procurement, Acme Holdings International"
          defaultValue={{ method: 'drawn', strokes: [squiggle.map(p => ({ x: p.x * 1.4 - 60, y: p.y }))], signedAt: SIGNED_AT }}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const c of ['276', '368', 'long']) {
      const root = canvasElement.querySelector(`[data-case="${c}"] [data-slot="signature-pad"]`) as HTMLElement;
      await expect(root.getBoundingClientRect().width).toBe(Number(c === 'long' ? 368 : c));
      await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
      for (const b of root.querySelectorAll('button')) {
        await expect(box(b)[1]).toBe(32);
        await expect(b.getBoundingClientRect().right).toBeLessThanOrEqual(root.getBoundingClientRect().right);
      }
      const hint = root.querySelector('[data-slot="signature-pad-hint"]') as HTMLElement | null;
      // The hint stays 32 from each edge and up to 2 lines (20 px each).
      if (hint) {
        await expect(hint.getBoundingClientRect().height).toBeLessThanOrEqual(40);
        await expect(Math.round(hint.getBoundingClientRect().left - root.getBoundingClientRect().left)).toBe(32);
      }
    }
    const note = canvasElement.querySelector('[data-case="long"] [data-slot="signature-pad-note"]') as HTMLElement;
    await expect(note.getBoundingClientRect().height).toBeGreaterThan(16);
    await expect(note.scrollWidth).toBeLessThanOrEqual(note.clientWidth);
  },
};

export const EmptyDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const SignedDark: Story = { ...Signed, tags: ['!dev'], globals: { theme: 'Dark' }, play: undefined };
export const SignedCorporate: Story = { ...Signed, tags: ['!dev'], globals: { theme: 'Corporate Light' }, play: undefined };
