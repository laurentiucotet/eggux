// EGG UI Avatar, Avatar Status and Avatar Verified. Figma: Avatar page, "Avatar / Component"
// (Avatar, Avatar Status, Avatar Verified). Type (initials, image, icon) x Size (xs 20, sm 24,
// default 32, lg 40, xl 48, 2xl 64, 3xl 96) x Shape (circle, square), Initials, Photo, Icon,
// Show status (online, away, busy, offline), Show verified. shadcn Avatar on Radix: the image shows
// once it has loaded, the initials (or the icon) stay as the fallback. Initials are cut to two
// letters. The photo is alt="": with `name` the avatar has a text equivalent ("Ana Popescu, away"); without it the
// avatar is decorative (the name is right next to it) and only the status text stays for screen
// readers. Status and verified share the bottom-right corner: use one, never both.
import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, User } from '@/components/icons';
import { cn } from '@/lib/utils';

export type AvatarSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarType = 'initials' | 'image' | 'icon';
export type AvatarStatusValue = 'online' | 'away' | 'busy' | 'offline';

// Figma sizes and the initials text style per Size (ui/label-small to heading/h2).
const avatarVariants = cva('relative inline-flex shrink-0 select-none items-center justify-center', {
  variants: {
    size: {
      xs: 'size-5 text-xs leading-4 font-medium',
      sm: 'size-6 text-xs leading-4 font-medium',
      default: 'size-8 text-xs leading-4 font-medium',
      lg: 'size-10 text-sm leading-5 font-medium',
      xl: 'size-12 text-lg leading-7 font-semibold',
      '2xl': 'size-16 text-2xl leading-8 font-semibold',
      '3xl': 'size-24 text-3xl leading-9 font-semibold tracking-[-0.4px]',
    },
  },
  defaultVariants: { size: 'default' },
});

// Shape=square: radius md up to default, lg from lg up.
const squareRadius: Record<AvatarSize, string> = {
  xs: 'rounded-md', sm: 'rounded-md', default: 'rounded-md',
  lg: 'rounded-lg', xl: 'rounded-lg', '2xl': 'rounded-lg', '3xl': 'rounded-lg',
};
// Avatar Status dot and Avatar Verified tick per Avatar Size (Figma instance sizes).
const statusSize: Record<AvatarSize, string> = {
  xs: 'size-[7px]', sm: 'size-[7px]', default: 'size-2.5', lg: 'size-3', xl: 'size-3.5', '2xl': 'size-4', '3xl': 'size-5',
};
const verifiedSize: Record<AvatarSize, string> = {
  xs: 'size-2.5', sm: 'size-3', default: 'size-3.5', lg: 'size-4', xl: 'size-[18px]', '2xl': 'size-[22px]', '3xl': 'size-7',
};

const statusColor: Record<AvatarStatusValue, string> = {
  online: 'bg-success',
  away: 'bg-warning',
  busy: 'bg-destructive',
  offline: 'bg-muted-foreground',
};
const statusText: Record<AvatarStatusValue, string> = { online: 'online', away: 'away', busy: 'busy', offline: 'offline' };

/** Avatar Group passes its Size and the 2 px ring to the avatars in its slot. */
const AvatarGroupContext = React.createContext<{ size: AvatarSize; ring: boolean } | null>(null);

export interface AvatarStatusProps extends React.ComponentProps<'span'> {
  /** Figma Status. */
  status?: AvatarStatusValue;
  /** Screen reader text; default the status name. */
  label?: string;
}

/** Figma Avatar Status: presence dot with a 2 px background ring. Part of Avatar, not used alone. */
function AvatarStatus({ status = 'online', label, className, ...props }: AvatarStatusProps) {
  return (
    <span
      data-slot="avatar-status"
      data-status={status}
      className={cn('absolute right-0 bottom-0 block size-2.5 rounded-full ring-2 ring-background', statusColor[status], className)}
      {...props}
    >
      <span className="sr-only">{label ?? `, ${statusText[status]}`}</span>
    </span>
  );
}

