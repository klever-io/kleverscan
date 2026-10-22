import theme from '@/styles/theme';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mockMiddlewareCounts: number[] = [];

jest.mock('@floating-ui/dom', () => {
  const actual = jest.requireActual('@floating-ui/dom');
  return {
    ...actual,
    computePosition: (
      reference: Element,
      floating: HTMLElement,
      options: { middleware: unknown[] },
    ) => {
      mockMiddlewareCounts.push(options.middleware.length);
      return actual.computePosition(reference, floating, options);
    },
  };
});

jest.mock('@/assets/help', () => ({
  IconHelp: () => null,
}));

import Tooltip from '../index';

describe('Tooltip positioning middlewares', () => {
  const originalResizeObserver = globalThis.ResizeObserver;

  beforeAll(() => {
    globalThis.ResizeObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  });

  afterAll(() => {
    globalThis.ResizeObserver = originalResizeObserver;
  });

  it('keeps a single arrow middleware across repeated position updates', async () => {
    jest.useFakeTimers();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <ThemeProvider theme={theme}>
          <Tooltip msg="hover hint" />
        </ThemeProvider>,
      );
    });

    const anchor = container.querySelector('[data-tooltip-anchor]') as Element;
    await act(async () => {
      anchor.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      anchor.dispatchEvent(new MouseEvent('mouseenter'));
      jest.advanceTimersByTime(500);
    });

    for (let round = 0; round < 10; round += 1) {
      await act(async () => {
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
        jest.advanceTimersByTime(50);
      });
    }

    await act(async () => root.unmount());
    container.remove();
    jest.useRealTimers();

    expect(mockMiddlewareCounts.length).toBeGreaterThan(1);
    expect(new Set(mockMiddlewareCounts)).toEqual(new Set([4]));
  });
});
