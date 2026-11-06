// EGG UI App Header. Figma: App Header (Navigation page, "App Header / Component", 1097:13020). Logo
// (swap, Type=full), Links slot (Nav Links, the current page active), Search Field (Show search,
// 256 wide, "Search Acme" with ⌘K) and Actions slot (notifications, help, the account Avatar).
// Top navigation for apps without a sidebar (client portals, simple admin, Page Shell / App
// Layout=stacked) with 3 to 6 destinations: 64 high (spacing/16), 24 px sides and gaps (spacing/6),
// bottom border, background/default. The links fill the space between the logo and the search, 4 px
// apart; actions 8 px apart. Header landmark with a nav ("Main") for the links; the active link has
// aria-current="page"; the logo links home, named by the product name. Needs 768; under 1024 drop the
// search field (Show search off) and put a search Button Icon in Actions; under 768 use Mobile Header.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { SearchField, type SearchFieldProps } from './search-field';

export interface AppHeaderProps extends React.ComponentProps<'header'> {
  /** Figma Logo (swap): default a full Logo named `productName`. */
  logo?: React.ReactNode;
  productName?: string;
  /** Where the logo goes. */
  homeHref?: string;
  /** Figma Links slot: NavLinks, the current page `active`. */
  links?: React.ReactNode;
  linksLabel?: string;
  /** Figma Show search: the Search Field props. Leave out under 1024. */
  search?: Omit<SearchFieldProps, 'className'>;
  /** Figma Actions slot: global actions and the account menu. */
  actions?: React.ReactNode;
}

function AppHeader({ logo, productName = 'Acme', homeHref = '/', links, linksLabel = 'Main', search, actions, className, ...props }: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={cn('flex h-16 w-full min-w-[768px] items-center gap-6 border-b border-border bg-background px-6 text-foreground', className)}
      {...props}
    >
      <a
        href={homeHref}
        data-slot="app-header-logo"
        className="flex shrink-0 items-center rounded-md outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
      >
        {logo ?? <Logo type="full" name={productName} />}
      </a>
      <nav aria-label={linksLabel} data-slot="app-header-links" className="flex min-w-0 flex-1 items-center gap-1">
        {links}
      </nav>
      {search ? <SearchField {...search} className="w-64 shrink-0" /> : null}
      {actions ? <div data-slot="app-header-actions" className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export { AppHeader };
