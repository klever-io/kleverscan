import { act, render, screen } from '@testing-library/react';
import React, { useState } from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// Factory mock, never loading the real module: precisionFunctions reaches an
// ESM chain Jest cannot transform.
const mockGetPrecision = jest.fn();
jest.mock('@/utils/precisionFunctions', () => ({
  getPrecision: (...args: unknown[]) => mockGetPrecision(...args),
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

import type { IPackInfo } from '@/types/contracts';
import { usePackInfoPrecisions } from '../index';

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
};

const packsFor = (...keys: string[]): IPackInfo[] =>
  keys.map(key => ({ key, packs: [] }));

/** Mirrors the ITO detail components: the packInfo prop changes when the
 *  reader navigates from one transaction to another without a remount. */
const Harness: React.FC<{ initial: IPackInfo[] }> = ({ initial }) => {
  const [packInfo, setPackInfo] = useState(initial);
  const [precisions] = usePackInfoPrecisions(packInfo);

  return (
    <div>
      <button type="button" onClick={() => setPackInfo(packsFor('DVK-34ZH'))}>
        swap
      </button>
      <span data-testid="out">{JSON.stringify(precisions)}</span>
    </div>
  );
};

describe('usePackInfoPrecisions', () => {
  beforeEach(() => {
    mockGetPrecision.mockReset();
  });

  it('resolves the precisions for the mount-time packs', async () => {
    mockGetPrecision.mockResolvedValue({ KLV: 6 });

    render(<Harness initial={packsFor('KLV')} />);
    await flush();

    expect(mockGetPrecision).toHaveBeenCalledWith(['KLV']);
    expect(screen.getByTestId('out').textContent).toBe('{"KLV":6}');
  });

  // The defect being pinned: the ids were frozen inside the useState
  // initializer, so a later packInfo never reached the effect.
  it('re-resolves when the packs change', async () => {
    mockGetPrecision
      .mockResolvedValueOnce({ KLV: 6 })
      .mockResolvedValueOnce({ 'DVK-34ZH': 4 });

    render(<Harness initial={packsFor('KLV')} />);
    await flush();

    await act(async () => {
      screen.getByText('swap').click();
    });
    await flush();

    expect(mockGetPrecision).toHaveBeenCalledTimes(2);
    expect(mockGetPrecision).toHaveBeenLastCalledWith(['DVK-34ZH']);
    expect(screen.getByTestId('out').textContent).toBe('{"DVK-34ZH":4}');
  });

  it('asks nothing for an empty pack list', async () => {
    mockGetPrecision.mockResolvedValue({});

    render(<Harness initial={[]} />);
    await flush();

    expect(mockGetPrecision).toHaveBeenCalledWith([]);
  });

  // The reset guard: pending or failed, the old packs' precisions must not
  // sit under the new packs.
  it('clears the previous answer while a new lookup is unresolved', async () => {
    mockGetPrecision
      .mockResolvedValueOnce({ KLV: 6 })
      .mockImplementationOnce(() => new Promise(() => undefined));

    render(<Harness initial={packsFor('KLV')} />);
    await flush();
    expect(screen.getByTestId('out').textContent).toBe('{"KLV":6}');

    await act(async () => {
      screen.getByText('swap').click();
    });
    await flush();

    expect(screen.getByTestId('out').textContent).toBe('{"DVK-34ZH":0}');
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
      .mockResolvedValueOnce({ 'DVK-34ZH': 4 });

    render(<Harness initial={packsFor('KLV')} />);
    await flush();

    await act(async () => {
      screen.getByText('swap').click();
    });
    await flush();

    await act(async () => {
      resolveFirst({ KLV: 6 });
    });
    await flush();

    expect(screen.getByTestId('out').textContent).toBe('{"DVK-34ZH":4}');
  });
});
