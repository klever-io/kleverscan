import { render, screen } from '@testing-library/react';
import React from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const routerQuery: Record<string, string | string[] | undefined> = {};

let routerPathname = '/transactions';

jest.mock('next/router', () => ({
  useRouter: () => ({
    isReady: true,
    pathname: routerPathname,
    query: routerQuery,
  }),
}));

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

import { useTransactionHeaders } from '../useTransactionHeaders';

/** Renders the headings the hook returns, one per element. */
const Probe: React.FC = () => (
  <ul>
    {useTransactionHeaders().map(header => (
      <li key={header} data-testid="header">
        {header}
      </li>
    ))}
  </ul>
);

const headersFor = (
  query: Record<string, string | string[] | undefined>,
  pathname = '/transactions',
) => {
  routerPathname = pathname;
  Object.keys(routerQuery).forEach(key => delete routerQuery[key]);
  Object.assign(routerQuery, query);

  render(<Probe />);

  return screen.getAllByTestId('header').map(node => node.textContent);
};

describe('useTransactionHeaders', () => {
  it('gives the five base headings when the list is not scoped', () => {
    expect(headersFor({})).toEqual([
      'Transaction Hash',
      'Block/Fees',
      'From/To',
      'Type',
      'Misc',
    ]);
  });

  it('adds In/Out after From/To when the URL names an account', () => {
    // This suite only renders the headings hook. That the cells line up with
    // them is enforced end to end, not here.
    expect(headersFor({ account: 'klv1abc' })).toEqual([
      'Transaction Hash',
      'Block/Fees',
      'From/To',
      'In/Out',
      'Type',
      'Misc',
    ]);
  });

  it('ignores a repeated account parameter, which names no single account', () => {
    expect(headersFor({ account: ['klv1abc', 'klv1def'] })).toHaveLength(5);
  });

  it('leaves the column out on a route the account never filters', () => {
    // The asset page forwards `account` to the API, which ignores it, so the
    // list still holds everyone. A direction there would read "In" for
    // essentially every row.
    expect(headersFor({ account: 'klv1abc' }, '/asset/[asset]')).toHaveLength(
      5,
    );
  });

  it('ignores an empty account parameter', () => {
    expect(headersFor({ account: '' })).toHaveLength(5);
  });
});
