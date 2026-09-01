import { render, screen, within } from '@testing-library/react';
import React from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mockSources = jest.fn();

// The card reads the palette from the app's own theme context, not from
// styled-components', so the provider alone does not reach it.
jest.mock('@/contexts/theme', () => ({
  useTheme: () => ({
    theme: jest.requireActual('@/styles/theme').default,
    isDarkTheme: false,
    toggleDarkTheme: () => undefined,
  }),
}));

jest.mock('../useValidatorSources', () => ({
  useValidatorSources: () => mockSources(),
}));

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      const leaf = key.split('.').pop() ?? key;
      const count = opts?.count;
      return count === undefined ? leaf : `${count} ${leaf}`;
    },
  }),
}));

// RTL 12 renders through the legacy `react-dom` entry, which React 19 removed.
// Same shim `DataList/__tests__/useDeferred.test.tsx` uses.
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

import theme from '@/styles/theme';
import { ThemeProvider } from 'styled-components';
import ValidatorsSummary from '../Summary';

const renderSummary = (): void => {
  render(
    <ThemeProvider theme={theme}>
      <ValidatorsSummary />
    </ThemeProvider>,
  );
};

const validator = (over: Record<string, unknown> = {}) => ({
  blsPublicKey: 'BLS1',
  ownerAddress: 'klv1owner',
  name: 'Node',
  status: 'elected',
  staked: 1_000_000,
  maxDelegation: 2_000_000,
  totalProduced: 10,
  totalMissed: 1,
  blocksProduced: 10,
  blocksMissed: 1,
  canDelegate: true,
  ...over,
});

const sources = (over: Record<string, unknown> = {}) => ({
  data: {
    validators: [validator()],
    entries: [{ publicKey: 'BLS1', versionNumber: 'v1', isActive: true }],
    networkTotalStake: 10_000_000,
    totalRecords: 1,
    validatorsAvailable: true,
    heartbeatAvailable: true,
    ...over,
  },
  isLoading: false,
});

const card = () => screen.getByLabelText('Label');

/** The value under one tile's label. Asserting on the card's concatenated text
 *  cannot tell the tiles apart, so a regression that gated only the sub lines
 *  and left the value printing 0 would keep every assertion green. */
const tileValue = (label: string): string => {
  const tile = within(card()).getByText(label).parentElement as HTMLElement;
  return (tile.children[1]?.textContent ?? '').trim();
};

describe('ValidatorsSummary', () => {
  beforeEach(() => mockSources.mockReset());

  it('shows the figures when both sources answered', () => {
    mockSources.mockReturnValue(sources());
    renderSummary();

    expect(tileValue('Validators')).toBe('1');
    expect(tileValue('NodesOnline')).toBe('1 / 1');
    expect(card().textContent).toContain('1 Elected');
  });

  it('says the count is unavailable rather than printing a zero the chain never had', () => {
    // The hook settles both halves instead of rejecting, so a failed list is a
    // successful empty answer: without the flag every tile would state 0 as a
    // measured fact, next to a card that says the load failed.
    mockSources.mockReturnValue(
      sources({ validators: [], validatorsAvailable: false }),
    );
    renderSummary();

    // Per tile: the count, the stake, the delegation room and the block total
    // all come off the failed list, so none of them may print a figure.
    expect(tileValue('Validators')).toBe('NoData');
    expect(tileValue('Staked')).toBe('NoData');
    expect(tileValue('OpenForDelegation')).toBe('NoData');
    expect(tileValue('BlocksProduced')).toBe('NoData');
    expect(card().textContent).not.toContain('0 Elected');
  });

  it('keeps the node tile unavailable when only the heartbeat failed', () => {
    mockSources.mockReturnValue(
      sources({ entries: [], heartbeatAvailable: false }),
    );
    renderSummary();

    // The list answered, so its own tiles still carry figures; only the node
    // tile depends on the heartbeat, and its observer count is a difference
    // against the validator key set, so it needs both.
    expect(tileValue('Validators')).toBe('1');
    expect(tileValue('NodesOnline')).toBe('NoData');
    expect(card().textContent).not.toContain('0 / 0');
  });

  it('holds the bar and legend space when the list failed', () => {
    // The card is 158px with the bar and 109 without, and the version card and
    // the table sit under it, so dropping the space moved the page 78px the
    // moment a recovery poll landed.
    mockSources.mockReturnValue(
      sources({ validators: [], validatorsAvailable: false }),
    );
    renderSummary();

    // One entry per chain state, so the placeholder wraps onto the same number
    // of lines the real legend does.
    expect(card().querySelectorAll('[data-testid="skeleton"]').length).toBe(6);
  });

  it('renders the loading shape while the sources are on their way', () => {
    mockSources.mockReturnValue({ data: sources().data, isLoading: true });
    renderSummary();

    expect(card().getAttribute('aria-busy')).toBe('true');
  });
});
