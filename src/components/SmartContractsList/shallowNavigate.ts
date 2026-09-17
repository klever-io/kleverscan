import { NextRouter } from 'next/router';
import { MouseEvent } from 'react';

/**
 * Click handler that applies a filter without leaving the client.
 *
 * The filter links kept their `href` for middle-click and open-in-new-tab,
 * but a plain follow of that href runs this page's getServerSideProps: a
 * server round trip for what is a query-string change, which repainted the
 * whole page for one table refetch. The filter bar's own dropdowns already
 * navigate shallowly through setQueryAndRouter; this puts the links on the
 * same path. Modified clicks are left to the browser.
 */
export const shallowNavigate =
  (router: NextRouter, href: string) =>
  (event: MouseEvent<HTMLAnchorElement>): void => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    router.push(href, undefined, { shallow: true });
  };
