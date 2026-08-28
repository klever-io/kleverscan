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

const INTERVAL = 4000;

const renderToggle = (onChange = jest.fn()) => {
  render(
    <ThemeProvider theme={theme}>
      <AutoUpdate interval={INTERVAL} onChange={onChange} />
    </ThemeProvider>,
  );
  return onChange;
};

const control = () => screen.getByTestId('blocks-auto-update');
const switchButton = () =>
  control().querySelector('button') as HTMLButtonElement;

describe('AutoUpdate', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('starts off and reports no interval when storage has never been written', () => {
    const onChange = renderToggle();

    expect(switchButton().getAttribute('aria-pressed')).toBe('false');
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('starts on and reports the interval when storage says so', () => {
    localStorage.setItem('updateBlocks', 'true');

    const onChange = renderToggle();

    expect(switchButton().getAttribute('aria-pressed')).toBe('true');
    expect(onChange).toHaveBeenCalledWith(INTERVAL);
  });

  it('turns on, reporting the interval and writing it back', () => {
    const onChange = renderToggle();
    onChange.mockClear();

    act(() => control().click());

    expect(switchButton().getAttribute('aria-pressed')).toBe('true');
    expect(onChange).toHaveBeenCalledWith(INTERVAL);
    expect(localStorage.getItem('updateBlocks')).toBe('true');
  });

  // The opposite of the switch's purpose: reporting the interval on the way
  // off would leave the table refetching every four seconds with the control
  // showing that it is not.
  it('turns off, reporting zero rather than the interval', () => {
    localStorage.setItem('updateBlocks', 'true');
    const onChange = renderToggle();
    onChange.mockClear();

    act(() => control().click());

    expect(switchButton().getAttribute('aria-pressed')).toBe('false');
    expect(onChange).toHaveBeenCalledWith(0);
    expect(onChange).not.toHaveBeenCalledWith(INTERVAL);
    expect(localStorage.getItem('updateBlocks')).toBe('false');
  });

  it('names the switch, which is otherwise an unlabelled button', () => {
    renderToggle();

    expect(switchButton().getAttribute('aria-label')).toBe('Auto update');
  });

  // Invalid HTML that React reports as a hydration failure, which is what the
  // first version of this control did.
  it('puts no button inside another button', () => {
    renderToggle();

    expect(control().tagName).toBe('DIV');
    expect(control().querySelectorAll('button')).toHaveLength(1);
  });
});