export interface AvatarVerifiedProps extends React.ComponentProps<'span'> {
  /** Screen reader text. */
  label?: string;
}

/** Figma Avatar Verified: info circle with a check, 2 px background ring. Part of Avatar. */
function AvatarVerified({ label = ', verified', className, ...props }: AvatarVerifiedProps) {
  return (
    <span
      data-slot="avatar-verified"
      className={cn('absolute right-0 bottom-0 flex size-4 items-center justify-center rounded-full bg-info text-info-foreground ring-2 ring-background', className)}
      {...props}
    >
      <Check aria-hidden="true" className="size-[62.5%]" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export interface AvatarProps extends Omit<React.ComponentProps<'span'>, 'children'>, Omit<VariantProps<typeof avatarVariants>, 'size'> {
  /** Figma Type. Default: image when `src` is set, else initials. */
  type?: AvatarType;
  /** Figma Size. Inside an Avatar Group the group's Size wins. */
  size?: AvatarSize;
  /** Figma Shape: circle for people, square for companies, workspaces and apps. */
  shape?: AvatarShape;
  /** Figma Initials: two letters; longer text is cut to two. */
  initials?: string;
  /** Figma Photo (Type=image): the person's photo URL. Initials show until it loads or if it fails. */
  src?: string;
  /** Figma Icon (Type=icon): User (default), Bot or Users from `@/components/icons`. */
  icon?: React.ReactNode;
  /** The person's name: the avatar's text equivalent. Leave empty when the name is right next to it. */
  name?: string;
  /** Figma Show status + Status. */
  status?: AvatarStatusValue;
  /** Figma Show verified. */
  verified?: boolean;
}

function Avatar({
  type,
  size: sizeProp,
  shape = 'circle',
  initials = 'AP',
  src,
  icon,
  name,
  status,
  verified = false,
  className,
  ...props
}: AvatarProps) {
  const group = React.useContext(AvatarGroupContext);
  const size: AvatarSize = group?.size ?? sizeProp ?? 'default';
  const kind: AvatarType = type ?? (src ? 'image' : 'initials');
  const radius = shape === 'square' ? squareRadius[size] : 'rounded-full';
  const glyph = (
    <span aria-hidden="true" className="flex size-1/2 items-center justify-center text-muted-foreground [&>svg]:size-full">
      {icon ?? <User />}
    </span>
  );
  const letters = (
    <span aria-hidden="true" className="min-w-0 overflow-hidden text-center text-ellipsis whitespace-nowrap">
      {initials.slice(0, 2)}
    </span>
  );

  return (
    <span data-slot="avatar" data-size={size} data-shape={shape} data-type={kind} className={cn(avatarVariants({ size }), className)} {...props}>
      <AvatarPrimitive.Root
        data-slot="avatar-surface"
        className={cn(
          'absolute inset-0 flex items-center justify-center overflow-hidden bg-muted text-foreground',
          radius,
          group?.ring && 'ring-2 ring-background',
        )}
      >
        {kind === 'image' && src ? (
          <AvatarPrimitive.Image data-slot="avatar-image" src={src} alt="" className="size-full object-cover" />
        ) : null}
        <AvatarPrimitive.Fallback data-slot="avatar-fallback" delayMs={kind === 'image' ? 300 : undefined} className="flex size-full items-center justify-center">
          {kind === 'icon' || (kind === 'image' && !initials) ? glyph : letters}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {name ? <span className="sr-only">{name}</span> : null}
      {status ? <AvatarStatus status={status} className={statusSize[size]} /> : null}
      {verified && !status ? <AvatarVerified className={verifiedSize[size]} /> : null}
    </span>
  );
}

export { Avatar, AvatarStatus, AvatarVerified, AvatarGroupContext, avatarVariants };
