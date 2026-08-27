import theme from '@/styles/theme';
import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { AccountsTableWrapper } from '../styles';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// The React 19 shim this repo's other component specs carry: testing-library
// 12 still calls ReactDOM.render, which React 19 removed.
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

/**
 * Thin on purpose. The wrapper is only ever rendered by the accounts page,
 * which Jest cannot import, so nothing else evaluates its breakpoint
 * interpolation: a theme token renamed out from under it would surface in a
 * browser rather than here.
 */
describe('AccountsTableWrapper', () => {
  it('resolves its theme interpolation without throwing', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <AccountsTableWrapper>
          <span>rows</span>
        </AccountsTableWrapper>
      </ThemeProvider>,
    );

    expect(container.textContent).toBe('rows');
  });
});
