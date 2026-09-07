import { render } from '@testing-library/react';
import React from 'react';

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

const sources = {
  data: {
    validators: [
      { blsPublicKey: 'BLS1', staked: 10 },
      { blsPublicKey: 'BLS2', staked: 20 },
    ],
    versionMap: { bls1: 'v1.7.21', bls2: 'v1.7.16' },
    entries: [],
    totalRecords: 2,
    heartbeatAvailable: true,
    validatorsAvailable: true,
  },
  isLoading: false,
  dataUpdatedAt: 1,
};

jest.mock('../useValidatorSources', () => ({
  useValidatorSources: () => sources,
}));

import { useVersionStats } from '../useVersionStats';

/** RTL 12 has no renderHook, so the hook is read through a probe, the same
 *  pattern useValidatorSources.test uses. */
let latest: ReturnType<typeof useVersionStats>;
const Probe: React.FC = () => {
  latest = useVersionStats();
  return null;
};

describe('useVersionStats', () => {
  it('buckets against the newest version among the validators', () => {
    render(<Probe />);

    expect(latest.latestVersion).toBe('v1.7.21');
    expect(latest.stats.map(s => [s.version, s.isLatest])).toEqual([
      ['v1.7.21', true],
      ['v1.7.16', false],
    ]);
  });

  /* The reason this hook exists: the page and the filter bar both rebuilt the
     buckets per render, and the fresh array identity disabled the memos
     downstream. */
  it('hands back the same array identity across re-renders', () => {
    const view = render(<Probe />);
    const first = latest.stats;
    view.rerender(<Probe />);

    expect(latest.stats).toBe(first);
  });

  it('answers empty stats while the validator half is missing', () => {
    sources.data.validatorsAvailable = false;
    render(<Probe />);
    sources.data.validatorsAvailable = true;

    expect(latest.stats).toEqual([]);
  });
});
