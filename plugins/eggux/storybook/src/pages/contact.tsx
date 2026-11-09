import * as React from 'react';
import { Headphones, Mail, MapPin, Phone } from '@/components/icons';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { IconTile } from '@/components/ui/icon-tile';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SitePage, emailError } from './site-parts';

const channels = [
  { icon: <Mail />, title: 'Sales', text: 'Pricing, demos and plans for your team.', link: 'sales@acme.example', href: 'mailto:sales@acme.example' },
  { icon: <Headphones />, title: 'Support', text: 'Help with your account. We answer within 4 working hours.', link: 'support@acme.example', href: 'mailto:support@acme.example' },
  { icon: <Phone />, title: 'Call us', text: 'Monday to Friday, 9:00 to 17:00 Bucharest time.', link: '+40 21 555 0100', href: 'tel:+40215550100' },
];
const offices = [
  { city: 'Bucharest', lines: ['Strada Exemplu 12, etaj 3', '010101 Bucharest, Romania'] },
  { city: 'Berlin', lines: ['Beispielstrasse 8', '10115 Berlin, Germany'] },
  { city: 'Lisbon', lines: ['Rua do Exemplo 21', '1100-001 Lisbon, Portugal'] },
];
const topics = ['Sales and pricing', 'Support', 'Partnerships', 'Press', 'Something else'];
const faq = [
  ['How fast will you reply?', 'We reply within one working day. Support questions from paying customers are answered within four working hours.'],
  ['Can I talk to someone before I buy?', 'Yes. Book a demo and we show your own use case, not a slide deck. It takes 30 minutes.'],
  ['Where is my data stored?', 'In the European Union. Details are in the privacy policy and the data processing agreement.'],
  ['I found a security problem. Who do I tell?', 'Write to security@acme.example. We confirm within one working day and never take legal action against good-faith reports.'],
] as const;

const limit = 500;
type Errors = { name?: string; email?: string; topic?: string; message?: string; consent?: string };

/** Contact: the reply time first, direct channels, a short form, the offices with written addresses, FAQ. */
export function ContactPage({ showErrors = false, sent = false }: { showErrors?: boolean; sent?: boolean }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [topic, setTopic] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [done, setDone] = React.useState(sent);
  const [errors, setErrors] = React.useState<Errors>(
    showErrors ? { name: 'Enter your name.', email: 'Enter your email address.', topic: 'Choose a topic.', message: 'Write a few words about what you need.', consent: 'Agree to be contacted so we can reply.' } : {},
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {
      name: name.trim() ? undefined : 'Enter your name.',
      email: emailError(email),
      topic: topic ? undefined : 'Choose a topic.',
      message: message.trim().length >= 10 ? undefined : 'Write a few words about what you need (at least 10 characters).',
      consent: consent ? undefined : 'Agree to be contacted so we can reply.',
    };
    setErrors(next);
    if (!Object.values(next).some(Boolean)) setDone(true);
  };

  return (
    <SitePage active="Contact">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
        <header className="flex max-w-2xl flex-col gap-3">
          <p className="m-0 text-sm leading-5 font-medium text-brand">Contact</p>
          <h1 className="m-0 text-4xl leading-10 font-semibold tracking-[-0.4px]">Talk to our team</h1>
          <p className="m-0 text-lg leading-7 text-muted-foreground">We reply within one working day. Pick the way that suits you, or send a message and we will find the right person.</p>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1fr_28rem]">
          <section aria-labelledby="channels-title" className="flex flex-col gap-4">
            <h2 id="channels-title" className="m-0 text-xl leading-7 font-semibold">Reach us directly</h2>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {channels.map(c => (
                <li key={c.title}>
                  <Card className="flex-row items-start gap-4 p-5">
                    <IconTile icon={c.icon} tileStyle="brand" />
                    <div className="flex flex-col gap-1">
                      <h3 className="m-0 text-base leading-6 font-semibold">{c.title}</h3>
                      <p className="m-0 text-sm leading-5 text-muted-foreground">{c.text}</p>
                      <a href={c.href} className="text-sm leading-5 font-medium text-brand underline-offset-4 hover:underline">{c.link}</a>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="form-title">
            <Card className="gap-5 p-6">
              <h2 id="form-title" className="m-0 text-xl leading-7 font-semibold">Send a message</h2>
              {done ? (
                <Alert variant="success" title="Message sent" description="Thank you. We will reply to your email within one working day." />
              ) : (
                <form noValidate onSubmit={submit} className="flex flex-col gap-4" aria-labelledby="form-title">
                  <Field label="Full name" error={errors.name} required>
                    <Input autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
                  </Field>
                  <Field label="Email" error={errors.email} required>
                    <Input type="email" autoComplete="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </Field>
                  <Field label="Topic" error={errors.topic} required>
                    <Select value={topic || undefined} onValueChange={setTopic}>
                      <SelectTrigger placeholder="Choose a topic" />
                      <SelectContent>
                        {topics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Message" error={errors.message} counter={{ value: message.length, limit }} required>
                    <Textarea rows={4} maxLength={limit} placeholder="How can we help?" value={message} onChange={e => setMessage(e.target.value)} />
                  </Field>
                  <div className="flex flex-col gap-1.5">
                    <Checkbox checked={consent} onCheckedChange={v => setConsent(v === true)} invalid={!!errors.consent} label="I agree that Acme may contact me about this message." />
                    {errors.consent ? <p role="alert" className="m-0 pl-6 text-sm leading-5 text-destructive">{errors.consent}</p> : null}
                  </div>
                  <Button type="submit" className="w-full">Send message</Button>
                </form>
              )}
            </Card>
          </section>
        </div>

        <section aria-labelledby="offices-title" className="flex flex-col gap-4">
          <h2 id="offices-title" className="m-0 text-xl leading-7 font-semibold">Our offices</h2>
          <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-3">
            {offices.map(o => (
              <li key={o.city} className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <address className="flex flex-col gap-1 text-sm leading-5 not-italic">
                  <strong className="text-base leading-6 font-semibold">{o.city}</strong>
                  {o.lines.map(l => <span key={l}>{l}</span>)}
                </address>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="faq-title" className="flex max-w-3xl flex-col gap-4">
          <h2 id="faq-title" className="m-0 text-xl leading-7 font-semibold">Before you write</h2>
          <Accordion type="single" collapsible defaultValue="reply">
            {faq.map(([q, a], i) => (
              <AccordionItem key={q} value={i === 0 ? 'reply' : `q${i}`} title={q}><p className="m-0">{a}</p></AccordionItem>
            ))}
          </Accordion>
          <p className="m-0 text-sm leading-5 text-muted-foreground">Still not sure? <a href="#demo" className="font-medium text-brand underline-offset-4 hover:underline">Book a 30-minute demo</a>.</p>
        </section>
      </div>
    </SitePage>
  );
}
