import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (address: string, maxLen: number) =>
    address.length > maxLen
      ? `${address.slice(0, maxLen / 2)}...${address.slice(-(maxLen / 2))}`
      : address,
}));

import { fetchAllValidators } from '@/services/requests/validators';
import { IBlockValidatorRow } from '../row';
import Validators from '../index';

jest.mock('@/services/requests/validators', () => ({
  fetchAllValidators: jest.fn(),
}));

const tableSpy: {
  current: {
    requestReady: boolean;
    rowSections: (entry: IBlockValidatorRow | string) => {
      element: () => React.ReactNode;
    }[];
    request: (
      page: number,
      limit: number,
    ) => Promise<{ data: { blockValidatorList: IBlockValidatorRow[] } }>;
    refreshKey?: number;
  } | null;
} = { current: null };

jest.mock('@/components/Table', () => {
  const ReactLib = require('react');
  return {
    __esModule: true,
    default: (props: typeof tableSpy.current) => {
      tableSpy.current = props;
      return ReactLib.createElement('div', {
        'data-testid': 'validators-table',
        'data-ready': String(props?.requestReady),
      });
    },
  };
});

const fetchMock = fetchAllValidators as jest.Mock;

const draw = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <Validators
          validators={['AA', 'NOOWNER', 'EE', 'zz']}
          producerOwnerAddress="klv1alpha"
        />
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

const drawRow = (row: IBlockValidatorRow) => {
  const sections = tableSpy.current?.rowSections(row) ?? [];
  return render(
    <ThemeProvider theme={theme}>
      <>
        {sections[0].element()}
        {sections[1].element()}
      </>
    </ThemeProvider>,
  );
};

describe('block Validators tab', () => {
  beforeEach(() => {
    tableSpy.current = null;
    fetchMock.mockReset();
  });

  it('holds the table and ignores a header string while the directory loads', () => {
    fetchMock.mockReturnValue(new Promise(() => undefined));
    draw();
    expect(screen.getByTestId('validators-table')).toHaveAttribute(
      'data-ready',
      'false',
    );
    const sections = tableSpy.current?.rowSections('Name') ?? [];
    expect(sections[0].element()).toBeNull();
    expect(sections[1].element()).toBeNull();
  });

  it('joins keys, skips a directory row with no key or owner, and renders each cell', async () => {
    fetchMock.mockResolvedValue({
      validators: [
        { blsPublicKey: 'Aa', ownerAddress: 'klv1alpha', name: 'Alpha' },
        { blsPublicKey: '', ownerAddress: 'klv1skip', name: 'Skip' },
        { blsPublicKey: 'NOOWNER', name: 'ShouldNotShow' },
        { blsPublicKey: 'Ee', ownerAddress: 'klv1delta00000000ZZ', name: '' },
      ],
      totalRecords: 4,
    });
    draw();
    await waitFor(() =>
      expect(screen.getByTestId('validators-table')).toHaveAttribute(
        'data-ready',
        'true',
      ),
    );
    const response = await tableSpy.current?.request(1, 10);
    const rows = response?.data.blockValidatorList ?? [];
    expect(rows.map(row => row.blsKey)).toEqual(['AA', 'NOOWNER', 'EE', 'zz']);
    expect(rows.map(row => row.leader)).toEqual([true, false, false, false]);
    expect(tableSpy.current?.refreshKey).toBeGreaterThan(0);
    expect(rows[1].name).toBeUndefined();
    expect(rows[2].name).toBe('');

    const leader = drawRow(rows[0]);
    expect(leader.getByTestId('validator-link')).toHaveTextContent('Alpha');
    expect(leader.getByTestId('block-leader')).toBeInTheDocument();
    expect(leader.getByTitle('AA').closest('a')).toHaveAttribute(
      'href',
      '/validator/klv1alpha',
    );
    leader.unmount();

    const named = drawRow(rows[2]);
    expect(named.getByTestId('validator-link')).toHaveTextContent(
      'klv1delt...000000ZZ',
    );
    expect(named.queryByTestId('block-leader')).not.toBeInTheDocument();
    named.unmount();

    const unknown = drawRow(rows[3]);
    expect(unknown.getByText('Unknown')).toHaveAttribute('title', 'zz');
    expect(unknown.getByText('zz')).toHaveAttribute('title', 'zz');
    expect(unknown.container.querySelector('a')).toBeNull();
  });

  it('lists every key as unknown when the directory request fails', async () => {
    fetchMock.mockRejectedValue(new Error('down'));
    draw();
    await waitFor(() =>
      expect(screen.getByTestId('validators-table')).toHaveAttribute(
        'data-ready',
        'true',
      ),
    );
    const response = await tableSpy.current?.request(1, 10);
    const rows = response?.data.blockValidatorList ?? [];
    expect(tableSpy.current?.refreshKey).toBe(0);
    expect(rows.every(row => !row.ownerAddress && !row.leader)).toBe(true);
    expect(rows.map(row => row.blsKey)).toEqual(['AA', 'NOOWNER', 'EE', 'zz']);
  });
});
