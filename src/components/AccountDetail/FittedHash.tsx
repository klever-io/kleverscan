import { middleFit } from '@/components/Tabs/Validators/fitKey';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FactHash } from './styles';

const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/* The same middle truncation as a block key: the cell width decides how
   much of the start and the end stay visible. The title keeps the whole
   address, and the copy button next to it copies that whole address. */
const FittedHash: React.FC<{ value: string }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
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

  return (
    <FactHash ref={ref} title={value}>
      {shown}
    </FactHash>
  );
};

export default FittedHash;
