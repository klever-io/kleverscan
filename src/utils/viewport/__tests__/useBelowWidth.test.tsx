import { render, screen } from '@testing-library/react';
import React from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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

import { act } from 'react-dom/test-utils';
import { useBelowWidth } from '../index';

interface IFakeQuery {
  media: string;
  matches: boolean;
  listeners: Set<() => void>;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

/* Keyed by media string and reused, the way the browser behaves: the hook
   reads the query during render as well as subscribing to it, so a fake that
   minted a fresh object per call would answer from one instance and be flipped
   on another. */
const queries = new Map<string, IFakeQuery>();
const matchMedia = jest.fn((media: string) => {
  const existing = queries.get(media);
  if (existing) return existing as unknown as MediaQueryList;

  const query: IFakeQuery = {
    media,
    matches: false,
    listeners: new Set(),
    addEventListener: (_type, listener) => query.listeners.add(listener),
    removeEventListener: (_type, listener) => query.listeners.delete(listener),
  };
  queries.set(media, query);
  return query as unknown as MediaQueryList;
});

const queryFor = (breakpoint: number): IFakeQuery => {
  const media = `(max-width: ${breakpoint - 0.02}px)`;
  const existing = queries.get(media);
  if (existing) return existing;
  matchMedia(media);
  return queries.get(media) as IFakeQuery;
};

/** Moves the viewport across the threshold the way the browser does: flip the
 *  stored answer, then fire the change the hook subscribed to. */
const crossThreshold = (breakpoint: number, matches: boolean): void => {
  const query = queryFor(breakpoint);
  query.matches = matches;
  act(() => {
    query.listeners.forEach(listener => listener());
  });
};

const Probe: React.FC<{ breakpoint?: number }> = ({ breakpoint }) => (
  <span data-testid="answer">{String(useBelowWidth(breakpoint))}</span>
);

const answer = (): string => screen.getByTestId('answer').textContent ?? '';

describe('useBelowWidth', () => {
  beforeEach(() => {
    queries.clear();
    matchMedia.mockClear();
    window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
  });

  it('answers false and subscribes to nothing without a breakpoint', () => {
    render(<Probe />);

    expect(answer()).toBe('false');
    expect(matchMedia).not.toHaveBeenCalled();
  });

  it('asks for the width just under the breakpoint, not the breakpoint', () => {
    render(<Probe breakpoint={1240} />);

    // `max-width: 1240px` and `min-width: 1240px` both match at exactly 1240,
    // and the row layout owns that width.
    expect(matchMedia).toHaveBeenCalledWith('(max-width: 1239.98px)');
  });

  it('answers true once the viewport is under the breakpoint', () => {
    render(<Probe breakpoint={1240} />);
    crossThreshold(1240, true);

    expect(answer()).toBe('true');
  });

  /* The common path, and the one nothing covered: a visitor who loads the page
     at 1100px never crosses a threshold, so the answer comes entirely from the
     read at mount. While that read lived in an effect, deleting it left every
     test here green. */
  it('answers true when the viewport is already under it at mount', () => {
    queryFor(1240).matches = true;

    render(<Probe breakpoint={1240} />);

    expect(answer()).toBe('true');
  });

  /* The inverse of the test above, and the one that matters: a hook that
     latched on the first narrow moment would leave the table as cards for the
     rest of the session, with no way back short of a reload. */
  it('answers false again once the viewport grows back over it', () => {
    render(<Probe breakpoint={1240} />);
    crossThreshold(1240, true);
    crossThreshold(1240, false);

    expect(answer()).toBe('false');
  });

  it('drops its listener when the component goes away', () => {
    const { unmount } = render(<Probe breakpoint={1240} />);
    const query = queryFor(1240);
    expect(query.listeners.size).toBe(1);

    unmount();

    expect(query.listeners.size).toBe(0);
  });

  it('drops the old listener when the breakpoint changes', () => {
    const { rerender } = render(<Probe breakpoint={1240} />);
    const first = queryFor(1240);

    rerender(<Probe breakpoint={1310} />);

    expect(first.listeners.size).toBe(0);
    expect(queryFor(1310).listeners.size).toBe(1);
  });
});
