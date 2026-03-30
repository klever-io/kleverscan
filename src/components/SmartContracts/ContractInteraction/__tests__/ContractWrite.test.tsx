import theme from '@/styles/theme';
import type { ContractInfo } from '@/types/smart-contract';
import { buildTransaction } from '@/components/Contract/utils';
import { getPrecision } from '@/utils/precisionFunctions';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TextDecoder, TextEncoder } from 'util';
import React from 'react';
import { toast } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import { web } from '@klever/sdk-web';

Object.assign(global, { TextEncoder, TextDecoder });
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const mockWallet = {
  signTransaction: jest.fn(),
  broadcastTransactions: jest.fn(),
};

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

jest.mock('react-syntax-highlighter', () => ({}), { virtual: true });
jest.mock('react-syntax-highlighter/dist/cjs/prism-light', () => ({}), {
  virtual: true,
});
jest.mock('@/contexts/contract/multicontract', () => ({
  useMulticontract: jest.fn(() => ({ metadata: '', setMetadata: jest.fn() })),
}));
jest.mock('@/contexts/contract', () => ({
  useContract: jest.fn(() => ({
    payload: null,
    formSend: jest.fn(),
    resetFormsData: jest.fn(),
  })),
}));
jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(() => ({
    handleSubmit: jest.fn(),
    watch: jest.fn(),
    getValues: jest.fn(),
  })),
  useFieldArray: jest.fn(() => ({
    fields: [],
    append: jest.fn(),
    remove: jest.fn(),
    replace: jest.fn(),
  })),
}));
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({ query: {} })),
}));
jest.mock('next/dynamic', () => () => () => null);
jest.mock('@/utils/hooks', () => ({
  useDidUpdateEffect: jest.fn(),
}));
jest.mock('@/utils/networkFunctions', () => ({
  getNetwork: jest.fn(() => 'mainnet'),
}));
jest.mock('@/contexts/extension', () => ({
  useExtension: jest.fn(() => ({
    walletAddress:
      'klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp7y7p',
    wallet: mockWallet,
  })),
}));
jest.mock('@/components/Contract/utils', () => ({
  buildTransaction: jest.fn(),
}));
jest.mock('@/utils/precisionFunctions', () => ({
  getPrecision: jest.fn(),
}));
jest.mock('@/components/Contract', () => ({
  HashComponent: ({ hash }: { hash: string }) => <div>{hash}</div>,
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('@klever/connect', () => ({
  Transaction: {
    fromTransaction: jest.fn((tx: unknown) => tx),
  },
}));
jest.mock(
  '@klever/sdk-web',
  () => {
    const contracts = jest.requireActual('@klever/connect-contracts');
    const emptyAbi = { types: {} };

    return {
      abiEncoder: {
        encodeABIValue: (
          value: unknown,
          rawType: string,
          nested = false,
        ) =>
          contracts.bytesToHex(
            contracts.encodeByType(value, rawType, emptyAbi, nested),
          ),
        encodeLengthPlusData: (value: string | string[], _innerType: string) => {
          if (Array.isArray(value)) {
            return value.length.toString(16).padStart(8, '0') + value.join('');
          }

          const bytes = new TextEncoder().encode(String(value));
          return (
            bytes.length.toString(16).padStart(8, '0') +
            contracts.bytesToHex(bytes)
          );
        },
      },
      utils: {
        getJSType: (type: string) => contracts.getJSType(type),
      },
      web: {
        signTransaction: jest.fn(async (tx: unknown) => ({ signed: tx })),
        broadcastTransactions: jest.fn(async () => ({
          error: '',
          data: { txsHashes: ['tx-hash-from-web'] },
        })),
      },
    };
  },
  { virtual: true },
);

import { ContractWriteTab } from '../ContractWrite';

const mockBuildTransaction = buildTransaction as jest.Mock;
const mockGetPrecision = getPrecision as jest.Mock;
const mockWeb = web as {
  signTransaction: jest.Mock;
  broadcastTransactions: jest.Mock;
};
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

beforeAll(() => {
  consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation((...args: unknown[]) => {
      const [message] = args;
      if (typeof message === 'string' && message.includes('ReactDOMTestUtils.act')) {
        return;
      }
    });
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

beforeEach(() => {
  jest.clearAllMocks();
  mockGetPrecision.mockResolvedValue(6);
  mockBuildTransaction.mockResolvedValue({
    result: { raw: 'unsigned-transaction' },
    txHash: 'fallback-hash',
  });
  mockWallet.signTransaction.mockResolvedValue({ signed: 'wallet-transaction' });
  mockWallet.broadcastTransactions.mockResolvedValue(['wallet-hash']);
  mockWeb.signTransaction.mockResolvedValue({ signed: 'web-transaction' });
  mockWeb.broadcastTransactions.mockResolvedValue({
    error: '',
    data: { txsHashes: ['tx-hash-from-web'] },
  });
});

describe('ContractWriteTab', () => {
  it('builds transaction metadata with ABI-encoded arguments', async () => {
    const contractInfo = buildContractInfo({
      name: 'TestContract',
      constructor: { inputs: [], outputs: [] },
      endpoints: [
        {
          name: 'setConfig',
          mutability: 'mutable',
          inputs: [
            { name: 'amount', type: 'u64' },
            { name: 'asset', type: 'TokenIdentifier' },
          ],
          outputs: [],
        },
      ],
      types: {},
    });

    renderWithTheme(
      <ContractWriteTab
        contractAddress={contractInfo.contractAddress}
        contractInfo={contractInfo}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /setConfig/i }));
    fireEvent.change(screen.getByPlaceholderText('u64'), {
      target: { value: '42' },
    });
    fireEvent.change(screen.getByPlaceholderText('TokenIdentifier'), {
      target: { value: 'KLV' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Write' }));

    await waitFor(() => {
      expect(mockBuildTransaction).toHaveBeenCalled();
    });

    const [, metadata] = mockBuildTransaction.mock.calls[0];
    const decodedMetadata = Buffer.from(metadata[0], 'base64').toString('utf-8');

    expect(decodedMetadata).toBe('setConfig@2a@4b4c56');
    expect(toast.success).toHaveBeenCalledWith('Transaction sent successfully');
  });
});
