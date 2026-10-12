import { fireEvent, render, screen } from '@testing-library/react';
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

jest.mock('@/assets/icons', () => ({
  TickSquare: () => {
    const ReactLib = require('react');
    return ReactLib.createElement('svg', { 'data-testid': 'allowed' });
  },
}));

jest.mock('@/utils/contracts', () => ({
  contractsList: [
    'Transfer',
    'Create Asset',
    'Create Validator',
    'Config Validator',
    'Freeze',
    'Unfreeze',
    'Delegate',
  ],
}));

jest.mock('@/utils/permissions', () => ({
  getContractStates: () => [],
}));

import { ThemeProvider } from 'styled-components';
import { PermissionOperations } from '@/components/AccountPermission';
import theme from '@/styles/theme';

describe('PermissionOperations for an owner with an empty list', () => {
  it('shows the first contracts as allowed, and the rest after Expand', () => {
    render(
      <ThemeProvider theme={theme}>
        <PermissionOperations id={0} operations="" type={0} />
      </ThemeProvider>,
    );

    expect(screen.getByText('Transfer')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.queryByText('Delegate')).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'common:Buttons.Expand' }),
    );

    expect(screen.getByText('Delegate')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
