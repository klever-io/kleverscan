import { useEffect, useState } from 'react';

/**
 * True once `delay` has passed since mount.
 *
 * For work that belongs on the page but not in its opening burst.
 * requestIdleCallback was tried first and is not usable here: measured on the
 * same page it fired at 152ms on one load and 2.6s on the next, so the work
 * was either back in the burst or visibly late.
 */
export const useDeferred = (delay: number): boolean => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return ready;
};
