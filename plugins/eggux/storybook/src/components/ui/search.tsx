// EGG UI Search page: Search Suggestions and Search Suggestion Item (1097:132179, 1097:132178),
// Search Result Item (622:92913).
// Search Suggestions: the panel under a Search Field while people type: popover surface, border,
// radius lg, shadow md, 4 padding and gap, min 280, the field's width. Sections (label ui/label-small
// muted, 8 / 6 padding): Recent searches (before typing), Suggestions (the typed part in ui/label,
// the completion regular), records ("Invoices": icon, title, type caption on the right) and a footer
// hint. Items 36 high, 8 padding, radius sm; highlighted on accent.
// WAI-ARIA combobox: the Search Field is role="combobox" with aria-controls, aria-expanded and
// aria-activedescendant; the panel is a listbox with a group per section and options. Up / Down
// move, Enter opens the highlighted row (or searches all with none), Escape closes, Delete removes a
// highlighted recent search. The remove x of a recent is pointer-only (no nested controls).
// Search Result Item: one result on a search page (640): page (path › section, title link, a
// two-line snippet with the matches bold, type badge and date), record (40 icon tile, record,
// status badge, details), person, file, media (SearchMediaThumbnail: 160 × 90 poster, play, duration),
// product, event share one layout with a leading slot;
// answer is a muted card with an AI Notice, the question, the answer (4 lines), sources and feedback.
import * as React from 'react';
import { ChevronRight, History, Play, Search, ThumbsDown, ThumbsUp } from '@/components/icons';
import { cn } from '@/lib/utils';
import { AiNotice } from './ai-summary';
import { Badge, type BadgeProps } from './badge';
import { ButtonIcon } from './button-icon';

/* Suggestions */

export type SuggestionType = 'suggestion' | 'recent' | 'record';

export interface SuggestionItemData {
  id: string;
  type: SuggestionType;
  /** suggestion: the full text; recent: the query; record: the title. */
  label: string;
  /** record: the type on the right ("Invoice"). */
  meta?: string;
  /** record: the icon. */
  icon?: React.ReactNode;
}

export interface SearchSuggestionItemProps extends Omit<React.ComponentProps<'div'>, 'id'> {
  item: SuggestionItemData;
  /** The typed text, shown in medium at the start of a suggestion. */
  query?: string;
  highlighted?: boolean;
  optionId: string;
  onRemove?: () => void;
}

function SearchSuggestionItem({ item, query = '', highlighted = false, optionId, onRemove, className, ...props }: SearchSuggestionItemProps) {
  const match = item.type === 'suggestion' && query && item.label.toLowerCase().startsWith(query.toLowerCase());
  return (
    <div
      id={optionId}
      role="option"
      aria-selected={highlighted}
      data-slot="search-suggestion-item"
      data-type={item.type}
      data-highlighted={highlighted || undefined}
      onMouseDown={e => e.preventDefault()}
      className={cn('flex min-h-9 w-full min-w-0 cursor-default items-center gap-2 rounded-sm p-2 text-sm leading-5 text-popover-foreground', highlighted && 'bg-accent text-accent-foreground', className)}
      {...props}
    >
      <span aria-hidden="true" className="flex shrink-0 text-muted-foreground [&_svg]:size-4">
        {item.type === 'recent' ? <History /> : item.type === 'suggestion' ? <Search /> : item.icon}
      </span>
      <span className="flex min-w-[120px] flex-1 truncate">
        {match ? (
          <span className="truncate"><span className="font-medium">{item.label.slice(0, query.length)}</span>{item.label.slice(query.length)}</span>
        ) : (
          <span className="truncate">{item.label}</span>
        )}
      </span>
      {item.type === 'record' && item.meta ? (
        <span className={cn('max-w-[120px] shrink-0 truncate text-xs leading-4', highlighted ? 'text-[var(--input-filled-muted-foreground)]' : 'text-muted-foreground')}>{item.meta}</span>
      ) : null}
      {item.type === 'recent' && onRemove ? (
        <span
          aria-hidden="true"
          title="Remove from history"
          onClick={e => { e.stopPropagation(); onRemove(); }}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-button text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current" strokeWidth="1.5"><path d="M4 4l8 8M12 4l-8 8" /></svg>
        </span>
      ) : null}
    </div>
  );
}

