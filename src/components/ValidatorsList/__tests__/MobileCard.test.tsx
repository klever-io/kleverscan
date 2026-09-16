import { render, screen } from '@testing-library/react';
import React from 'react';

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

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key.split(/[:.]/).pop(),
  }),
}));

import theme from '@/styles/theme';
import { IValidator } from '@/types/index';
import { ThemeProvider } from 'styled-components';
import ValidatorsMobileCard from '../MobileCard';

const validator = (overrides: Partial<IValidator> = {}): IValidator =>
  ({
    ownerAddress: 'klv1owner',
    name: 'Compass',
    parsedAddress: 'klv1...owner',
    rank: 2,
    status: 'elected',
    staked: 1_000_000,
    commission: 500,
    maxDelegation: 2_000_000,
    rating: 10_000_000,
    canDelegate: true,
    totalProduced: 10,
    totalMissed: 1,
    blocksProduced: 9,
    blocksMissed: 1,
    selfStake: 10,
    cumulativeStaked: 1,
    blsPublicKey: 'BLS1',
    ...overrides,
  }) as IValidator;

const draw = (
  item: IValidator,
  extras: Partial<React.ComponentProps<typeof ValidatorsMobileCard>> = {},
) =>
  render(
    <ThemeProvider theme={theme}>
      <ValidatorsMobileCard
        item={item}
        index={0}
        versionMap={{ bls1: 'v1.7.21' }}
        latestVersion="v1.7.21"
        heartbeatAvailable
        sourcesLoading={false}
        {...extras}
      />
    </ThemeProvider>,
  );

describe('ValidatorsMobileCard', () => {
  it('renders the rank-prefixed identity and the resolved version', () => {
    draw(validator());

    expect(screen.getByTestId('validator-link')).toHaveTextContent(
      '2. Compass',
    );
    expect(screen.getByText('v1.7.21')).toBeInTheDocument();
  });

  /* Pinned as DOM order because it was rebuilt twice in review: the delegate
     badge sits in the right-edge group BEFORE the two buttons, so the buttons
     stay outermost on every card. */
  it('keeps the delegate badge before the action buttons', () => {
    draw(validator());

    const row = screen.getByTestId('validator-link').parentElement as Element;
    const kids = [...row.children].map(
      el => el.className.split(' ')[0].split('-sc-')[0],
    );
    const slot = kids.findIndex(cls => /DelegateSlot/.test(cls));
    const actions = kids.findIndex(cls => /RowActions/.test(cls));
    expect(slot).toBeGreaterThan(-1);
    expect(actions).toBeGreaterThan(-1);
    expect(slot).toBeLessThan(actions);
  });

  it('states the refusal for a validator that does not delegate', () => {
    draw(validator({ canDelegate: false }));

    expect(screen.getByText('CannotDelegate')).toBeInTheDocument();
    expect(screen.queryByText('CanDelegate')).toBeNull();
  });

  it('shows a version skeleton while the shared query is in flight', () => {
    draw(validator(), { sourcesLoading: true, heartbeatAvailable: false });

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByText('VersionUnavailable')).toBeNull();
  });
});
