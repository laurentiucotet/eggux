import * as React from 'react';
import { Copy, Download, Ellipsis, Share2, Trash2 } from '@/components/icons';
import { ActionSheet } from '@/components/ui/action-sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { BottomActionBar } from '@/components/ui/bottom-action-bar';
import { Button } from '@/components/ui/button';
import { ButtonIcon } from '@/components/ui/button-icon';
import { DescriptionList, DescriptionListItem } from '@/components/ui/description-list';
import { EmptyState } from '@/components/ui/empty-state';
import { InvoiceLineItemList, InvoiceLineItemRow } from '@/components/ui/invoice-line-item-row';
import { MobileHeader } from '@/components/ui/mobile-header';
import { SummaryList, SummaryRow } from '@/components/ui/summary-row';
import { PhoneScreen } from './mobile-parts';
import { money, statusVariant, type InvoiceStatus } from './mobile-invoices';

const lines = [
  { description: 'Brand identity workshop', detail: 'Two days on site', quantity: 2, unitPrice: 48000 },
  { description: 'Design system audit', detail: 'Oct 1 to Oct 31', quantity: 1, unitPrice: 26000 },
  { description: 'Icon set licence', detail: 'SKU IC-204', quantity: 3, unitPrice: 3500 },
];
const credit = { description: 'Loyalty discount', amount: 12000 };

export interface MobileInvoiceDetailPageProps {
  initialStatus?: InvoiceStatus;
  /** Open the Action Sheet at the start. */
  initialSheetOpen?: boolean;
  /** Open the delete confirmation at the start. */
  initialConfirmOpen?: boolean;
}

/** One invoice on a phone: a detail header with an action sheet, the customer, the lines, the total and the decision in a Bottom Action Bar. */
export function MobileInvoiceDetailPage({ initialStatus = 'Sent', initialSheetOpen = false, initialConfirmOpen = false }: MobileInvoiceDetailPageProps) {
  const [status, setStatus] = React.useState<InvoiceStatus>(initialStatus);
  const [sheetOpen, setSheetOpen] = React.useState(initialSheetOpen);
  const [confirmOpen, setConfirmOpen] = React.useState(initialConfirmOpen);
  const [deleted, setDeleted] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [reminded, setReminded] = React.useState(false);

  const subtotal = lines.reduce((a, l) => a + l.quantity * l.unitPrice, 0);
  const tax = Math.round((subtotal - credit.amount) * 0.2);
  const total = subtotal - credit.amount + tax;
  const paid = status === 'Paid';

  const header = (
    <MobileHeader
      type="detail"
      title="INV-2041"
      backLabel="Back to invoices"
      onBack={() => {
        window.location.hash = 'invoices';
      }}
      trailing={
        deleted ? null : (
          <ActionSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            title="INV-2041"
            description="Northwind Traders · €1,446.00"
            trigger={<ButtonIcon variant="ghost" icon={<Ellipsis />} label="More actions for INV-2041" className="min-h-11 min-w-11" showTooltip={false} />}
            actions={[
              { label: 'Share', icon: <Share2 />, onSelect: () => setMessage('Link to INV-2041 copied.') },
              { label: 'Duplicate', icon: <Copy />, onSelect: () => setMessage('Duplicated as INV-2042, saved as a draft.') },
              { label: 'Download PDF', icon: <Download />, onSelect: () => setMessage('INV-2041.pdf is ready.') },
              { label: 'Delete', icon: <Trash2 />, destructive: true, onSelect: () => setConfirmOpen(true) },
            ]}
          />
        )
      }
    />
  );

  const confirm = (
    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <AlertDialogContent type="destructive">
        <AlertDialogHeader title="Delete INV-2041?" description="The invoice and its payment history are removed. Northwind Traders will no longer see it. This cannot be undone." />
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              setDeleted(true);
              setMessage('');
            }}
          >
            Delete invoice
          </AlertDialogAction>
          <AlertDialogCancel>Keep invoice</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (deleted) {
    return (
      <PhoneScreen header={header}>
        <EmptyState
          size="sm"
          title="Invoice deleted"
          description="INV-2041 is gone. Your other invoices are untouched."
          headingLevel={2}
          actions={<Button asChild size="touch"><a href="#invoices">Back to invoices</a></Button>}
        />
        {confirm}
      </PhoneScreen>
    );
  }

  return (
    <PhoneScreen
      header={header}
      className="px-4 pt-4 pb-6"
      footer={
        <BottomActionBar label="Invoice actions">
          <Button
            type="button"
            size="touch"
            disabled={paid}
            onClick={() => {
              setStatus('Paid');
              setMessage('INV-2041 marked as paid.');
            }}
          >
            {paid ? 'Paid' : 'Mark as paid'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="touch"
            disabled={paid || reminded}
            onClick={() => {
              setReminded(true);
              setMessage('Reminder sent to billing@northwind.example.');
            }}
          >
            {reminded ? 'Reminder sent' : 'Send reminder'}
          </Button>
        </BottomActionBar>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <Badge variant={statusVariant[status]} size="lg" dot>{status}</Badge>
          <span className="text-sm leading-5 text-muted-foreground">{paid ? 'Paid Nov 13' : 'Due Nov 28'}</span>
        </div>
        <p role="status" className="m-0 min-h-5 text-sm leading-5 text-muted-foreground">{message}</p>

        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-base leading-6 font-semibold">Customer</h2>
          <DescriptionList>
            <DescriptionListItem label="Name">Northwind Traders</DescriptionListItem>
            <DescriptionListItem label="Billing email">billing@northwind.example</DescriptionListItem>
            <DescriptionListItem label="Issued">Nov 13, 2026</DescriptionListItem>
          </DescriptionList>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-base leading-6 font-semibold">Items</h2>
          <InvoiceLineItemList aria-label="Line items">
            {lines.map(l => (
              <InvoiceLineItemRow key={l.description} description={l.description} detail={l.detail} quantity={l.quantity} unitPrice={money(l.unitPrice)} amount={money(l.quantity * l.unitPrice)} />
            ))}
            <InvoiceLineItemRow description={credit.description} amount={money(credit.amount)} credit />
          </InvoiceLineItemList>
        </div>

        <h2 className="sr-only">Totals</h2>
        <SummaryList>
          <SummaryRow label="Subtotal" value={money(subtotal - credit.amount)} />
          <SummaryRow label="VAT (20%)" value={money(tax)} />
          <SummaryRow label="Total (EUR)" value={money(total)} variant="total" />
        </SummaryList>
      </div>
      {confirm}
    </PhoneScreen>
  );
}
