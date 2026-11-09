import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Input } from '@/components/ui/input';
import { PostCard } from '@/components/ui/post-card';
import { Prose, ProseBlockquote, ProseHeading, ProseList, ProseListItem, ProseParagraph } from '@/components/ui/prose';
import { SocialShare } from '@/components/ui/social-share';
import { TableOfContents } from '@/components/ui/table-of-contents';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SitePage } from './site-parts';

const url = 'https://acme.example/blog/month-end-close';
const title = 'How we cut month-end close from nine days to five';

const headings = [
  { id: 'why-slow', label: 'Why closing was slow' },
  { id: 'three-changes', label: 'The three changes' },
  { id: 'approvals', label: 'Approvals with a deadline', level: 2 as const },
  { id: 'one-checklist', label: 'One checklist for every entity', level: 2 as const },
  { id: 'results', label: 'What changed' },
];

const related = [
  { title: 'The month-end checklist we give every new customer', category: 'Guides', meta: '2 Oct 2026 · 6 min read', excerpt: 'Twelve steps, in the order that avoids rework.' },
  { title: 'Why we stopped reconciling on the last day', category: 'Finance', meta: '18 Sep 2026 · 5 min read', excerpt: 'Small daily matches beat one heroic evening.' },
  { title: 'Approvals that do not wait for the one person on holiday', category: 'Product', meta: '3 Sep 2026 · 4 min read', excerpt: 'Delegation rules, deadlines and an audit trail.' },
];

/** An article: header (category, date, reading time, title, lead, author), cover, a reading column with a table of contents, share, author, related posts, newsletter. */
export function BlogPostPage() {
  return (
    <TooltipProvider delayDuration={0}>
      <SitePage active="Blog">
        <article className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
          <div className="grid lg:grid-cols-[14rem_minmax(0,44rem)] lg:justify-center lg:gap-x-12">
          <header className="flex w-full min-w-0 flex-col gap-5 lg:col-start-2">
            <Breadcrumb items={[{ label: 'Home', href: '#home' }, { label: 'Blog', href: '#blog' }, { label: 'Finance' }]} />
            <p className="m-0 flex flex-wrap items-center gap-3 text-sm leading-5">
              <Badge variant="soft-info">Finance</Badge>
              <time dateTime="2026-10-12">12 Oct 2026</time>
              <span aria-hidden="true">·</span>
              <span>7 min read</span>
            </p>
            <h1 className="m-0 text-4xl leading-10 font-semibold tracking-[-0.4px] sm:text-5xl sm:leading-[3.25rem]">{title}</h1>
            <p className="m-0 text-xl leading-8 text-muted-foreground">Three small process changes, no new headcount. Here is what a five-person finance team did, in order, and what we would skip next time.</p>
            <div className="flex items-center gap-3">
              <Avatar initials="MI" size="lg" />
              <p className="m-0 text-sm leading-5"><strong className="font-semibold">Maria Ilie</strong><br /><span className="text-muted-foreground">Finance lead, Northwind Traders</span></p>
            </div>
          </header>
          </div>

          <ImagePlaceholder ratio="21:9" alt="" className="w-full rounded-xl" />

          <div className="grid gap-12 lg:grid-cols-[14rem_minmax(0,44rem)] lg:justify-center lg:gap-x-12">
            <aside aria-label="Table of contents" className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents items={headings} />
              </div>
            </aside>
            <div className="flex min-w-0 flex-col gap-10">
              <Prose size="lg">
                <ProseParagraph>In January our month-end close took nine working days. By June it took five. Nobody worked longer hours, and we did not buy anything. We changed three habits, and this is the story of those changes.</ProseParagraph>
                <ProseHeading id="why-slow">Why closing was slow</ProseHeading>
                <ProseParagraph>The close was not slow because the work was hard. It was slow because it was serial: every step waited for the one before it, and every wait ended in a message asking for a signature.</ProseParagraph>
                <ProseBlockquote cite="Maria Ilie, Finance lead">
                  We spent more time asking who had approved what than checking whether the numbers were right.
                </ProseBlockquote>
                <ProseHeading id="three-changes">The three changes</ProseHeading>
                <ProseParagraph>Each change was small enough to try in a single month. We kept the ones that held.</ProseParagraph>
                <ProseHeading id="approvals" level={3}>Approvals with a deadline</ProseHeading>
                <ProseParagraph>Every approval got a due date and a named backup. If the first person did not answer, the backup could. The average wait dropped from two days to a few hours.</ProseParagraph>
                <ProseHeading id="one-checklist" level={3}>One checklist for every entity</ProseHeading>
                <ProseParagraph>We had four entities and four slightly different lists. We merged them into one and marked the steps that only apply to some:</ProseParagraph>
                <ProseList>
                  <ProseListItem>Bank accounts reconciled by day 2.</ProseListItem>
                  <ProseListItem>Accruals posted by day 3, with a note for anything over EUR 5,000.</ProseListItem>
                  <ProseListItem>Intercompany balances matched by day 4.</ProseListItem>
                </ProseList>
                <ProseHeading id="results">What changed</ProseHeading>
                <ProseParagraph>The close now takes five working days. The number that matters more to the team: nobody works the weekend before the board meeting any more.</ProseParagraph>
              </Prose>

              <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
                <p className="m-0 text-sm leading-5 font-medium">Share this article</p>
                <SocialShare url={url} title={title} showLabel={false} />
              </div>

              <section aria-label="About the author" className="flex gap-4 rounded-xl border border-border p-5">
                <Avatar initials="MI" size="xl" />
                <div className="flex flex-col gap-1">
                  <h2 className="m-0 text-base leading-6 font-semibold">Written by Maria Ilie</h2>
                  <p className="m-0 text-sm leading-5 text-muted-foreground">Finance lead at Northwind Traders. She runs the close for four entities in three countries and writes about the parts nobody puts in a slide.</p>
                </div>
              </section>
            </div>
          </div>
        </article>

        <section aria-labelledby="related-title" className="border-t border-border bg-muted/40">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
            <h2 id="related-title" className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px]">Keep reading</h2>
            <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-3">
              {related.map(p => (
                <li key={p.title}>
                  <PostCard title={p.title} href="#post" category={p.category} meta={p.meta} excerpt={p.excerpt} headingLevel={3} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="newsletter-title" className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-16 text-center">
          <h2 id="newsletter-title" className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px]">One email a month, no filler</h2>
          <p className="m-0 text-base leading-6 text-muted-foreground">New articles and one idea you can use the same week. Unsubscribe in one click.</p>
          <form noValidate onSubmit={e => e.preventDefault()} aria-label="Newsletter" className="mx-auto flex w-full max-w-md items-end gap-2 text-left">
            <div className="flex-1">
              <Field label="Email" showLabel={false}>
                <Input type="email" autoComplete="email" placeholder="name@company.com" />
              </Field>
            </div>
            <Button type="submit">Subscribe</Button>
          </form>
        </section>
      </SitePage>
    </TooltipProvider>
  );
}
