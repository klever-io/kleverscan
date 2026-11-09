import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
import type { IMultisignData } from '../..';
import { ButtonsComponent } from '..';

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

// The shared multisign styles import InputGlobal, whose dependency chain
// reaches an ESM-only package Jest does not transform. ButtonsComponent only
// uses its styled wrappers, so a plain element stands in.
jest.mock('@/components/InputGlobal', () => 'input');

jest.mock('@klever/connect', () => ({
  Transaction: { fromTransaction: jest.fn() },
}));

jest.mock('@/contexts/extension', () => ({
  useExtension: () => ({ wallet: null, walletAddress: 'klv1owner' }),
}));

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn(), warning: jest.fn() },
}));

const tx = (hash: string, fromJSON?: boolean): IMultisignData =>
  ({
    hash,
    address: 'klv1owner',
    signers: [],
    Threshold: 1,
    raw: { hash, RawData: {} },
    decodedTx: {},
    ...(fromJSON ? { fromJSON: true } : {}),
  }) as unknown as IMultisignData;

const renderButtons = (
  multiSignData: IMultisignData,
  multiSignDataRef: IMultisignData[],
) => {
  const setSelectedHash = jest.fn();
  render(
    <ThemeProvider theme={theme}>
      <ButtonsComponent
        setSignBcastTransaction={jest.fn()}
        multiSignData={multiSignData}
        multiSignDataRef={multiSignDataRef}
        setTxHash={jest.fn()}
        draggingOverlayCount={0}
        setDragginOverlayCount={jest.fn()}
        setSelectedHash={setSelectedHash}
        refetchMultisignData={jest.fn()}
      />
    </ThemeProvider>,
  );
  return { setSelectedHash };
};

describe('ButtonsComponent "Remove JSON file"', () => {
  it('removes the selected imported transaction, not the last entry', () => {
    const imported = tx('json-1', true);
    const list = [tx('api-1'), imported, tx('api-2')];
    const { setSelectedHash } = renderButtons(imported, list);

    fireEvent.click(screen.getByText('Remove JSON file'));

    expect(list.map(e => e.hash)).toEqual(['api-1', 'api-2']);
    expect(setSelectedHash).toHaveBeenCalledWith('');
  });

  it('is not offered for a transaction that came from the API', () => {
    const list = [tx('api-1'), tx('json-1', true)];
    renderButtons(list[0], list);

    expect(screen.queryByText('Remove JSON file')).not.toBeInTheDocument();
    expect(screen.getByText('Download JSON file')).toBeInTheDocument();
  });
});
