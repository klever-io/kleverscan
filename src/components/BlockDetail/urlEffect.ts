import {
  DependencyList,
  EffectCallback,
  useEffect,
  useLayoutEffect,
} from 'react';

type UrlEffect = (effect: EffectCallback, deps?: DependencyList) => void;

/**
 * The server has no window, so the page reads the URL after paint.
 * The browser reads it before paint, which is what stops the tab flash.
 */
export const pickUrlEffect = (win: unknown): UrlEffect =>
  win === undefined ? useEffect : useLayoutEffect;

/** Layout effect in the browser, plain effect while the server has no window. */
export const useIsoLayoutEffect = pickUrlEffect(
  typeof window === 'undefined' ? undefined : window,
);
