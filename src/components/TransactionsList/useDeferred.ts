import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

/** Waited no longer than this, in case the page never has work of its own. */
const CEILING = 4000;

/**
 * True once the page's other requests have finished, and stays true.
 *
 * For requests that belong on the page but must not compete with the one a
 * reader is actually waiting for. This API answers a transaction-list query
 * in about two seconds and does not serve them in parallel, so six at once
 * turned a 2.1s list into a 7s one.
 *
 * It waits to see traffic before waiting for quiet: this mounts above the
 * table, so at first paint there is nothing in flight yet and an idle check
 * on its own would release immediately.
 */
export const useDeferred = (): boolean => {
  const inFlight = useIsFetching();
  const sawTraffic = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (inFlight > 0) sawTraffic.current = true;
    else if (sawTraffic.current) setReady(true);
  }, [inFlight]);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), CEILING);
    return () => clearTimeout(timer);
  }, []);

  return ready;
};
