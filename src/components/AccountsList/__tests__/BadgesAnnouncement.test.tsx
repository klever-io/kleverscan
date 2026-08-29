import theme from '@/styles/theme';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

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

import { BadgesAnnouncement } from '../BadgesAnnouncement';

const MESSAGE = 'Validator badges loaded';

const renderAnnouncement = (
  owners: Record<string, { isGenesis: boolean; list: string }> | null | undefined,
) =>
  render(
    <ThemeProvider theme={theme}>
      <BadgesAnnouncement owners={owners} message={MESSAGE} />
    </ThemeProvider>,
  );

describe('BadgesAnnouncement', () => {
  it('exists as an empty live region while the validator set is still loading', () => {
    renderAnnouncement(undefined);

    // The region must be in the DOM before its content changes, or readers
    // never treat the later fill as an update worth announcing.
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region.textContent).toBe('');
  });

  it('announces once the validator set has landed', () => {
    const view = renderAnnouncement(undefined);

    view.rerender(
      <ThemeProvider theme={theme}>
        <BadgesAnnouncement
          owners={{ klv1abc: { isGenesis: false, list: 'elected' } }}
          message={MESSAGE}
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole('status').textContent).toBe(MESSAGE);
  });

  it('stays silent when the fetch failed, matching the absent badges', () => {
    const view = renderAnnouncement(undefined);

    view.rerender(
      <ThemeProvider theme={theme}>
        <BadgesAnnouncement owners={null} message={MESSAGE} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('status').textContent).toBe('');
  });
});
