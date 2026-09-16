import theme from '@/styles/theme';
import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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

import ExplainedBadge from '../ExplainedBadge';

const MSG = 'This asset has a KDA fee pool.';

const renderBadge = () =>
  render(
    <ThemeProvider theme={theme}>
      <ExplainedBadge variant="accent" msg={MSG}>
        Fee Pool
      </ExplainedBadge>
    </ThemeProvider>,
  );

describe('ExplainedBadge', () => {
  it('shows the label', () => {
    const { container } = renderBadge();
    expect(container.textContent).toContain('Fee Pool');
  });

  it('reaches the keyboard, where a title attribute never did', () => {
    const { container } = renderBadge();
    const trigger = container.querySelector(
      '[data-tooltip-anchor]',
    ) as HTMLElement;

    expect(trigger).not.toBeNull();
    expect(trigger.tabIndex).toBe(0);
  });

  it('carries the whole explanation as text, not only in a tooltip', () => {
    const { container } = renderBadge();
    // The tooltip mounts only while hovered or focused, so a reader in browse
    // mode meets the message only through this copy.
    expect(container.textContent).toContain(MSG);
  });

  // The opposite of the two above: the explanation must not be painted next to
  // the label, which is what makes it safe to carry inline.
  it('does not show the explanation visually', () => {
    const { container } = renderBadge();
    const hidden = container.querySelector('[class*="VisuallyHidden"]');

    expect(hidden).not.toBeNull();
    expect(hidden?.textContent).toContain(MSG);
    // The visible label must not have absorbed it.
    const label = container.querySelector('[class*="BadgePill"]');
    expect(label?.firstChild?.textContent).toBe('Fee Pool');
  });

  it('does not leave the explanation in a title attribute', () => {
    const { container } = renderBadge();
    expect(container.querySelector('[title]')).toBeNull();
  });
});
