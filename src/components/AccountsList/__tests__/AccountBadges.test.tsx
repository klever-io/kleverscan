import theme from '@/styles/theme';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Resolved against the shipped English bundle, so a badge label or tooltip key
 * that nobody added fails here instead of rendering "Badges.Foundation" at a
 * reader. That is not hypothetical: it is exactly what the page showed after
 * the keys were added but before the dev server was restarted.
 */
jest.mock('next-i18next', () => {
  const bundle = jest.requireActual(
    '../../../../public/locales/en/accounts.json',
  );

  const translate = (
    key: string,
    options?: { defaultValue?: string },
  ): string => {
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
    // Mirrors i18next: a caller that supplies a fallback gets it. Only a key
    // with neither is a mistake worth failing on.
    if (options?.defaultValue) return options.defaultValue;
    throw new Error(`missing accounts locale key: ${key}`);
  };

  return { useTranslation: () => ({ t: translate }) };
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

import AccountBadges from '../AccountBadges';
import type { IAccountBadges } from '../badges';

const renderBadges = (badges: Partial<IAccountBadges>) =>
  render(
    <ThemeProvider theme={theme}>
      <AccountBadges
        badges={{
          foundation: false,
          validator: false,
          genesisValidator: false,
          validatorList: '',
          ...badges,
        }}
      />
    </ThemeProvider>,
  );

describe('AccountBadges', () => {
  it('renders nothing at all for an ordinary account', () => {
    const { container } = renderBadges({});

    expect(container.textContent).toBe('');
  });

  it('renders the foundation badge on its own, with its own tooltip', () => {
    renderBadges({ foundation: true });

    const pill = screen.getByText('Foundation');
    expect(screen.queryByText('Validator')).toBeNull();
    // Asserted because the validator pill's title was checked twice and this
    // one never: swapping the two keys passed the whole suite, and the i18n
    // mock only proves a key exists, not that it is on the right pill.
    expect(pill.getAttribute('title')).toBe(
      "Created in the chain's first block",
    );
  });

  it('renders the plain validator badge with its role tooltip', () => {
    renderBadges({ validator: true });

    const pill = screen.getByText('Validator');
    expect(pill.getAttribute('title')).toBe('Owns a registered validator node');
  });

  it('appends the list state to the tooltip when the chain reports one', () => {
    renderBadges({ validator: true, validatorList: 'jailed' });

    expect(screen.getByText('Validator').getAttribute('title')).toBe(
      'Owns a registered validator node (Jailed)',
    );
  });

  it('falls back to the raw state for one the bundle does not carry', () => {
    // `list` is an untyped string on the chain, and the four states here are
    // the ones measured live plus the one this repo already renders elsewhere.
    // A fifth must read as itself rather than as a raw key.
    renderBadges({ validator: true, validatorList: 'somethingNew' });

    expect(screen.getByText('Validator').getAttribute('title')).toBe(
      'Owns a registered validator node (somethingNew)',
    );
  });

  it('swaps to the genesis form, and does not show both', () => {
    renderBadges({
      validator: true,
      genesisValidator: true,
      validatorList: 'elected',
    });

    const pill = screen.getByText('Genesis validator');
    expect(pill.getAttribute('title')).toBe(
      'Owns a validator registered in the genesis block (Elected)',
    );
    // A genesis validator is a validator; saying both would say it twice.
    expect(screen.queryByText('Validator')).toBeNull();
  });

  it('shows both badges when an account is foundation and a validator', () => {
    // Suppression happens upstream in accountBadges, not here: this component
    // renders what it is handed, so the combination has to work.
    renderBadges({ foundation: true, validator: true });

    expect(screen.getByText('Foundation')).toBeTruthy();
    expect(screen.getByText('Validator')).toBeTruthy();
  });
});
