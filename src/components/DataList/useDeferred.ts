import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

/** Ceiling, so a page with no traffic of its own never defers forever. */
const CEILING_MS = 4000;

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
    const timer = setTimeout(() => setReady(true), CEILING_MS);
    return () => clearTimeout(timer);
  }, []);

  return ready;
};
