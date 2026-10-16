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

jest.mock('@/assets/coins', () => {
  const React = require('react');
  return {
    KLV: React.forwardRef(
      (
        props: React.SVGProps<SVGSVGElement>,
        ref: React.Ref<SVGSVGElement>,
      ) => React.createElement('svg', { ...props, ref }),
    ),
  };
});

jest.mock('@/utils/hooks', () => ({
  usePrecision: () => 6,
  usePackInfoPrecisions: () => [{}],
}));

jest.mock('next-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
import { Contract } from '@/types/contracts';
import { Transfer } from '../index';

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

const address = 'klv1exampleaddressvalue000000000000000000000000000000';

const renderTransfer = (toAddress: string) =>
  render(
    <ThemeProvider theme={theme}>
      <Transfer
        sender="klv1sender"
        type={0}
        typeString={Contract.Transfer}
        parameter={{ amount: 200000000, toAddress, assetId: 'KLV' }}
        contractIndex={0}
        filteredReceipts={[]}
        renderMetadata={() => null}
      />
    </ThemeProvider>,
  );

describe('Transfer to address', () => {
  it('links the recipient and keeps the copy control on that address', () => {
    renderTransfer(address);

    expect(screen.getByRole('link', { name: address })).toHaveAttribute(
      'href',
      `/account/${address}`,
    );
    expect(
      screen.getByRole('button', { name: 'Copy Address' }),
    ).toBeInTheDocument();
  });

  it('renders a dash when the recipient is missing', () => {
    renderTransfer('');

    expect(screen.getByText('--')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Open account in a new tab' }),
    ).not.toBeInTheDocument();
  });
});
