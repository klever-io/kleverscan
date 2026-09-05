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
  // The word is visually hidden inside the badge now that the glyph carries
  // the state, so the styled element is its parent.
  const label = screen.getByText(text) as HTMLElement;
  return (label.parentElement as HTMLElement).className;
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

  it('maps success and In to the same look, pending and Out likewise', () => {
    expect(classOf('In')).toBe(classOf('Success'));
    expect(classOf('Out')).toBe(classOf('Pending'));
  });

  it('gives fail its own look, distinct from success and pending', () => {
    expect(classOf('Fail')).not.toBe(classOf('Success'));
    expect(classOf('Fail')).not.toBe(classOf('Pending'));
  });
});
