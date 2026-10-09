import { pickUrlEffect } from '@/components/BlockDetail/urlEffect';
import { middleFit } from '@/components/Tabs/Validators/fitKey';
import { useRef, useState } from 'react';

const useIsoLayoutEffect = pickUrlEffect(
  typeof window === 'undefined' ? undefined : window,
);

/**
 * Shorten `value` to the width of the node in `ref`. The caller renders
 * `shown` and keeps the full value on the title. Shared by the account
 * address and the block validator key.
 */
export const useMiddleFit = <T extends HTMLElement>(value: string) => {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(value);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let cancelled = false;
    const fit = () => {
      if (cancelled) return;
      const next = middleFit(value, el.clientWidth, text => {
        const previous = el.textContent;
        el.textContent = text;
        const width = el.scrollWidth;
        el.textContent = previous;
        return width;
      });
      setShown(current => (current === next ? current : next));
    };

    fit();
    const fonts = document.fonts;
    if (fonts) {
      fonts.ready.then(fit).catch(() => undefined);
    }
    if (typeof ResizeObserver === 'undefined') {
      return () => {
        cancelled = true;
      };
    }
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [value]);

  return { ref, shown };
};
