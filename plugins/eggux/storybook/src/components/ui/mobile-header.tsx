// EGG UI Mobile Header. Figma: Mobile Header (Mobile page, "Mobile Header / Component"). Type (app,
// detail, brand, search) x Size (default, large); Title, Logo; slots Leading, Trailing. The top bar
// of a mobile screen under 768 px: 56 high, border on the bottom. app = menu + page title + trailing
// actions; detail = back + object title + actions; brand = the Logo on entry screens (sign in, sign
// up), nothing to go back to; search = back + Search Field + Cancel. Size=large keeps the bar and moves
// the title under it (heading/h2, up to 2 lines) for the top of a list; switch to default when the
// list scrolls. The title is the page heading (h1). Touch targets are at least 44 x 44. Add the
// safe-area inset on top with `safeArea`.
import * as React from 'react';
import { ArrowLeft, Menu } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Logo } from './logo';
import { SearchField } from './search-field';

export type MobileHeaderType = 'app' | 'detail' | 'brand' | 'search';
export type MobileHeaderSize = 'default' | 'large';

export interface MobileHeaderProps extends Omit<React.ComponentProps<'header'>, 'title'> {
  /** Figma Type. Default app. */
  type?: MobileHeaderType;
  /** Figma Size: large moves the title under the bar (app and detail only). Default default. */
  size?: MobileHeaderSize;
  /** Figma Title: the page or object name, one line in the bar, up to two lines when large. */
  title?: string;
  /** Slot Leading. Default: a menu button (app) or a back button (detail, search); hidden in brand. */
  leading?: React.ReactNode;
  /** Slot Trailing: notifications and an Avatar, or actions. In search it is replaced by Cancel. */
  trailing?: React.ReactNode;
  /** Figma Logo (Type=brand): a Logo, linked to home. Default the Acme full logo. */
  logo?: React.ReactNode;
  /** Link of the brand Logo. Default "#home". */
  logoHref?: string;
  /** Type=search: placeholder of the field ("Search customers"). */
  searchPlaceholder?: string;
  /** Type=search: the query (controlled). */
  query?: string;
  /** Type=search: every change of the query. */
  onQueryChange?: (query: string) => void;
  /** Type=search: Cancel returns to the list and clears the query. */
  onCancel?: () => void;
  cancelLabel?: string;
  /** Accessible name of the default menu button. */
  menuLabel?: string;
  /** Accessible name of the default back button, naming the destination ("Back to customers"). */
  backLabel?: string;
  onMenu?: () => void;
  onBack?: () => void;
  /** Add the top safe-area inset (notch) above the bar. Default false. */
  safeArea?: boolean;
}

const touch = 'min-h-11 min-w-11';

function MobileHeader({
  type = 'app',
  size = 'default',
  title = 'Customers',
  leading,
  trailing,
  logo,
  logoHref = '#home',
  searchPlaceholder = 'Search customers',
  query,
  onQueryChange,
  onCancel,
  cancelLabel = 'Cancel',
  menuLabel = 'Open menu',
  backLabel = 'Back to customers',
  onMenu,
  onBack,
  safeArea = false,
  className,
  ...props
}: MobileHeaderProps) {
  const large = size === 'large' && (type === 'app' || type === 'detail');
  const backButton = <ButtonIcon variant="ghost" icon={<ArrowLeft />} label={backLabel} className={touch} showTooltip={false} onClick={onBack} />;
  const leadingNode =
    type === 'brand'
      ? null
      : (leading ?? (type === 'app' ? <ButtonIcon variant="ghost" icon={<Menu />} label={menuLabel} className={touch} showTooltip={false} onClick={onMenu} /> : backButton));

  return (
    <header
      data-slot="mobile-header"
      data-type={type}
      data-size={large ? 'large' : 'default'}
      className={cn('flex w-full flex-col border-b border-border bg-background text-foreground', !large && 'h-14', safeArea && 'pt-[env(safe-area-inset-top)]', className)}
      {...props}
    >
      <div className={cn('flex min-w-0 items-center gap-2 px-2', large ? 'h-14 shrink-0' : 'min-h-0 flex-1')}>
        {leadingNode ? <div data-slot="mobile-header-leading" className="flex shrink-0 items-center">{leadingNode}</div> : null}
        {type === 'brand' ? (
          <a href={logoHref} className="ml-2 inline-flex min-w-0 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
            {logo ?? <Logo type="full" name="Acme" />}
          </a>
        ) : type === 'search' ? (
          <div className="min-w-0 flex-1">
            <SearchField placeholder={searchPlaceholder} showShortcut={false} value={query} onValueChange={onQueryChange} autoFocus />
          </div>
        ) : large ? (
          <div className="flex-1" />
        ) : (
          <h1 className="m-0 min-w-0 flex-1 truncate text-lg leading-7 font-semibold">{title}</h1>
        )}
        {type === 'search' ? (
          <Button type="button" variant="ghost" className={cn(touch, 'shrink-0')} onClick={onCancel}>{cancelLabel}</Button>
        ) : type === 'brand' ? (
          <div data-slot="mobile-header-trailing" className="ml-auto flex shrink-0 items-center gap-1">{trailing}</div>
        ) : trailing ? (
          <div data-slot="mobile-header-trailing" className="flex shrink-0 items-center gap-1">{trailing}</div>
        ) : null}
      </div>
      {large ? <h1 className="m-0 line-clamp-2 px-4 pt-1 pb-3 text-2xl leading-8 font-semibold tracking-[-0.4px]">{title}</h1> : null}
    </header>
  );
}

export { MobileHeader };
