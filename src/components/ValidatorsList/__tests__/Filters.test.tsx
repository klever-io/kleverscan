import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mockCaptured: Array<Record<string, unknown>> = [];
const mockSources = jest.fn();
const mockStats = jest.fn();
const mockRouter = {
  pathname: '/validators',
  query: {} as Record<string, unknown>,
};

// The generic Filter carries its own suite; here it only has to hand back the
// props this wrapper builds, which ARE the wrapper's whole behavior.
jest.mock('@/components/Filter', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    mockCaptured.push(props);
    return null;
  },
}));

jest.mock('../useValidatorSources', () => ({
  useValidatorSources: () => mockSources(),
}));

jest.mock('../useVersionStats', () => ({
  useVersionStats: () => mockStats(),
}));

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('@/utils', () => ({
  setQueryAndRouter: jest.fn(),
}));

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) =>
      options && typeof options.filter === 'string'
        ? `${key}|${options.filter}`
        : key,
  }),
}));

// The installed testing-library still calls the removed ReactDOM.render; every
// component suite in this repo carries the same createRoot shim.
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

import theme from '@/styles/theme';
import { setQueryAndRouter } from '@/utils';
import ValidatorsFilters from '../Filters';

const sources = ({
  isLoading = false,
  heartbeatAvailable = true,
  validatorsAvailable = true,
}: {
  isLoading?: boolean;
  heartbeatAvailable?: boolean;
  validatorsAvailable?: boolean;
} = {}) => {
  mockSources.mockReturnValue({
    data: {
      validators: [
        { name: 'Val One', blsPublicKey: 'a' },
        { blsPublicKey: 'b' },
      ],
      totalRecords: 2,
      versionMap: {},
      entries: [],
      heartbeatAvailable,
      validatorsAvailable,
    },
    isLoading,
    dataUpdatedAt: 0,
  });
};

const drawFilters = () =>
  render(
    <ThemeProvider theme={theme}>
      <ValidatorsFilters />
    </ThemeProvider>,
  );

const lastFilter = (testId: string): Record<string, unknown> => {
  const found = [...mockCaptured]
    .reverse()
    .find(props => props.testId === testId);
  if (!found) throw new Error(`no ${testId} filter rendered`);
  return found;
};

beforeEach(() => {
  mockCaptured.length = 0;
  Object.keys(mockRouter.query).forEach(key => delete mockRouter.query[key]);
  (setQueryAndRouter as jest.Mock).mockClear();
  sources();
  mockStats.mockReturnValue({
    latestVersion: 'v1.7.21',
    stats: [{ version: 'v1.7.21' }, { version: 'Unknown' }],
  });
});

describe('ValidatorsFilters', () => {
  // Gating on resolvability alone had the box announce an outage on every
  // ordinary page load, while the query was merely still in flight.
  it('keeps the version filter open while the sources are loading', () => {
    sources({ isLoading: true, heartbeatAvailable: false });
    drawFilters();

    const version = lastFilter('validator-version');
    expect(version.disabledInput).toBe(false);
    expect(version.loading).toBe(true);
    expect(version.data).toEqual([]);
  });

  it('locks the version filter once the join settled without its version half', () => {
    sources({ heartbeatAvailable: false });
    drawFilters();

    const version = lastFilter('validator-version');
    expect(version.disabledInput).toBe(true);
    expect(version.data).toEqual([]);
    // Names come from the list half alone, so that filter stays usable.
    const name = lastFilter('validator-name');
    expect(name.disabledInput).toBeUndefined();
    expect(name.data).toEqual(['Val One']);
  });

  it('offers the version buckets and the clear label once resolvable', () => {
    drawFilters();

    const version = lastFilter('validator-version');
    expect(version.disabledInput).toBe(false);
    expect(version.data).toEqual(['v1.7.21', 'Unknown']);
    expect(version.clearLabel).toBe(
      'validators:Filters.Clear|validators:Filters.Version',
    );
  });

  it('reads the current selection from the URL only when it is a string', () => {
    mockRouter.query.name = 'Val One';
    mockRouter.query.version = ['v1', 'v2'];
    drawFilters();

    expect(lastFilter('validator-name').current).toBe('Val One');
    expect(lastFilter('validator-version').current).toBeUndefined();
  });

  it('writes a selection into the URL and resets the page', () => {
    mockRouter.query.page = '3';
    mockRouter.query.version = 'v1.7.21';
    drawFilters();

    (lastFilter('validator-name').onClick as (value: string) => void)(
      'Val One',
    );

    expect(setQueryAndRouter).toHaveBeenCalledWith(
      { version: 'v1.7.21', name: 'Val One' },
      mockRouter,
    );
  });

  // Through the version filter, so both onClick arrows get exercised.
  it('drops the key and the page when a filter clears to All', () => {
    mockRouter.query.page = '3';
    mockRouter.query.version = 'v1.7.21';
    drawFilters();

    (lastFilter('validator-version').onClick as (value: string) => void)('All');

    expect(setQueryAndRouter).toHaveBeenCalledWith({}, mockRouter);
  });
});
