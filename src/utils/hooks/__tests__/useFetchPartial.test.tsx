import { act, render, screen } from '@testing-library/react';
import React, { useState } from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// Factory mock, never loading the real module: precisionFunctions reaches
// @/pages/transactions and from there an ESM chain Jest cannot transform.
jest.mock('@/utils/precisionFunctions', () => ({
  getPrecision: jest.fn(),
}));

jest.mock('@/components/Skeleton', () => ({
  __esModule: true,
  default: () => null,
}));

// Same shim every component suite in this repo carries: this
// testing-library version drives the removed ReactDOM.render API.
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

const mockGet = jest.fn();
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: (...args: unknown[]) => mockGet(...args) },
}));

import { useFetchPartial } from '../index';

interface IRow {
  assetId?: string;
}

/**
 * Drives the hook the way TransactionsFilters does: awaits the search and
 * only then clears its own loading flag. That mirror matters, because the
 * defect being pinned was a promise that never settled, which no assertion
 * on the hook's return value alone would catch.
 */
const Harness: React.FC = () => {
  const [, fetchPartial, loading] = useFetchPartial<IRow>(
    'assets',
    'assets/list',
    'assetId',
  );
  const [settled, setSettled] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          await fetchPartial('KLV');
          setSettled(true);
        }}
      >
        search
      </button>
      <span data-testid="state">
        {settled ? 'settled' : loading ? 'loading' : 'idle'}
      </span>
    </div>
  );
};

describe('useFetchPartial', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGet.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const search = async () => {
    await act(async () => {
      screen.getByText('search').click();
    });
    await act(async () => {
      jest.advanceTimersByTime(600);
    });
    // let the awaited promise chain flush
    await act(async () => Promise.resolve());
  };

  it('settles even when a loaded row is missing the search field', async () => {
    // The initial load returns a row without assetId, the shape the optional
    // chain at the call sites says to expect. Matching used to call
    // toUpperCase on it inside the timer, where nothing rejects, so the
    // caller's await hung and its spinner stayed on forever.
    mockGet.mockResolvedValueOnce({
      data: { assets: [{}, { assetId: 'KFI' }] },
    });
    mockGet.mockResolvedValueOnce({
      data: { assets: [{ assetId: 'KLV' }] },
    });
    render(<Harness />);
    await act(async () => Promise.resolve());

    await search();

    expect(screen.getByTestId('state')).toHaveTextContent('settled');
  });

  it('settles when the request itself rejects', async () => {
    mockGet.mockResolvedValueOnce({ data: { assets: [] } });
    mockGet.mockRejectedValueOnce(new Error('network down'));
    render(<Harness />);
    await act(async () => Promise.resolve());

    await search();

    expect(screen.getByTestId('state')).toHaveTextContent('settled');
  });

  it('settles on the silent failure shape, HTTP 200 with data null', async () => {
    mockGet.mockResolvedValueOnce({ data: { assets: [] } });
    mockGet.mockResolvedValueOnce({ data: null, error: '' });
    render(<Harness />);
    await act(async () => Promise.resolve());

    await search();

    expect(screen.getByTestId('state')).toHaveTextContent('settled');
  });
});
