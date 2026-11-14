import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { AddressForm, MultiStepForm, Payment } from './form-data-blocks';

const meta = {
  title: 'Blocks/Forms/Forms',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Data forms of the Forms page: Payment, Address, Multi-step Form, Account Settings Form and Waitlist. Fields are checked when people leave them and on submit; the first wrong field takes focus, long forms show an Error Summary. Payment uses plain inputs with cc-* autocomplete (no provider) and never logs values. Figma: BLOCKS / Forms. Guides: eggux build-ui/patterns/form-validation.md, multi-step-form.md' } },
  },
} satisfies Meta;
export default meta;

const Stage = ({ children }: { children: ReactNode }) => <div className="flex min-h-[640px] items-start justify-center bg-background p-10 max-sm:p-0">{children}</div>;
const cat = (c: string) => ({ table: { category: c } });
const box = (el: Element) => el.getBoundingClientRect();
const described = (el: HTMLElement, text: string) => expect(el).toHaveAccessibleDescription(expect.stringContaining(text));
const TODAY = new Date(2026, 10, 14);
const FILLED = { name: 'Maria Ilie', email: 'maria@northwind.com', phone: '+40712345678' };

export const PaymentStory: StoryObj<{ title: string; amount: string }> = {
  name: 'Payment',
  args: { title: 'Payment details', amount: '€250' },
  argTypes: {
    title: { name: 'Title', control: 'text', ...cat('Content') },
    amount: { name: 'Amount', control: 'text', description: 'Formatted amount in the description and the button.', ...cat('Content') },
  },
  render: a => <Stage><Payment title={a.title} amount={a.amount} today={TODAY} /></Stage>,
};

export const AddressStory: StoryObj<{ title: string; description: string; submitLabel: string }> = {
  name: 'Address',
  args: { title: 'Billing address', description: 'Shown on invoices.', submitLabel: 'Save address' },
  argTypes: {
    title: { name: 'Title', control: 'text', ...cat('Content') },
    description: { name: 'Description', control: 'text', ...cat('Content') },
    submitLabel: { name: 'Submit label', control: 'text', ...cat('Content') },
  },
  render: a => <Stage><AddressForm title={a.title} description={a.description} submitLabel={a.submitLabel} /></Stage>,
};

export const MultiStepStory: StoryObj<{ step: number }> = {
  name: 'Multi-step Form',
  args: { step: 1 },
  argTypes: { step: { name: 'Start on step', control: { type: 'inline-radio' }, options: [0, 1, 2], description: '0 Customer, 1 Details, 2 Confirm; earlier steps come filled.', ...cat('State') } },
  render: a => (
    <div className="flex justify-center bg-background p-10 max-sm:p-4">
      <MultiStepForm key={a.step} defaultStep={a.step} today={TODAY} defaultValues={a.step > 0 ? FILLED : undefined} />
    </div>
  ),
};

/* Hidden checks */

const onPay = fn();
export const PaymentCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><Payment today={TODAY} onSubmit={onPay} /></Stage>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const number = c.getByRole('textbox', { name: /^Card number/ });
    const expiry = c.getByRole('textbox', { name: /^Expiry/ });
    const cvc = c.getByRole('textbox', { name: /^CVC/ });
    const name = c.getByRole('textbox', { name: /^Name on card/ });
    const postal = c.getByRole('textbox', { name: /^Postal code/ });
    await expect(number).toHaveAttribute('autocomplete', 'cc-number');
    await expect(expiry).toHaveAttribute('autocomplete', 'cc-exp');
    await expect(cvc).toHaveAttribute('autocomplete', 'cc-csc');
    await expect(name).toHaveAttribute('autocomplete', 'cc-name');
    await described(postal, '6 digits');
    await userEvent.click(c.getByRole('button', { name: 'Pay €250' }));
    await waitFor(() => expect(number).toHaveFocus());
    await described(number, 'Enter the card number.');
    const country = c.getByRole('combobox', { name: /^Country/ });
    await expect(country).toHaveAttribute('aria-invalid', 'true');
    await described(country, 'Select a country.');
    await described(postal, 'Enter the postal code.');
    // Formatting as people type; the brand appears; a wrong checksum is caught.
    await userEvent.type(number, '4242424242424241');
    await expect(number).toHaveValue('4242 4242 4242 4241');
    await expect(canvasElement.querySelector('[data-slot=card-brand]')).toHaveTextContent('VISA');
    await described(number, 'Check the card number');
    await userEvent.clear(number);
    await userEvent.type(number, '4242424242424242');
    await waitFor(() => expect(number).not.toHaveAttribute('aria-invalid'));
    await userEvent.type(expiry, '1025');
    await expect(expiry).toHaveValue('10 / 25');
    await described(expiry, 'This card has expired.');
    await userEvent.clear(expiry);
    await userEvent.type(expiry, '1028');
    await userEvent.type(cvc, '12a3');
    await expect(cvc).toHaveValue('123');
    await userEvent.type(name, 'Ana Popescu');
    await userEvent.click(country);
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Romania' }));
    await userEvent.type(postal, '400001');
    await userEvent.click(c.getByRole('button', { name: 'Pay €250' }));
    await expect(onPay).toHaveBeenCalledWith({ number: '4242 4242 4242 4242', expiry: '10 / 28', cvc: '123', name: 'Ana Popescu', country: 'RO', postalCode: '400001' });
  },
};

