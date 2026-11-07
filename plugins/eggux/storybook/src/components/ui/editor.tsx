// EGG UI Editor page. Figma: Editor page.
// - Rich Text Editor: a Toolbar (Heading, Bold, Italic, Underline | List, Quote | Link) over a
//   contentEditable Content area and a footer (hint and character count). Focus shows the ring.
//   Formats use the browser editing commands so the demo works without a library; in an app swap
//   the Content for Tiptap or Lexical and keep the frame, toolbar and footer.
// - Comment: avatar, name, time (full date on hover), text, Reply and Edit. Type reply indents
//   44 with a 24 avatar. State resolved adds a Resolved badge and mutes the text.
// - Comment Composer: avatar, growing Textarea, attach, ⌘/Ctrl+Enter sends, Comment (off while empty).
// - Selection Toolbar: floating toolbar over selected text: Bold, Italic, Link and Comment.
// - Comment Highlight: tint on commented words (open, active, selected, resolved = none).
// - Comment Thread: quote, comments, replies, composer, Resolve and More. State default, active
//   (ring border and shadow), resolved (collapsed with "Resolved by" and Reopen).
// - Comments Panel: aside with the title and open count, Open / Resolved filter, threads or empty.
import * as React from 'react';
import { Bold, Check, Ellipsis, Heading, Italic, Link, List, ListFilter, MessageSquare, Plus, TextQuote, Underline, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { BadgeCount } from './badge-count';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';
import { EmptyState } from './empty-state';
import { Kbd, KbdGroup } from './kbd';
import { Textarea } from './textarea';
import { Toggle } from './toggle';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { Toolbar, ToolbarGroup } from './toolbar';

/* Rich Text Editor */

type Format = 'heading' | 'bold' | 'italic' | 'underline' | 'list' | 'quote';

function readFormats(): Record<Format, boolean> {
  const q = (c: string) => {
    try {
      return document.queryCommandState(c);
    } catch {
      return false;
    }
  };
  const block = (() => {
    try {
      return String(document.queryCommandValue('formatBlock')).toLowerCase();
    } catch {
      return '';
    }
  })();
  return { heading: block === 'h3', bold: q('bold'), italic: q('italic'), underline: q('underline'), list: q('insertUnorderedList'), quote: block === 'blockquote' };
}

export interface RichTextEditorProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** Accessible name of the text area. */
  label: string;
  /** Initial content (HTML). */
  defaultValue?: string;
  /** Called with the HTML after each change. */
  onValueChange?: (html: string) => void;
  /** Figma Show footer: the hint at the start. */
  hint?: React.ReactNode;
  /** Character limit shown at the end of the footer ("186 / 2000"). */
  maxLength?: number;
  /** Figma Show footer. */
  showFooter?: boolean;
  /** Link: the app asks for the URL (a Popover or Dialog) and calls `document.execCommand('createLink')`. */
  onInsertLink?: () => void;
  placeholder?: string;
}

