import theme from '@/styles/theme';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@/contexts/mobile', () => ({
  useMobile: () => ({ isMobile: false, isTablet: false }),
}));

jest.mock('@/contexts/theme', () => ({
  useTheme: () => ({ theme: { black: '#000' } }),
}));

jest.mock('@/contexts/contractModal', () => ({
  useContractModal: () => ({
    getInteractionsButtons: () => [
      () => <button type="button">Transfer</button>,
    ],
  }),
}));

jest.mock('qrcode.react', () => ({
  QRCodeSVG: () => <svg data-testid="qr-code" />,
}));

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

import ExplorerLink from '../index';

const HASH = 'abc123';

describe('ExplorerLink compact mode', () => {
  /**
   * The production wiring under test is one prop: compact mode passing its own
   * `type` through to the hover menu. The menu's own suite is thorough but
   * receives `entity` directly, so dropping the pass-through would fall back
   * to the account menu everywhere while every existing test stayed green.
   * This is the test that fails in that case.
   */
  it('hands its type to the hover menu, so a hash is not treated as an address', () => {
    render(
      <ThemeProvider theme={theme}>
        <ExplorerLink type="transaction" value={HASH} compact />
      </ThemeProvider>,
    );

    const wrapper = screen.getByText(HASH).closest('div')
      ?.parentElement as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    expect(screen.getByText('Copy Transaction Hash')).toBeInTheDocument();
    expect(screen.queryByText('Copy Address')).not.toBeInTheDocument();
    expect(screen.queryByText('QR Code')).not.toBeInTheDocument();
    expect(screen.queryByText('Transfer')).not.toBeInTheDocument();
  });

  it('keeps the full address menu for an account link', () => {
    render(
      <ThemeProvider theme={theme}>
        <ExplorerLink type="account" value="klv1abc" compact />
      </ThemeProvider>,
    );

    const wrapper = screen.getByText('klv1abc').closest('div')
      ?.parentElement as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    expect(screen.getByText('Copy Address')).toBeInTheDocument();
    expect(screen.getByText('QR Code')).toBeInTheDocument();
    expect(screen.getByText('Transfer')).toBeInTheDocument();
  });

  describe('the monospace an address type gets', () => {
    /** The link's own text node, whichever wrapper it ended up in. */
    const renderedInside = (text: string): string =>
      screen.getByText(text).tagName;

    it('wraps a hash-shaped type in its own element', () => {
      render(
        <ThemeProvider theme={theme}>
          <ExplorerLink type="smart-contract" value="klv1abc" compact />
        </ThemeProvider>,
      );

      // The address goes through Mono, which renders a span of its own inside
      // the anchor rather than putting the text straight in the link.
      const anchor = screen.getByText('klv1abc').closest('a') as HTMLElement;
      expect(anchor.firstElementChild).not.toBeNull();
      expect(renderedInside('klv1abc')).toBe('SPAN');
    });

    it('gives way when the label brings its own typography', () => {
      // A resolved contract name is words, not a hash, so the caller turns the
      // monospace off and the label renders exactly as it was handed over.
      render(
        <ThemeProvider theme={theme}>
          <ExplorerLink
            type="smart-contract"
            value="klv1abc"
            label={<b>Bitcoin.me</b>}
            mono={false}
            compact
          />
        </ThemeProvider>,
      );

      expect(renderedInside('Bitcoin.me')).toBe('B');
      const anchor = screen.getByText('Bitcoin.me').closest('a') as HTMLElement;
      expect(anchor.firstElementChild?.tagName).toBe('B');
    });
  });
});
