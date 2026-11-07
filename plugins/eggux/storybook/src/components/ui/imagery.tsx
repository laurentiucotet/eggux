// EGG UI Image page. Figma: Image page.
// - Map View (Figma "Map"): map placeholder with roads, water and parks, a centered pin with the
//   place and address, zoom controls and the attribution. Pass `src` for a static map image. Pair it
//   with the written address.
// - Image Cropper: crop, zoom and rotate before upload. The selection (square or circle, 220) stays
//   centered; drag or arrow keys move the image, the slider or +/- zoom, Rotate turns it 90°.
// - Avatar Upload: avatar (circle for a person, square for a logo), Label, Hint, Upload/Change and
//   Remove. State empty, filled, uploading (progress and Cancel), error (says what to fix).
// - Image Compare Slider: before and after with a handle; drag or arrow keys move it.
// - Device Frame: a browser window (address bar) or a phone around a screenshot.
// - Image Figure: an image with a caption and an optional credit (figure and figcaption).
// The Map drawing uses the Figma assets in src/assets/map as masks, colored with theme tokens.
import * as React from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Lock, MapPin, Minus, Plus, RefreshCw, Upload } from '@/components/icons';
import { cn } from '@/lib/utils';
import parkA from '@/assets/map/park-1.svg';
import parkB from '@/assets/map/park-2.svg';
import roadsMinor from '@/assets/map/roads-1.svg';
import roadsMajor from '@/assets/map/roads-2.svg';
import water from '@/assets/map/water.svg';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { ImagePlaceholder, type ImageRatio } from './image-placeholder';
import { Slider } from './slider';
import { Spinner } from './spinner';

/* Map View */

function MapShape({ src, inset, className }: { src: string; inset: string; className: string }) {
  const mask = `url("${src}")`;
  return (
    <span
      aria-hidden="true"
      className={cn('pointer-events-none absolute', className)}
      style={{ inset, maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat' }}
    />
  );
}

export interface MapViewProps extends React.ComponentProps<'div'> {
  /** Figma Label: the place name over the pin. */
  label?: string;
  /** The written address under the label (truncates; give it in full nearby too). */
  address?: string;
  /** Figma Show pin. */
  showPin?: boolean;
  /** Figma Show label. */
  showLabel?: boolean;
  /** Figma Show controls: zoom in and out. */
  showControls?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  /** A static map image (Mapbox, Google) that replaces the drawn placeholder. */
  src?: string;
  /** Map data credit, bottom right. */
  attribution?: string;
}

function MapView({
  label = 'Acme HQ',
  address,
  showPin = true,
  showLabel = true,
  showControls = true,
  onZoomIn,
  onZoomOut,
  src,
  attribution = 'Map data © OpenStreetMap',
  className,
  children,
  ...props
}: MapViewProps) {
  return (
    <div data-slot="map" className={cn('relative aspect-video w-180 max-w-full overflow-clip rounded-xl bg-muted', className)} {...props}>
      {src ? (
        <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <>
          <MapShape src={water} inset="-29.63% -23.61% 55.56% 65.28%" className="bg-primary" />
          <MapShape src={parkA} inset="29.63% 63.89% 38.27% 8.33%" className="bg-success" />
          <MapShape src={parkB} inset="69.14% 0 3.7% 77.78%" className="bg-success" />
          <MapShape src={roadsMinor} inset="-0.62% -0.35%" className="bg-background" />
          <MapShape src={roadsMajor} inset="-1.48% -0.83%" className="bg-background" />
        </>
      )}
      {children}
      {showPin ? (
        <div data-slot="map-pin" className="absolute top-[calc(50%-14.5px)] left-[calc(50%-19.5px)] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          {showLabel ? (
            <div className="flex max-w-48 min-w-0 flex-col gap-0.5 rounded-md border border-border bg-popover px-3 py-2 text-popover-foreground shadow-md">
              <p className="m-0 truncate text-sm leading-5 font-medium">{label}</p>
              {address ? <p className="m-0 w-[166px] max-w-full truncate text-xs leading-4 text-muted-foreground" title={address}>{address}</p> : null}
            </div>
          ) : null}
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md">
            <MapPin aria-hidden="true" className="size-5" />
            {!showLabel ? <span className="sr-only">{label}</span> : null}
          </span>
        </div>
      ) : null}
      {showControls ? (
        <div data-slot="map-controls" className="absolute top-4 right-4 flex flex-col overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md">
          {[
            { label: 'Zoom in', icon: Plus, onClick: onZoomIn },
            { label: 'Zoom out', icon: Minus, onClick: onZoomOut },
          ].map(({ label: l, icon: Icon, onClick }) => (
            <button key={l} type="button" aria-label={l} onClick={onClick} className="flex size-8 items-center justify-center outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset">
              <Icon aria-hidden="true" className="size-4" />
            </button>
          ))}
        </div>
      ) : null}
      {attribution ? <p className="absolute right-2 bottom-2 m-0 rounded-sm bg-background/80 px-1.5 py-0.5 text-xs leading-4 whitespace-nowrap text-muted-foreground">{attribution}</p> : null}
    </div>
  );
}

