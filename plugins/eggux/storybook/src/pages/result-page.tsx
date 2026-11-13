import { Search, TriangleAlert } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { SitePage } from './site-parts';

/**
 * A result page inside the site shell: navigation stays, the message says what happened in plain
 * words, and there is always a next step. 404 offers the parent page and search; 500 offers a retry,
 * the support contact and an error id to quote.
 */
export function ResultPage({ kind = 'not-found' }: { kind?: 'not-found' | 'server-error' }) {
  const notFound = kind === 'not-found';
  return (
    <SitePage>
      <div className="mx-auto flex min-h-[28rem] max-w-xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-6">
          {notFound ? <Search /> : <TriangleAlert />}
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="m-0 text-3xl leading-9 font-semibold tracking-[-0.4px]">{notFound ? 'We cannot find that page' : 'Something went wrong on our side'}</h1>
          <p className="m-0 text-base leading-6 text-muted-foreground">
            {notFound
              ? 'The link may be old or mistyped. Nothing you saved is lost. Try the home page, or search for what you were looking for.'
              : 'Your data is safe. Try again in a moment. If it keeps happening, tell us the error id below and we will look into it.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {notFound ? (
            <Button asChild><a href="#home">Go to the home page</a></Button>
          ) : (
            <Button type="button" onClick={() => window.location.reload()}>Try again</Button>
          )}
          <Button asChild variant="outline"><a href={notFound ? '#search' : '#contact'}>{notFound ? 'Search the site' : 'Contact support'}</a></Button>
        </div>
        {!notFound ? <p className="m-0 text-sm leading-5 text-muted-foreground">Error id: <code className="font-mono text-xs">ERR-7F3A-2291</code></p> : null}
      </div>
    </SitePage>
  );
}
