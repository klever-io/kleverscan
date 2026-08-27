import theme from '@/styles/theme';
import { render, screen, within } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * The real module reaches `services/requests/ito` and from there the ESM chain
 * Jest cannot transform, so it is replaced wholesale, the way the transactions
 * card's own suite does it. The truncation itself is therefore not what this
 * file checks; the e2e covers that, at a viewport where this card is what
 * renders.
 */
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string, max: number) =>
    `${value.slice(0, max / 2)}...${value.slice(-(max / 2))}`,
}));

/**
 * Resolved against the shipped English bundles rather than echoed back, so a
 * key the card asks for that nobody ever added fails here instead of rendering
 * "accounts:Common.CopyAddress" at a reader.
 */
jest.mock('next-i18next', () => {
  const bundles: Record<string, unknown> = {
    accounts: jest.requireActual('../../../../public/locales/en/accounts.json'),
    table: jest.requireActual('../../../../public/locales/en/table.json'),
  };

  const translate = (key: string): string => {
    const [namespace, path] = key.includes(':')
      ? key.split(':')
      : ['accounts', key];
    const value = path
      .split('.')
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === 'object'
            ? (node as Record<string, unknown>)[part]
            : undefined,
        bundles[namespace],
      );
    if (typeof value !== 'string') {
      throw new Error(`missing ${namespace} locale key: ${key}`);
    }
    return value;
  };

  return { useTranslation: () => ({ t: translate }) };
});

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

import AccountsMobileCard from '../MobileCard';

const ADDRESS =
  'klv1edd0ymfmv9r2mxk7mdtsk4zfeql5cp9vyn7t4y4adq58vp2r9alslfglw8';

const account = {
  address: ADDRESS,
  nonce: 42,
  // 500 KLV and 12.5 KLV at precision 6.
  balance: 500_000_000,
  frozenBalance: 12_500_000,
} as never;

const GENESIS_MS = 1656680400000;

const renderCard = (
  overrides: Record<string, unknown> = {},
  sources: Record<string, unknown> = {},
) =>
  render(
    <ThemeProvider theme={theme}>
      <AccountsMobileCard
        item={{ ...(account as object), ...overrides } as never}
        index={3}
        {...(sources as never)}
      />
    </ThemeProvider>,
  );

describe('AccountsMobileCard', () => {
  it('links the address to its account page and marks it for the smoke suite', () => {
    renderCard();

    const link = screen.getByTestId('account-link');
    expect(link.getAttribute('href')).toBe(`/account/${ADDRESS}`);
    // The whole address in the tooltip, because the visible text is shortened.
    expect(link.getAttribute('title')).toBe(ADDRESS);
  });

  it('badges the card from the same sources as the desktop row', () => {
    // The card path was only ever rendered without the two sources, so the
    // "no badges" branch was the only one any test reached. Everything else
    // about badges on this path was covered by Cypress alone.
    renderCard(
      { timestamp: GENESIS_MS },
      {
        genesisTimestamp: GENESIS_MS,
        owners: { [ADDRESS]: { isGenesis: true, list: 'elected' } },
      },
    );
    const card = screen.getByTestId('table-row-3');

    expect(card.textContent).toContain('Foundation');
    expect(card.textContent).toContain('Genesis validator');
  });

  it('shows no badge while the sources are still unknown', () => {
    renderCard({ timestamp: GENESIS_MS });
    const card = screen.getByTestId('table-row-3');

    expect(card.textContent).not.toContain('Foundation');
    expect(card.textContent).not.toContain('alidator');
  });

  it('carries the row index, which is what the table keys its rows on', () => {
    renderCard();

    expect(screen.getByTestId('table-row-3')).toBeTruthy();
  });

  it('divides both amounts by the KLV precision', () => {
    renderCard();
    const card = screen.getByTestId('table-row-3');

    // 500_000_000 and 12_500_000 raw, at precision 6.
    expect(card.textContent).toContain('500 KLV');
    expect(card.textContent).toContain('12.5');
    // The raw figures must not survive anywhere in the card.
    expect(card.textContent).not.toContain('500000000');
    expect(card.textContent).not.toContain('12500000');
  });

  it('labels the nonce through the locale bundle, not as a literal', () => {
    renderCard();
    const card = screen.getByTestId('table-row-3');

    // The i18n mock throws on a key the bundle does not carry, so reaching
    // this assertion already proves the key resolved; the text check pins the
    // label to its value so the two cannot drift apart.
    expect(card.textContent).toContain('Nonce 42');
  });

  it('offers copy and open-in-new-tab actions on the address', () => {
    renderCard();

    const card = screen.getByTestId('table-row-3');
    expect(within(card).getByLabelText('Copy address')).toBeTruthy();
    const open = within(card).getByLabelText('Open account in a new tab');
    expect(open.getAttribute('href')).toBe(`/account/${ADDRESS}`);
    // Set by the shared control, and the reason a reviewer does not have to
    // check for it at every call site.
    expect(open.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