/* Image Cropper */

export interface CropValue {
  /** Image offset from the center, in px. */
  x: number;
  y: number;
  /** 1 to 3. */
  zoom: number;
  /** 0, 90, 180 or 270. */
  rotation: number;
}

export interface ImageCropperProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** The image to crop. Without it the area is muted. */
  src?: string;
  /** Figma Shape: circle for avatars, square for logos and covers. */
  shape?: 'square' | 'circle';
  /** Name of the crop area for screen readers. */
  label?: string;
  onCancel?: () => void;
  onSave?: (crop: CropValue) => void;
}

function ImageCropper({ src, shape = 'square', label = 'Crop area', onCancel, onSave, className, ...props }: ImageCropperProps) {
  const [zoomPct, setZoomPct] = React.useState(50);
  const [rotation, setRotation] = React.useState(0);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const drag = React.useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const zoom = 1 + zoomPct / 50;

  function onKeyDown(e: React.KeyboardEvent) {
    const step = e.shiftKey ? 40 : 10;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      const [dx, dy] = moves[e.key];
      setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      setZoomPct((z) => Math.min(100, z + 10));
    } else if (e.key === '-') {
      e.preventDefault();
      setZoomPct((z) => Math.max(0, z - 10));
    }
  }

  return (
    <div data-slot="image-cropper" data-shape={shape} className={cn('flex w-120 max-w-full min-w-80 flex-col gap-4', className)} {...props}>
      <div
        role="group"
        aria-label={`${label}. Drag or use the arrow keys to move the image, plus and minus to zoom.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (d) setOffset({ x: d.ox + e.clientX - d.x, y: d.oy + e.clientY - d.y });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        data-slot="image-cropper-area"
        className="relative h-80 w-full cursor-move touch-none overflow-clip rounded-md bg-muted outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <div
          data-slot="image-cropper-image"
          className="absolute inset-0 bg-muted"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)` }}
        >
          {src ? <img src={src} alt="" draggable={false} className="size-full object-cover" /> : null}
        </div>
        <div
          aria-hidden="true"
          data-slot="image-cropper-selection"
          className={cn(
            'pointer-events-none absolute top-1/2 left-1/2 size-55 -translate-x-1/2 -translate-y-1/2 overflow-hidden border-2 border-white shadow-[0_0_0_9999px_rgb(0_0_0/0.6)]',
            shape === 'circle' ? 'rounded-full' : '',
          )}
        >
          <span className="absolute inset-y-0 left-[calc(33.333%-1px)] w-px bg-white/30" />
          <span className="absolute inset-y-0 left-[calc(66.667%-1px)] w-px bg-white/30" />
          <span className="absolute inset-x-0 top-[calc(33.333%-1px)] h-px bg-white/30" />
          <span className="absolute inset-x-0 top-[calc(66.667%-1px)] h-px bg-white/30" />
        </div>
      </div>
      <div data-slot="image-cropper-zoom" className="flex w-full items-center gap-3">
        <Minus aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        <Slider className="min-w-0 flex-1" value={[zoomPct]} onValueChange={([v]) => setZoomPct(v)} thumbLabels={['Zoom']} formatValue={(v) => `${Math.round((1 + v / 50) * 100)}%`} />
        <Plus aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        <ButtonIcon variant="outline" icon={<RefreshCw />} label="Rotate 90°" onClick={() => setRotation((r) => (r + 90) % 360)} />
      </div>
      <div className="flex w-full justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={() => onSave?.({ ...offset, zoom, rotation })}>
          Save
        </Button>
      </div>
    </div>
  );
}

/* Avatar Upload */

export type AvatarUploadState = 'empty' | 'filled' | 'uploading' | 'error';

export interface AvatarUploadProps extends React.ComponentProps<'div'> {
  /** Figma State. */
  state?: AvatarUploadState;
  /** Figma Shape: circle for a person, square for a workspace or company logo. */
  shape?: 'circle' | 'square';
  /** Figma Label; Show label hides it visually (it stays the group name). */
  label?: string;
  showLabel?: boolean;
  /** Figma Hint: the upload rules. */
  hint?: string;
  /** State=error: what to fix. */
  error?: string;
  /** State=uploading: 0 to 100. */
  progress?: number;
  /** Two letters shown when there is no photo. */
  initials?: string;
  /** State=filled: the photo or logo. Without it, filled shows the initials (on the brand color when square). */
  src?: string;
  /** Figma Show remove (empty and filled). */
  showRemove?: boolean;
  /** Accepted file types for the picker. */
  accept?: string;
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
  onCancel?: () => void;
}

