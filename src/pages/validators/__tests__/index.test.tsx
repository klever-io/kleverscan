import theme from '@/styles/theme';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mockPush = jest.fn();
let mockQuery: Record<string, string | string[] | undefined> = {};

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: mockQuery,
    pathname: '/validators',
    push: mockPush,
    isReady: true,
  }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

jest.mock('@/assets/cards', () => ({
  Validators: () => <span data-testid="validators-icon" />,
}));

jest.mock('@/assets/status', () => ({
  getStatusIcon: () => () => null,
}));

jest.mock('@/assets/icons', () => ({
  FilterArrowDown: () => <svg data-testid="arrow" />,
}));

jest.mock('@/utils/hooks', () => ({
  useFetchPartial: () => [[], jest.fn(), false, jest.fn()],
}));

const mockApiGet = jest.fn();
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => mockApiGet(...args),
  },
}));

const mockHeartbeat = jest.fn();
jest.mock('@/services/requests/heartbeat', () => {
  const actual = jest.requireActual('@/services/requests/heartbeat');
  return {
    ...actual,
    fetchHeartbeatStatus: (...args: unknown[]) => mockHeartbeat(...args),
  };
});

const mockFetchAll = jest.fn();
jest.mock('@/services/requests/validators', () => ({
  fetchAllValidators: (...args: unknown[]) => mockFetchAll(...args),
}));

jest.mock('@/utils/parseValues', () => ({
  parseValidators: (res: { data: { validators: unknown[] } }) =>
    res.data.validators,
}));

jest.mock('@/components/Copy', () => ({
  __esModule: true,
  default: () => <span data-testid="copy" />,
}));

jest.mock('@/components/Progress', () => ({
  __esModule: true,
  default: () => <span data-testid="progress" />,
}));

jest.mock('@/components/Tooltip', () => ({
  __esModule: true,
  default: ({ Component }: { Component: React.FC }) => (
    <span data-testid="tooltip">
      <Component />
    </span>
  ),
}));

jest.mock('@/components/Detail', () => {
  return function MockDetail({
    customHeader,
    tableProps,
    filters,
    title,
  }: {
    customHeader?: React.ReactNode;
    tableProps?: {
      request: (page: number, limit: number) => Promise<unknown>;
      rowSections: (
        item: unknown,
      ) => Array<{ element: (p: object) => React.ReactNode }>;
      refreshKey?: number;
    };
    filters?: Array<{
      title?: string;
      data: string[];
      onClick?: (v: string) => void;
    }>;
    title: string;
  }) {
    const [rows, setRows] = React.useState<unknown[]>([]);

    React.useEffect(() => {
      let cancelled = false;
      if (!tableProps) return undefined;
      tableProps.request(1, 10).then((res: any) => {
        if (!cancelled) setRows(res?.data?.validators ?? []);
      });
      return () => {
        cancelled = true;
      };
      // refreshKey only — customHeader is new JSX every parent render.
    }, [tableProps?.refreshKey]);

    return (
      <div data-testid="detail">
        <h1>{title}</h1>
        <div data-testid="custom-header">{customHeader}</div>
        <div data-testid="filters">
          {filters?.map(f => (
            <div key={f.title} data-testid={`filter-${f.title}`}>
              <span>
                {f.title}:{f.data.join(',')}
              </span>
              {f.data.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => f.onClick?.(item)}
                >
                  pick-{item}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div data-testid="table-rows">
          {rows.map((row: any, i: number) => (
            <div key={i} data-testid={`row-${i}`}>
              {row.name}
              {tableProps?.rowSections(row).map((section, j) => (
                <div key={j}>{section.element({})}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
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

import Validators from '../index';

const sampleValidator = {
  ownerAddress: 'klv1owner1',
  parsedAddress: 'klv1…',
  name: 'Node-Alpha',
  rank: 1,
  staked: 1_000_000_000_000,
  cumulativeStaked: 1.5,
  rating: 10000000,
  canDelegate: true,
  selfStake: 100,
  status: 'elected',
  totalProduced: 10,
  totalMissed: 1,
  commission: 1000,
  maxDelegation: 0,
  blsPublicKey: 'bls-alpha',
};

const renderPage = () =>
  render(
    <ThemeProvider theme={theme}>
      <Validators />
    </ThemeProvider>,
  );

describe('Validators page', () => {
  beforeEach(() => {
    mockQuery = {};
    mockPush.mockReset();
    mockApiGet.mockReset();
    mockHeartbeat.mockReset();
    mockFetchAll.mockReset();

    mockHeartbeat.mockResolvedValue({
      versionMap: { 'bls-alpha': 'v1.7.21-rc1', 'bls-old': 'v1.7.20' },
      latestVersion: 'v1.7.21-rc1',
    });
    mockFetchAll.mockResolvedValue({
      validators: [
        sampleValidator,
        {
          ...sampleValidator,
          name: 'Old-Node',
          blsPublicKey: 'bls-old',
          rank: 2,
        },
      ],
      totalRecords: 2,
    });
    mockApiGet.mockResolvedValue({
      data: {
        validators: [
          sampleValidator,
          {
            ...sampleValidator,
            name: 'Old-Node',
            blsPublicKey: 'bls-old',
            rank: 2,
          },
        ],
      },
      pagination: {
        self: 1,
        next: 1,
        previous: 1,
        perPage: 10,
        totalPages: 1,
        totalRecords: 2,
      },
      error: '',
      code: 'successful',
    });
  });

  it('loads heartbeat + full list and renders distribution stats', async () => {
    renderPage();

    await waitFor(() => {
      expect(mockHeartbeat).toHaveBeenCalled();
      expect(mockFetchAll).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId('version-distribution')).toBeInTheDocument();
      expect(screen.getByTestId('on-latest-callout')).toBeInTheDocument();
    });

    // Version filter options come from aggregated stats
    await waitFor(() => {
      expect(screen.getByTestId('filter-Version').textContent).toContain(
        'v1.7.21-rc1',
      );
      expect(screen.getByTestId('filter-Version').textContent).toContain(
        'v1.7.20',
      );
    });
  });

  it('toggles stake mode from the distribution panel', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Stake' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Stake' }));

    await waitFor(() => {
      expect(
        screen.getByText(/of stake on latest/i),
      ).toBeInTheDocument();
    });
  });
});
