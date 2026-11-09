// EGG UI Surveys page: Feedback Widget (443:7130), NPS Survey (443:7203), CSAT Rating (443:7241).
// All three are cards (card surface, border, radius xl, 20 padding).
// Feedback Widget: the question (ui/label), Yes / No (outline sm with thumbs; the picked one turns
// secondary, aria-pressed), then an optional comment (Textarea) and Send, then thanks in place
// (circle-check, role="status"). Focus moves to the comment after an answer.
// NPS Survey: the question (body/large), a 0-10 scale of 40 high score boxes 4 apart (picked one
// on primary), anchors "Not likely" / "Very likely" (ui/caption muted), then an optional follow-up
// with Skip and Send. The scale is a radiogroup (arrows move, the ends carry the anchors in their
// names); it wraps to two rows (0-5, 6-10) in containers under 420.
// CSAT Rating: the question, five faces (emoji over a word, 8 apart; picked on accent with a
// foreground border), then a muted thanks line. A radiogroup named by the question; the emoji is
// aria-hidden and each option is named by its word.
import * as React from 'react';
import { CircleCheck, ThumbsDown, ThumbsUp, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Textarea } from './textarea';

const card = 'relative flex w-full min-w-0 flex-col rounded-xl border border-border bg-card p-5 text-card-foreground';

/* Shared radiogroup keyboard: arrows move and select, Home / End jump. */
function useRadioKeys(count: number, value: number | null, onChange: (i: number) => void) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i + 1) % count
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i - 1 + count) % count
      : e.key === 'Home' ? 0 : e.key === 'End' ? count - 1 : null;
    if (next === null) return;
    e.preventDefault();
    onChange(next);
    refs.current[next]?.focus();
  };
  const tabIndex = (i: number) => (value === null ? (i === 0 ? 0 : -1) : value === i ? 0 : -1);
  return { refs, onKeyDown, tabIndex };
}

/* Feedback Widget */

export type FeedbackAnswer = 'yes' | 'no';

export interface FeedbackWidgetProps extends Omit<React.ComponentProps<'section'>, 'onSubmit'> {
  question?: string;
  thanks?: string;
  /** Called on Send (or right away when comments are off). */
  onSubmit?: (answer: FeedbackAnswer, comment: string) => void;
  /** Ask for an optional comment after the answer. */
  comment?: boolean;
  commentLabel?: (answer: FeedbackAnswer) => string;
}

function FeedbackWidget({
  question = 'Was this page helpful?',
  thanks = 'Thanks for the feedback.',
  onSubmit,
  comment = true,
  commentLabel = a => (a === 'no' ? 'What was missing? (optional)' : 'What could be better? (optional)'),
  className,
  ...props
}: FeedbackWidgetProps) {
  const id = React.useId();
  const [answer, setAnswer] = React.useState<FeedbackAnswer | null>(null);
  const [text, setText] = React.useState('');
  const [done, setDone] = React.useState(false);
  const textRef = React.useRef<HTMLTextAreaElement>(null);
  const pick = (a: FeedbackAnswer) => {
    setAnswer(a);
    if (!comment) { setDone(true); onSubmit?.(a, ''); }
  };
  React.useEffect(() => { if (answer && comment && !done) textRef.current?.focus(); }, [answer, comment, done]);
  return (
    <section data-slot="feedback-widget" data-state={done ? 'thanks' : answer ? 'comment' : 'ask'} aria-labelledby={done ? undefined : id} aria-label={done ? question : undefined} className={cn(card, 'gap-3', className)} {...props}>
      {done ? (
        <p role="status" className="m-0 flex items-center gap-2 text-sm leading-5 font-medium">
          <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-success" />
          <span className="line-clamp-2 min-w-0 flex-1">{thanks}</span>
        </p>
      ) : (
        <>
          <p id={id} className="m-0 line-clamp-2 text-sm leading-5 font-medium">{question}</p>
          <div role="group" aria-labelledby={id} className="flex items-start gap-2">
            {(['yes', 'no'] as const).map(a => (
              <Button key={a} size="sm" variant={answer === a ? 'secondary' : 'outline'} aria-pressed={answer === a} onClick={() => pick(a)}>
                {a === 'yes' ? <ThumbsUp aria-hidden="true" /> : <ThumbsDown aria-hidden="true" />}
                {a === 'yes' ? 'Yes' : 'No'}
              </Button>
            ))}
          </div>
          {answer && comment ? (
            <>
              <Textarea ref={textRef} aria-label={commentLabel(answer)} placeholder={commentLabel(answer)} value={text} onChange={e => setText(e.target.value)} />
              <Button size="sm" className="self-start" onClick={() => { setDone(true); onSubmit?.(answer, text.trim()); }}>Send</Button>
            </>
          ) : null}
        </>
      )}
    </section>
  );
}

/* NPS Survey */

export interface NpsSurveyProps extends Omit<React.ComponentProps<'section'>, 'onSubmit' | 'defaultValue'> {
  question?: string;
  followUp?: string;
  lowLabel?: string;
  highLabel?: string;
  value?: number | null;
  defaultValue?: number | null;
  /** One tap records the score. */
  onScore?: (score: number) => void;
  onSubmit?: (score: number, comment: string) => void;
  onDismiss?: () => void;
}

