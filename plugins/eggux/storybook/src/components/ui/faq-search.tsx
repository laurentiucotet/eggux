// EGG UI FAQ Search. Code only (no Figma component yet); family Marketing.
// A help-center FAQ: a Search Field above an Accordion (plus/minus icons). Typing filters the
// questions (a question or its answer must contain the text, case-insensitive) and marks the match
// in the question and in the answer. A live line says how many questions match; with none, an
// empty state names the search and offers "Show all questions". Items open and close on their own.
// A11y: the field is a labelled search; the count is a polite status (announced after typing);
// questions are accordion buttons in headings (Enter/Space toggles, arrows move between them);
// <mark> carries the highlight with a token pair, not color alone (it is also a text match the
// screen reader reads as plain text). Escape in the field clears it.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionItem } from './accordion';
import { Button } from './button';
import { SearchField } from './search-field';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSearchProps extends Omit<React.ComponentProps<'section'>, 'title' | 'onChange'> {
  items: FaqItem[];
  /** Heading above the field. Empty hides it. */
  heading?: string;
  placeholder?: string;
  /** Starting query. */
  defaultQuery?: string;
  headingLevel?: 2 | 3 | 4;
  onQueryChange?: (query: string) => void;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-[var(--badge-soft-warning-bg)] px-0.5 text-[var(--badge-soft-warning-fg)]">{part}</mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

function FaqSearch({
  items,
  heading = 'Frequently asked questions',
  placeholder = 'Search questions',
  defaultQuery = '',
  headingLevel = 2,
  onQueryChange,
  className,
  ...props
}: FaqSearchProps) {
  const [query, setQuery] = React.useState(defaultQuery);
  const headingId = React.useId();
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  const q = query.trim().toLowerCase();
  const shown = q ? items.filter(i => i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q)) : items;
  const update = (next: string) => {
    setQuery(next);
    onQueryChange?.(next);
  };
  return (
    <section
      data-slot="faq-search"
      aria-labelledby={heading ? headingId : undefined}
      aria-label={heading ? undefined : 'Frequently asked questions'}
      className={cn('flex w-full min-w-0 flex-col gap-4', className)}
      {...props}
    >
      {heading ? <Heading id={headingId} className="m-0 text-2xl leading-8 font-semibold tracking-tight text-foreground [overflow-wrap:anywhere]">{heading}</Heading> : null}
      <SearchField placeholder={placeholder} label="Search questions" showShortcut={false} value={query} onValueChange={update} />
      <p role="status" data-slot="faq-search-count" className="m-0 text-sm leading-5 text-muted-foreground">
        {q ? `${shown.length} of ${items.length} questions match` : `${items.length} questions`}
      </p>
      {shown.length > 0 ? (
        <Accordion icon="plus">
          {shown.map(item => (
            <AccordionItem key={item.id} value={item.id} title={<Highlight text={item.question} query={query} />}>
              <p className="m-0 text-muted-foreground [overflow-wrap:anywhere]"><Highlight text={item.answer} query={query} /></p>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div data-slot="faq-search-empty" className="flex min-w-0 flex-col items-start gap-3 rounded-xl border border-dashed border-border p-6">
          <p className="m-0 text-base leading-6 font-semibold text-foreground [overflow-wrap:anywhere]">No questions match “{query.trim()}”</p>
          <p className="m-0 text-sm leading-5 text-muted-foreground">Try a shorter word, or show every question again.</p>
          <Button variant="outline" size="sm" onClick={() => update('')}>Show all questions</Button>
        </div>
      )}
    </section>
  );
}

export { FaqSearch };
