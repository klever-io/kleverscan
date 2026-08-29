import theme from '@/styles/theme';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/** Resolved against the shipped English bundle, so a missing badge label or tooltip key fails here
 *  instead of rendering "Badges.Foundation": exactly what the page showed before the dev server restart. */
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
    // Mirrors i18next: a caller supplying a fallback gets it; only a key with neither fails.
    if (options?.defaultValue) return options.defaultValue;
    throw new Error(`missing accounts locale key: ${key}`);
  };

  return { useTranslation: () => ({ t: translate }) };
});

// Thin, like every suite that meets it: the real one renders through
// react-tooltip's portal after a delay. What this suite owns is which msg a
// badge hands it and whether the trigger joined the tab order.
jest.mock('@/components/Tooltip', () => ({
  __esModule: true,
  default: ({
    msg,
    focusable,
    Component,
  }: {
    msg: string;
    focusable?: boolean;
    Component?: React.FC;
  }) => (
    <span
      title={msg}
      tabIndex={focusable ? 0 : undefined}
      data-testid="tooltip-trigger"
    >
      {Component ? <Component /> : null}
    </span>
  ),
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

/** The focusable trigger wrapping a pill, per the mock above. */
const triggerOf = (element: HTMLElement) =>
  element.closest('[data-testid="tooltip-trigger"]');

describe('AccountBadges', () => {
  it('renders nothing at all for an ordinary account', () => {
    const { container } = renderBadges({});

    expect(container.textContent).toBe('');
  });

  it('renders the foundation badge on its own, with its own tooltip', () => {
    renderBadges({ foundation: true });

    const trigger = triggerOf(screen.getByText('Foundation'));
    expect(screen.queryByText('Validator')).toBeNull();
    // The validator pill's tooltip was checked twice and this one never: swapping the two keys passed the whole suite.
    expect(trigger?.getAttribute('title')).toBe(
      "Created in the chain's first block",
    );
  });

  it('renders the plain validator badge with its role tooltip, and no state text', () => {
    renderBadges({ validator: true });

    const pill = screen.getByText('Validator');
    expect(pill.textContent).toBe('Validator');
    expect(triggerOf(pill)?.getAttribute('title')).toBe(
      'Owns a registered validator node',
    );
  });

  it('reads the list state with the badge and appends it to the tooltip', () => {
    renderBadges({ validator: true, validatorList: 'jailed' });

    // The hidden span makes a reader say "Validator, Jailed" in the row
    // itself, instead of hiding the state behind a hover-only title.
    const trigger = screen.getByTestId('tooltip-trigger');
    expect(trigger.textContent).toBe('Validator, Jailed');
    expect(trigger.getAttribute('title')).toBe(
      'Owns a registered validator node (Jailed)',
    );
  });

  it('puts every badge trigger in the tab order', () => {
    renderBadges({ foundation: true, validator: true });

    const triggers = screen.getAllByTestId('tooltip-trigger');
    expect(triggers).toHaveLength(2);
    triggers.forEach(trigger => {
      expect(trigger.getAttribute('tabindex')).toBe('0');
    });
  });

  it('falls back to the raw state for one the bundle does not carry', () => {
    // `list` is an untyped string on the chain; the four states are the ones
    // measured live, and a fifth must read as itself rather than a raw key.
    renderBadges({ validator: true, validatorList: 'somethingNew' });

    const trigger = screen.getByTestId('tooltip-trigger');
    expect(trigger.textContent).toBe('Validator, somethingNew');
    expect(trigger.getAttribute('title')).toBe(
      'Owns a registered validator node (somethingNew)',
    );
  });

  it('swaps to the genesis form, and does not show both', () => {
    renderBadges({
      validator: true,
      genesisValidator: true,
      validatorList: 'elected',
    });

    const trigger = screen.getByTestId('tooltip-trigger');
    expect(trigger.textContent).toBe('Genesis validator, Elected');
    expect(trigger.getAttribute('title')).toBe(
      'Owns a validator registered in the genesis block (Elected)',
    );
    // A genesis validator is a validator; saying both would say it twice.
    expect(screen.queryByText('Validator')).toBeNull();
  });

  it('shows both badges when an account is foundation and a validator', () => {
    // Suppression happens upstream in accountBadges; this component renders what it is handed.
    renderBadges({ foundation: true, validator: true });

    expect(screen.getByText('Foundation')).toBeTruthy();
    expect(screen.getByText('Validator')).toBeTruthy();
  });
});
