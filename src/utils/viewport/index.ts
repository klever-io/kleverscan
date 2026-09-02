import { belowWidth } from '@/components/DataList/layout';
import { useCallback, useSyncExternalStore } from 'react';

/**
 * True while the viewport is narrower than `breakpoint` px.
 *
 * `useSyncExternalStore` over matchMedia, not state seeded in an effect: state
 * restarted at false on every mount, which painted one frame of full table at
 * a width that cannot hold it. The server snapshot stays false, so SSR and
 * hydration agree.
 */
export const useBelowWidth = (breakpoint?: number): boolean => {
  const query = breakpoint
    ? `(max-width: ${belowWidth(breakpoint)})`
    : undefined;

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