function AvatarUpload({
  state = 'empty',
  shape = 'circle',
  label = 'Profile photo',
  showLabel = true,
  hint = 'JPG or PNG, at least 256 × 256 px, up to 5 MB.',
  error,
  progress = 0,
  initials = 'AP',
  src,
  showRemove = false,
  accept = 'image/png,image/jpeg',
  onFileSelect,
  onRemove,
  onCancel,
  className,
  ...props
}: AvatarUploadProps) {
  const id = React.useId();
  const input = React.useRef<HTMLInputElement>(null);
  const filled = state === 'filled';
  const brandLogo = filled && shape === 'square' && !src;
  return (
    <div role="group" aria-labelledby={`${id}-label`} data-slot="avatar-upload" data-state={state} data-shape={shape} className={cn('flex items-center gap-4', className)} {...props}>
      <Avatar
        size="xl"
        shape={shape}
        initials={initials}
        src={filled ? src : undefined}
        className={cn(state === 'uploading' && '[&_[data-slot=avatar-image]]:opacity-50 [&_[data-slot=avatar-surface]]:bg-muted/50', brandLogo && '[&_[data-slot=avatar-surface]]:bg-primary [&_[data-slot=avatar-surface]]:text-primary-foreground')}
      />
      <div className="flex w-70 max-w-full min-w-0 flex-col gap-1">
        <p id={`${id}-label`} className={cn('m-0 text-sm leading-5 font-medium text-foreground', !showLabel && 'sr-only')}>
          {label}
        </p>
        {state === 'uploading' ? (
          <p className="m-0 text-sm leading-5 text-muted-foreground" role="status">
            Uploading… {Math.round(progress)}%
          </p>
        ) : state === 'error' ? (
          <p id={`${id}-hint`} className="m-0 text-sm leading-5 text-destructive" role="alert">
            {error ?? 'The image could not be uploaded. Try again.'}
          </p>
        ) : (
          <p id={`${id}-hint`} className="m-0 text-sm leading-5 text-muted-foreground">
            {hint}
          </p>
        )}
        <div className="flex items-center gap-2">
          {state === 'uploading' ? (
            <>
              <Spinner size="sm" />
              <Button variant="ghost" size="sm" onClick={onCancel} aria-label={`Cancel upload of ${label.toLowerCase()}`}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <input
                ref={input}
                type="file"
                accept={accept}
                tabIndex={-1}
                aria-hidden="true"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileSelect?.(file);
                  e.target.value = '';
                }}
              />
              <Button variant="outline" size="sm" leadingIcon={<Upload />} aria-describedby={`${id}-label ${id}-hint`} onClick={() => input.current?.click()}>
                {filled ? 'Change' : 'Upload'}
              </Button>
              {showRemove && state !== 'error' ? (
                <Button variant="ghost" size="sm" aria-describedby={`${id}-label`} onClick={onRemove}>
                  Remove
                </Button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* Image Compare Slider */

function CompareHint({ text, className }: { text: string; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('absolute inset-y-0 flex flex-col items-center justify-center gap-2 overflow-clip', className)}>
      <ImageIcon aria-hidden="true" className="size-6" />
      <p className="m-0 text-xs leading-4 whitespace-nowrap">{text}</p>
    </div>
  );
}

export interface ImageCompareSliderProps extends Omit<React.ComponentProps<'div'>, 'defaultValue'> {
  /** The before image; without it a muted placeholder with a hint. */
  before?: React.ReactNode;
  /** The after image; without it a darker placeholder with a hint. */
  after?: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  /** Handle position, 0 to 100 (percent from the left). */
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Accessible name of the handle. */
  label?: string;
}

function ImageCompareSlider({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  value,
  defaultValue = 50,
  onValueChange,
  label = 'Compare before and after',
  className,
  ...props
}: ImageCompareSliderProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const pos = value ?? inner;
  const root = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);
  const set = (v: number) => {
    const next = Math.max(0, Math.min(100, Math.round(v)));
    setInner(next);
    onValueChange?.(next);
  };
  const fromPointer = (clientX: number) => {
    const r = root.current?.getBoundingClientRect();
    if (r && r.width) set(((clientX - r.left) / r.width) * 100);
  };
  function onKeyDown(e: React.KeyboardEvent) {
    const step = e.shiftKey ? 10 : 2;
    const next: Record<string, number> = { ArrowLeft: pos - step, ArrowDown: pos - step, ArrowRight: pos + step, ArrowUp: pos + step, Home: 0, End: 100, PageDown: pos - 10, PageUp: pos + 10 };
    if (e.key in next) {
      e.preventDefault();
      set(next[e.key]);
    }
  }
  return (
    <div
      ref={root}
      data-slot="image-compare-slider"
      className={cn('relative aspect-video w-160 max-w-full touch-none overflow-clip rounded-xl bg-muted select-none', className)}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        fromPointer(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      {...props}
    >
      <div data-slot="image-compare-before" className="absolute inset-0 overflow-clip bg-muted text-muted-foreground [&>img]:size-full [&>img]:object-cover">
        {before ?? <CompareHint text="Before image" className="right-1/2 left-0" />}
      </div>
      <div data-slot="image-compare-after" className="absolute inset-0 overflow-clip bg-border text-foreground/70 [&>img]:size-full [&>img]:object-cover" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        {after ?? <CompareHint text="After image" className="right-0 left-1/2" />}
      </div>
      <span aria-hidden="true" className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-background" style={{ left: `${pos}%` }} />
      <span
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pos}
        aria-valuetext={`${pos}% ${beforeLabel.toLowerCase()}, ${100 - pos}% ${afterLabel.toLowerCase()}`}
        onKeyDown={onKeyDown}
        data-slot="image-compare-handle"
        className="absolute top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-background text-foreground shadow-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        style={{ left: `${pos}%` }}
      >
        <ChevronLeft aria-hidden="true" className="size-3.5" />
        <ChevronRight aria-hidden="true" className="size-3.5" />
      </span>
      <Badge variant="secondary" className="absolute top-3 left-3 max-w-[min(16rem,calc(50%-30px))]">
        <span className="truncate">{beforeLabel}</span>
      </Badge>
      <Badge variant="secondary" className="absolute top-3 right-3 max-w-[min(16rem,calc(50%-30px))]">
        <span className="truncate">{afterLabel}</span>
      </Badge>
    </div>
  );
}

/* Device Frame */

export interface DeviceFrameProps extends React.ComponentProps<'div'> {
  /** Figma Device. */
  device?: 'browser' | 'phone';
  /** Figma Address (browser): the URL in the address bar. */
  address?: string;
}

function DeviceFrame({ device = 'browser', address = 'app.acme.com/invoices', className, children, ...props }: DeviceFrameProps) {
  if (device === 'phone') {
    return (
      <div data-slot="device-frame" data-device="phone" className={cn('flex w-[390px] max-w-full flex-col overflow-clip rounded-[44px] border-8 border-foreground bg-background p-2 shadow-xl', className)} {...props}>
        <div data-slot="device-frame-screen" className="flex w-full flex-col items-center overflow-clip rounded-[36px]">
          {children ?? <ImagePlaceholder ratio="9:16" className="aspect-auto h-[812px]" />}
        </div>
      </div>
    );
  }
  return (
    <div data-slot="device-frame" data-device="browser" className={cn('flex w-240 max-w-full flex-col overflow-clip rounded-xl border border-border bg-background shadow-xl', className)} {...props}>
      <div data-slot="device-frame-chrome" className="flex w-full items-center gap-3 border-b border-border bg-muted px-4 py-2">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-background px-3 py-1">
          <Lock aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />
          <p className="m-0 min-w-0 flex-1 truncate text-xs leading-4 text-muted-foreground">{address}</p>
        </div>
      </div>
      <div data-slot="device-frame-screen" className="flex w-full flex-col items-center">
        {children ?? <ImagePlaceholder ratio="16:9" />}
      </div>
    </div>
  );
}

/* Image Figure */

export interface ImageFigureProps extends React.ComponentProps<'figure'> {
  /** Image Placeholder Ratio. */
  ratio?: ImageRatio;
  /** The photo URL; without it the placeholder shows. */
  src?: string;
  /** Alt text of the photo; the caption does not replace it. */
  alt?: string;
  /** What or where it is, one line. */
  caption: React.ReactNode;
  /** Figma Show credit: photographer or source. */
  credit?: React.ReactNode;
}

function ImageFigure({ ratio = '4:3', src, alt = '', caption, credit, className, ...props }: ImageFigureProps) {
  return (
    <figure data-slot="image-figure" className={cn('m-0 flex w-full flex-col gap-2', className)} {...props}>
      <ImagePlaceholder ratio={ratio} src={src} alt={alt} showCaption={false} className="rounded-lg" />
      <figcaption className="flex flex-col gap-2">
        <span className="text-sm leading-5 text-muted-foreground">{caption}</span>
        {credit ? <span className="text-xs leading-4 text-muted-foreground">{credit}</span> : null}
      </figcaption>
    </figure>
  );
}

export { AvatarUpload, DeviceFrame, ImageCompareSlider, ImageCropper, ImageFigure, MapView };
