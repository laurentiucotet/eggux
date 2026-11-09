// EGG UI Signature Pad. Figma: Signature Pad (Input page, "Signature Pad / Component"). State
// (empty, signed). A 180 px pad (radius md, dashed border while empty, solid once signed) that clips
// the stroke on purpose, with a baseline and an "×" 32 px in from the sides, a centered hint (up to
// 2 lines) while empty, and a footer: the note (terms while empty, "Signed by Ana Popescu · 21 Oct
// 2026, 10:42" once signed, announced politely), "Type instead" (ghost sm) and "Clear" (outline sm).
// Strokes are drawn with pointer events (mouse, finger, stylus) into an SVG in the foreground color,
// so they follow the theme. "Type instead" is the keyboard and screen reader path: the typed name
// shows in a script face on the baseline and signs on Enter or blur. Switching method or Clear
// restarts. onSign returns the strokes or name, the time and an SVG to store with the document
// version. Built from Button.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { DEFAULT_LOCALE, formatShortDate, formatTime, timeOfDate } from './calendar-date';

export interface SignaturePoint {
  x: number;
  y: number;
}

export interface SignatureValue {
  /** drawn: strokes on the pad; typed: the name typed instead. */
  method: 'drawn' | 'typed';
  /** Pointer strokes in px from the pad's top left (method drawn). */
  strokes?: SignaturePoint[][];
  /** The typed name (method typed). */
  name?: string;
  /** When it was signed; store it with the image and the document version. */
  signedAt: Date;
  /** The signature as a standalone SVG, ready to store. Filled in by onSign. */
  svg?: string;
}

export interface SignaturePadProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Figma State: null is empty, a value is signed. Controlled when given. */
  value?: SignatureValue | null;
  defaultValue?: SignatureValue | null;
  /** After each stroke, or when a typed name is confirmed. */
  onSign?: (value: SignatureValue) => void;
  /** Clear, or a switch between drawing and typing. */
  onClear?: () => void;
  /** Who signs: shown after signing ("Signed by Ana Popescu") and in the typed field's name. */
  signedBy?: string;
  /** Figma hint in the empty pad. */
  hint?: string;
  /** Figma note under an empty pad (the terms). */
  note?: React.ReactNode;
  /** Clock for the signing time (stories and tests pass a fixed one). */
  now?: () => Date;
  locale?: string;
  /** Texts translated by the app. */
  labels?: {
    typeInstead?: string; drawInstead?: string; clear?: string; pad?: string; signature?: string;
    typedName?: string; typedPlaceholder?: string; signed?: (who: string | undefined, when: string) => string;
  };
}

const STROKE = 2.5;

const pathOf = (stroke: SignaturePoint[]) => {
  if (stroke.length === 0) return '';
  const [first, ...rest] = stroke;
  const r = (n: number) => Math.round(n * 10) / 10;
  return rest.length === 0
    ? `M${r(first.x)} ${r(first.y)}l0.01 0`
    : `M${r(first.x)} ${r(first.y)}` + rest.map(p => `L${r(p.x)} ${r(p.y)}`).join('');
};

