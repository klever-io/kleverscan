jest.mock('@/contexts/contractModal', () => ({
  useContractModal: () => ({
    getInteractionsButtons: () => [],
  }),
}));

jest.mock('qrcode.react', () => ({
  QRCodeSVG: () => <svg data-testid="qr-code" />,
}));

jest.mock('@/components/InputGlobal', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props: React.InputHTMLAttributes<HTMLInputElement>) =>
      React.createElement('input', props),
  };
});

jest.mock('@/components/QrCodeModal', () => ({
  __esModule: true,
  default: () => <button type="button">QR</button>,
}));

jest.mock('@/components/TransactionDetails/TokenOperations', () => ({
  __esModule: true,
  default: ({ receipts }: { receipts: unknown[] }) =>
    receipts.length ? <div>Token transfers</div> : null,
}));

jest.mock('@/components/Tooltip', () => ({
  __esModule: true,
  default: () => <span>tooltip</span>,
}));

jest.mock('@/components/TransactionDetails/KappFee', () => ({
  __esModule: true,
  default: ({ kAppFee }: { kAppFee: number }) => <p>{kAppFee}</p>,
}));

import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
import { formatDateWithSeconds } from '@/utils/formatFunctions';
import Overview, { ITransactionOverview } from '../Overview';

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

const sender = 'klv1exampleaddressvalue000000000000000000000000000000';
const when = 1787664055000;

const loaded = (): ITransactionOverview => ({
  hash: 'abcd1234',
  nonce: 7,
  sender,
  bandwidthFee: 2000000,
  signature: 'sigvalue',
  timestamp: when,
  block: { epoch: 4 },
  blockNum: 12,
  status: 'Success',
  StatusIcon: () => <svg data-testid="status-icon" />,
  resultCode: 'Ok',
  kAppFee: 1,
  receipts: [{ typeString: 'Transfer' }],
});

const renderOverview = (props: ITransactionOverview) =>
  render(
    <ThemeProvider theme={theme}>
      <Overview {...props} />
    </ThemeProvider>,
  );

describe('Overview', () => {
  it('renders the loaded rows and keeps the copy control on the hash', () => {
    renderOverview(loaded());

    expect(screen.getByTitle('abcd1234')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy hash' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'QR' })).toBeInTheDocument();
    expect(screen.getByText('Token transfers')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Ok')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: sender })).toHaveAttribute(
      'href',
      `/account/${sender}`,
    );
    expect(
      screen.getByRole('link', { name: 'Open account in a new tab' }),
    ).toBeInTheDocument();
    expect(screen.getByText('2.000000')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('KLV')).toBeInTheDocument();
    expect(
      screen.getByText(formatDateWithSeconds(when)),
    ).toBeInTheDocument();
    expect(screen.getByTitle('sigvalue')).toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });

  it('shows a dash for a missing sender instead of a skeleton', () => {
    renderOverview({ ...loaded(), sender: undefined, hash: 'abcd1234' });

    expect(screen.getByText('--')).toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Open account in a new tab' }),
    ).not.toBeInTheDocument();
  });

  it('shows a skeleton only while the page is loading', () => {
    renderOverview({
      ...loaded(),
      loading: true,
      hash: undefined,
      sender: undefined,
    });

    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
    expect(screen.queryByText('--')).not.toBeInTheDocument();
  });

  it('hides epoch when the block lookup came back empty', () => {
    renderOverview({ ...loaded(), block: {} });

    expect(screen.queryByText('Epoch')).not.toBeInTheDocument();
  });

  it('hides the optional rows when those values are absent', () => {
    renderOverview({
      ...loaded(),
      status: undefined,
      StatusIcon: undefined,
      resultCode: undefined,
      block: undefined,
      blockNum: 0,
      kAppFee: 0,
      timestamp: undefined,
      receipts: [],
    });

    expect(screen.queryByText('Status')).not.toBeInTheDocument();
    expect(screen.queryByText('Result Code')).not.toBeInTheDocument();
    expect(screen.queryByText('Epoch')).not.toBeInTheDocument();
    expect(screen.queryByText('Block Number')).not.toBeInTheDocument();
    expect(screen.queryByText('kApp Fee')).not.toBeInTheDocument();
    expect(screen.queryByText('Time')).not.toBeInTheDocument();
    expect(screen.queryByText('Token transfers')).not.toBeInTheDocument();
    expect(screen.getByText('Nonce')).toBeInTheDocument();
  });
});
