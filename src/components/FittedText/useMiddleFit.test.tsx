jest.mock('@/components/Tabs/Validators/fitKey', () => ({
  middleFit: (
    value: string,
    maxWidth: number,
    measure: (text: string) => number,
  ) => {
    if (maxWidth <= 0 || measure(value) <= maxWidth) return value;
    return `w${Math.round(maxWidth)}`;
  },
}));

import { render, screen } from '@testing-library/react';
import React, { act } from 'react';
import { useMiddleFit } from './useMiddleFit';

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

const value = 'klv1exampleaddressvalue000000000000000000000000000000';

const readBox = (el: HTMLElement): number => {
  const raw = el.getAttribute('data-cw');
  return raw ? Number(raw) : 0;
};

/**
 * Same shape as a detail row: a label, then a wrapper that shrinks to the
 * text, then the link and its two icons. data-cw is the used width.
 */
const FitRow = ({
  stacked = false,
}: {
  stacked?: boolean;
}) => {
  const { ref, shown } = useMiddleFit<HTMLElement>(value, true);
  return (
    <div
      data-row
      data-cw="400"
      style={{
        display: 'flex',
        flexDirection: stacked ? 'column' : 'row',
      }}
    >
      <span data-label data-cw="80">
        Owner
      </span>
      <span data-wrap data-cw={stacked ? '104' : '320'}>
        <div data-linkrow data-cw={stacked ? '104' : '320'}>
          <span
            data-text
            ref={node => {
              ref.current = node;
            }}
            title={value}
          >
            {shown}
          </span>
          <i data-icon data-cw="20" />
          <i data-icon data-cw="20" />
        </div>
      </span>
    </div>
  );
};