function NpsSurvey({
  question = 'How likely are you to recommend Acme to a colleague?',
  followUp = 'What is the main reason for your score?',
  lowLabel = 'Not likely',
  highLabel = 'Very likely',
  value: valueProp,
  defaultValue = null,
  onScore,
  onSubmit,
  onDismiss,
  className,
  ...props
}: NpsSurveyProps) {
  const id = React.useId();
  const [inner, setInner] = React.useState<number | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const [text, setText] = React.useState('');
  const set = (i: number) => { setInner(i); onScore?.(i); };
  const keys = useRadioKeys(11, value, set);
  return (
    <section data-slot="nps-survey" data-state={value === null ? 'unanswered' : 'answered'} aria-labelledby={id} className={cn(card, '@container gap-4', className)} {...props}>
      <h2 id={id} className={cn('m-0 text-lg leading-7 font-semibold', onDismiss && 'pr-8')}>{question}</h2>
      {onDismiss ? <ButtonIcon variant="ghost" size="sm" icon={<X />} label="Dismiss survey" className="absolute top-4 right-4" onClick={onDismiss} /> : null}
      <div>
        <div role="radiogroup" aria-labelledby={id} className="grid grid-cols-6 gap-1 @min-[420px]:grid-cols-11">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              ref={el => { keys.refs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={value === i}
              aria-label={i === 0 ? `0, ${lowLabel}` : i === 10 ? `10, ${highLabel}` : String(i)}
              tabIndex={keys.tabIndex(i)}
              onKeyDown={e => keys.onKeyDown(e, i)}
              onClick={() => set(i)}
              className={cn(
                'flex h-10 min-w-0 items-center justify-center rounded-md text-sm leading-5 font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                value === i ? 'bg-primary text-primary-foreground' : 'border border-input text-foreground hover:bg-accent',
              )}
            >
              {i}
            </button>
          ))}
        </div>
        <div aria-hidden="true" className="mt-4 flex text-xs leading-4 text-muted-foreground">
          <span className="min-w-0 flex-1">{lowLabel}</span>
          <span className="shrink-0">{highLabel}</span>
        </div>
      </div>
      {value !== null ? (
        <>
          <label htmlFor={`${id}-comment`} className="text-sm leading-5 font-medium">{followUp}</label>
          <Textarea id={`${id}-comment`} placeholder="Optional" value={text} onChange={e => setText(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => onSubmit?.(value, '')}>Skip</Button>
            <Button size="sm" onClick={() => onSubmit?.(value, text.trim())}>Send</Button>
          </div>
        </>
      ) : null}
    </section>
  );
}

/* CSAT Rating */

export interface CsatOption { emoji: string; label: string }

const csatDefault: CsatOption[] = [
  { emoji: '😞', label: 'Very poor' },
  { emoji: '😕', label: 'Poor' },
  { emoji: '😐', label: 'OK' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😀', label: 'Very good' },
];

export interface CsatRatingProps extends Omit<React.ComponentProps<'section'>, 'onChange' | 'defaultValue'> {
  question?: string;
  options?: CsatOption[];
  value?: number | null;
  defaultValue?: number | null;
  /** 0 (worst) to 4 (best). */
  onChange?: (index: number) => void;
  /** Shown after a rating, in a status region. */
  answeredText?: React.ReactNode;
}

function CsatRating({
  question = 'How was your support experience?',
  options = csatDefault,
  value: valueProp,
  defaultValue = null,
  onChange,
  answeredText = 'Thanks. Tell us more in the reply to the ticket email.',
  className,
  ...props
}: CsatRatingProps) {
  const id = React.useId();
  const [inner, setInner] = React.useState<number | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const set = (i: number) => { setInner(i); onChange?.(i); };
  const keys = useRadioKeys(options.length, value, set);
  return (
    <section data-slot="csat-rating" data-state={value === null ? 'unanswered' : 'answered'} aria-labelledby={id} className={cn(card, 'gap-4', className)} {...props}>
      <h2 id={id} className="m-0 text-sm leading-5 font-medium">{question}</h2>
      <div role="radiogroup" aria-labelledby={id} className="flex gap-2">
        {options.map((o, i) => (
          <button
            key={o.label}
            ref={el => { keys.refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={value === i}
            tabIndex={keys.tabIndex(i)}
            onKeyDown={e => keys.onKeyDown(e, i)}
            onClick={() => set(i)}
            className={cn(
              'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-md border py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
              value === i ? 'border-foreground bg-accent' : 'border-border hover:bg-accent',
            )}
          >
            <span aria-hidden="true" className="text-xl leading-7">{o.emoji}</span>
            {/* Muted on the accent fill is under 4.5:1: the filled-muted token when picked. */}
            <span className={cn('max-w-full truncate px-1 text-xs leading-4', value === i ? 'text-[var(--input-filled-muted-foreground)]' : 'text-muted-foreground')}>{o.label}</span>
          </button>
        ))}
      </div>
      <p role="status" className={cn('m-0 text-sm leading-5 text-muted-foreground', value === null && 'sr-only')}>{value !== null ? answeredText : ''}</p>
    </section>
  );
}

export { CsatRating, FeedbackWidget, NpsSurvey };
