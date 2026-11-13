// EGG UI Endpoint Badge. Code only (no Figma component yet); family Developer.
// An HTTP method badge (GET, POST, PUT, PATCH, DELETE) followed by the path in the mono style.
// The method is a soft Badge: the word is always shown, so color is never the only signal (GET info,
// POST success, PUT warning, PATCH category-3, DELETE destructive). The method badge has a fixed
// minimum width so a list of endpoints lines up. The path truncates on one line with its full value
// in a title; `wrap` lets it break instead. Read by screen readers as "GET /v1/invoices".
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge, type BadgeProps } from './badge';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const methodVariant: Record<HttpMethod, NonNullable<BadgeProps['variant']>> = {
  GET: 'soft-info',
  POST: 'soft-success',
  PUT: 'soft-warning',
  PATCH: 'category-3',
  DELETE: 'soft-destructive',
};

export interface EndpointBadgeProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  /** The HTTP method. */
  method: HttpMethod;
  /** The path, starting with a slash: "/v1/invoices/{id}". */
  path: string;
  /** Badge size of the method. Default default. */
  size?: 'sm' | 'default' | 'lg';
  /** Break a long path onto more lines instead of truncating it. */
  wrap?: boolean;
}

function EndpointBadge({ method, path, size = 'default', wrap = false, className, ...props }: EndpointBadgeProps) {
  return (
    <span data-slot="endpoint-badge" data-method={method} className={cn('inline-flex min-w-0 max-w-full gap-2', wrap ? 'items-start' : 'items-center', className)} {...props}>
      <Badge variant={methodVariant[method]} size={size} className="min-w-14 font-mono">
        {method}
      </Badge>
      <code
        data-slot="endpoint-badge-path"
        title={path}
        className={cn('min-w-0 font-mono text-sm leading-5 text-foreground', wrap ? 'break-all' : 'truncate')}
      >
        {path}
      </code>
    </span>
  );
}

export { EndpointBadge };
