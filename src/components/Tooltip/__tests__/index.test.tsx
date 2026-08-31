import theme from '@/styles/theme';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// The bare `<Tooltip msg=... />` path renders this SVG import, which Jest
// resolves to an object rather than a component.
jest.mock('@/assets/help', () => ({
  IconHelp: () => null,
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

import Tooltip from '../index';

/**
 * Pins the document-level Escape dismissal for hover-only tooltips (WCAG
 * 1.4.13): keyboard events go to the focused element, and a hover trigger
 * holds no focus, so the dismissal must live on the document while a tip is
 * showing. The visual half (react-tooltip actually hiding) is library
 * behavior, verified in a real browser; what this suite owns is that the
 * listener exists exactly while a tip shows, and that Escape ends it.
 */
describe('Tooltip hover dismissal', () => {
  it('arms a document Escape listener only while showing, and Escape disarms it', () => {
    const addSpy = jest.spyOn(document, 'addEventListener');
    const removeSpy = jest.spyOn(document, 'removeEventListener');

    const { container } = render(
      <ThemeProvider theme={theme}>
        <Tooltip msg="hover hint" Component={() => <span>pill</span>} />
      </ThemeProvider>,
    );

    const keydownAdds = () =>
      addSpy.mock.calls.filter(([type]) => type === 'keydown').length;
    const keydownRemoves = () =>
      removeSpy.mock.calls.filter(([type]) => type === 'keydown').length;

    const before = keydownAdds();
    const trigger = container.querySelector('.button-tooltip') as Element;
    fireEvent.mouseOver(trigger);
    expect(keydownAdds()).toBe(before + 1);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(keydownRemoves()).toBeGreaterThanOrEqual(1);

    // Disarmed: a second Escape adds nothing and removes nothing further.
    const removesAfterDismiss = keydownRemoves();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(keydownRemoves()).toBe(removesAfterDismiss);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('ignores other keys while showing', () => {
    const removeSpy = jest.spyOn(document, 'removeEventListener');
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Tooltip msg="hover hint" Component={() => <span>pill</span>} />
      </ThemeProvider>,
    );

    fireEvent.mouseOver(container.querySelector('.button-tooltip') as Element);
    const removesBefore = removeSpy.mock.calls.filter(
      ([type]) => type === 'keydown',
    ).length;
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(
      removeSpy.mock.calls.filter(([type]) => type === 'keydown').length,
    ).toBe(removesBefore);

    removeSpy.mockRestore();
  });
});

describe('Tooltip trigger and anchor', () => {
  const wrap = (ui: React.ReactNode) => (
    <ThemeProvider theme={theme}>{ui}</ThemeProvider>
  );

  it('renders children as the trigger', () => {
    const { container } = render(
      wrap(
        <Tooltip msg="explanation">
          <span data-testid="own-trigger">icon</span>
        </Tooltip>,
      ),
    );

    expect(container.querySelector('[data-testid="own-trigger"]')).not.toBeNull();
  });

  // The opposite of the test above: without a trigger the built-in help icon
  // still stands in, which is what every bare `<Tooltip msg=... />` relies on.
  it('falls back to the built-in icon when given neither children nor Component', () => {
    const { container } = render(wrap(<Tooltip msg="explanation" />));

    expect(container.querySelector('[data-testid="own-trigger"]')).toBeNull();
    expect(container.querySelector('.button-tooltip')).not.toBeNull();
  });

  it('gives each instance its own anchor, so one does not bind the others', () => {
    const { container } = render(
      wrap(
        <>
          <Tooltip msg="first" />
          <Tooltip msg="second" />
        </>,
      ),
    );

    const anchors = [...container.querySelectorAll('[data-tooltip-anchor]')].map(
      node => node.getAttribute('data-tooltip-anchor'),
    );

    expect(anchors).toHaveLength(2);
    expect(new Set(anchors).size).toBe(2);
  });
});
