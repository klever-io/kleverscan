import theme from '@/styles/theme';
import { Service } from '@/types';
import type { ContractInfo } from '@/types/smart-contract';
import api from '@/services/api';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TextDecoder, TextEncoder } from 'util';
import React from 'react';
import { ThemeProvider } from 'styled-components';

Object.assign(global, { TextEncoder, TextDecoder });
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('react-dom', () => {
  const actual = jest.requireActual('react-dom');
  const client = jest.requireActual('react-dom/client');
  const React = jest.requireActual('react');
  const roots = new Map<Element, { render: (ui: React.ReactNode) => void; unmount: () => void }>();

  return {
    ...actual,
    render: (ui: React.ReactNode, container: Element) => {
      let root = roots.get(container);
      if (!root) {
        root = client.createRoot(container);
        roots.set(container, root);
      }

      React.act(() => {
        root.render(ui);
      });
      return root;
    },
    unmountComponentAtNode: (container: Element) => {
      const root = roots.get(container);
      if (!root) return false;

      React.act(() => {
        root.unmount();
      });
      roots.delete(container);
      return true;
    },
  };
});

jest.mock('@klever/sdk-web', () => {
  const contracts = jest.requireActual('@klever/connect-contracts');

  return {
    abiEncoder: {
      encodeWithABI: (abi: unknown, value: unknown, rawType: string) =>
        contracts.bytesToHex(
          contracts.encodeByType(value, rawType, abi, false),
        ),
    },
  };
}, { virtual: true });

import { ContractReadTab } from '../ContractRead';

const mockApiPost = api.post as jest.Mock;
let consoleErrorSpy: jest.SpyInstance;

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const buildContractInfo = (abi: Record<string, unknown>): ContractInfo =>
  ({
    id: 1,
    contractAddress: 'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp7y7p',
    createdAt: '2026-03-30T00:00:00.000Z',
    updatedAt: '2026-03-30T00:00:00.000Z',
    contractVersions: [
      {
        abi: JSON.stringify(abi),
      },
    ],
  }) as ContractInfo;

beforeEach(() => {
  jest.clearAllMocks();
});

beforeAll(() => {
  consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation((...args: unknown[]) => {
      const [message] = args;
      if (
        typeof message === 'string' &&
        (message.includes('ReactDOMTestUtils.act') ||
          message.includes('React does not recognize the `isError` prop'))
      ) {
        return;
      }
    });
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

describe('ContractReadTab', () => {
  it('shows an empty state when there are no readonly endpoints', () => {
    const contractInfo = buildContractInfo({
      name: 'TestContract',
      constructor: { inputs: [], outputs: [] },
      endpoints: [
        {
          name: 'setValue',
          mutability: 'mutable',
          inputs: [],
          outputs: [],
        },
      ],
      types: {},
    });

    renderWithTheme(
      <ContractReadTab
        contractAddress={contractInfo.contractAddress}
        contractInfo={contractInfo}
      />,
    );

    expect(
      screen.getByText('No readable functions available for this contract.'),
    ).toBeInTheDocument();
  });

  it('validates required inputs before querying', async () => {
    const contractInfo = buildContractInfo({
      name: 'TestContract',
      constructor: { inputs: [], outputs: [] },
      endpoints: [
        {
          name: 'balanceOf',
          mutability: 'readonly',
          inputs: [{ name: 'ownerId', type: 'u64' }],
          outputs: [{ name: 'balance', type: 'BigUint' }],
        },
      ],
      types: {},
    });

    renderWithTheme(
      <ContractReadTab
        contractAddress={contractInfo.contractAddress}
        contractInfo={contractInfo}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /balanceOf/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Query' }));

    expect(
      screen.getByText('Missing required arguments: ownerId'),
    ).toBeInTheDocument();
    expect(mockApiPost).not.toHaveBeenCalled();
  });

  it('encodes query arguments before calling vm/hex and decodes numeric results', async () => {
    const contractInfo = buildContractInfo({
      name: 'TestContract',
      constructor: { inputs: [], outputs: [] },
      endpoints: [
        {
          name: 'balanceOf',
          mutability: 'readonly',
          inputs: [{ name: 'ownerId', type: 'u64' }],
          outputs: [{ name: 'balance', type: 'BigUint' }],
        },
      ],
      types: {},
    });

    mockApiPost.mockResolvedValue({
      error: '',
      data: {
        data: '0f4240',
      },
    });

    renderWithTheme(
      <ContractReadTab
        contractAddress={contractInfo.contractAddress}
        contractInfo={contractInfo}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /balanceOf/i }));
    fireEvent.change(screen.getByPlaceholderText('u64'), {
      target: { value: '42' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Query' }));

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith({
        route: 'vm/hex',
        service: Service.NODE,
        body: {
          scAddress: contractInfo.contractAddress,
          funcName: 'balanceOf',
          args: ['2a'],
        },
      });
    });

    expect(await screen.findByText('1000000')).toBeInTheDocument();
  });

  it('decodes multiple outputs including booleans, printable strings, and raw bytes', async () => {
    const contractInfo = buildContractInfo({
      name: 'TestContract',
      constructor: { inputs: [], outputs: [] },
      endpoints: [
        {
          name: 'describe',
          mutability: 'readonly',
          inputs: [],
          outputs: [
            { name: 'enabled', type: 'bool' },
            { name: 'label', type: 'utf-8 string' },
            { name: 'payload', type: 'bytes' },
          ],
        },
      ],
      types: {},
    });

    mockApiPost.mockResolvedValue({
      error: '',
      data: {
        data: ['01', '48656c6c6f20576f726c64', '00ff'],
      },
    });

    renderWithTheme(
      <ContractReadTab
        contractAddress={contractInfo.contractAddress}
        contractInfo={contractInfo}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /describe/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Query' }));

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith({
        route: 'vm/hex',
        service: Service.NODE,
        body: {
          scAddress: contractInfo.contractAddress,
          funcName: 'describe',
          args: [],
        },
      });
    });

    expect(await screen.findByText(/enabled: true/)).toBeInTheDocument();
    expect(screen.getByText(/label: Hello World/)).toBeInTheDocument();
    expect(screen.getByText(/payload: 0x00ff/)).toBeInTheDocument();
  });

  it('shows API errors returned by the node query', async () => {
    const contractInfo = buildContractInfo({
      name: 'TestContract',
      constructor: { inputs: [], outputs: [] },
      endpoints: [
        {
          name: 'version',
          mutability: 'readonly',
          inputs: [],
          outputs: [{ name: 'value', type: 'u32' }],
        },
      ],
      types: {},
    });

    mockApiPost.mockResolvedValue({
      error: 'vm execution failed',
      data: null,
    });

    renderWithTheme(
      <ContractReadTab
        contractAddress={contractInfo.contractAddress}
        contractInfo={contractInfo}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /version/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Query' }));

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith({
        route: 'vm/hex',
        service: Service.NODE,
        body: {
          scAddress: contractInfo.contractAddress,
          funcName: 'version',
          args: [],
        },
      });
    });

    expect(await screen.findByText('vm execution failed')).toBeInTheDocument();
  });
});
