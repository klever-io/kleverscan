import theme from '@/styles/theme';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('next-i18next', () => {
  const bundle = jest.requireActual(
    '../../../../public/locales/en/blocks.json',
  );
  return {
    useTranslation: () => ({
      t: (key: string, options?: { defaultValue?: string }) => {
        const path = key.includes(':') ? key.split(':')[1] : key;
        const value = path
          .split('.')
          .reduce<unknown>(
            (node, part) =>
              node && typeof node === 'object'
                ? (node as Record<string, unknown>)[part]
                : undefined,
            bundle,
          );
        if (typeof value === 'string') return value;
        if (options?.defaultValue) return options.defaultValue;
        throw new Error(`missing blocks locale key: ${key}`);
      },
    }),
  };
});

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

import { act } from 'react';
import AutoUpdate from '../AutoUpdate';

const renderSwitch = (active: boolean, onToggle = jest.fn()) => {
  const view = render(
    <ThemeProvider theme={theme}>
      <AutoUpdate active={active} onToggle={onToggle} />
    </ThemeProvider>,
  );
  return { view, onToggle };
};

const control = () => screen.getByTestId('blocks-auto-update');
const switchButton = () =>
  control().querySelector('button') as HTMLButtonElement;

describe('AutoUpdate', () => {
  it('shows what the page says, on', () => {
    renderSwitch(true);

    expect(switchButton().getAttribute('aria-pressed')).toBe('true');
  });

  it('shows what the page says, off', () => {
    renderSwitch(false);

    expect(switchButton().getAttribute('aria-pressed')).toBe('false');
  });

  // The regression that made this component controlled: the shared Table
  // zeroes the interval on a page change, and a switch holding its own state
  // kept showing "on" while nothing refreshed any more.
  it('follows the page when the interval is zeroed from outside', () => {
    const { view } = renderSwitch(true);
    expect(switchButton().getAttribute('aria-pressed')).toBe('true');

    act(() => {
      view.rerender(
        <ThemeProvider theme={theme}>
          <AutoUpdate active={false} onToggle={jest.fn()} />
        </ThemeProvider>,
      );
    });

    expect(switchButton().getAttribute('aria-pressed')).toBe('false');
  });

  it('reports a click and decides nothing itself', () => {
    const { onToggle } = renderSwitch(false);

    act(() => control().click());

    expect(onToggle).toHaveBeenCalledTimes(1);
    // Still off: flipping is the page's decision, not this component's.
    expect(switchButton().getAttribute('aria-pressed')).toBe('false');
  });

  it('names the switch, which is otherwise an unlabelled button', () => {
    renderSwitch(false);

    expect(switchButton().getAttribute('aria-label')).toBe('Auto update');
  });

  // Invalid HTML that React reports as a hydration failure, which is what the
  // first version of this control did.
  it('puts no button inside another button', () => {
    renderSwitch(false);

    expect(control().tagName).toBe('DIV');
    expect(control().querySelectorAll('button')).toHaveLength(1);
  });
});
