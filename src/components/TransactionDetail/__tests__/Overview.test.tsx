jest.mock('@/contexts/contractModal', () => ({
  useContractModal: () => ({
    getInteractionsButtons: () => [],
  }),
}));

jest.mock('qrcode.react', () => ({
  QRCodeSVG: () => <svg data-testid="qr-code" />,
}));

jest.mock('@/components/InputGlobal', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props: React.InputHTMLAttributes<HTMLInputElement>) =>
      React.createElement('input', props),
  };
});

jest.mock('@/components/QrCodeModal', () => ({
  __esModule: true,
  default: () => <button type="button">QR</button>,
}));

jest.mock('@/components/TransactionDetails/TokenOperations', () => ({
  __esModule: true,
  default: ({ receipts }: { receipts: unknown[] }) =>
    receipts.length ? <div>Token transfers</div> : null,
}));

jest.mock('@/components/Tooltip', () => ({
  __esModule: true,
  default: () => <span>tooltip</span>,
}));

jest.mock('@/components/TransactionDetails/KappFee', () => ({
  __esModule: true,
  default: ({ kAppFee }: { kAppFee: number }) => <p>{kAppFee}</p>,
}));

import { render, screen } from '@testing-library/react';
import React, { act } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
import { formatDate, formatDateWithSeconds } from '@/utils/formatFunctions';
import Overview, { ITransactionOverview } from '../Overview';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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

const sender = 'klv1exampleaddressvalue000000000000000000000000000000';
const when = 1787664055000;

const loaded = (): ITransactionOverview => ({
  hash: 'abcd1234',
  nonce: 7,
  sender,
  bandwidthFee: 2000000,
  signature: 'sigvalue',
  timestamp: when,
  block: { epoch: 4 },
  blockNum: 12,
  status: 'Success',
  StatusIcon: () => <svg data-testid="status-icon" />,
  resultCode: 'Ok',
  kAppFee: 1,
  receipts: [{ typeString: 'Transfer' }],
});

const rect = (right: number, width = right): DOMRect =>
  ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right,
    bottom: 0,
    width,
    height: 0,
    toJSON() {
      return {};
    },
  }) as DOMRect;

const paddingRight = (
  padding: string,
  original: typeof window.getComputedStyle,
): typeof window.getComputedStyle =>
  ((elt: Element, pseudoElt?: string | null) => {
    const style = original(elt, pseudoElt);
    if (elt.tagName !== 'DIV' || !(elt.textContent || '').includes('UTC')) {
      return style;
    }
    return new Proxy(style, {
      get(target, prop, receiver) {
        if (prop === 'paddingRight') return padding;
        const value = Reflect.get(target, prop, receiver);
        return typeof value === 'function' ? value.bind(target) : value;
      },
    });
  }) as typeof window.getComputedStyle;

const renderOverview = (props: ITransactionOverview) =>
  render(
    <ThemeProvider theme={theme}>
      <Overview {...props} />
    </ThemeProvider>,
  );

