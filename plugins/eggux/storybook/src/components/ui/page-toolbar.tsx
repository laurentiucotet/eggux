// EGG UI Page Toolbar. Figma: Page Toolbar (Navigation page, "Page Toolbar / Component", 434:6018).
// The row between a list page title and the list: start group with the Search Field (Show search,
// 128-320 wide) and the outline Filters button with its Badge Count (Show filters; the count shows
// only when filters are on and is part of the button name: "Filters, 2 active"); end group with
// the view Toggle Group (outline, icon-only items; Show view) and the one primary Button (Show
// primary). 36 high, 8 px gaps; flex-wrap: the start group fills (min 256), the end group moves to
// a second line in narrow columns. Search, filters and view belong in the URL (the app's job).
// While rows are selected, Table Toolbar takes its place.
import * as React from 'react';
import { ListFilter } from '@/components/icons';
import { cn } from '@/lib/utils';
import { BadgeCount } from './badge-count';
import { Button } from './button';
import { SearchField, type SearchFieldProps } from './search-field';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

export interface PageToolbarView {
  value: string;
  /** Name of the view ("List", "Board", "Calendar"): aria-label and tooltip. */
  label: string;
  icon: React.ReactNode;
}

export interface PageToolbarProps extends React.ComponentProps<'div'> {
  /** Figma Show search: the Search Field props (placeholder names what is searched). */
  search?: Omit<SearchFieldProps, 'className'>;
  /** Figma Show filters: opens the filters (a Popover or a Sheet). */
  onFilters?: () => void;
  /** Active filters; the count shows when above 0. */
  filterCount?: number;
  filtersLabel?: string;
  /** Figma Show view: the views, as icon-only Toggle Group items. */
  views?: PageToolbarView[];
  view?: string;
  defaultView?: string;
  onViewChange?: (view: string) => void;
  viewLabel?: string;
  /** Figma Show primary: the one primary Button ("New invoice"). */
  primary?: React.ReactNode;
}

function PageToolbar({
  search,
  onFilters,
  filterCount = 0,
  filtersLabel = 'Filters',
  views,
  view,
  defaultView,
  onViewChange,
  viewLabel = 'View',
  primary,
  className,
  ...props
}: PageToolbarProps) {
  const hasEnd = (views && views.length > 0) || primary != null;
  return (
    <div data-slot="page-toolbar" className={cn('flex w-full min-w-0 flex-wrap items-center gap-2', className)} {...props}>
      <div data-slot="page-toolbar-start" className="flex min-w-64 flex-1 items-center gap-2">
        {search ? <SearchField {...search} className="max-w-80 min-w-32 flex-1" /> : null}
        {onFilters ? (
          <Button
            variant="outline"
            leadingIcon={<ListFilter aria-hidden="true" />}
            onClick={onFilters}
          >
            {filtersLabel}
            {/* The name reads "Filters, 2 active"; the visible count is a picture of it. */}
            {filterCount > 0 ? (
              <>
                <span className="sr-only">, {filterCount} active</span>
                <BadgeCount variant="secondary" count={filterCount} aria-hidden="true" />
              </>
            ) : null}
          </Button>
        ) : null}
      </div>
      {hasEnd ? (
        <div data-slot="page-toolbar-end" className="flex shrink-0 items-center gap-2">
          {views && views.length > 0 ? (
            <ToggleGroup
              type="single"
              variant="outline"
              aria-label={viewLabel}
              value={view}
              defaultValue={defaultView ?? (view === undefined ? views[0].value : undefined)}
              onValueChange={onViewChange}
            >
              {views.map(v => <ToggleGroupItem key={v.value} value={v.value} label={v.label} icon={v.icon} showLabel={false} />)}
            </ToggleGroup>
          ) : null}
          {primary ?? null}
        </div>
      ) : null}
    </div>
  );
}

export { PageToolbar };
