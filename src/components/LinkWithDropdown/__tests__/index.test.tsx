import theme from '@/styles/theme';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@/contexts/mobile', () => ({
  useMobile: () => ({ isMobile: false, isTablet: false }),
}));

jest.mock('@/contexts/theme', () => ({
  useTheme: () => ({ theme: { black: '#000' } }),
}));

// The Transfer button is built by a factory on the contract-modal context.
jest.mock('@/contexts/contractModal', () => ({
  useContractModal: () => ({
    getInteractionsButtons: () => [
      () => <button type="button">Transfer</button>,
    ],
  }),
}));

// qrcode.react does real encoding work; its presence is what matters here.
jest.mock('qrcode.react', () => ({
  QRCodeSVG: () => <svg data-testid="qr-code" />,
}));

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

import LinkWithDropdown from '../index';

const ADDRESS = 'klv1abc';

const renderLink = (entity?: 'account' | 'transaction' | 'block') => {
  const view = render(
    <ThemeProvider theme={theme}>
      <LinkWithDropdown
        link="/account/klv1abc"
        address={ADDRESS}
        entity={entity}
      >
        <span>the link</span>
      </LinkWithDropdown>
    </ThemeProvider>,
  );
  return {
    ...view,
    wrapper: screen.getByText('the link').parentElement
      ?.parentElement as HTMLElement,
  };
};

const open = (wrapper: HTMLElement) => fireEvent.mouseEnter(wrapper);

describe('LinkWithDropdown', () => {
  describe('the menu is built only while it is open', () => {
    it('renders none of it before the first hover', () => {
      renderLink();

      expect(screen.queryByText('Open in New Tab')).not.toBeInTheDocument();
      expect(screen.queryByTestId('qr-code')).not.toBeInTheDocument();
      expect(screen.getByText('the link')).toBeInTheDocument();
    });

    it('builds it on hover and tears it down again on leave', () => {
      const { wrapper } = renderLink();

      open(wrapper);
      expect(screen.getByText('Open in New Tab')).toBeInTheDocument();

      fireEvent.mouseLeave(wrapper);
      expect(screen.queryByText('Open in New Tab')).not.toBeInTheDocument();
    });
  });

  describe('what the menu offers depends on what the link points at', () => {
    it('offers the QR code and Transfer for a wallet address', () => {
      const { wrapper } = renderLink('account');

      open(wrapper);

      expect(screen.getByText('Copy Address')).toBeInTheDocument();
      expect(screen.getByText('QR Code')).toBeInTheDocument();
      expect(screen.getByText('Transfer')).toBeInTheDocument();
    });

    it.each([
      ['transaction' as const, 'Copy Transaction Hash'],
      ['block' as const, 'Copy Block Number'],
    ])(
      'offers neither for a %s, whose value is not an address',
      (entity, copyLabel) => {
        // A QR of a block number scans to nothing, and a Transfer prefilled
        // with a hash as its receiver cannot be submitted correctly. Both were
        // offered for every link before the entity split.
        const { wrapper } = renderLink(entity);

        open(wrapper);

        expect(screen.getByText(copyLabel)).toBeInTheDocument();
        expect(screen.queryByText('QR Code')).not.toBeInTheDocument();
        expect(screen.queryByText('Transfer')).not.toBeInTheDocument();
        expect(screen.queryByTestId('qr-code')).not.toBeInTheDocument();
      },
    );
  });
});
