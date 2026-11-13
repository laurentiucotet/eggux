// EGG UI Billing Contact Card. Code only (no Figma component yet); Billing family.
// Who invoices go to: company, contact name, billing email (a mailto link), phone and the billing
// address, as a description list inside a Card with an Edit button. A missing email is said in
// words with a "Missing" badge ("No billing email. Invoices cannot be sent."), because an invoice
// that goes nowhere is the one problem on this card that costs money. Long emails and company names
// wrap or truncate. It shows data the server returns; it never validates or stores it.
import * as React from 'react';
import { Pencil } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardHeader } from './card';

export interface BillingContactCardProps extends Omit<React.ComponentProps<'div'>, 'title' | 'children'> {
  company?: string;
  name?: string;
  email?: string;
  phone?: string;
  /** Address lines, one per line. */
  address?: string[];
  onEdit?: () => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-xs leading-4 text-muted-foreground">{label}</dt>
      <dd className="m-0 min-w-0 text-sm leading-5 break-words">{children}</dd>
    </div>
  );
}

function BillingContactCard({ company, name, email, phone, address, onEdit, className, ...props }: BillingContactCardProps) {
  return (
    <Card data-slot="billing-contact-card" role="region" aria-label="Billing contact" className={cn('w-full max-w-sm', className)} {...props}>
      <CardHeader
        title="Billing contact"
        description="Invoices and payment reminders go here."
        action={
          <Button variant="outline" size="sm" leadingIcon={<Pencil />} onClick={onEdit} aria-label="Edit billing contact">
            Edit
          </Button>
        }
      />
      <CardContent>
        <dl className="m-0 grid min-w-0 grid-cols-1 gap-3">
          {company ? <Row label="Company">{company}</Row> : null}
          {name ? <Row label="Contact">{name}</Row> : null}
          <Row label="Billing email">
            {email ? (
              <a href={`mailto:${email}`} className="rounded-sm break-all text-foreground underline underline-offset-2 outline-none hover:no-underline focus-visible:ring-[3px] focus-visible:ring-ring/50">
                {email}
              </a>
            ) : (
              <span className="flex flex-wrap items-center gap-2">
                <Badge variant="soft-warning">Missing</Badge>
                <span>No billing email. Invoices cannot be sent.</span>
              </span>
            )}
          </Row>
          {phone ? <Row label="Phone">{phone}</Row> : null}
          {address && address.length > 0 ? (
            <Row label="Billing address">
              {address.map(line => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </Row>
          ) : null}
        </dl>
      </CardContent>
    </Card>
  );
}

export { BillingContactCard };