export interface SuggestionSection { id: string; label: string; items: SuggestionItemData[] }

export interface SearchSuggestionsProps extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
  listboxId: string;
  sections: SuggestionSection[];
  query?: string;
  activeId?: string | null;
  onSelect?: (item: SuggestionItemData) => void;
  onRemoveRecent?: (item: SuggestionItemData) => void;
  hint?: string;
  /** "No matches for …" when every section is empty. */
  emptyText?: string;
  optionId: (itemId: string) => string;
}

function SearchSuggestions({ listboxId, sections, query = '', activeId, onSelect, onRemoveRecent, hint = 'Enter to search all results · Esc to close', emptyText, optionId, className, ...props }: SearchSuggestionsProps) {
  const visible = sections.filter(s => s.items.length);
  return (
    <div data-slot="search-suggestions" className={cn('flex w-full min-w-[280px] flex-col gap-1 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md', className)} {...props}>
      <div id={listboxId} role="listbox" aria-label="Search suggestions" className="flex flex-col gap-1">
        {visible.map(s => (
          <div key={s.id} role="group" aria-labelledby={`${listboxId}-${s.id}`} className="flex flex-col">
            <div id={`${listboxId}-${s.id}`} className="px-2 py-1.5 text-xs leading-4 font-medium text-muted-foreground">{s.label}</div>
            {s.items.map(item => (
              <SearchSuggestionItem
                key={item.id}
                item={item}
                query={query}
                optionId={optionId(item.id)}
                highlighted={activeId === item.id}
                onClick={() => onSelect?.(item)}
                onRemove={onRemoveRecent ? () => onRemoveRecent(item) : undefined}
              />
            ))}
          </div>
        ))}
      </div>
      {!visible.length && emptyText ? <p role="status" className="m-0 px-2 py-2 text-sm leading-5 text-muted-foreground">{emptyText}</p> : null}
      {hint ? <div className="flex border-t border-border px-2 pt-2 pb-1 text-xs leading-4 text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

/* Results */

export type SearchResultType = 'page' | 'record' | 'person' | 'file' | 'media' | 'product' | 'event';

export interface SearchResultItemProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  type?: SearchResultType;
  title: React.ReactNode;
  /** Plain title text for the link name when `title` holds marks. */
  href: string;
  /** page: ["Help center", "Invoices"]. */
  path?: string[];
  /** Leading slot: icon tile (record, file), Avatar (person), Thumbnail (product), Date Tile (event), video thumbnail (media). */
  leading?: React.ReactNode;
  /** A Badge next to the title (status) or in the meta row (type). */
  badge?: { label: string; variant?: BadgeProps['variant']; place?: 'title' | 'meta' };
  /** Two lines; wrap the matched words in <mark>. */
  snippet?: React.ReactNode;
  /** One line of caption details ("Invoice · €1,240.00 · Due 30 Oct"). */
  details?: React.ReactNode;
  /** Actions on the right (Message, Download), above the title link. */
  actions?: React.ReactNode;
  headingLevel?: 2 | 3 | 4;
}

function SearchResultItem({ type = 'page', title, href, path, leading, badge, snippet, details, actions, headingLevel = 3, className, ...props }: SearchResultItemProps) {
  const Heading = `h${headingLevel}` as 'h3';
  const titleBadge = badge && badge.place !== 'meta' && type !== 'page' ? <Badge variant={badge.variant ?? 'secondary'}>{badge.label}</Badge> : null;
  const metaBadge = badge && (badge.place === 'meta' || type === 'page') ? <Badge variant={badge.variant ?? 'secondary'} className="max-w-32">{badge.label}</Badge> : null;
  return (
    <article data-slot="search-result-item" data-type={type} className={cn('relative flex w-full min-w-0 items-start gap-4 py-3 has-[a[data-slot=search-result-link]:focus-visible]:ring-[3px] has-[a[data-slot=search-result-link]:focus-visible]:ring-ring/50', className)} {...props}>
      {leading ? <div className="flex shrink-0">{leading}</div> : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {path?.length ? (
          <div className="flex min-w-0 items-center gap-1 text-xs leading-4 text-muted-foreground">
            {path.map((p, i) => (
              <React.Fragment key={i}>
                {i > 0 ? <ChevronRight aria-hidden="true" className="size-3 shrink-0" /> : null}
                <span className={cn('truncate', i === 0 ? 'max-w-40 shrink-0' : 'min-w-0 flex-1')}>{p}</span>
              </React.Fragment>
            ))}
          </div>
        ) : null}
        <div className="flex min-w-0 items-center gap-2">
          <Heading className="m-0 line-clamp-2 min-w-0 flex-1 text-lg leading-7 font-semibold text-foreground [&_mark]:bg-transparent [&_mark]:font-bold [&_mark]:text-inherit">
            <a data-slot="search-result-link" href={href} className="outline-none after:absolute after:inset-0 after:content-[''] hover:underline">{title}</a>
          </Heading>
          {titleBadge}
        </div>
        {snippet ? <p className="m-0 line-clamp-2 text-sm leading-5 text-muted-foreground [&_mark]:bg-transparent [&_mark]:font-medium [&_mark]:text-foreground">{snippet}</p> : null}
        {details || metaBadge ? (
          <div className="flex min-w-0 items-center gap-2 text-xs leading-4 text-muted-foreground">
            {metaBadge}
            {details ? <span className="min-w-0 flex-1 truncate">{details}</span> : null}
          </div>
        ) : null}
      </div>
      {actions ? <div className="relative z-10 flex shrink-0 items-center gap-2 self-center">{actions}</div> : null}
    </article>
  );
}

export interface SearchMediaThumbnailProps extends React.ComponentProps<'span'> {
  /** Poster frame from the video. */
  src?: string;
  /** "12:40". */
  duration?: string;
}

/** Leading slot for Type=media: a 160 × 90 poster with a play button and the duration (decorative; the title is the link). */
function SearchMediaThumbnail({ src, duration, className, ...props }: SearchMediaThumbnailProps) {
  return (
    <span aria-hidden="true" data-slot="search-media-thumbnail" className={cn('relative flex h-[90px] w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted', className)} {...props}>
      {src ? <img src={src} alt="" className="absolute inset-0 size-full object-cover" /> : null}
      <span className="relative flex size-[52px] items-center justify-center rounded-full bg-background text-foreground shadow-md [&_svg]:size-5"><Play /></span>
      {duration ? <span className="absolute right-3 bottom-3 rounded-md bg-secondary px-2 py-0.5 text-xs leading-4 font-medium text-secondary-foreground">{duration}</span> : null}
    </span>
  );
}

export interface SearchAnswerProps extends React.ComponentProps<'section'> {
  question: string;
  answer: string;
  /** Sources slot: a <Sources> or Source Items. */
  sources?: React.ReactNode;
  feedback?: 'up' | 'down' | null;
  onFeedback?: (v: 'up' | 'down' | null) => void;
  label?: string;
}

function SearchAnswer({ question, answer, sources, feedback = null, onFeedback, label = 'AI answer', className, ...props }: SearchAnswerProps) {
  const id = React.useId();
  return (
    <section data-slot="search-answer" aria-labelledby={id} className={cn('flex w-full min-w-0 flex-col items-start gap-3 rounded-lg bg-muted p-4', className)} {...props}>
      <AiNotice>{label}</AiNotice>
      <h3 id={id} className="m-0 text-lg leading-7 font-semibold text-foreground">{question}</h3>
      <p className="m-0 line-clamp-4 text-base leading-7 text-foreground">{answer}</p>
      {sources ? <div className="w-full">{sources}</div> : null}
      <div className="flex w-full items-center gap-1">
        {/* Muted on the muted card falls under 4.5:1: foreground (decision D-001). */}
        <span className="min-w-0 flex-1 text-xs leading-4 text-foreground">Was this helpful?</span>
        <ButtonIcon variant="ghost" size="sm" icon={<ThumbsUp />} label="Helpful" aria-pressed={feedback === 'up'} onClick={() => onFeedback?.(feedback === 'up' ? null : 'up')} />
        <ButtonIcon variant="ghost" size="sm" icon={<ThumbsDown />} label="Not helpful" aria-pressed={feedback === 'down'} onClick={() => onFeedback?.(feedback === 'down' ? null : 'down')} />
      </div>
    </section>
  );
}

export { SearchAnswer, SearchMediaThumbnail, SearchResultItem, SearchSuggestionItem, SearchSuggestions };