const onSave = fn();
export const AddressCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><AddressForm onSubmit={onSave} /></Stage>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Save address' }));
    const street = c.getByRole('textbox', { name: /^Street and number/ });
    await waitFor(() => expect(street).toHaveFocus());
    await described(street, 'Enter the street and number.');
    await described(c.getByRole('combobox', { name: /^County/ }), 'Select a county.');
    await userEvent.type(street, 'Str. Memorandumului 28');
    await userEvent.type(c.getByRole('textbox', { name: /^City/ }), 'Cluj-Napoca');
    const postal = c.getByRole('textbox', { name: /^Postal code/ });
    await userEvent.type(postal, '4000');
    await described(postal, 'Enter a postal code with 6 digits.');
    await userEvent.type(postal, '01');
    await userEvent.click(c.getByRole('combobox', { name: /^County/ }));
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Cluj' }));
    await userEvent.click(c.getByRole('button', { name: 'Save address' }));
    await expect(onSave).toHaveBeenCalledWith({ street: 'Str. Memorandumului 28', city: 'Cluj-Napoca', postalCode: '400001', county: 'Cluj', country: 'RO' });
  },
};

// Cards at 1440, 768 and 390: 384 wide, two columns for the paired fields, no overflow, every control named.
export const CardsLayoutCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true }, a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } },
  render: () => (
    <div className="flex flex-col gap-8 bg-background">
      {[1440, 768, 390].map(w => (
        <div key={w} data-width={w} style={{ width: w }} className="flex flex-wrap items-start justify-center gap-6">
          <Payment today={TODAY} /><AddressForm />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const w of [1440, 768, 390]) {
      const frame = canvasElement.querySelector<HTMLElement>(`[data-width="${w}"]`)!;
      await expect(frame.scrollWidth).toBeLessThanOrEqual(w);
      for (const card of frame.querySelectorAll<HTMLElement>('[data-slot=auth-card]')) {
        await expect(Math.round(box(card).width)).toBe(384);
        await expect(within(card).getAllByRole('heading', { level: 2 })).toHaveLength(1);
        for (const el of card.querySelectorAll('a, button')) await expect(el).toHaveAccessibleName();
      }
    }
    const pay = within(canvasElement.querySelector<HTMLElement>('[data-width="1440"] [data-slot=auth-card]')!);
    const expiry = pay.getByRole('textbox', { name: /^Expiry/ });
    const cvc = pay.getByRole('textbox', { name: /^CVC/ });
    await expect(Math.round(box(expiry).top)).toBe(Math.round(box(cvc).top));
    await expect(Math.round(box(cvc).left - box(expiry).right)).toBe(16);
  },
};

const onRequest = fn();
export const MultiStepCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div className="p-6"><MultiStepForm today={TODAY} onSubmit={onRequest} defaultValues={{ date: new Date(2026, 11, 3) }} /></div>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('list', { name: 'Progress' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Continue to details' }));
    const name = c.getByRole('textbox', { name: /^Customer name/ });
    await waitFor(() => expect(name).toHaveFocus());
    await described(name, 'Enter the customer name.');
    await described(c.getByRole('textbox', { name: /^Phone/ }), 'Enter a phone number.');
    await userEvent.type(name, 'Maria Ilie');
    await userEvent.type(c.getByRole('textbox', { name: /^Work email/ }), 'maria@northwind.com');
    const phone = c.getByRole('textbox', { name: /^Phone/ });
    await userEvent.type(phone, '71234567');
    await described(phone, 'Enter a phone number with 9 digits.');
    await userEvent.type(phone, '8');
    await waitFor(() => expect(phone).not.toHaveAttribute('aria-invalid'));
    await userEvent.click(c.getByRole('button', { name: 'Continue to details' }));
    // Step 2: its heading takes focus; Back keeps the data and does not check.
    await waitFor(() => expect(c.getByRole('heading', { level: 2, name: 'Details' }).firstElementChild).toHaveFocus());
    await expect(c.getByRole('listitem', { current: 'step' })).toHaveTextContent('Details');
    await userEvent.click(c.getByRole('button', { name: 'Back' }));
    await expect(await c.findByRole('textbox', { name: /^Customer name/ })).toHaveValue('Maria Ilie');
    await userEvent.click(c.getByRole('button', { name: 'Continue to details' }));
    await userEvent.click(await c.findByRole('button', { name: 'Continue to confirm' }));
    const owner = c.getByRole('combobox', { name: /^Owner/ });
    await waitFor(() => expect(owner).toHaveFocus());
    await described(owner, 'Choose who the customer meets.');
    await userEvent.click(owner);
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Andrei Pop · Solutions engineer' }));
    await userEvent.click(c.getByRole('combobox', { name: /^Meeting type/ }));
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Check-up · 30 min' }));
    await userEvent.type(c.getByRole('textbox', { name: /^What would you like to cover/ }), 'Renewal terms');
    await userEvent.click(c.getByRole('button', { name: 'Continue to confirm' }));
    // Review with Edit per section; Edit goes back to the step.
    await expect(await c.findByText(/Andrei Pop · Solutions engineer · 3 Dec 2026 · Check-up · 30 min/)).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Edit customer' }));
    await expect(await c.findByRole('textbox', { name: /^Customer name/ })).toHaveValue('Maria Ilie');
    await userEvent.click(c.getByRole('button', { name: 'Continue to details' }));
    await userEvent.click(await c.findByRole('button', { name: 'Continue to confirm' }));
    await userEvent.click(await c.findByRole('button', { name: 'Send request' }));
    await expect(onRequest).toHaveBeenCalledWith(expect.objectContaining({ name: 'Maria Ilie', owner: 'andrei', meetingType: 'checkup', notes: 'Renewal terms' }));
    await expect(await c.findByText('Your meeting request is on its way')).toBeVisible();
  },
};

export const MultiStepDateCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div className="p-6"><MultiStepForm today={TODAY} defaultStep={1} defaultValues={FILLED} /></div>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Continue to confirm' }));
    const date = c.getByLabelText(/^Date/);
    await waitFor(() => expect(date).toHaveAttribute('aria-invalid', 'true'));
    await described(date, 'Choose a day for the meeting.');
  },
};