describe('Overview', () => {
  it('renders the loaded rows and keeps the copy control on the hash', () => {
    renderOverview(loaded());

    expect(screen.getByTitle('abcd1234')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy hash' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'QR' })).toBeInTheDocument();
    expect(screen.getByText('Token transfers')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Ok')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: sender })).toHaveAttribute(
      'href',
      `/account/${sender}`,
    );
    expect(
      screen.getByRole('link', { name: 'Open account in a new tab' }),
    ).toBeInTheDocument();
    expect(screen.getByText('2.000000')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('KLV')).toBeInTheDocument();
    expect(screen.getByText(formatDateWithSeconds(when))).toBeInTheDocument();
    expect(screen.getByTitle('sigvalue')).toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });

  it('keeps the KDA tooltip on the value line', () => {
    renderOverview(loaded());
    const kda = screen.getByText('KLV').parentElement;
    const kapp = screen.getByText('1').parentElement?.parentElement;
    expect(kda?.className).toBeTruthy();
    expect(kda?.className).not.toBe(kapp?.className);
    const css = [...document.querySelectorAll('style')]
      .map(node => node.textContent || '')
      .join('')
      .replace(/\s/g, '');
    expect(css).toContain('flex-wrap:nowrap');
  });

  it('drops the seconds when the time crosses the value padding', () => {
    const originalRect = HTMLElement.prototype.getBoundingClientRect;
    const originalStyle = window.getComputedStyle;
    // The card border is far to the right, so a card-border measure keeps
    // the seconds. The value cell ends sooner, and its padding is part of
    // that edge.
    window.getComputedStyle = paddingRight('20px', originalStyle);
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.getAttribute('data-time-probe') === 'true') return rect(290, 290);
      if (this.tagName === 'SECTION') return rect(500);
      if (this.tagName === 'DIV' && (this.textContent || '').includes('UTC')) {
        return rect(300);
      }
      if (this.tagName === 'SPAN' && (this.textContent || '').includes(':55')) {
        return rect(300);
      }
      return originalRect.call(this);
    };

    try {
      render(
        <ThemeProvider theme={theme}>
          <section>
            <Overview {...loaded()} />
          </section>
        </ThemeProvider>,
      );
      expect(screen.getByText(formatDate(when))).toBeInTheDocument();
      expect(
        screen.queryByText(formatDateWithSeconds(when)),
      ).not.toBeInTheDocument();
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalRect;
      window.getComputedStyle = originalStyle;
    }
  });

  it('keeps the seconds when the time fits inside the value cell', () => {
    const originalRect = HTMLElement.prototype.getBoundingClientRect;
    // The stamp is past the card border, which is what used to drop the
    // seconds. The value cell still has room for the probe.
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.getAttribute('data-time-probe') === 'true') return rect(300, 300);
      if (this.tagName === 'SECTION') return rect(100);
      if (this.tagName === 'DIV' && (this.textContent || '').includes('UTC')) {
        return rect(400);
      }
      if (this.tagName === 'SPAN' && (this.textContent || '').includes(':55')) {
        return rect(300);
      }
      return originalRect.call(this);
    };

    try {
      render(
        <ThemeProvider theme={theme}>
          <section>
            <Overview {...loaded()} />
          </section>
        </ThemeProvider>,
      );
      expect(screen.getByText(formatDateWithSeconds(when))).toBeInTheDocument();
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalRect;
    }
  });

  it('remeasures the time when the value cell changes size', async () => {
    const originalRect = HTMLElement.prototype.getBoundingClientRect;
    const originalStyle = window.getComputedStyle;
    let cellRight = 280;
    window.getComputedStyle = paddingRight('20px', originalStyle);
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.getAttribute('data-time-probe') === 'true') return rect(290, 290);
      if (this.tagName === 'SECTION') return rect(200);
      if (this.tagName === 'DIV' && (this.textContent || '').includes('UTC')) {
        return rect(cellRight);
      }
      if (this.tagName === 'SPAN' && (this.textContent || '').includes(':55')) {
        return rect(400);
      }
      return originalRect.call(this);
    };

    const watched: {
      callback: ResizeObserverCallback;
      element?: Element;
    }[] = [];
    let disconnected = false;
    const OriginalObserver = global.ResizeObserver;
    class FakeObserver {
      callback: ResizeObserverCallback;
      element?: Element;
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        watched.push(this);
      }
      observe(element: Element) {
        this.element = element;
      }
      unobserve() {}
      disconnect() {
        disconnected = true;
      }
    }
    global.ResizeObserver = FakeObserver as unknown as typeof ResizeObserver;

    let rejectReady: (reason: unknown) => void = () => undefined;
    const ready = new Promise<void>((_resolve, reject) => {
      rejectReady = reject;
    });
    const originalFonts = Object.getOwnPropertyDescriptor(document, 'fonts');
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready },
    });

    const view = render(
      <ThemeProvider theme={theme}>
        <section>
          <Overview {...loaded()} />
        </section>
      </ThemeProvider>,
    );

    try {
      expect(screen.getByText(formatDate(when))).toBeInTheDocument();
      const timeWatch = watched.find(item =>
        (item.element?.textContent || '').includes('UTC'),
      );
      expect(timeWatch).toBeDefined();
      cellRight = 500;
      await act(async () => {
        timeWatch?.callback([], {} as ResizeObserver);
      });
      expect(screen.getByText(formatDateWithSeconds(when))).toBeInTheDocument();
      await act(async () => {
        rejectReady(new Error('fonts failed'));
        await ready.catch(() => undefined);
      });
      view.unmount();
      expect(disconnected).toBe(true);
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalRect;
      window.getComputedStyle = originalStyle;
      global.ResizeObserver = OriginalObserver;
      if (originalFonts) {
        Object.defineProperty(document, 'fonts', originalFonts);
      } else {
        delete (document as { fonts?: FontFaceSet }).fonts;
      }
    }
  });

  it('shows a dash for a missing sender instead of a skeleton', () => {
    renderOverview({ ...loaded(), sender: undefined, hash: 'abcd1234' });

    expect(screen.getByText('--')).toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Open account in a new tab' }),
    ).not.toBeInTheDocument();
  });

  it('shows a skeleton only while the page is loading', () => {
    renderOverview({
      ...loaded(),
      loading: true,
      hash: undefined,
      sender: undefined,
    });

    expect(screen.getAllByTestId('skeleton')).toHaveLength(7);
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.queryByText(formatDate(when))).not.toBeInTheDocument();
    expect(
      screen.queryByText(formatDateWithSeconds(when)),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('--')).not.toBeInTheDocument();
  });

  it('hides epoch when the block lookup came back empty', () => {
    renderOverview({ ...loaded(), block: {} });

    expect(screen.queryByText('Epoch')).not.toBeInTheDocument();
  });

  it('hides the optional rows when those values are absent', () => {
    renderOverview({
      ...loaded(),
      status: undefined,
      StatusIcon: undefined,
      resultCode: undefined,
      block: undefined,
      blockNum: 0,
      kAppFee: 0,
      timestamp: undefined,
      receipts: [],
    });

    expect(screen.queryByText('Status')).not.toBeInTheDocument();
    expect(screen.queryByText('Result Code')).not.toBeInTheDocument();
    expect(screen.queryByText('Epoch')).not.toBeInTheDocument();
    expect(screen.queryByText('Block Number')).not.toBeInTheDocument();
    expect(screen.queryByText('kApp Fee')).not.toBeInTheDocument();
    expect(screen.queryByText('Time')).not.toBeInTheDocument();
    expect(screen.queryByText('Token transfers')).not.toBeInTheDocument();
    expect(screen.getByText('Nonce')).toBeInTheDocument();
  });
});
