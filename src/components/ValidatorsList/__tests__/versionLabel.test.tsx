import { render, screen } from '@testing-library/react';
import React from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// RTL 12 renders through the legacy `react-dom` entry, which React 19 removed.
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
import { IValidator } from '@/types/index';
import { ThemeProvider } from 'styled-components';
import { VersionBadge } from '../cells';
import { validatorRowSections, IValidatorRowContext } from '../rows';
import { VALIDATOR_COLUMNS } from '../columns';

const draw = (ui: React.ReactElement): void => {
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

const labels = {
  copyAddress: 'copy',
  addressCopied: 'copied',
  openValidator: 'open',
  openInNewTab: 'new tab',
  canDelegate: 'Open',
  canDelegateTooltip: 'accepts',
  cannotDelegate: 'Closed',
  cannotDelegateTooltip: 'refuses',
  missedShare: 'Missed share',
  unknownVersion: 'Unknown',
  versionUnavailable: 'Unavailable',
  versionUnavailableTooltip: 'Node versions could not be loaded',
  noDelegationLimit: 'No limit',
  capacityDetail: () => 'detail',
} as unknown as IValidatorRowContext['labels'];

const validator = {
  rank: 1,
  name: 'Compass',
  ownerAddress: 'klv1owner',
  parsedAddress: 'klv1...owner',
  staked: 1000,
  commission: 500,
  maxDelegation: 2000,
  rating: 10_000_000,
  status: 'elected',
  totalProduced: 10,
  totalMissed: 1,
  canDelegate: true,
  selfStake: 10,
  cumulativeStaked: 1,
  blsPublicKey: 'BLS1',
} as unknown as IValidator;

const versionCellIndex = VALIDATOR_COLUMNS.findIndex(
  column => column.key === 'version',
);

const renderVersionCell = (heartbeatAvailable: boolean): void => {
  const sections = validatorRowSections(validator, {
    versionMap: {},
    latestVersion: undefined,
    heartbeatAvailable,
    labels,
  });
  draw(<>{sections[versionCellIndex].element({})}</>);
};

describe('VersionBadge', () => {
  it('renders the version itself when the node reported one', () => {
    draw(<VersionBadge version="v1.7.21" isLatest unknownLabel="Unknown" />);

    expect(screen.getByText('v1.7.21')).toBeInTheDocument();
  });

  it('renders the bare label when the version is genuinely unknown', () => {
    draw(
      <VersionBadge
        version={undefined}
        isLatest={false}
        unknownLabel="Unknown"
      />,
    );

    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(document.querySelector('.button-tooltip')).toBeNull();
  });

  /* The distinction the whole change exists for: an outage must not read like
     the third of mainnet that genuinely has no heartbeat, so this label is the
     one that carries an explanation. */
  it('wraps the label in a tooltip when the source is the thing that failed', () => {
    draw(
      <VersionBadge
        version={undefined}
        isLatest={false}
        unknownLabel="Unavailable"
        unknownTooltip="Node versions could not be loaded"
      />,
    );

    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    expect(document.querySelector('.button-tooltip')).not.toBeNull();
  });
});

describe('validatorRowSections version cell', () => {
  it('says Unknown while the heartbeat is answering', () => {
    renderVersionCell(true);

    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(screen.queryByText('Unavailable')).toBeNull();
  });

  /* Same empty version map both ways. Only the flag differs, which is the
     point: without it the two states are indistinguishable. */
  it('says Unavailable once the heartbeat is the thing that failed', () => {
    renderVersionCell(false);

    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    expect(screen.queryByText('Unknown')).toBeNull();
  });
});
