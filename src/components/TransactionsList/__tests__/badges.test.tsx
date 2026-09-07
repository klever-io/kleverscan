import theme from '@/styles/theme';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// The installed testing-library still calls the removed ReactDOM.render; every
// component suite in this repo carries the same createRoot shim.
jest.mock('react-dom', () => {
  const actual = jest.requireActual('react-dom');
  const client = jest.requireActual('react-dom/client');
  const ReactLib = jest.requireActual('react');
  const roots = new Map<
    Element,
    { render: (ui: React.ReactNode) => void; unmount: () => void }
  >();

  return {
    ...actual,
    render: (ui: React.ReactNode, container: Element) => {
      let root = roots.get(container);
      if (!root) {
        root = client.createRoot(container);
        roots.set(container, root);
      }
      ReactLib.act(() => {
        root.render(ui);
      });
      return root;
    },
    unmountComponentAtNode: (container: Element) => {
      const root = roots.get(container);
      if (!root) return false;
      ReactLib.act(() => {
        root.unmount();
      });
      roots.delete(container);
      return true;
    },
  };
});

import { InOutBadge, TransactionStatusBadge } from '../badges';

/**
 * The variant is not readable from the DOM as an attribute, but
 * styled-components derives the class from the resolved css, so two badges
 * carry the same className exactly when they resolved to the same variant.
 * That makes the mapping observable: In must look like success, Out like
 * pending, and fail must not look like success.
 */
const classOf = (text: string): string => {
  // A status badge hides its word behind a glyph, so the styled element is the
  // parent; a direction badge is the word itself. Take whichever of the two
  // actually carries the pill class.
  const label = screen.getByText(text) as HTMLElement;
  const parent = label.parentElement as HTMLElement;
  return /Badge|Pill/.test(label.className) ? label.className : parent.className;
};

describe('transaction badges', () => {
  beforeEach(() => {
    render(
      <ThemeProvider theme={theme}>
        <TransactionStatusBadge status="success" />
        <TransactionStatusBadge status="pending" />
        <TransactionStatusBadge status="fail" />
        <InOutBadge direction="In" />
        <InOutBadge direction="Out" />
      </ThemeProvider>,
    );
  });

  it('capitalizes the raw chain status for display', () => {
    expect(screen.getByText('Success')).toBeTruthy();
    expect(screen.getByText('Pending')).toBeTruthy();
    expect(screen.getByText('Fail')).toBeTruthy();
  });

  it('gives In and Out the colors of success and pending', () => {
    // The two columns are deliberately different shapes now: status is a
    // glyph, direction is a word. The colour is the part that still has to
    // agree, so read it rather than the class.
    const colorOf = (text: string): string => {
      const label = screen.getByText(text) as HTMLElement;
      const badge = /Badge|Pill/.test(label.className)
        ? label
        : (label.parentElement as HTMLElement);
      return getComputedStyle(badge).color;
    };

    expect(colorOf('In')).toBe(colorOf('Success'));
    expect(colorOf('Out')).toBe(colorOf('Pending'));
  });

  it('spells the direction out instead of drawing an arrow', () => {
    // The row already carries a green arrow between From and To. A second
    // pair of arrows beside it reads as the same signal repeated.
    //
    // The word alone proves nothing: the glyph version kept the same word in a
    // visually hidden span next to the arrow, so getByText found it either
    // way. What separates the two shapes is whether that word is the visible
    // badge or a screen-reader label clipped out of the layout.
    for (const direction of ['In', 'Out']) {
      const label = screen.getByText(direction) as HTMLElement;
      // The badge, not the word: the glyph version put its arrow BESIDE the
      // word, so querying the word itself would find no svg either way.
      const badge = label.parentElement as HTMLElement;

      expect(getComputedStyle(label).position).not.toBe('absolute');
      expect(badge.querySelector('svg')).toBeNull();
    }
  });

  it('names the direction badge, since the list is divs and has no header link', () => {
    // A reader reaching this cell hears whatever the badge is called. The row
    // is divs, not a table, so the "In/Out" header names nothing; without a
    // label the cell is a bare "In" beside "Success" and "Transfer".
    //
    // The name rides in the hidden sibling, not aria-label: the spec forbids
    // naming a bare span, and the pill is uppercase, which a reader may spell
    // out letter by letter.
    for (const direction of ['In', 'Out']) {
      const named = screen.getByText(`Direction: ${direction}`);

      expect(getComputedStyle(named).position).toBe('absolute');
      expect(named.getAttribute('aria-hidden')).toBeNull();
      expect(screen.getByText(direction).getAttribute('aria-hidden')).toBe(
        'true',
      );
    }
  });

  it('gives fail its own look, distinct from success and pending', () => {
    expect(classOf('Fail')).not.toBe(classOf('Success'));
    expect(classOf('Fail')).not.toBe(classOf('Pending'));
  });
});
