import { middleFit } from '@/components/Tabs/Validators/fitKey';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FactHash, FactHashLink } from './styles';

const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/* The cell width decides how much of the start and the end stay visible.
   The title keeps the whole value, and the copy button copies that whole
   value. An optional href makes the sender a link. Same fit as a block
   validator key. */
const FittedHash: React.FC<{ value: string; href?: string }> = ({
  value,
  href,
}) => {
  const ref = useRef<HTMLElement | null>(null);
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

  if (href) {
    return (
      <FactHashLink
        ref={node => {
          ref.current = node;
        }}
        href={href}
        title={value}
      >
        {shown}
      </FactHashLink>
    );
  }

  return (
    <FactHash
      ref={node => {
        ref.current = node;
      }}
      title={value}
    >
      {shown}
    </FactHash>
  );
};

export default FittedHash;
