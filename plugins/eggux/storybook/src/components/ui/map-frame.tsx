// EGG UI Map Frame. Code only (no Figma component yet). A drawn placeholder map for store and place
// pickers: a grid, a river, a park and roads as SVG shapes in theme tokens (no tiles, no network),
// numbered pins as buttons, zoom buttons, a card for the selected pin and a "List view" toggle that
// swaps the map for a list of the same places (every pin has a list row). Keyboard: Tab goes through
// the pins; with the map focused the arrow keys pan and + / - zoom; zoom and Recenter are buttons
// too, so no gesture is pointer only. Pin positions are in map units 0 to 100 on both axes; swap the
// drawing for a real map later and keep the pins, the card and the list. Use Map View (Image page)
// for a single static place. Built on Button Icon and Toggle Group.
import * as React from 'react';
import { List as ListIcon, Minus, Plus, RefreshCw, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

export interface MapFramePin {
  id: string;
  name: string;
  /** Shown on the card and in the list. */
  address?: string;
  /** Position on the map, 0 to 100. */
  x: number;
  y: number;
}

export interface MapFrameProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  pins: MapFramePin[];
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedChange?: (id: string | null) => void;
  /** map or list (the fallback). */
  view?: 'map' | 'list';
  defaultView?: 'map' | 'list';
  onViewChange?: (view: 'map' | 'list') => void;
  defaultZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  /** Accessible name of the map. */
  label?: string;
  /** The Map / List view toggle above the map. Default true. */
  showViewToggle?: boolean;
  /** Actions in the selected card (Directions, Choose this store). */
  cardActions?: (pin: MapFramePin) => React.ReactNode;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const round = (n: number) => Math.round(n * 10) / 10;
const pinButton =
  'absolute z-10 flex size-8 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full border-2 border-background text-xs leading-4 font-semibold shadow-md outline-none transition-transform duration-[var(--duration-fast)] focus-visible:ring-[3px] focus-visible:ring-ring motion-reduce:transition-none';

function MapDrawing({ zoom, cx, cy }: { zoom: number; cx: number; cy: number }) {
  const transform = `translate(50 50) scale(${zoom}) translate(${-cx} ${-cy})`;
  const line = { vectorEffect: 'non-scaling-stroke' } as const;
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
      <g transform={transform}>
        <path d="M10 0V100M20 0V100M30 0V100M40 0V100M50 0V100M60 0V100M70 0V100M80 0V100M90 0V100M0 10H100M0 20H100M0 30H100M0 40H100M0 50H100M0 60H100M0 70H100M0 80H100M0 90H100" fill="none" strokeWidth={1} opacity={0.5} style={{ ...line, stroke: 'var(--border)' }} />
        <path d="M58 6H88V28H58Z" style={{ fill: 'var(--badge-soft-success-bg)' }} />
        <path d="M6 58H24V74H6Z" style={{ fill: 'var(--badge-soft-success-bg)' }} />
        <path d="M0 80C16 72 30 92 52 84S84 70 100 78V100H0Z" style={{ fill: 'var(--badge-soft-info-bg)' }} />
        <path d="M0 40C25 38 40 48 60 44S85 30 100 34" fill="none" strokeWidth={11} style={{ ...line, stroke: 'var(--border)' }} />
        <path d="M0 40C25 38 40 48 60 44S85 30 100 34" fill="none" strokeWidth={8} style={{ ...line, stroke: 'var(--background)' }} />
        <path d="M44 0C46 25 40 60 48 100" fill="none" strokeWidth={9} style={{ ...line, stroke: 'var(--border)' }} />
        <path d="M44 0C46 25 40 60 48 100" fill="none" strokeWidth={6} style={{ ...line, stroke: 'var(--background)' }} />
        <path d="M20 0V70M72 0V100M0 14H100M0 66H40M60 60H100" fill="none" strokeWidth={4} style={{ ...line, stroke: 'var(--background)' }} />
      </g>
    </svg>
  );
}

