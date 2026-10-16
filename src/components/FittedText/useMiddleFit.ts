import { pickUrlEffect } from '@/components/BlockDetail/urlEffect';
import { middleFit } from '@/components/Tabs/Validators/fitKey';
import { useRef, useState } from 'react';

const useIsoLayoutEffect = pickUrlEffect(
  typeof window === 'undefined' ? undefined : window,
);

const PROBE_SLACK_PX = 1;

const padX = (style: CSSStyleDeclaration): number =>
  (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);

const gapX = (style: CSSStyleDeclaration): number =>
  parseFloat(style.columnGap || style.gap) || 0;

const stacksVertically = (style: CSSStyleDeclaration): boolean =>
  (style.display === 'flex' || style.display === 'inline-flex') &&
  (style.flexDirection === 'column' ||
    style.flexDirection === 'column-reverse');

const siblingWidths = (parent: HTMLElement, keep: Element): number => {
  let others = 0;
  for (let i = 0; i < parent.children.length; i += 1) {
    const child = parent.children[i];
    if (child !== keep) others += (child as HTMLElement).offsetWidth;
  }
  return others;
};

/** Width taken by neighbours that sit on the same line. A column stacks them. */
const beside = (parent: HTMLElement, keep: Element): number => {
  const style = getComputedStyle(parent);
  if (stacksVertically(style)) return 0;
  const gaps =
    parent.children.length > 1 ? gapX(style) * (parent.children.length - 1) : 0;
  return siblingWidths(parent, keep) + gaps;
};

const isPageRoot = (node: HTMLElement | null): boolean =>
  node === null || node === document.body || node === document.documentElement;

/**
 * The box to measure and to watch. A fit-content wrapper stays as wide as
 * the text, so a wider viewport never resizes it and the text cannot grow
 * back. Climb while an ancestor is wider, and skip a wrapper that is only
 * as wide as the text when something above that wrapper is wider.
 *
 * Once the box is wider than the link row, stop. The card around the detail
 * row is the same width, and a page container a few pixels wider must not
 * become the box: measuring the page subtracts the other rows.
 */
export const fitBox = (el: HTMLElement): HTMLElement => {
  let node: HTMLElement = el;
  let parent: HTMLElement | null = node.parentElement;
  const cluster =
    parent && !isPageRoot(parent) ? parent.clientWidth : el.clientWidth;

  while (parent && !isPageRoot(parent)) {
    if (parent.clientWidth > node.clientWidth + PROBE_SLACK_PX) {
      node = parent;
      parent = node.parentElement;
      continue;
    }
    if (node.clientWidth > cluster + PROBE_SLACK_PX) {
      return node;
    }
    const grand = parent.parentElement;
    if (
      !grand ||
      isPageRoot(grand) ||
      grand.clientWidth <= parent.clientWidth + PROBE_SLACK_PX
    ) {
      return node;
    }
    node = parent;
    parent = grand;
  }
  return node;
};

/** Free width for `el` inside `box`, after padding, labels and icons. */
export const freeWidth = (el: HTMLElement, box: HTMLElement): number => {
  let width = box.clientWidth - padX(getComputedStyle(box));
  let node: HTMLElement | null = el;
  while (node && node !== box) {
    const parent: HTMLElement | null = node.parentElement;
    if (!parent) break;
    width -= beside(parent, node);
    if (parent !== box) width -= padX(getComputedStyle(parent));
    node = parent;
  }
  return width;
};

/**
 * Shorten `value` to the width of the node in `ref`. The caller renders
 * `shown` and keeps the full value on the title. Shared by the account
 * address and the block validator key.
 *
 * `reserveSiblings` measures free space beside the icons instead of the
 * node. The node stays as wide as its text, so a copy button sits against
 * it, and a wider row lets the text grow again.
 */
export const useMiddleFit = <T extends HTMLElement>(
  value: string,
  reserveSiblings = false,
) => {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(value);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let cancelled = false;
    let observed: Element | null = null;
    let observer: ResizeObserver | null = null;

    const fit = () => {
      if (cancelled) return;
      const node = ref.current;
      if (!node) return;
      const box = reserveSiblings ? fitBox(node) : node;
      if (observer && observed !== box) {
        observer.disconnect();
        observer.observe(box);
        observed = box;
      }
      const maxWidth = reserveSiblings
        ? freeWidth(node, box)
        : node.clientWidth;
      const next = middleFit(value, maxWidth, text => {
        const previous = node.textContent;
        node.textContent = text;
        const width = node.scrollWidth;
        node.textContent = previous;
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
    observer = new ResizeObserver(fit);
    const box = reserveSiblings ? fitBox(el) : el;
    observer.observe(box);
    observed = box;
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [reserveSiblings, value]);

  return { ref, shown };
};
