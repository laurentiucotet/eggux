// EGG UI Poll. Code only (no Figma component yet); family Community.
// A question with two to six options, single choice. State vote: a radio group and a Vote button
// (disabled until an option is picked). State results: each option as a row with its label, share in
// percent, vote count and a bar; the leading option(s) carry a check and "Leading" ("Winner" once the
// poll is closed); your own choice is marked "Your vote". A closed poll opens on the results.
// A11y: a fieldset with the question as legend and native radios (arrows move, Space picks); results
// are a list whose items read "Remote first, 48 percent, 120 votes"; the bars are decoration; the
// switch from vote to results is announced in a polite status and focus moves to the results heading.
import * as React from 'react';
import { Check } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';

export interface PollOption {
  id: string;
  label: string;
  /** Votes so far, without the viewer's own vote. */
  votes: number;
}

export interface PollProps extends Omit<React.ComponentProps<'section'>, 'onChange'> {
  question: string;
  options: PollOption[];
  /** A closed poll shows the final result and takes no votes. */
  closed?: boolean;
  /** The option the viewer already voted for: the poll opens on the results. */
  defaultVoted?: string;
  /** One line under the options: "Ends in 2 days". */
  meta?: React.ReactNode;
  /** Called with the option id when the viewer votes. */
  onVote?: (id: string) => void;
}

function Poll({ question, options, closed = false, defaultVoted, meta, onVote, className, ...props }: PollProps) {
  const [picked, setPicked] = React.useState<string | null>(null);
  const [voted, setVoted] = React.useState<string | null>(defaultVoted ?? null);
  const [announce, setAnnounce] = React.useState('');
  const resultsRef = React.useRef<HTMLHeadingElement>(null);
  const headingId = React.useId();
  const showResults = closed || voted !== null;

  const counts = options.map(o => o.votes + (o.id === voted ? 1 : 0));
  const total = counts.reduce((a, b) => a + b, 0);
  const top = Math.max(...counts);
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!picked) return;
    setVoted(picked);
    setAnnounce('Vote recorded. Results are shown.');
    onVote?.(picked);
  };
  // Move focus to the results after the viewer's own vote, so the vote button never leaves focus on nothing.
  React.useEffect(() => {
    if (announce) resultsRef.current?.focus();
  }, [announce]);

  const footer = (
    <p className="m-0 flex min-w-0 flex-wrap items-center gap-x-2 text-xs leading-4 text-muted-foreground">
      <span>{total.toLocaleString('en')} {total === 1 ? 'vote' : 'votes'}</span>
      {closed ? <span>· Closed</span> : null}
      {meta ? <span className="min-w-0 truncate">· {meta}</span> : null}
    </p>
  );

  return (
    <section
      data-slot="poll"
      data-state={showResults ? 'results' : 'vote'}
      aria-labelledby={headingId}
      className={cn('flex w-full min-w-0 max-w-[480px] flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      {showResults ? (
        <>
          <h3 id={headingId} ref={resultsRef} tabIndex={-1} className="m-0 text-base leading-6 font-semibold break-words outline-none">{question}</h3>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {options.map((o, i) => {
              const winner = counts[i] === top && top > 0;
              const mine = o.id === voted;
              return (
                <li
                  key={o.id}
                  data-winner={winner ? 'true' : undefined}
                  data-mine={mine ? 'true' : undefined}
                  className="relative flex min-w-0 flex-col gap-1.5 rounded-md border border-border p-3"
                >
                  <span className="sr-only">
                    {o.label}, {pct(counts[i])} percent, {counts[i].toLocaleString('en')} {counts[i] === 1 ? 'vote' : 'votes'}
                    {winner ? (closed ? ', winner' : ', leading') : ''}
                    {mine ? ', your vote' : ''}
                  </span>
                  <div aria-hidden="true" className="flex min-w-0 items-center gap-2 text-sm leading-5">
                    {winner ? <Check className="size-4 shrink-0 text-success" /> : null}
                    <span className={cn('min-w-0 flex-1 truncate', winner ? 'font-semibold' : 'font-medium')}>{o.label}</span>
                    {mine ? <Badge variant="soft-info" size="sm" shape="pill">Your vote</Badge> : null}
                    <span className="shrink-0 font-semibold tabular-nums">{pct(counts[i])}%</span>
                  </div>
                  <div aria-hidden="true" className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      style={{ width: `${pct(counts[i])}%` }}
                      className={cn('h-full rounded-full motion-safe:transition-[width] motion-safe:duration-[var(--duration-base,300ms)]', winner ? 'bg-primary' : 'bg-muted-foreground')}
                    />
                  </div>
                  <span aria-hidden="true" className="text-xs leading-4 text-muted-foreground">
                    {counts[i].toLocaleString('en')} {counts[i] === 1 ? 'vote' : 'votes'}
                    {winner ? (closed ? ' · Winner' : ' · Leading') : ''}
                  </span>
                </li>
              );
            })}
          </ul>
          {footer}
          <span role="status" aria-live="polite" className="sr-only">{announce}</span>
        </>
      ) : (
        <form onSubmit={submit} className="flex min-w-0 flex-col gap-3">
          <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
            <legend id={headingId} className="mb-3 max-w-full p-0 text-base leading-6 font-semibold break-words">{question}</legend>
            {options.map(o => (
              <label
                key={o.id}
                className="flex min-h-11 min-w-0 cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2 text-sm leading-5 hover:bg-accent has-[:checked]:border-primary has-[:focus-visible]:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
              >
                <input
                  type="radio"
                  name={`${headingId}-poll`}
                  value={o.id}
                  checked={picked === o.id}
                  onChange={() => setPicked(o.id)}
                  className="peer sr-only"
                />
                <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center rounded-full border border-input peer-checked:border-primary peer-checked:after:size-2 peer-checked:after:rounded-full peer-checked:after:bg-primary" />
                <span className="min-w-0 flex-1 break-words">{o.label}</span>
              </label>
            ))}
          </fieldset>
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            {footer}
            <Button type="submit" size="sm" disabled={!picked}>Vote</Button>
          </div>
        </form>
      )}
    </section>
  );
}

export { Poll };