const escapeXml = (s: string) => s.replace(/[<>&"']/g, c => `&#${c.charCodeAt(0)};`);

/** A standalone SVG of the signature (black on transparent), the size of the pad. */
export function signatureToSvg(value: SignatureValue, width: number, height: number) {
  const body =
    value.method === 'typed'
      ? `<text x="32" y="124" font-family="Georgia, serif" font-style="italic" font-size="30">${escapeXml(value.name ?? '')}</text>`
      : (value.strokes ?? [])
          .map(s => `<path d="${pathOf(s)}" fill="none" stroke="black" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round"/>`)
          .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(width)}" height="${Math.round(height)}" viewBox="0 0 ${Math.round(width)} ${Math.round(height)}">${body}</svg>`;
}

function SignaturePad({
  value: valueProp,
  defaultValue = null,
  onSign,
  onClear,
  signedBy,
  hint = 'Sign here with your mouse, finger or stylus',
  note = 'By signing you agree to the terms above.',
  now = () => new Date(),
  locale = DEFAULT_LOCALE,
  labels,
  className,
  ...props
}: SignaturePadProps) {
  const t = {
    typeInstead: 'Type instead', drawInstead: 'Draw instead', clear: 'Clear', pad: 'Signature pad', signature: 'Signature',
    typedName: 'Type your full name', typedPlaceholder: 'Your full name',
    signed: (who: string | undefined, when: string) => (who ? `Signed by ${who} · ${when}` : `Signed · ${when}`),
    ...labels,
  };
  const [inner, setInner] = React.useState<SignatureValue | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const [typing, setTyping] = React.useState(value?.method === 'typed');
  const [typed, setTyped] = React.useState(value?.method === 'typed' ? value.name ?? '' : '');
  const [live, setLive] = React.useState<SignaturePoint[] | null>(null);
  const padRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const drawing = React.useRef<SignaturePoint[] | null>(null);
  const focusTyped = React.useRef(false);
  React.useEffect(() => {
    if (typing && focusTyped.current) inputRef.current?.focus();
    focusTyped.current = false;
  }, [typing]);

  const sign = (next: Omit<SignatureValue, 'svg'>) => {
    const rect = padRef.current?.getBoundingClientRect();
    const full = { ...next, svg: signatureToSvg(next as SignatureValue, rect?.width ?? 480, rect?.height ?? 180) };
    setInner(full);
    onSign?.(full);
  };
  const clear = () => {
    setInner(null);
    setTyped('');
    setLive(null);
    drawing.current = null;
    onClear?.();
  };

  const point = (e: React.PointerEvent) => {
    const rect = padRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const endStroke = () => {
    const stroke = drawing.current;
    drawing.current = null;
    setLive(null);
    if (!stroke || stroke.length === 0) return;
    const strokes = [...(value?.method === 'drawn' ? value.strokes ?? [] : []), stroke];
    sign({ method: 'drawn', strokes, signedAt: now() });
  };

  const confirmTyped = () => {
    const name = typed.trim();
    if (!name) {
      if (value) clear();
      return;
    }
    if (value?.method === 'typed' && value.name === name) return;
    sign({ method: 'typed', name, signedAt: now() });
  };

  const signed = Boolean(value);
  const strokes = value?.method === 'drawn' ? value.strokes ?? [] : [];
  const when = value ? `${formatShortDate(value.signedAt, locale)}, ${formatTime(timeOfDate(value.signedAt), false, locale)}` : '';

  return (
    <div data-slot="signature-pad" data-state={signed ? 'signed' : 'empty'} className={cn('flex w-120 max-w-full min-w-0 flex-col gap-2', className)} {...props}>
      <div
        ref={padRef}
        data-slot="signature-pad-pad"
        className={cn(
          'relative h-45 w-full overflow-hidden rounded-md border border-input bg-background transition-[box-shadow,border-color] duration-[var(--duration-fast)] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
          signed || typing ? 'border-solid' : 'border-dashed',
        )}
      >
        {/* Positions follow Figma, measured from the pad's outer edge (the border sits inside in Figma). */}
        <div className="absolute -inset-px">
          <span aria-hidden="true" data-slot="signature-pad-baseline" className="absolute inset-x-8 top-[132px] h-px bg-border" />
          <span aria-hidden="true" className="absolute top-[100px] left-8 w-4 text-2xl leading-8 font-semibold text-muted-foreground">×</span>
          {!signed && !typing ? (
            <p data-slot="signature-pad-hint" className="pointer-events-none absolute inset-x-8 bottom-[90px] line-clamp-2 text-center text-sm leading-5 text-muted-foreground">
              {hint}
            </p>
          ) : null}
          {typing ? (
            <input
              ref={inputRef}
              type="text"
              autoComplete="name"
              data-slot="signature-pad-typed"
              aria-label={t.typedName}
              placeholder={t.typedPlaceholder}
              value={typed}
              onChange={e => setTyped(e.target.value)}
              onBlur={confirmTyped}
              onKeyDown={e => {
                if (e.key === 'Enter') confirmTyped();
              }}
              className="absolute top-[84px] right-8 left-14 h-12 min-w-0 truncate bg-transparent font-serif text-3xl leading-12 text-foreground italic outline-none placeholder:text-muted-foreground"
            />
          ) : (
            <svg
              role="img"
              aria-label={signed ? (signedBy ? `${t.signature} of ${signedBy}` : t.signature) : t.pad}
              data-slot="signature-pad-canvas"
              className="absolute inset-0 size-full cursor-crosshair touch-none text-foreground"
              onPointerDown={e => {
                if (e.button !== 0) return;
                try {
                  e.currentTarget.setPointerCapture(e.pointerId);
                } catch {
                  // Synthetic pointers (tests) have no capture.
                }
                drawing.current = [point(e)];
                setLive(drawing.current);
              }}
              onPointerMove={e => {
                if (!drawing.current) return;
                drawing.current = [...drawing.current, point(e)];
                setLive(drawing.current);
              }}
              onPointerUp={endStroke}
              onPointerCancel={endStroke}
            >
              {[...strokes, ...(live ? [live] : [])].map((s, i) => (
                <path key={i} d={pathOf(s)} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
              ))}
            </svg>
          )}
        </div>
      </div>
      <div data-slot="signature-pad-footer" className="flex min-w-0 items-center gap-2">
        <p role="status" data-slot="signature-pad-note" className="min-w-0 flex-1 text-xs leading-4 text-muted-foreground">
          {signed ? t.signed(signedBy, when) : note}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            // Switching method restarts; typing moves focus into the name field.
            clear();
            focusTyped.current = !typing;
            setTyping(!typing);
          }}
        >
          {typing ? t.drawInstead : t.typeInstead}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            clear();
            if (typing) inputRef.current?.focus();
          }}
        >
          {t.clear}
        </Button>
      </div>
    </div>
  );
}

export { SignaturePad };