function RichTextEditor({
  label,
  defaultValue = '',
  onValueChange,
  hint = 'Markdown shortcuts work: **bold**, - list, > quote',
  maxLength,
  showFooter = true,
  onInsertLink,
  placeholder,
  className,
  ...props
}: RichTextEditorProps) {
  const id = React.useId();
  const content = React.useRef<HTMLDivElement>(null);
  const [formats, setFormats] = React.useState<Record<Format, boolean>>({ heading: false, bold: false, italic: false, underline: false, list: false, quote: false });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (content.current) {
      content.current.innerHTML = defaultValue;
      setCount(content.current.textContent?.length ?? 0);
    }
    // Initial content only: the editor owns its DOM after that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const onSelection = () => {
      const el = content.current;
      const sel = document.getSelection();
      if (el && sel?.anchorNode && el.contains(sel.anchorNode)) setFormats(readFormats());
    };
    document.addEventListener('selectionchange', onSelection);
    return () => document.removeEventListener('selectionchange', onSelection);
  }, []);

  const changed = () => {
    const el = content.current;
    if (!el) return;
    setCount(el.textContent?.length ?? 0);
    setFormats(readFormats());
    onValueChange?.(el.innerHTML);
  };

  const apply = (f: Format) => {
    content.current?.focus();
    const cur = readFormats();
    if (f === 'heading') document.execCommand('formatBlock', false, cur.heading ? 'p' : 'h3');
    else if (f === 'quote') document.execCommand('formatBlock', false, cur.quote ? 'p' : 'blockquote');
    else if (f === 'list') document.execCommand('insertUnorderedList');
    else document.execCommand(f);
    changed();
  };

  const tool = (f: Format, name: string, icon: React.ReactNode, shortcut?: string) => (
    <Toggle size="sm" label={name} icon={icon} shortcut={shortcut ? <Kbd>{shortcut}</Kbd> : undefined} pressed={formats[f]} onPressedChange={() => apply(f)} />
  );

  return (
    <div
      data-slot="rich-text-editor"
      className={cn(
        'flex w-160 max-w-full flex-col overflow-clip rounded-md border border-input bg-background shadow-xs',
        'focus-within:border-ring focus-within:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
        className,
      )}
      {...props}
    >
      {/* mousedown would move focus out of the text and drop the selection */}
      <div className="border-b border-border" onMouseDown={(e) => e.preventDefault()}>
        <Toolbar aria-label={`${label} formatting`} aria-controls={id}>
          <ToolbarGroup>{tool('heading', 'Heading', <Heading />)}</ToolbarGroup>
          <ToolbarGroup>
            {tool('bold', 'Bold', <Bold />, 'Ctrl B')}
            {tool('italic', 'Italic', <Italic />, 'Ctrl I')}
            {tool('underline', 'Underline', <Underline />, 'Ctrl U')}
          </ToolbarGroup>
          <ToolbarGroup>
            {tool('list', 'Bulleted list', <List />)}
            {tool('quote', 'Quote', <TextQuote />)}
          </ToolbarGroup>
          <ToolbarGroup>
            <ButtonIcon variant="ghost" size="sm" icon={<Link />} label="Link" onClick={onInsertLink} />
          </ToolbarGroup>
        </Toolbar>
      </div>
      <div
        ref={content}
        id={id}
        role="textbox"
        aria-multiline="true"
        aria-label={label}
        aria-describedby={showFooter ? `${id}-footer` : undefined}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={changed}
        onKeyUp={() => setFormats(readFormats())}
        data-slot="rich-text-editor-content"
        className={cn(
          'flex min-h-30 w-full flex-col gap-2 p-3 text-sm leading-5 text-foreground outline-none',
          '[&_h3]:m-0 [&_h3]:text-sm [&_h3]:font-medium [&_p]:m-0 [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:m-0 [&_ol]:pl-5',
          '[&_blockquote]:m-0 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground',
          '[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4',
          'empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]',
        )}
      />
      {showFooter ? (
        <div id={`${id}-footer`} className="flex w-full items-start justify-between gap-3 px-3 pb-2 text-xs leading-4 text-muted-foreground">
          <p className="m-0 min-w-0 flex-1 truncate">{hint}</p>
          {maxLength ? (
            <p className={cn('m-0 shrink-0 whitespace-nowrap', count > maxLength && 'text-destructive')}>
              {count} / {maxLength}
              <span className="sr-only"> characters</span>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* Comment */

export interface CommentProps extends React.ComponentProps<'article'> {
  name: string;
  initials?: string;
  avatarSrc?: string;
  /** Relative time ("2 h ago"). */
  time: string;
  /** ISO date and time; its full form shows on hover. */
  dateTime?: string;
  /** Figma Type: reply indents one level with a smaller avatar. */
  type?: 'comment' | 'reply';
  /** Figma State. */
  resolved?: boolean;
  /** Figma Show actions. */
  showActions?: boolean;
  onReply?: () => void;
  onEdit?: () => void;
}

function Comment({ name, initials, avatarSrc, time, dateTime, type = 'comment', resolved = false, showActions = true, onReply, onEdit, className, children, ...props }: CommentProps) {
  const reply = type === 'reply';
  const full = dateTime ? new Date(dateTime).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' }) : undefined;
  return (
    <article data-slot="comment" data-type={type} data-resolved={resolved || undefined} aria-label={`Comment by ${name}`} className={cn('flex w-full min-w-0 items-start gap-3', reply && 'pl-11', className)} {...props}>
      <Avatar size={reply ? 'sm' : 'default'} initials={initials ?? name.split(' ').map((p) => p[0]).join('')} src={avatarSrc} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-0.5">
          <p className={cn('m-0 truncate text-sm leading-5 font-medium', reply ? 'max-w-40' : 'max-w-50', resolved ? 'text-muted-foreground' : 'text-foreground')}>{name}</p>
          <time dateTime={dateTime} title={full} className="max-w-40 truncate text-xs leading-4 text-muted-foreground">
            {time}
          </time>
          {resolved ? <Badge variant="success">Resolved</Badge> : null}
        </div>
        <div className={cn('text-sm leading-5 break-words [&_a]:text-brand [&_a]:underline', resolved ? 'text-muted-foreground' : 'text-foreground')}>{children}</div>
        {showActions ? (
          <div className="flex gap-3">
            <Button variant="link" size="sm" className="h-8" aria-label={`Reply to ${name}`} onClick={onReply}>
              Reply
            </Button>
            <Button variant="link" size="sm" className="h-8" aria-label={`Edit comment by ${name}`} onClick={onEdit}>
              Edit
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/* Comment Composer */

export interface CommentComposerProps extends Omit<React.ComponentProps<'form'>, 'onSubmit'> {
  /** The current user. */
  initials?: string;
  avatarSrc?: string;
  placeholder?: string;
  /** Accessible name of the text box. */
  label?: string;
  submitLabel?: string;
  onSubmit?: (text: string) => void;
  onAttach?: () => void;
  autoFocus?: boolean;
}

function CommentComposer({
  initials = 'AP',
  avatarSrc,
  placeholder = 'Add a comment… Use @ to mention someone',
  label = 'Add a comment',
  submitLabel = 'Comment',
  onSubmit,
  onAttach,
  autoFocus,
  className,
  ...props
}: CommentComposerProps) {
  const [text, setText] = React.useState('');
  const send = () => {
    const t = text.trim();
    if (!t) return;
    onSubmit?.(t);
    setText('');
  };
  return (
    <form
      data-slot="comment-composer"
      className={cn('flex w-full min-w-0 items-start gap-3', className)}
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      {...props}
    >
      <Avatar initials={initials} src={avatarSrc} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Textarea
          aria-label={label}
          placeholder={placeholder}
          value={text}
          autoFocus={autoFocus}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              send();
            }
          }}
        />
        <div className="flex w-full items-center gap-2">
          <ButtonIcon variant="ghost" icon={<Plus />} label="Attach a file" onClick={onAttach} />
          <span className="flex-1" />
          <KbdGroup aria-hidden="true">
            <Kbd>⌘</Kbd>
            <Kbd>↵</Kbd>
          </KbdGroup>
          <Button type="submit" size="sm" disabled={!text.trim()} aria-keyshortcuts="Meta+Enter Control+Enter">
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

/* Selection Toolbar */

export interface SelectionToolbarProps extends Omit<React.ComponentProps<'div'>, 'aria-label'> {
  /** Figma Show formatting: off for readers who can only comment. */
  showFormatting?: boolean;
  /** Figma Show comment. */
  showComment?: boolean;
  bold?: boolean;
  italic?: boolean;
  onBoldChange?: (on: boolean) => void;
  onItalicChange?: (on: boolean) => void;
  onLink?: () => void;
  onComment?: () => void;
  /** Escape. */
  onClose?: () => void;
}

function SelectionToolbar({ showFormatting = true, showComment = true, bold, italic, onBoldChange, onItalicChange, onLink, onComment, onClose, className, onKeyDown, ...props }: SelectionToolbarProps) {
  return (
    <Toolbar
      aria-label="Selected text"
      toolbarStyle="floating"
      data-slot="selection-toolbar"
      className={cn('w-max', className)}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.key === 'Escape') onClose?.();
      }}
      {...props}
    >
      {showFormatting ? (
        <ToolbarGroup>
          <Toggle label="Bold" icon={<Bold />} pressed={bold} onPressedChange={onBoldChange} />
          <Toggle label="Italic" icon={<Italic />} pressed={italic} onPressedChange={onItalicChange} />
          <ButtonIcon variant="ghost" icon={<Link />} label="Link" onClick={onLink} />
        </ToolbarGroup>
      ) : null}
      {showComment ? (
        <ToolbarGroup>
          <Button size="sm" leadingIcon={<MessageSquare />} onClick={onComment} aria-keyshortcuts="Meta+Alt+M Control+Alt+M">
            Comment
          </Button>
        </ToolbarGroup>
      ) : null}
    </Toolbar>
  );
}

/* Comment Highlight */

export type CommentHighlightState = 'open' | 'active' | 'selected' | 'resolved';

const highlightFill: Record<CommentHighlightState, string> = {
  open: 'bg-[var(--comment-highlight)]',
  active: 'bg-[var(--comment-highlight-active)]',
  selected: 'bg-[var(--comment-selection)]',
  resolved: 'bg-transparent',
};

function CommentHighlight({ state = 'open', className, ...props }: React.ComponentProps<'mark'> & { state?: CommentHighlightState }) {
  return <mark data-slot="comment-highlight" data-state={state} className={cn('box-decoration-clone text-inherit', highlightFill[state], className)} {...props} />;
}

/* Comment Thread */

export interface CommentThreadProps extends React.ComponentProps<'article'> {
  /** The commented words (2 lines at most). */
  quote: string;
  /** Figma State. */
  state?: 'default' | 'active' | 'resolved';
  /** State=resolved: "Resolved by Ana Popescu · 2 d ago". */
  resolvedBy?: string;
  /** Figma Show reply: a Comment Composer. */
  composer?: React.ReactNode;
  onResolve?: () => void;
  onReopen?: () => void;
  /** DropdownMenuItems for More (Edit, Copy link, Delete). */
  menu?: React.ReactNode;
}

function CommentThread({ quote, state = 'default', resolvedBy, composer, onResolve, onReopen, menu, className, children, ...props }: CommentThreadProps) {
  const resolved = state === 'resolved';
  return (
    <article
      data-slot="comment-thread"
      data-state={state}
      aria-label={`Thread on “${quote}”`}
      aria-current={state === 'active' ? 'true' : undefined}
      className={cn(
        'flex w-80 max-w-full min-w-70 flex-col gap-3 rounded-lg border p-3',
        resolved ? 'border-border bg-[var(--card-muted)]' : 'bg-card text-card-foreground',
        state === 'active' ? 'border-ring shadow-md' : !resolved && 'border-border',
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-start gap-2">
        <blockquote className="m-0 flex min-w-30 flex-1 gap-2">
          <span aria-hidden="true" className={cn('w-0.5 shrink-0 self-stretch rounded-full', resolved ? 'bg-border' : 'bg-warning')} />
          <p className={cn('m-0 min-w-0 flex-1 text-sm leading-5 text-muted-foreground', resolved ? 'truncate' : 'line-clamp-2')}>{quote}</p>
        </blockquote>
        <div className="flex shrink-0 items-center gap-0.5">
          {resolved ? (
            <Button variant="outline" size="sm" aria-label={`Reopen thread on “${quote}”`} onClick={onReopen}>
              Reopen
            </Button>
          ) : (
            <>
              <ButtonIcon variant="ghost" size="sm" icon={<Check />} label="Resolve thread" onClick={onResolve} />
              {menu ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ButtonIcon variant="ghost" size="sm" icon={<Ellipsis />} label="More thread actions" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <ButtonIcon variant="ghost" size="sm" icon={<Ellipsis />} label="More thread actions" />
              )}
            </>
          )}
        </div>
      </div>
      {resolved ? (
        <p className="m-0 flex w-full items-center gap-1.5 text-xs leading-4 text-muted-foreground">
          <Check aria-hidden="true" className="size-4 shrink-0 text-success" />
          <span className="min-w-0 flex-1 truncate">{resolvedBy}</span>
        </p>
      ) : (
        <>
          {children}
          {composer}
        </>
      )}
    </article>
  );
}

/* Comments Panel */

export interface CommentsPanelProps extends React.ComponentProps<'aside'> {
  title?: string;
  openCount: number;
  resolvedCount: number;
  filter?: 'open' | 'resolved';
  onFilterChange?: (filter: 'open' | 'resolved') => void;
  /** Figma Show filter. */
  onFilterMenu?: () => void;
  /** Figma Show close. */
  onClose?: () => void;
}

function CommentsPanel({ title = 'Comments', openCount, resolvedCount, filter = 'open', onFilterChange, onFilterMenu, onClose, className, children, ...props }: CommentsPanelProps) {
  const id = React.useId();
  const empty = React.Children.count(children) === 0;
  return (
    <aside aria-labelledby={id} data-slot="comments-panel" className={cn('flex h-full w-90 max-w-full flex-col overflow-clip border-l border-border bg-background', className)} {...props}>
      <div className="flex w-full shrink-0 flex-col gap-3 p-4">
        <div className="flex w-full items-center gap-2">
          <h2 id={id} className="m-0 text-xl leading-7 font-semibold tracking-[-0.4px] whitespace-nowrap text-foreground">
            {title}
          </h2>
          <BadgeCount variant="secondary" count={openCount} label={`${openCount} open`} />
          <span className="flex-1" />
          {onFilterMenu ? <ButtonIcon variant="ghost" size="sm" icon={<ListFilter />} label="Filter comments" onClick={onFilterMenu} /> : null}
          {onClose ? <ButtonIcon variant="ghost" size="sm" icon={<X />} label="Close comments" onClick={onClose} /> : null}
        </div>
        <ToggleGroup type="single" variant="segmented" fullWidth aria-label="Show threads" value={filter} onValueChange={(v) => onFilterChange?.(v as 'open' | 'resolved')}>
          <ToggleGroupItem value="open" label={`Open ${openCount}`} />
          <ToggleGroupItem value="resolved" label={`Resolved ${resolvedCount}`} />
        </ToggleGroup>
      </div>
      {empty ? (
        <div className="flex min-h-0 flex-1 items-center justify-center p-6">
          <EmptyState size="sm" icon={<MessageSquare />} title="No comments yet" description="Select text to comment." headingLevel={3} />
        </div>
      ) : (
        <div data-slot="comments-panel-threads" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4 [&>[data-slot=comment-thread]]:w-full [&>[data-slot=comment-thread]]:min-w-0">
          {children}
        </div>
      )}
    </aside>
  );
}

export { Comment, CommentComposer, CommentHighlight, CommentsPanel, CommentThread, RichTextEditor, SelectionToolbar };
