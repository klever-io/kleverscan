import { useEffect, useState } from 'react';

/**
 * True while the viewport is narrower than `breakpoint` px.
 *
 * matchMedia rather than a resize listener: it fires only when the threshold
 * is crossed, where a listener on `resize` would re-render every consumer on
 * every intermediate pixel of a window drag.
 *
 * False on the server and on the first client render, which is the order the
 * `useMobile` flags settle in too, so a table that also reads those cannot
 * disagree with itself on the first paint.
 */
export const useBelowWidth = (breakpoint?: number): boolean => {
  const [below, setBelow] = useState(false);

  useEffect(() => {
    if (!breakpoint) {
      setBelow(false);
      return;
    }

    // 0.02 under the breakpoint, not the breakpoint itself: `max-width: N` and
    // `min-width: N` both match at exactly N, and the CSS that lays the row
    // out uses the min-width half.
    const query = window.matchMedia(`(max-width: ${breakpoint - 0.02}px)`);
    const update = (): void => setBelow(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [breakpoint]);

  return below;
};
