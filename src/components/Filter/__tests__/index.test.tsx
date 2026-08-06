import theme from '@/styles/theme';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@/assets/icons', () => ({
  FilterArrowDown: () => <svg data-testid="arrow" />,
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

import Filter from '../index';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Filter', () => {
  it('shows search placeholder and focuses input when opened', async () => {
    renderWithTheme(
      <Filter
        title="Version"
        data={['v1.7.21-rc1', 'v1.7.20', 'Unknown']}
        current={undefined}
        onClick={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId('selector'));

    const input = await screen.findByLabelText('Search Version');
    expect(input).toHaveAttribute('placeholder', 'Search version…');

    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  });

  it('filters list items as the user types', async () => {
    renderWithTheme(
      <Filter
        title="Name"
        data={['Alice', 'Bob', 'Carol']}
        current={undefined}
        onClick={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId('selector'));
    const input = await screen.findByLabelText('Search Name');

    fireEvent.change(input, { target: { value: 'bo' } });

    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('calls onClick and closes when an item is selected', async () => {
    const onClick = jest.fn();
    renderWithTheme(
      <Filter
        title="Version"
        data={['v1.7.20']}
        current={undefined}
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByTestId('selector'));
    const item = await screen.findByText('v1.7.20');
    fireEvent.click(item);

    expect(onClick).toHaveBeenCalledWith('v1.7.20');
    await waitFor(() => {
      expect(screen.queryByLabelText('Search Version')).not.toBeInTheDocument();
    });
  });

  it('syncs displayed selection when current prop changes', () => {
    const { rerender } = renderWithTheme(
      <Filter
        title="Version"
        data={['v1.7.20']}
        current={undefined}
        onClick={jest.fn()}
      />,
    );

    expect(screen.getByText('All')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <Filter
          title="Version"
          data={['v1.7.20']}
          current="v1.7.20"
          onClick={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('v1.7.20')).toBeInTheDocument();
  });

  it('does not open when disabledInput is set', () => {
    renderWithTheme(
      <Filter
        title="Version"
        data={['v1.7.20']}
        current={undefined}
        onClick={jest.fn()}
        disabledInput
      />,
    );

    fireEvent.click(screen.getByTestId('selector'));
    expect(screen.queryByLabelText('Search Version')).not.toBeInTheDocument();
  });
});
