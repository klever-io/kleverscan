import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

/** Ceiling for a page that never asks for anything. */
const CEILING_MS = 4000;

/**
 * Hard stop, whatever the page is doing.
 *
 * The ceiling above only releases a page with no traffic, which is right, but
 * a queryFn that pages sequentially (the validator set takes up to 50 calls,
 * each with `api.get`'s own 10s timeout) can legitimately hold in-flight
 * state far longer than any single request. Releasing late beats never.
 */
const HARD_CEILING_MS = 15000;

/**
 * True once the page's other requests have gone quiet, and true from then on,
 * for requests that belong on a page but must not compete with the one the
 * reader is waiting for.
 */
export const useDeferred = (): boolean => {
  const inFlight = useIsFetching();
  // Waits to see traffic before waiting for quiet: this hook mounts above the
  // table, so an idle check alone would release before the table has asked for
  // anything and defer nothing.
  const sawTraffic = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (inFlight > 0) {
      sawTraffic.current = true;
    } else if (sawTraffic.current) {
      // Never goes back to false: a later refetch must not re-hide badges that
      // are already on screen.
      setReady(true);
    }
  }, [inFlight]);

  useEffect(() => {
    // Only for a page that never asked for anything. Releasing here while a
    // request is still in flight is the one thing this hook exists to prevent,
    // and on a slow connection that is exactly when it fires.
    const soon = setTimeout(() => {
      if (!sawTraffic.current) setReady(true);
    }, CEILING_MS);
    const latest = setTimeout(() => setReady(true), HARD_CEILING_MS);
    return () => {
      clearTimeout(soon);
      clearTimeout(latest);
    };
  }, []);

  return ready;
};