// 768 at 1440 and 768 wide, the Stepper; at 390 "Step 2 of 3 · Details" and a progress bar instead. No overflow.
export const MultiStepLayoutCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true }, a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } },
  render: () => (
    <div className="flex flex-col gap-8 bg-background">
      {[1440, 768, 390].map(w => (
        <div key={w} data-width={w} style={{ width: w }} className="flex justify-center">
          <MultiStepForm today={TODAY} defaultStep={1} defaultValues={FILLED} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const w of [1440, 768, 390]) {
      const frame = canvasElement.querySelector<HTMLElement>(`[data-width="${w}"]`)!;
      const block = frame.querySelector<HTMLElement>('[data-slot=multi-step-form]')!;
      await expect(frame.scrollWidth).toBeLessThanOrEqual(w);
      await expect(Math.round(box(block).width)).toBe(Math.min(768, w));
      const stepper = within(frame).queryByRole('list', { name: 'Progress' });
      if (w >= 768) await expect(stepper).toBeVisible();
      else {
        await expect(stepper).toBeNull();
        await expect(frame.querySelector('[data-slot=step-progress]')).toHaveTextContent('Step 2 of 3 · Details');
      }
      for (const el of block.querySelectorAll('a, button')) await expect(el).toHaveAccessibleName();
    }
    const wide = canvasElement.querySelector<HTMLElement>('[data-width="1440"]')!;
    const card = wide.querySelector('[data-slot=card]')!;
    await expect(Math.round(box(card).top - box(wide.querySelector('[data-slot=stepper]')!).bottom)).toBe(32);
  },
};

export const PaymentDark: StoryObj<{ title: string; amount: string }> = { ...PaymentStory, name: 'Payment Dark', tags: ['!dev'], globals: { theme: 'Dark' } };
export const PaymentBackOffice: StoryObj<{ title: string; amount: string }> = { ...PaymentStory, name: 'Payment Back office', tags: ['!dev'], globals: { theme: 'Corporate Light' } };
