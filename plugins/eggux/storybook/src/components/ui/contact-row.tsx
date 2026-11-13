// EGG UI Contact Row. Code only (no Figma component yet). Mobile page. One person in a contact list:
// an avatar, the name and the phone number (each on one line, truncated) and up to three round
// buttons, Call, Message and Video, 44 x 44 each and named after the person ("Call Maya Lopez").
// No swipe needed: every action is a visible button. The row is a plain block: put rows in a list
// (ul / li) and give it a divider. Hide an action by leaving it out of `actions`; an action with no
// handler is disabled. Not for a person with a profile page to open (use Person Card).
import * as React from 'react';
import { MessageSquare, Monitor, Phone } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar, type AvatarStatusValue } from './avatar';
import { Button } from './button';

export type ContactAction = 'call' | 'message' | 'video';

export interface ContactRowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  name: string;
  /** The phone number as it is shown ("+40 721 555 014"). */
  number: string;
  /** Two letters when there is no photo. Default: first letters of the name. */
  initials?: string;
  src?: string;
  status?: AvatarStatusValue;
  /** Which buttons show, in this order. Default call, message, video. */
  actions?: ContactAction[];
  onCall?: () => void;
  onMessage?: () => void;
  onVideo?: () => void;
}

const meta: Record<ContactAction, { label: string; icon: React.ReactNode }> = {
  call: { label: 'Call', icon: <Phone /> },
  message: { label: 'Message', icon: <MessageSquare /> },
  // TODO: a Video icon (camera) is not in the icon set yet; Monitor stands in.
  video: { label: 'Video call', icon: <Monitor /> },
};

function ContactRow({ name, number, initials, src, status, actions = ['call', 'message', 'video'], onCall, onMessage, onVideo, className, ...props }: ContactRowProps) {
  const handler = { call: onCall, message: onMessage, video: onVideo };
  const letters = initials ?? name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div data-slot="contact-row" className={cn('flex min-h-16 w-full min-w-0 items-center gap-3 px-3 py-2', className)} {...props}>
      <Avatar size="lg" initials={letters} src={src} status={status} aria-hidden="true" className="shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="block truncate text-base leading-6 font-medium text-foreground">{name}</span>
        <span className="block truncate text-sm leading-5 text-foreground/80">{number}</span>
      </div>
      <div className="flex shrink-0 items-center">
        {actions.map(a => (
          <Button
            key={a}
            type="button"
            variant="ghost"
            size="touch"
            aria-label={`${meta[a].label} ${name}`}
            disabled={!handler[a]}
            onClick={handler[a]}
            className="size-11 rounded-full px-0 [&_svg]:size-5"
          >
            {meta[a].icon}
          </Button>
        ))}
      </div>
    </div>
  );
}

export { ContactRow };