describe('useMiddleFit reserveSiblings', () => {
  const originals = {
    clientWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'clientWidth',
    ),
    offsetWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'offsetWidth',
    ),
    scrollWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'scrollWidth',
    ),
  };
  let notify: () => void = () => undefined;
  const observed: Element[] = [];

  beforeEach(() => {
    observed.length = 0;
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        return readBox(this as HTMLElement);
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return readBox(this as HTMLElement);
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 1000,
    });
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      get: () => undefined,
    });
    class Observer {
      constructor(callback: ResizeObserverCallback) {
        notify = () => {
          act(() => {
            callback([], this as unknown as ResizeObserver);
          });
        };
      }
      observe = (el: Element) => {
        observed.push(el);
      };
      unobserve = () => undefined;
      disconnect = () => undefined;
    }
    globalThis.ResizeObserver = Observer as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    (
      ['clientWidth', 'offsetWidth', 'scrollWidth'] as const
    ).forEach(key => {
      const original = originals[key];
      if (original) {
        Object.defineProperty(HTMLElement.prototype, key, original);
      }
    });
    delete (document as { fonts?: unknown }).fonts;
  });

  it('shortens to the free space beside the icons', () => {
    render(<FitRow />);
    // 320 link row, minus two 20px icons.
    expect(screen.getByTitle(value)).toHaveTextContent('w280');
  });

  it('keeps the row width after the wrapper shrinks, then grows with the row', () => {
    render(<FitRow />);
    const wrap = document.querySelector('[data-wrap]') as HTMLElement;
    const linkRow = document.querySelector('[data-linkrow]') as HTMLElement;
    const row = document.querySelector('[data-row]') as HTMLElement;

    // The row is watched from the first pass. A wrapper that still fills
    // its slot must not be the box, or a later wider viewport never fires.
    expect(observed.at(-1)).toBe(row);

    wrap.setAttribute('data-cw', '104');
    linkRow.setAttribute('data-cw', '104');
    notify();

    // The wrapper now hugs the short text. The row is still 400.
    // 400 - 80 label - 40 icons = 280, not 104 - 40.
    expect(screen.getByTitle(value)).toHaveTextContent('w280');
    expect(observed.at(-1)).toBe(row);

    row.setAttribute('data-cw', '700');
    notify();
    // 700 - 80 - 40 = 580.
    expect(screen.getByTitle(value)).toHaveTextContent('w580');
  });

  it('does not subtract a label that is stacked above the value', () => {
    render(<FitRow stacked />);
    // 400 column, minus the icons only. The label is on its own line.
    expect(screen.getByTitle(value)).toHaveTextContent('w360');
  });

  it('does not subtract a label that sits in a one-column grid', () => {
    const OneColumn = () => {
      const { ref, shown } = useMiddleFit<HTMLElement>(value, true);
      return (
        <div
          data-row
          data-cw="400"
          style={{ display: 'grid', gridTemplateColumns: '1fr' }}
        >
          <span data-label data-cw="400">
            Owner
          </span>
          <div data-linkrow data-cw="120">
            <span
              data-text
              ref={node => {
                ref.current = node;
              }}
              title={value}
            >
              {shown}
            </span>
            <i data-icon data-cw="20" />
            <i data-icon data-cw="20" />
          </div>
        </div>
      );
    };

    render(<OneColumn />);
    // 400 grid, minus the icons only. The label is the only column.
    expect(screen.getByTitle(value)).toHaveTextContent('w360');
  });

  it('still subtracts a label that sits beside the value in a two-column grid', () => {
    const TwoColumn = () => {
      const { ref, shown } = useMiddleFit<HTMLElement>(value, true);
      return (
        <div
          data-row
          data-cw="400"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
        >
          <span data-label data-cw="80">
            Owner
          </span>
          <div data-linkrow data-cw="120">
            <span
              data-text
              ref={node => {
                ref.current = node;
              }}
              title={value}
            >
              {shown}
            </span>
            <i data-icon data-cw="20" />
            <i data-icon data-cw="20" />
          </div>
        </div>
      );
    };

    render(<TwoColumn />);
    // 400 grid, minus the 80 label and two 20px icons.
    expect(screen.getByTitle(value)).toHaveTextContent('w280');
  });

  it('still subtracts a label when the grid columns are a subgrid', () => {
    const Subgrid = () => {
      const { ref, shown } = useMiddleFit<HTMLElement>(value, true);
      return (
        <div
          data-row
          data-cw="400"
          style={{ display: 'grid', gridTemplateColumns: 'subgrid' }}
        >
          <span data-label data-cw="400">
            Owner
          </span>
          <div data-linkrow data-cw="120">
            <span
              data-text
              ref={node => {
                ref.current = node;
              }}
              title={value}
            >
              {shown}
            </span>
            <i data-icon data-cw="20" />
            <i data-icon data-cw="20" />
          </div>
        </div>
      );
    };

    render(<Subgrid />);
    // subgrid is not one track. The 400px label eats the free width.
    expect(screen.getByTitle(value)).toHaveTextContent(value);
  });

  it('still subtracts a label when the grid columns are none', () => {
    const None = () => {
      const { ref, shown } = useMiddleFit<HTMLElement>(value, true);
      return (
        <div
          data-row
          data-cw="400"
          style={{ display: 'grid', gridTemplateColumns: 'none' }}
        >
          <span data-label data-cw="400">
            Owner
          </span>
          <div data-linkrow data-cw="120">
            <span
              data-text
              ref={node => {
                ref.current = node;
              }}
              title={value}
            >
              {shown}
            </span>
            <i data-icon data-cw="20" />
            <i data-icon data-cw="20" />
          </div>
        </div>
      );
    };

    render(<None />);
    expect(screen.getByTitle(value)).toHaveTextContent(value);
  });

  it('does not subtract a label that sits in a one-column inline grid', () => {
    const Inline = () => {
      const { ref, shown } = useMiddleFit<HTMLElement>(value, true);
      return (
        <div
          data-row
          data-cw="400"
          style={{ display: 'inline-grid', gridTemplateColumns: '1fr' }}
        >
          <span data-label data-cw="400">
            Owner
          </span>
          <div data-linkrow data-cw="120">
            <span
              data-text
              ref={node => {
                ref.current = node;
              }}
              title={value}
            >
              {shown}
            </span>
            <i data-icon data-cw="20" />
            <i data-icon data-cw="20" />
          </div>
        </div>
      );
    };

    render(<Inline />);
    expect(screen.getByTitle(value)).toHaveTextContent('w360');
  });

  it('does not subtract a label when one track has line names', () => {
    const Named = () => {
      const { ref, shown } = useMiddleFit<HTMLElement>(value, true);
      return (
        <div
          data-row
          data-cw="400"
          style={{ display: 'grid', gridTemplateColumns: '[a] 251px [b]' }}
        >
          <span data-label data-cw="400">
            Owner
          </span>
          <div data-linkrow data-cw="120">
            <span
              data-text
              ref={node => {
                ref.current = node;
              }}
              title={value}
            >
              {shown}
            </span>
            <i data-icon data-cw="20" />
            <i data-icon data-cw="20" />
          </div>
        </div>
      );
    };

    render(<Named />);
    // [a] and [b] are line names, not columns. 400 minus the icons.
    expect(screen.getByTitle(value)).toHaveTextContent('w360');
  });

  it('still subtracts a label when Chrome reports a subgrid with empty line names', () => {
    const Reported = () => {
      const { ref, shown } = useMiddleFit<HTMLElement>(value, true);
      return (
        <div
          data-row
          data-cw="400"
          style={{ display: 'grid', gridTemplateColumns: 'subgrid [] [] []' }}
        >
          <span data-label data-cw="400">
            Owner
          </span>
          <div data-linkrow data-cw="120">
            <span
              data-text
              ref={node => {
                ref.current = node;
              }}
              title={value}
            >
              {shown}
            </span>
            <i data-icon data-cw="20" />
            <i data-icon data-cw="20" />
          </div>
        </div>
      );
    };

    render(<Reported />);
    expect(screen.getByTitle(value)).toHaveTextContent(value);
  });

  it('still subtracts a label when two tracks both have line names', () => {
    const TwoNamed = () => {
      const { ref, shown } = useMiddleFit<HTMLElement>(value, true);
      return (
        <div
          data-row
          data-cw="400"
          style={{
            display: 'grid',
            gridTemplateColumns: '[a] 100px [b] 200px [c]',
          }}
        >
          <span data-label data-cw="80">
            Owner
          </span>
          <div data-linkrow data-cw="120">
            <span
              data-text
              ref={node => {
                ref.current = node;
              }}
              title={value}
            >
              {shown}
            </span>
            <i data-icon data-cw="20" />
            <i data-icon data-cw="20" />
          </div>
        </div>
      );
    };

    render(<TwoNamed />);
    // Two lengths remain after the line names. 400 - 80 - 40.
    expect(screen.getByTitle(value)).toHaveTextContent('w280');
  });

  it('stops on the detail row when the page container is a few pixels wider', () => {
    const PageAroundCard = () => {
      const { ref, shown } = useMiddleFit<HTMLElement>(value, true);
      return (
        <div data-main data-cw="800">
          <div data-container data-cw="768">
            <section data-card data-cw="766">
              <div data-row data-cw="766" style={{ display: 'flex' }}>
                <span data-label data-cw="80">
                  From
                </span>
                <div data-value data-cw="518">
                  <div data-linkrow data-cw="518">
                    <span
                      data-text
                      ref={node => {
                        ref.current = node;
                      }}
                      title={value}
                    >
                      {shown}
                    </span>
                    <i data-icon data-cw="20" />
                    <i data-icon data-cw="20" />
                  </div>
                </div>
              </div>
              <div data-other data-cw="766" />
            </section>
          </div>
        </div>
      );
    };

    render(<PageAroundCard />);
    const row = document.querySelector('[data-row]') as HTMLElement;

    // 766 row, minus the 80 label and two 20px icons. The other fact row
    // and the page must not be part of the measure.
    expect(screen.getByTitle(value)).toHaveTextContent('w646');
    expect(observed.at(-1)).toBe(row);
  });
});
