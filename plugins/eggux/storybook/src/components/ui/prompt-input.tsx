// EGG UI Prompt Input. Figma: Prompt Input (AI Chat / Prompt Input / Component).
// State (default, focus, streaming, disabled) and Content (placeholder, filled) match the Figma
// variants: focus is the focus-within ring, Content follows the textarea value, streaming swaps
// Send for Stop. Slots Attachments and Tools are ReactNode props.
import * as React from 'react';
import { ArrowUp, Mic, Paperclip, Square } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface PromptInputProps extends Omit<React.ComponentProps<'div'>, 'onSubmit' | 'defaultValue'> {
  /** Controlled value of the text area. */
  value?: string;
  /** Initial value when uncontrolled (Figma Content=filled). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the text on Enter or Send. Uncontrolled inputs clear after sending. */
  onSubmit?: (value: string) => void;
  /** Figma State=streaming: Send becomes Stop. */
  streaming?: boolean;
  onStop?: () => void;
  /** Figma State=disabled. */
  disabled?: boolean;
  /** Figma Placeholder: an example, never the label. */
  placeholder?: string;
  /** Accessible label of the text area. */
  label?: string;
  /** Figma Attachments slot (Show attachments): Attachment and Context Chip items. */
  attachments?: React.ReactNode;
  /** Figma Tools slot (Show tools): tools and Model Picker. */
  tools?: React.ReactNode;
  /** Figma Show voice. */
  showVoice?: boolean;
  onVoice?: () => void;
  /** Attach button; hidden when not given. */
  onAttach?: () => void;
}

function PromptInput({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSubmit,
  streaming = false,
  onStop,
  disabled = false,
  placeholder = 'Ask anything…',
  label = 'Message',
  attachments,
  tools,
  showVoice = true,
  onVoice,
  onAttach,
  className,
  ...props
}: PromptInputProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const filled = value.trim().length > 0;

  const setValue = (next: string) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  const submit = () => {
    if (!filled || streaming || disabled) return;
    onSubmit?.(value);
    if (!controlled) setInner('');
    // Focus returns to the input after sending.
    textareaRef.current?.focus();
  };

  return (
    <div
      data-slot="prompt-input"
      data-state={streaming ? 'streaming' : disabled ? 'disabled' : 'default'}
      data-content={filled ? 'filled' : 'placeholder'}
      className={cn(
        'flex w-full flex-col gap-2 rounded-xl border border-input bg-background p-3 text-foreground transition-[border-color,box-shadow] duration-[var(--duration-fast)]',
        'focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
        disabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {attachments ? <fieldset data-slot="prompt-input-attachments" disabled={disabled} className="m-0 flex min-w-0 flex-wrap items-start gap-2 border-0 p-0">{attachments}</fieldset> : null}

      <div className="flex min-h-12 w-full px-2 pt-1">
        <textarea
          ref={textareaRef}
          data-slot="prompt-input-textarea"
          aria-label={label}
          rows={1}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            // Enter sends, Shift+Enter adds a new line; never send mid IME composition.
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          // Grows with the text to about 8 lines (8 × 28 px), then scrolls.
          className="field-sizing-content max-h-56 min-h-7 w-full resize-none overflow-y-auto bg-transparent text-base leading-7 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          {onAttach ? (
            <Button variant="ghost" size="icon" aria-label="Attach files" title="Attach files" disabled={disabled} onClick={onAttach}>
              <Paperclip aria-hidden="true" />
            </Button>
          ) : null}
          {/* A disabled fieldset disables every control put in the Tools slot along with the field. */}
          {tools ? <fieldset data-slot="prompt-input-tools" disabled={disabled} className="m-0 flex min-w-0 items-center gap-1 border-0 p-0">{tools}</fieldset> : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {showVoice ? (
            <Button variant="ghost" size="icon" aria-label="Dictate" title="Dictate" disabled={disabled || streaming} onClick={onVoice}>
              <Mic aria-hidden="true" />
            </Button>
          ) : null}
          {streaming ? (
            <Button size="icon" aria-label="Stop" title="Stop" onClick={onStop}>
              <Square aria-hidden="true" />
            </Button>
          ) : (
            <Button size="icon" aria-label="Send" title="Send" disabled={disabled || !filled} onClick={submit}>
              <ArrowUp aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export { PromptInput };
