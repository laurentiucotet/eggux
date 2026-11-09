// EGG UI Prose. Figma: Prose page. Prose (Size sm, default, lg) is the column for long text: help
// articles, docs, release notes. It sets the reading width (280 to 672, sm 576, lg 768) and the gap
// between blocks, and its parts follow the Size: Prose Heading (h2, h3, h4; each adds its own top
// space so sections breathe), Prose Paragraph, Prose List + Prose List Item (bullet or number marker
// in muted), Prose Blockquote (4px rule, quote and cite). Links inside are brand and underlined;
// inline code uses Inline Code. Highlight (Tone default = mark, ai = text an AI added or changed)
// marks a run of text and wraps with the line.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type ProseSize = 'sm' | 'default' | 'lg';

const ProseContext = React.createContext<ProseSize>('default');
const ListContext = React.createContext<boolean>(false);

const sizes: Record<ProseSize, { root: string; body: string; marker: string; h2: string; h3: string; h4: string; cite: string }> = {
  sm: {
    root: 'max-w-[576px] gap-3 [&_[data-slot=prose-list]]:gap-3',
    body: 'text-sm leading-5',
    marker: 'h-5',
    h2: 'pt-4 text-xl leading-7 font-semibold tracking-[-0.4px]',
    h3: 'pt-1 text-base leading-6 font-semibold',
    h4: 'pt-1 text-sm leading-5 font-medium',
    cite: 'text-xs leading-4',
  },
  default: {
    root: 'max-w-[672px] gap-4 [&_[data-slot=prose-list]]:gap-4',
    body: 'text-base leading-7',
    marker: 'h-7',
    h2: 'pt-6 text-2xl leading-8 font-semibold tracking-[-0.4px]',
    h3: 'pt-4 text-xl leading-7 font-semibold',
    h4: 'pt-2 text-sm leading-5 font-medium',
    cite: 'text-xs leading-4',
  },
  lg: {
    root: 'max-w-[768px] gap-5 [&_[data-slot=prose-list]]:gap-5',
    body: 'text-lg leading-7',
    marker: 'h-7',
    h2: 'pt-8 text-3xl leading-9 font-semibold tracking-[-0.4px]',
    h3: 'pt-5 text-2xl leading-8 font-semibold',
    h4: 'pt-3 text-lg leading-7 font-medium',
    cite: 'text-sm leading-5',
  },
};

export interface ProseProps extends React.ComponentProps<'div'> {
  /** Figma Size: the type scale and gaps of every part inside. */
  size?: ProseSize;
}

function Prose({ size = 'default', className, ...props }: ProseProps) {
  return (
    <ProseContext.Provider value={size}>
      <div
        data-slot="prose"
        data-size={size}
        className={cn(
          'flex w-full min-w-[280px] flex-col text-foreground',
          sizes[size].root,
          '[&_a]:rounded-sm [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 [&_a]:outline-none [&_a:focus-visible]:ring-[3px] [&_a:focus-visible]:ring-ring/50 [&_a:hover]:decoration-2',
          className,
        )}
        {...props}
      />
    </ProseContext.Provider>
  );
}

export interface ProseHeadingProps extends React.ComponentProps<'h2'> {
  /** Figma Level: h2 for sections, h3 for sub-sections, h4 for small labelled blocks. */
  level?: 2 | 3 | 4;
}

function ProseHeading({ level = 2, className, ...props }: ProseHeadingProps) {
  const size = React.useContext(ProseContext);
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
  return <Tag data-slot="prose-heading" data-level={level} className={cn('m-0 text-foreground', sizes[size][`h${level}`], className)} {...props} />;
}

function ProseParagraph({ className, ...props }: React.ComponentProps<'p'>) {
  const size = React.useContext(ProseContext);
  return <p data-slot="prose-paragraph" className={cn('m-0', sizes[size].body, className)} {...props} />;
}

export interface ProseListProps extends React.ComponentProps<'ul'> {
  /** Numbered list (ol) instead of bullets (ul). */
  ordered?: boolean;
}

function ProseList({ ordered = false, className, ...props }: ProseListProps) {
  const Tag = (ordered ? 'ol' : 'ul') as unknown as React.FC<React.ComponentProps<'ul'>>;
  return (
    <ListContext.Provider value={ordered}>
      <Tag data-slot="prose-list" data-ordered={ordered || undefined} role="list" className={cn('m-0 flex list-none flex-col p-0 [counter-reset:prose-item]', className)} {...props} />
    </ListContext.Provider>
  );
}

function ProseListItem({ className, children, ...props }: React.ComponentProps<'li'>) {
  const size = React.useContext(ProseContext);
  const ordered = React.useContext(ListContext);
  return (
    <li data-slot="prose-list-item" className={cn('flex items-start gap-2 pl-1 [counter-increment:prose-item]', sizes[size].body, className)} {...props}>
      <span
        aria-hidden="true"
        data-slot="prose-list-marker"
        className={cn(
          'flex w-5 shrink-0 items-center text-muted-foreground',
          sizes[size].marker,
          ordered ? "justify-end tabular-nums before:content-[counter(prose-item)'.']" : 'justify-center before:size-1.5 before:rounded-full before:bg-muted-foreground before:content-[""]',
        )}
      />
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  );
}

export interface ProseBlockquoteProps extends React.ComponentProps<'figure'> {
  /** Who said it: shown under the quote in muted. */
  cite?: React.ReactNode;
}

function ProseBlockquote({ cite, className, children, ...props }: ProseBlockquoteProps) {
  const size = React.useContext(ProseContext);
  return (
    <figure data-slot="prose-blockquote" className={cn('m-0 flex flex-col gap-2 border-l-4 border-border pl-4', className)} {...props}>
      <blockquote className={cn('m-0', sizes[size].body)}>{children}</blockquote>
      {cite ? <figcaption className={cn('text-muted-foreground', sizes[size].cite)}>{cite}</figcaption> : null}
    </figure>
  );
}

export type HighlightTone = 'default' | 'ai';

export interface HighlightProps extends React.ComponentProps<'mark'> {
  /** Figma Tone: default (highlight/mark) for matches; ai (highlight/ai) for text an AI added or changed. */
  tone?: HighlightTone;
}

function Highlight({ tone = 'default', className, ...props }: HighlightProps) {
  return (
    <mark
      data-slot="highlight"
      data-tone={tone}
      className={cn('box-decoration-clone text-inherit', tone === 'ai' ? 'bg-[var(--highlight-ai)]' : 'bg-[var(--highlight-mark)]', className)}
      {...props}
    />
  );
}

export { Highlight, Prose, ProseBlockquote, ProseHeading, ProseList, ProseListItem, ProseParagraph };
