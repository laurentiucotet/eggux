// EGG UI Commerce page: Product Card (126:81: vertical / horizontal / overlay; default / sale /
// sold-out; default / sm), Line Item (441:1539: cart / summary), Mini Cart (442:1446), Order Row
// (442:1551), Shipment Tracker (442:1552), Address Card (442:1657), Payment Method Card (442:1690),
// Payment Method Mark (693:105996).
// Product Card: the product name is the link (stretched over the card); wishlist (a 36 pressed
// toggle on secondary) and Add to cart stay above it. sale: destructive "-20%" badge, price in
// destructive, old price struck through with "Was" for screen readers; sold-out: secondary
// "Sold out" badge, faded photo, Notify me instead of Add to cart. horizontal: 120 photo left, no
// wishlist; overlay: name, variant and price on a media scrim over the photo, no action.
// Line Item: 72 photo (summary 56), name, variant, quantity (Number Input sm, or "Qty 2"), line
// total and Remove. Mini Cart: 360 panel with title, close, summary items, subtotal, a note and
// View cart / Checkout. Order Row: number, date · items, a soft status badge, total, chevron; the
// row is a link (selected = aria-current). Shipment Tracker: ETA, carrier and tracking number,
// Track on <carrier>, and a 4-step Stepper. Address Card: radio in checkout (selected = 2 px
// primary border), Default badge, Edit / Remove. Payment Method Card: brand mark, card and expiry
// (expired in destructive with Update), menu. Payment Method Mark: a text mark, never a logo.
import * as React from 'react';
import { ChevronRight, Ellipsis, ExternalLink, Heart, Package, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';
import { ImagePlaceholder } from './image-placeholder';
import { NumberInput } from './number-input';
import { RadioGroupItem } from './radio';
import { Separator } from './separator';
import { Stepper, type StepData } from './stepper';

/* Product Card */

export interface ProductCardProps extends Omit<React.ComponentProps<'article'>, 'children'> {
  name: string;
  href: string;
  /** "Sand · 4 colors". */
  variantText?: string;
  price: string;
  /** sale: the price before. */
  oldPrice?: string;
  /** sale: "-20%". */
  discount?: string;
  soldOut?: boolean;
  image?: string;
  imageAlt?: string;
  layout?: 'vertical' | 'horizontal' | 'overlay';
  size?: 'default' | 'sm';
  /** Wishlist toggle (vertical and overlay). */
  wished?: boolean;
  onWishChange?: (wished: boolean) => void;
  /** Add to cart (Notify me when sold out); none in overlay. */
  onAdd?: () => void;
  onNotify?: () => void;
}

const stretched = 'outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50';

function Price({ price, oldPrice, onMedia }: { price: string; oldPrice?: string; onMedia?: boolean }) {
  return (
    <p className="m-0 flex items-center gap-2 whitespace-nowrap">
      <span className={cn('text-sm leading-5 font-medium', oldPrice && !onMedia ? 'text-destructive' : onMedia ? 'text-[var(--video-foreground)]' : 'text-foreground')}>
        {oldPrice ? <span className="sr-only">Now </span> : null}{price}
      </span>
      {oldPrice ? <s className={cn('text-xs leading-4', onMedia ? 'text-[var(--video-foreground)]' : 'text-muted-foreground')}><span className="sr-only">Was </span>{oldPrice}</s> : null}
    </p>
  );
}

function ProductCard({ name, href, variantText, price, oldPrice, discount, soldOut = false, image, imageAlt = '', layout = 'vertical', size = 'default', wished, onWishChange, onAdd, onNotify, className, ...props }: ProductCardProps) {
  const sm = size === 'sm';
  const badge = soldOut ? <Badge variant="secondary">Sold out</Badge> : discount ? <Badge variant="destructive">{discount}</Badge> : null;
  const wish = layout !== 'horizontal' && onWishChange ? (
    <Button
      variant="secondary"
      size={sm ? 'icon-sm' : 'icon'}
      aria-label={`Save ${name}`}
      aria-pressed={Boolean(wished)}
      onClick={() => onWishChange(!wished)}
      className="relative z-10 shadow-xs [&_svg]:size-4"
    >
      <Heart aria-hidden="true" className={wished ? 'fill-current' : undefined} />
    </Button>
  ) : null;
  const action = soldOut
    ? (onNotify ? <Button variant="outline" size="sm" onClick={onNotify} className={cn('relative z-10', layout === 'vertical' && 'w-full')}>Notify me</Button> : null)
    : (onAdd ? <Button variant="outline" size="sm" onClick={onAdd} className={cn('relative z-10', layout === 'vertical' && 'w-full')}>Add to cart</Button> : null);
  const photo = (cls: string) => <ImagePlaceholder ratio="1:1" src={image} alt={imageAlt} showCaption={false} className={cn(cls, soldOut && 'opacity-50')} />;

  if (layout === 'overlay') {
    return (
      <article data-slot="product-card" data-layout="overlay" className={cn('relative flex h-[352px] w-[264px] min-w-40 shrink-0 flex-col justify-end overflow-hidden rounded-xl', className)} {...props}>
        {photo('absolute inset-0 size-full rounded-none')}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">{badge ?? <span />}{wish}</div>
        <div aria-hidden="true" className="relative h-12 bg-linear-to-b from-transparent to-black/60" />
        <div className="relative flex flex-col gap-1 bg-black/60 px-4 pb-4 text-[var(--video-foreground)]">
          <h3 className="m-0 truncate text-sm leading-5 font-medium"><a href={href} className={cn('text-[var(--video-foreground)] no-underline', stretched)}>{name}</a></h3>
          {variantText ? <p className="m-0 truncate text-xs leading-4">{variantText}</p> : null}
          <Price price={price} oldPrice={oldPrice} onMedia />
        </div>
      </article>
    );
  }
  if (layout === 'horizontal') {
    return (
      <article data-slot="product-card" data-layout="horizontal" className={cn('relative flex w-[400px] max-w-full min-w-40 gap-4', className)} {...props}>
        <div className="relative w-[120px] shrink-0 overflow-hidden rounded-xl">
          {photo('w-full')}
          {badge ? <div className="absolute top-3 left-3">{badge}</div> : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
          <div className="flex w-full flex-col gap-1">
            <h3 className="m-0 truncate text-sm leading-5 font-medium"><a href={href} className={cn('text-foreground no-underline', stretched)}>{name}</a></h3>
            {variantText ? <p className="m-0 truncate text-xs leading-4 text-muted-foreground">{variantText}</p> : null}
            <Price price={price} oldPrice={oldPrice} />
          </div>
          {action}
        </div>
      </article>
    );
  }
  return (
    <article data-slot="product-card" data-layout="vertical" data-size={size} className={cn('relative flex min-w-40 shrink-0 flex-col', sm ? 'w-[180px] gap-2' : 'w-[264px] gap-3', className)} {...props}>
      <div className="relative w-full overflow-hidden rounded-xl">
        {photo('w-full')}
        <div className={cn('absolute flex items-start justify-between', sm ? 'inset-x-2 top-2' : 'inset-x-3 top-3')}>{badge ?? <span />}{wish}</div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <h3 className={cn('m-0 truncate font-medium', sm ? 'text-xs leading-4' : 'text-sm leading-5')}><a href={href} className={cn('text-foreground no-underline', stretched)}>{name}</a></h3>
        {variantText ? <p className="m-0 truncate text-xs leading-4 text-muted-foreground">{variantText}</p> : null}
        <Price price={price} oldPrice={oldPrice} />
      </div>
      {action}
    </article>
  );
}

/* Line Item */

export interface LineItemProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  name: string;
  /** "Sand · M". */
  variant?: string;
  quantity: number;
  /** Line total, formatted. */
  total: string;
  image?: string;
  layout?: 'cart' | 'summary';
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  max?: number;
  /** summary: the quantity on the variant line ("Sand · M · Qty 2"), 80 high (Mini Cart). */
  inlineQuantity?: boolean;
}

function LineItem({ name, variant, quantity, total, image, layout = 'cart', onQuantityChange, onRemove, max = 99, inlineQuantity = false, className, ...props }: LineItemProps) {
  const cart = layout === 'cart';
  const inline = !cart && inlineQuantity;
  return (
    <div data-slot="line-item" data-layout={layout} className={cn('flex w-full items-start gap-3 py-3', className)} {...props}>
      <ImagePlaceholder ratio="1:1" src={image} alt="" showCaption={false} className={cn('shrink-0', cart ? 'w-[72px]' : 'w-14')} />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <p className="m-0 w-full text-sm leading-5 font-medium text-foreground">{name}</p>
        {variant || inline ? <p className="m-0 w-full text-xs leading-4 text-muted-foreground">{[variant, inline ? `Qty ${quantity}` : null].filter(Boolean).join(' · ')}</p> : null}
        {inline ? null : cart ? (
          <NumberInput
            size="sm"
            min={1}
            max={max}
            value={quantity}
            onValueChange={onQuantityChange}
            aria-label={`Quantity of ${name}`}
            decrementLabel={`Decrease quantity of ${name}`}
            incrementLabel={`Increase quantity of ${name}`}
            className="w-[116px]"
          />
        ) : <p className="m-0 text-xs leading-4 text-muted-foreground">Qty {quantity}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className="m-0 text-right text-sm leading-5 font-medium whitespace-nowrap text-foreground">{total}</p>
        {cart && onRemove ? <Button variant="link" size="sm" className="h-8" onClick={onRemove} aria-label={`Remove ${name}`}>Remove</Button> : null}
      </div>
    </div>
  );
}

/* Mini Cart */

export interface MiniCartProps extends Omit<React.ComponentProps<'section'>, 'children'> {
  items: Pick<LineItemProps, 'name' | 'variant' | 'quantity' | 'total' | 'image'>[];
  subtotal: string;
  note?: string;
  cartHref: string;
  onCheckout?: () => void;
  onClose?: () => void;
}

function MiniCart({ items, subtotal, note = 'Shipping and taxes at checkout', cartHref, onCheckout, onClose, className, ...props }: MiniCartProps) {
  const id = React.useId();
  const count = items.reduce((a, i) => a + i.quantity, 0);
  return (
    <section data-slot="mini-cart" aria-labelledby={id} className={cn('flex w-[360px] max-w-full flex-col gap-3 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg', className)} {...props}>
      <div className="flex items-center gap-2">
        <h2 id={id} className="m-0 min-w-0 flex-1 truncate text-sm leading-5 font-medium">Cart ({count} {count === 1 ? 'item' : 'items'})</h2>
        {onClose ? <Button variant="ghost" size="icon-sm" aria-label="Close cart" onClick={onClose}><X aria-hidden="true" /></Button> : null}
      </div>
      <div className="flex flex-col">
        {items.map(i => <LineItem key={i.name} layout="summary" inlineQuantity {...i} />)}
      </div>
      <Separator />
      <div className="flex items-center justify-between text-sm leading-5">
        <span className="text-foreground">Subtotal</span>
        <span className="font-medium text-foreground">{subtotal}</span>
      </div>
      <p className="m-0 text-xs leading-4 text-muted-foreground">{note}</p>
      <div className="flex gap-2">
        <Button asChild variant="outline" className="flex-1"><a href={cartHref}>View cart</a></Button>
        <Button className="flex-1" onClick={onCheckout}>Checkout</Button>
      </div>
    </section>
  );
}

/* Order Row */

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'paid' | 'refunded';

const orderBadge: Record<OrderStatus, { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> = {
  processing: { label: 'Processing', variant: 'soft-neutral' },
  shipped: { label: 'Shipped', variant: 'soft-info' },
  delivered: { label: 'Delivered', variant: 'soft-success' },
  paid: { label: 'Paid', variant: 'soft-success' },
  cancelled: { label: 'Cancelled', variant: 'soft-destructive' },
  refunded: { label: 'Refunded', variant: 'outline' },
};

export interface OrderRowProps extends Omit<React.ComponentProps<'a'>, 'children'> {
  /** "Order #10482". */
  number: string;
  /** "12 Nov 2026 · 3 items". */
  meta: string;
  status: OrderStatus;
  total: string;
  selected?: boolean;
}

function OrderRow({ number, meta, status, total, selected = false, className, ...props }: OrderRowProps) {
  const b = orderBadge[status];
  return (
    <a
      data-slot="order-row"
      data-status={status}
      aria-current={selected ? 'page' : undefined}
      className={cn(
        'flex w-full flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-4 py-3 text-foreground no-underline outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset',
        selected ? 'bg-accent' : 'hover:bg-[var(--table-row-hover)]',
        className,
      )}
      {...props}
    >
      <span className="flex min-w-40 flex-1 flex-col gap-0.5 whitespace-nowrap">
        <span className="truncate text-sm leading-5 font-medium">{number}</span>
        <span className={cn('truncate text-xs leading-4', selected ? 'text-[var(--input-filled-muted-foreground)]' : 'text-muted-foreground')}>{meta}</span>
      </span>
      <Badge variant={b.variant}>{b.label}</Badge>
      <span className="min-w-24 text-right text-sm leading-5 font-medium whitespace-nowrap">{total}</span>
      <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
    </a>
  );
}

/* Shipment Tracker */

export interface ShipmentTrackerProps extends Omit<React.ComponentProps<'section'>, 'children'> {
  /** "Arriving Thursday, 14 Nov". */
  eta: string;
  /** "DHL · 1Z999AA10123456784". */
  carrier: string;
  trackUrl?: string;
  /** "Track on DHL". */
  trackLabel?: string;
  steps: StepData[];
  /** Index of the current step. */
  current: number;
}

function ShipmentTracker({ eta, carrier, trackUrl, trackLabel = 'Track shipment', steps, current, className, ...props }: ShipmentTrackerProps) {
  const id = React.useId();
  return (
    <section data-slot="shipment-tracker" aria-labelledby={id} className={cn('flex w-[640px] max-w-full min-w-[560px] flex-col gap-5 rounded-xl border border-border bg-card p-5 text-card-foreground', className)} {...props}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Package aria-hidden="true" className="size-5 shrink-0" />
        <div className="flex min-w-40 flex-1 flex-col gap-0.5 whitespace-nowrap">
          <h3 id={id} className="m-0 truncate text-xl leading-7 font-semibold tracking-[-0.4px]">{eta}</h3>
          <p className="m-0 truncate text-xs leading-4 text-muted-foreground">{carrier}</p>
        </div>
        {trackUrl ? (
          <Button asChild variant="outline" size="sm">
            <a href={trackUrl} target="_blank" rel="noreferrer">{trackLabel}<ExternalLink aria-hidden="true" className="size-4" /><span className="sr-only"> (opens in a new tab)</span></a>
          </Button>
        ) : null}
      </div>
      <Stepper steps={steps} current={current} aria-label="Shipment progress" />
    </section>
  );
}

/* Address Card */

export interface AddressCardProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  name: string;
  /** Address lines in the country's format, then the phone. */
  lines: string[];
  isDefault?: boolean;
  /** Checkout: a radio; put the cards in a RadioGroup. */
  value?: string;
  selected?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

function AddressCard({ name, lines, isDefault = false, value, selected = false, onEdit, onRemove, className, ...props }: AddressCardProps) {
  const id = React.useId();
  return (
    <div
      data-slot="address-card"
      data-state={selected ? 'selected' : 'default'}
      className={cn('flex w-80 max-w-full items-start gap-3 rounded-xl bg-card p-4 text-card-foreground', selected ? 'border-2 border-primary' : 'border border-border', className)}
      {...props}
    >
      {value !== undefined ? <RadioGroupItem value={value} aria-labelledby={id} className="mt-0.5" /> : null}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p id={id} className="m-0 max-w-[200px] truncate text-sm leading-5 font-medium">{name}</p>
          {isDefault ? <Badge variant="secondary">Default</Badge> : null}
        </div>
        <address className="text-sm leading-5 text-muted-foreground not-italic">
          {lines.map(l => <span key={l} className="block">{l}</span>)}
        </address>
        {onEdit || onRemove ? (
          <div className="flex gap-3">
            {onEdit ? <Button variant="link" size="sm" className="h-8" onClick={onEdit} aria-label={`Edit address of ${name}`}>Edit</Button> : null}
            {onRemove ? <Button variant="link" size="sm" className="h-8" onClick={onRemove} aria-label={`Remove address of ${name}`}>Remove</Button> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* Payment Method Mark and Card */

function PaymentMethodMark({ name, className, ...props }: { name: string } & React.ComponentProps<'span'>) {
  return (
    <span data-slot="payment-method-mark" className={cn('inline-flex h-6 min-w-10 items-center justify-center rounded-sm border border-border bg-card px-2 text-xs leading-4 font-medium whitespace-nowrap text-card-foreground', className)} {...props}>
      {name}
    </span>
  );
}

export interface PaymentMethodCardProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Text mark: "VISA". */
  brand: string;
  /** "Visa ending in 4242". */
  label: string;
  /** "Expires 08/28" or, when expired, "Expired 08/25". */
  expiry: string;
  expired?: boolean;
  isDefault?: boolean;
  onUpdate?: () => void;
  /** Dropdown Menu items: Make default, Remove. */
  menu?: React.ReactNode;
}

function PaymentMethodCard({ brand, label, expiry, expired = false, isDefault = false, onUpdate, menu, className, ...props }: PaymentMethodCardProps) {
  return (
    <div data-slot="payment-method-card" data-state={expired ? 'expired' : 'default'} className={cn('flex w-[400px] max-w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-card-foreground', className)} {...props}>
      <span aria-hidden="true" className="flex h-[30px] w-11 shrink-0 items-center justify-center rounded-sm border border-border text-xs leading-4 font-medium">{brand}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
        <p className="m-0 flex items-center gap-2 text-sm leading-5 font-medium"><span className="truncate">{label}</span>{isDefault ? <Badge variant="secondary">Default</Badge> : null}</p>
        <p className={cn('m-0 truncate text-xs leading-4', expired ? 'text-destructive' : 'text-muted-foreground')}>{expiry}</p>
      </div>
      {expired && onUpdate ? <Button variant="outline" size="sm" onClick={onUpdate} aria-label={`Update ${label}`}>Update</Button> : null}
      {menu ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`More actions for ${label}`}><Ellipsis aria-hidden="true" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}

export { AddressCard, LineItem, MiniCart, OrderRow, PaymentMethodCard, PaymentMethodMark, ProductCard, ShipmentTracker };
