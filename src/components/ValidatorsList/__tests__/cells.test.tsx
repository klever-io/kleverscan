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
import {
  CapacityCell,
  statusVariant,
  ValidatorIdentity,
  MissedCell,
  VersionBadge,
} from '../cells';
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
  versionUnavailableReason: 'Node versions could not be loaded',
  noDelegationLimit: 'No limit',
  statusLabel: (status: string) => status,
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
  blocksProduced: 9,
  blocksMissed: 1,
  canDelegate: true,
  selfStake: 10,
  cumulativeStaked: 1,
  blsPublicKey: 'BLS1',
} as unknown as IValidator;

const versionCellIndex = VALIDATOR_COLUMNS.findIndex(
  column => column.key === 'version',
);

const renderVersionCell = (
  heartbeatAvailable: boolean,
  sourcesLoading = false,
): void => {
  const sections = validatorRowSections(validator, {
    versionMap: {},
    latestVersion: undefined,
    heartbeatAvailable,
    sourcesLoading,
    labels,
  });
  draw(<>{sections[versionCellIndex].element({})}</>);
};

/** The pill's variant is a styled-components class, so the cases are compared
 *  against each other rather than against a colour literal. */
const pillClass = (ui: React.ReactElement): string => {
  const { container, unmount } = render(
    <ThemeProvider theme={theme}>{ui}</ThemeProvider>,
  );
  const className = (container.firstElementChild as HTMLElement).className;
  unmount();
  return className;
};

describe('VersionBadge', () => {
  it('renders the version itself when the node reported one', () => {
    draw(
      <VersionBadge
        version="v1.7.21"
        latestVersion="v1.7.21"
        unknownLabel="Unknown"
      />,
    );

    expect(screen.getByText('v1.7.21')).toBeInTheDocument();
  });

  it('renders the bare label when the version is genuinely unknown', () => {
    draw(<VersionBadge version={undefined} unknownLabel="Unknown" />);

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
        unknownLabel="Unavailable"
        unknownTooltip="Node versions could not be loaded"
      />,
    );

    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    expect(document.querySelector('.button-tooltip')).not.toBeNull();
  });

  it('gives the unknown label the same pill the versions get', () => {
    const unknown = pillClass(
      <VersionBadge version={undefined} unknownLabel="Unknown" />,
    );
    const known = pillClass(
      <VersionBadge
        version="v1.7.21"
        latestVersion="v1.7.21"
        unknownLabel="x"
      />,
    );

    expect(unknown.split(' ')[0]).toBe(known.split(' ')[0]);
  });

  it('marks the newest version and an older one differently', () => {
    const latest = pillClass(
      <VersionBadge
        version="v1.7.21"
        latestVersion="v1.7.21"
        unknownLabel="x"
      />,
    );
    const older = pillClass(
      <VersionBadge
        version="v1.7.16"
        latestVersion="v1.7.21"
        unknownLabel="x"
      />,
    );

    expect(latest).not.toBe(older);
  });

  /* The inverse of the test above, and the one that matters: with the
     validator list half of the join missing there is no newest version, and
     flagging every node as out of date is the opposite of what the pill is
     for. */
  it('does not flag a version as outdated when there is nothing to compare', () => {
    const noBasis = pillClass(
      <VersionBadge
        version="v1.7.21"
        latestVersion={undefined}
        unknownLabel="x"
      />,
    );
    const older = pillClass(
      <VersionBadge
        version="v1.7.16"
        latestVersion="v1.7.21"
        unknownLabel="x"
      />,
    );
    const latest = pillClass(
      <VersionBadge
        version="v1.7.21"
        latestVersion="v1.7.21"
        unknownLabel="x"
      />,
    );

    expect(noBasis).not.toBe(older);
    expect(noBasis).not.toBe(latest);
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

  /* The third state, and the one both flags above get wrong on their own: the
     table's own request settles before the shared query, so every row claimed
     an outage for the few hundred ms in between. */
  it('claims neither while the shared query is still in flight', () => {
    renderVersionCell(false, true);

    expect(screen.queryByText('Unavailable')).toBeNull();
    expect(screen.queryByText('Unknown')).toBeNull();
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });
});

describe('CapacityCell', () => {
  const segments = (): number =>
    document.querySelectorAll('[class*="ShareSegment"], [data-fill]').length;

  const drawCapacity = (staked: number, maxDelegation: number): void => {
    draw(
      <CapacityCell
        staked={staked}
        maxDelegation={maxDelegation}
        noLimitLabel="No limit"
        detail="detail"
      />,
    );
  };

  it('paints a fill for a cap that is partly taken', () => {
    drawCapacity(500, 1000);

    expect(screen.getByText('50.0%')).toBeInTheDocument();
    expect(
      document.querySelector('[aria-hidden="true"] > * > *'),
    ).not.toBeNull();
  });

  /* The inverse, and the one that was wrong: ShareSegment carries a 2px
     minimum, so an untouched cap still painted a sliver that read as "some of
     this is already delegated" on the one figure the column exists for. 14 of
     209 mainnet rows round to zero. */
  it('paints nothing for a cap nothing has taken', () => {
    drawCapacity(0, 1000);

    expect(screen.getByText('0.0%')).toBeInTheDocument();
    expect(document.querySelector('[aria-hidden="true"] > * > *')).toBeNull();
  });

  it('states the absence of a cap instead of a fill', () => {
    drawCapacity(500, 0);

    expect(screen.getByText('No limit')).toBeInTheDocument();
  });
});

describe('statusVariant', () => {
  it.each([
    ['elected', 'success'],
    ['eligible', 'accent'],
    ['waiting', 'contract'],
    ['jailed', 'danger'],
    ['inactive', 'warning'],
    ['something-new', 'neutral'],
  ])('maps %s to %s', (state, variant) => {
    expect(statusVariant(state)).toBe(variant);
  });
});

describe('ValidatorIdentity', () => {
  const identityFor = (canDelegate: boolean) =>
    ({ ...validator, canDelegate }) as IValidator;

  it('states acceptance for a delegating validator', () => {
    draw(<ValidatorIdentity validator={identityFor(true)} labels={labels} />);

    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.queryByText('Closed')).toBeNull();
  });

  it('states refusal for one that does not delegate', () => {
    draw(<ValidatorIdentity validator={identityFor(false)} labels={labels} />);

    expect(screen.getByText('Closed')).toBeInTheDocument();
    expect(screen.queryByText('Open')).toBeNull();
  });
});

describe('MissedCell', () => {
  /* Zero attempts is unknown, not flawless: a share out of nothing would read
     as 0.00% missed. */
  it('prints the placeholder share when nothing was attempted', () => {
    draw(
      <MissedCell
        totalMissed={0}
        totalProduced={0}
        shareLabel="Missed share"
      />,
    );

    expect(screen.getByText(/, Missed share: - -%/)).toBeInTheDocument();
  });

  it('prints the share of attempts, not of successes', () => {
    draw(
      <MissedCell
        totalMissed={25}
        totalProduced={75}
        shareLabel="Missed share"
      />,
    );

    expect(screen.getByText(/, Missed share: 25.00%/)).toBeInTheDocument();
  });
});
