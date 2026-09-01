import { useCallback, useSyncExternalStore } from 'react';

/**
 * True while the viewport is narrower than `breakpoint` px.
 *
 * matchMedia rather than a resize listener: it fires only when the threshold
 * is crossed, where a listener on `resize` would re-render every consumer on
 * every intermediate pixel of a window drag.
 *
 * Read during render through `useSyncExternalStore`, not from state seeded in
 * an effect. As state it restarted at false on every mount, while the
 * `useMobile` flags it sits beside are already correct there, because their
 * provider lives above the page. React Query serves cached rows synchronously
 * on a client-side navigation, so between the shared tablet breakpoint and
 * this one that cost a painted frame of the full table at a width that cannot
 * hold it: the exact horizontal overflow the breakpoint exists to prevent.
 *
 * The server snapshot stays false, so SSR and hydration agree; only later
 * mounts read the real value on their first render.
 */
export const useBelowWidth = (breakpoint?: number): boolean => {
  // 0.02 under the breakpoint, not the breakpoint itself: `max-width: N` and
  // `min-width: N` both match at exactly N, and the CSS that lays the row out
  // uses the min-width half.
  const query = breakpoint ? `(max-width: ${breakpoint - 0.02}px)` : undefined;

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!query) return () => undefined;
      const media = window.matchMedia(query);
      media.addEventListener('change', onStoreChange);
      return () => media.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => (query ? window.matchMedia(query).matches : false),
    () => false,
  );
};