function MapFrame({
  pins,
  selectedId: selectedProp,
  defaultSelectedId = null,
  onSelectedChange,
  view: viewProp,
  defaultView = 'map',
  onViewChange,
  defaultZoom = 1,
  minZoom = 1,
  maxZoom = 4,
  label = 'Store map',
  showViewToggle = true,
  cardActions,
  className,
  ...props
}: MapFrameProps) {
  const [innerSelected, setInnerSelected] = React.useState<string | null>(defaultSelectedId);
  const [innerView, setInnerView] = React.useState<'map' | 'list'>(defaultView);
  const [zoom, setZoom] = React.useState(clamp(defaultZoom, minZoom, maxZoom));
  const [center, setCenter] = React.useState({ x: 50, y: 50 });
  const selectedId = selectedProp === undefined ? innerSelected : selectedProp;
  const view = viewProp ?? innerView;
  const selected = pins.find(p => p.id === selectedId) ?? null;
  const half = 50 / zoom;

  const limit = (x: number, y: number, z: number) => ({ x: clamp(x, 50 / z, 100 - 50 / z), y: clamp(y, 50 / z, 100 - 50 / z) });
  const select = (id: string | null) => {
    if (selectedProp === undefined) setInnerSelected(id);
    onSelectedChange?.(id);
    const pin = pins.find(p => p.id === id);
    if (pin) setCenter(limit(pin.x, pin.y, zoom));
  };
  const changeView = (next: 'map' | 'list') => {
    if (viewProp === undefined) setInnerView(next);
    onViewChange?.(next);
  };
  const changeZoom = (next: number) => {
    const z = clamp(next, minZoom, maxZoom);
    setZoom(z);
    setCenter(c => limit(c.x, c.y, z));
  };
  const pan = (dx: number, dy: number) => setCenter(c => limit(c.x + dx, c.y + dy, zoom));
  const moved = zoom !== clamp(defaultZoom, minZoom, maxZoom) || center.x !== 50 || center.y !== 50;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 25 / zoom;
    const keys: Record<string, () => void> = {
      ArrowLeft: () => pan(-step, 0),
      ArrowRight: () => pan(step, 0),
      ArrowUp: () => pan(0, -step),
      ArrowDown: () => pan(0, step),
      '+': () => changeZoom(zoom + 1),
      '=': () => changeZoom(zoom + 1),
      '-': () => changeZoom(zoom - 1),
      _: () => changeZoom(zoom - 1),
    };
    const action = keys[e.key];
    if (!action || e.altKey || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    action();
  };

  const visible = pins.filter(p => Math.abs(p.x - center.x) <= half && Math.abs(p.y - center.y) <= half);

  return (
    <div data-slot="map-frame" className={cn('flex w-full min-w-0 flex-col gap-2', className)} {...props}>
      {showViewToggle ? (
        <div className="flex min-w-0 items-center justify-between gap-2">
          <p className="m-0 min-w-0 truncate text-sm font-medium">{label}</p>
          <ToggleGroup type="single" variant="segmented" size="sm" aria-label="Map or list" value={view} onValueChange={v => changeView(v as 'map' | 'list')}>
            <ToggleGroupItem value="map" label="Map" />
            <ToggleGroupItem value="list" label="List view" icon={<ListIcon aria-hidden="true" />} />
          </ToggleGroup>
        </div>
      ) : null}

      {view === 'map' ? (
        <div
          role="group"
          tabIndex={0}
          aria-roledescription="map"
          aria-label={`${label}. Tab to reach the places, arrow keys pan, plus and minus zoom.`}
          data-center={`${round(center.x)},${round(center.y)}`}
          data-zoom={zoom}
          onKeyDown={onKeyDown}
          className="relative h-72 min-h-64 w-full overflow-hidden rounded-lg border border-border bg-muted outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <MapDrawing zoom={zoom} cx={center.x} cy={center.y} />
          {visible.map(pin => {
            const index = pins.indexOf(pin);
            const isSelected = pin.id === selectedId;
            return (
              <button
                key={pin.id}
                type="button"
                data-pin={pin.id}
                aria-pressed={isSelected}
                aria-label={`${index + 1}, ${pin.name}`}
                onClick={() => select(isSelected ? null : pin.id)}
                style={{ left: `${50 + (pin.x - center.x) * zoom}%`, top: `${50 + (pin.y - center.y) * zoom}%` }}
                className={cn(pinButton, isSelected ? 'z-20 scale-125 bg-foreground text-background' : 'bg-primary text-primary-foreground')}
              >
                {index + 1}
              </button>
            );
          })}
          <div className="absolute top-2 right-2 z-30 flex flex-col gap-1">
            <ButtonIcon variant="outline" size="sm" icon={<Plus />} label="Zoom in" tooltipSide="left" disabled={zoom >= maxZoom} onClick={() => changeZoom(zoom + 1)} />
            <ButtonIcon variant="outline" size="sm" icon={<Minus />} label="Zoom out" tooltipSide="left" disabled={zoom <= minZoom} onClick={() => changeZoom(zoom - 1)} />
            {moved ? (
              <ButtonIcon
                variant="outline"
                size="sm"
                icon={<RefreshCw />}
                label="Recenter map"
                tooltipSide="left"
                onClick={() => {
                  setZoom(clamp(defaultZoom, minZoom, maxZoom));
                  setCenter({ x: 50, y: 50 });
                }}
              />
            ) : null}
          </div>
          {selected ? (
            <div role="group" aria-label="Selected place" data-slot="map-frame-card" className="absolute inset-x-2 bottom-2 z-30 flex min-w-0 items-start gap-2 rounded-lg border border-border bg-card p-3 text-card-foreground shadow-md">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="min-w-0">
                  <p className="m-0 truncate text-sm leading-5 font-semibold">{selected.name}</p>
                  {selected.address ? <p className="m-0 truncate text-xs leading-4 text-muted-foreground">{selected.address}</p> : null}
                </div>
                {cardActions ? <div className="flex min-w-0 flex-wrap gap-2">{cardActions(selected)}</div> : null}
              </div>
              <ButtonIcon variant="ghost" size="xs" icon={<X />} label="Close place card" onClick={() => select(null)} />
            </div>
          ) : null}
          <p role="status" className="sr-only">
            Zoom {zoom} of {maxZoom}. Showing {visible.length} of {pins.length} places.
          </p>
        </div>
      ) : (
        <ul data-slot="map-frame-list" aria-label={`${label}, list of places`} className="m-0 flex max-h-72 min-h-64 w-full list-none flex-col overflow-y-auto rounded-lg border border-border bg-card p-1">
          {pins.map((pin, index) => {
            const isSelected = pin.id === selectedId;
            return (
              <li key={pin.id} className="min-w-0">
                <button
                  type="button"
                  aria-current={isSelected || undefined}
                  onClick={() => select(isSelected ? null : pin.id)}
                  className={cn('flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-md p-2 text-left outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50', isSelected && 'bg-accent')}
                >
                  <span aria-hidden="true" className={cn('flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold', isSelected ? 'bg-foreground text-background' : 'bg-primary text-primary-foreground')}>
                    {index + 1}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm leading-5 font-medium">{pin.name}</span>
                    {pin.address ? <span className={cn('truncate text-xs leading-4', isSelected ? 'text-foreground' : 'text-muted-foreground')}>{pin.address}</span> : null}
                  </span>
                </button>
                {isSelected && cardActions ? <div className="flex min-w-0 flex-wrap gap-2 px-2 pb-2 pl-11">{cardActions(pin)}</div> : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export { MapFrame };
