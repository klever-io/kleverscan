import theme from '@/styles/theme';
import { VersionStat } from '@/services/requests/heartbeat';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

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

/**
 * Resolves against the real `en` bundle rather than echoing keys back, so
 * every assertion below keeps checking the words a reader actually sees, and a
 * key that never lands in the JSON fails here instead of rendering its own
 * name at the user.
 */
jest.mock('next-i18next', () => {
  const bundle = jest.requireActual(
    '../../../../../public/locales/en/validators.json',
  );

  const lookup = (key: string): string | undefined =>
    key
      .replace(/^validators:/, '')
      .split('.')
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === 'object'
            ? (node as Record<string, unknown>)[part]
            : undefined,
        bundle,
      ) as string | undefined;

  return {
    useTranslation: () => ({
      t: (key: string, options?: Record<string, unknown>) => {
        const count = options?.count;
        const resolved =
          count === undefined
            ? lookup(key)
            : (lookup(`${key}_${count === 1 ? 'one' : 'other'}`) ??
              lookup(key));
        if (resolved === undefined) {
          throw new Error(`missing translation key: ${key}`);
        }
        return Object.entries(options ?? {}).reduce(
          (text, [name, value]) =>
            text.replace(new RegExp(`{{${name}}}`, 'g'), String(value)),
          resolved,
        );
      },
    }),
  };
});

import VersionDistribution from '../index';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const baseStats: VersionStat[] = [
  {
    version: 'v1.7.21-rc1',
    count: 10,
    percent: 50,
    isLatest: true,
    isUnknown: false,
    stake: 500,
    stakePercent: 60,
  },
  {
    version: 'v1.7.20',
    count: 6,
    percent: 30,
    isLatest: false,
    isUnknown: false,
    stake: 200,
    stakePercent: 25,
  },
  {
    version: 'Unknown',
    count: 4,
    percent: 20,
    isLatest: false,
    isUnknown: true,
    stake: 100,
    stakePercent: 15,
  },
];

describe('VersionDistribution', () => {
  it('renders stats strip and distribution when data is available', () => {
    renderWithTheme(
      <VersionDistribution
        stats={baseStats}
        latestVersion="v1.7.21-rc1"
        loading={false}
        heartbeatAvailable
        validatorsAvailable
        mode="nodes"
        onModeChange={jest.fn()}
        onSelectVersion={jest.fn()}
      />,
    );

    expect(screen.getAllByText('v1.7.21-rc1').length).toBeGreaterThan(0);
    expect(screen.getByTestId('on-latest-callout')).toHaveTextContent('50.0%');
    // The version itself is printed once, beside "Newest"; repeating it here
    // was one of three copies of the same string in this block.
    expect(screen.getByText(/50.0% of nodes on latest/)).toBeInTheDocument();
    expect(screen.getByText('10 nodes')).toBeInTheDocument();
  });

  // The validator count moved to the page summary, which already carried it as
  // its first tile. Two elements printing the same number a card apart is what
  // made this block read as a competing section.
  it('no longer repeats the validator count the summary owns', () => {
    renderWithTheme(
      <VersionDistribution
        stats={baseStats}
        latestVersion="v1.7.21-rc1"
        loading={false}
        heartbeatAvailable
        validatorsAvailable
        mode="nodes"
        onModeChange={jest.fn()}
        onSelectVersion={jest.fn()}
      />,
    );

    expect(screen.queryByText('Total Validators')).not.toBeInTheDocument();
  });

  it('shows loading skeletons while loading', () => {
    renderWithTheme(
      <VersionDistribution
        stats={[]}
        loading
        heartbeatAvailable={false}
        validatorsAvailable={false}
        mode="nodes"
        onModeChange={jest.fn()}
        onSelectVersion={jest.fn()}
      />,
    );

    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });

  it('shows heartbeat failure message', () => {
    renderWithTheme(
      <VersionDistribution
        stats={[]}
        loading={false}
        heartbeatAvailable={false}
        validatorsAvailable
        mode="nodes"
        onModeChange={jest.fn()}
        onSelectVersion={jest.fn()}
      />,
    );

    expect(
      screen.getByText(/Could not load node versions/i),
    ).toBeInTheDocument();
  });

  it('shows validators failure message', () => {
    renderWithTheme(
      <VersionDistribution
        stats={[]}
        loading={false}
        heartbeatAvailable
        validatorsAvailable={false}
        mode="nodes"
        onModeChange={jest.fn()}
        onSelectVersion={jest.fn()}
      />,
    );

    expect(
      screen.getByText(/Could not load the full validator list/i),
    ).toBeInTheDocument();
  });

  it('toggles Nodes/Stake mode', () => {
    const onModeChange = jest.fn();
    renderWithTheme(
      <VersionDistribution
        stats={baseStats}
        latestVersion="v1.7.21-rc1"
        loading={false}
        heartbeatAvailable
        validatorsAvailable
        mode="nodes"
        onModeChange={onModeChange}
        onSelectVersion={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Stake' }));
    expect(onModeChange).toHaveBeenCalledWith('stake');
  });

  it('selects and clears a version filter on row click', () => {
    const onSelectVersion = jest.fn();
    const { rerender } = renderWithTheme(
      <VersionDistribution
        stats={baseStats}
        latestVersion="v1.7.21-rc1"
        loading={false}
        heartbeatAvailable
        validatorsAvailable
        mode="nodes"
        onModeChange={jest.fn()}
        selectedVersion={undefined}
        onSelectVersion={onSelectVersion}
      />,
    );

    fireEvent.click(screen.getByTitle('Filter by v1.7.20'));
    expect(onSelectVersion).toHaveBeenCalledWith('v1.7.20');

    rerender(
      <ThemeProvider theme={theme}>
        <VersionDistribution
          stats={baseStats}
          latestVersion="v1.7.21-rc1"
          loading={false}
          heartbeatAvailable
          validatorsAvailable
          mode="nodes"
          onModeChange={jest.fn()}
          selectedVersion="v1.7.20"
          onSelectVersion={onSelectVersion}
        />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByTitle('Filter by v1.7.20'));
    expect(onSelectVersion).toHaveBeenLastCalledWith(undefined);
  });

  it('shows stake values in stake mode', () => {
    renderWithTheme(
      <VersionDistribution
        stats={baseStats}
        latestVersion="v1.7.21-rc1"
        loading={false}
        heartbeatAvailable
        validatorsAvailable
        mode="stake"
        onModeChange={jest.fn()}
        onSelectVersion={jest.fn()}
      />,
    );

    expect(screen.getByText(/60.0% of stake on latest/)).toBeInTheDocument();
  });

  it('expands when more than the collapse threshold versions exist', () => {
    const many: VersionStat[] = Array.from({ length: 5 }, (_, i) => ({
      version: `v1.0.${i}`,
      count: 1,
      percent: 20,
      isLatest: i === 4,
      isUnknown: false,
      stake: 1,
      stakePercent: 20,
    }));

    renderWithTheme(
      <VersionDistribution
        stats={many}
        latestVersion="v1.0.4"
        loading={false}
        heartbeatAvailable
        validatorsAvailable
        mode="nodes"
        onModeChange={jest.fn()}
        onSelectVersion={jest.fn()}
      />,
    );

    expect(screen.getByText(/\+2 other versions/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/\+2 other versions/));
    expect(screen.getByText('Show less')).toBeInTheDocument();
  });
});
