import { act, render, screen } from '@testing-library/react';
import React, { useState } from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// Factory mock, never loading the real module: precisionFunctions reaches
// @/pages/transactions and from there an ESM chain Jest cannot transform.
const mockGetPrecision = jest.fn();
jest.mock('@/utils/precisionFunctions', () => ({
  getPrecision: (...args: unknown[]) => mockGetPrecision(...args),
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

import { usePrecision } from '../index';

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
};

/** Renders one asset list and can swap it, the way a detail page does when the
 *  reader navigates from one record to another without the page remounting. */
const Harness: React.FC<{ initial: string[] }> = ({ initial }) => {
  const [ids, setIds] = useState(initial);
  const precisions = usePrecision(ids);

  return (
    <div>
      <button type="button" onClick={() => setIds(['KFI'])}>
        swap
      </button>
      <button type="button" onClick={() => setIds([...ids])}>
        rebuild
      </button>
      <span data-testid="out">{JSON.stringify(precisions)}</span>
    </div>
  );
};

const SingleHarness: React.FC = () => {
  const precision = usePrecision('KLV');
  return <span data-testid="single">{String(precision)}</span>;
};

describe('usePrecision', () => {
  beforeEach(() => {
    mockGetPrecision.mockReset();
  });

  // The other arm of the input type: a single id resolves to a number.
  it('resolves a single string id to a number', async () => {
    mockGetPrecision.mockResolvedValue(6);

    render(<SingleHarness />);
    await flush();

    expect(mockGetPrecision).toHaveBeenCalledWith('KLV');
    expect(screen.getByTestId('single').textContent).toBe('6');
  });

  it('resolves the precisions for the ids it was given', async () => {
    mockGetPrecision.mockResolvedValue({ KLV: 6 });

    render(<Harness initial={['KLV']} />);
    await flush();

    expect(screen.getByTestId('out').textContent).toBe('{"KLV":6}');
  });

  it('re-resolves when the asset ids change', async () => {
    mockGetPrecision
      .mockResolvedValueOnce({ KLV: 6 })
      .mockResolvedValueOnce({ KFI: 8 });

    render(<Harness initial={['KLV']} />);
    await flush();

    await act(async () => {
      screen.getByText('swap').click();
    });
    await flush();

    expect(mockGetPrecision).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('out').textContent).toBe('{"KFI":8}');
  });

  // The opposite of the test above: the fix keys on the ids, not on the array
  // identity, so a caller rebuilding its list inline must not refetch forever.
  it('does not re-resolve when the same ids arrive in a new array', async () => {
    mockGetPrecision.mockResolvedValue({ KLV: 6 });

    render(<Harness initial={['KLV']} />);
    await flush();

    await act(async () => {
      screen.getByText('rebuild').click();
    });
    await flush();

    expect(mockGetPrecision).toHaveBeenCalledTimes(1);
  });

  it('lets a newer answer stand when an older one resolves late', async () => {
    let resolveFirst: (v: unknown) => void = () => undefined;
    mockGetPrecision
      .mockImplementationOnce(
        () =>
          new Promise(resolve => {
            resolveFirst = resolve;
          }),
      )
      .mockResolvedValueOnce({ KFI: 8 });

    render(<Harness initial={['KLV']} />);
    await flush();

    await act(async () => {
      screen.getByText('swap').click();
    });
    await flush();

    // The first request only now comes back, with the superseded asset.
    await act(async () => {
      resolveFirst({ KLV: 6 });
    });
    await flush();

    expect(screen.getByTestId('out').textContent).toBe('{"KFI":8}');
  });
});
