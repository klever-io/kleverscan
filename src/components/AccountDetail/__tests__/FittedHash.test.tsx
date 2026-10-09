import { render, screen, waitFor } from '@testing-library/react';
import React, { act } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';

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

jest.mock('@/components/Tabs/Validators/fitKey', () => ({
  middleFit: (
    value: string,
    maxWidth: number,
    measure: (text: string) => number,
  ) => {
    if (maxWidth <= 0 || measure(value) <= maxWidth) return value;
    const short = `${value.slice(0, 4)}...${value.slice(-4)}`;
    measure(short);
    return short;
  },
}));

import FittedHash from '@/components/AccountDetail/FittedHash';

const value = 'klv1exampleaddressvalue000000000000000000000000000000';

const renderHash = () =>
  render(
    <ThemeProvider theme={theme}>
      <FittedHash value={value} />
    </ThemeProvider>,
  );

describe('FittedHash', () => {
  const originals = {
    clientWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'clientWidth',
    ),
    scrollWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'scrollWidth',
    ),
  };

  afterEach(() => {
    if (originals.clientWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        'clientWidth',
        originals.clientWidth,
      );
    }
    if (originals.scrollWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        'scrollWidth',
        originals.scrollWidth,
      );
    }
    delete (document as { fonts?: unknown }).fonts;
  });

  const metrics = (clientWidth: number | (() => number), charPx: number) => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () =>
        typeof clientWidth === 'function' ? clientWidth() : clientWidth,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get() {
        return (this.textContent || '').length * charPx;
      },
    });
  };

  it('keeps the whole address when the cell has not been measured', () => {
    metrics(0, 8);
    renderHash();
    const node = screen.getByTitle(value);
    expect(node).toHaveTextContent(value);
  });

  it('shortens the middle when the measured text is wider than the cell', () => {
    metrics(40, 8);
    renderHash();
    const node = screen.getByTitle(value);
    expect(node.textContent).toContain('...');
    expect(node.textContent).not.toBe(value);
    expect(node).toHaveAttribute('title', value);
  });

  it('shortens once the fonts finish loading into a narrow cell', async () => {
    let width = 0;
    metrics(() => width, 8);
    let resolveReady: () => void = () => undefined;
    const ready = new Promise<void>(resolve => {
      resolveReady = resolve;
    });
    const fonts = Object.getOwnPropertyDescriptor(Document.prototype, 'fonts');
    Object.defineProperty(Document.prototype, 'fonts', {
      configurable: true,
      get: () => ({ ready }),
    });
    try {
      renderHash();
      expect(screen.getByTitle(value)).toHaveTextContent(value);
      width = 40;
      await act(async () => {
        resolveReady();
        await ready;
      });
      await waitFor(() => {
        expect(screen.getByTitle(value).textContent).toContain('...');
      });
    } finally {
      if (fonts) {
        Object.defineProperty(Document.prototype, 'fonts', fonts);
      } else {
        delete (Document.prototype as { fonts?: unknown }).fonts;
      }
    }
  });

  it('disconnects the resize observer when the cell goes away', () => {
    metrics(0, 8);
    const disconnect = jest.fn();
    const observe = jest.fn();
    class Observer {
      observe = observe;
      disconnect = disconnect;
    }
    const previous = globalThis.ResizeObserver;
    globalThis.ResizeObserver = Observer as unknown as typeof ResizeObserver;
    const view = renderHash();
    expect(observe).toHaveBeenCalled();
    view.unmount();
    expect(disconnect).toHaveBeenCalled();
    globalThis.ResizeObserver = previous;
  });
});
