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
  it('shows the given search placeholder and focuses input when opened', async () => {
    renderWithTheme(
      <Filter
        title="Version"
        // Deliberately not "Search version…": that is exactly what the removed
        // title-matching branch produced, so asserting it would pass against
        // the code this replaces.
        placeholder="Pick a version"
        data={['v1.7.21-rc1', 'v1.7.20', 'Unknown']}
        current={undefined}
        onClick={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId('selector'));

    const input = await screen.findByLabelText('Search Version');
    expect(input).toHaveAttribute('placeholder', 'Pick a version');

    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  });

  it('falls back to a generic placeholder when none is given', async () => {
    renderWithTheme(
      <Filter
        title="Version"
        data={['v1.7.20']}
        current={undefined}
        onClick={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId('selector'));

    const input = await screen.findByLabelText('Search Version');
    expect(input).toHaveAttribute('placeholder', 'Type to search…');
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

  it('matches version dots literally (not as regex any-char)', async () => {
    renderWithTheme(
      <Filter
        title="Version"
        data={['v1.7.20', 'v1x7x20']}
        current={undefined}
        onClick={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId('selector'));
    const input = await screen.findByLabelText('Search Version');
    fireEvent.change(input, { target: { value: 'v1.7.20' } });

    expect(screen.getByText('v1.7.20')).toBeInTheDocument();
    expect(screen.queryByText('v1x7x20')).not.toBeInTheDocument();
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

  describe('displayed label separated from the selected value', () => {
    // The label is what a reader sees; the value is what reaches the URL and
    // the API. These pin that translating the first cannot move the second.
    const LABELS: Record<string, string> = {
      All: 'Alle',
      Success: 'Geslaagd',
      Fail: 'Mislukt',
    };
    const renderLabel = (value: string) => LABELS[value] ?? value;

    const renderFilter = (onClick = jest.fn()) => {
      renderWithTheme(
        <Filter
          title="Status"
          data={['Success', 'Fail']}
          renderLabel={renderLabel}
          current={undefined}
          onClick={onClick}
        />,
      );
      return onClick;
    };

    it('lists labels, not values', async () => {
      renderFilter();
      fireEvent.click(screen.getByTestId('selector'));

      expect(await screen.findByText('Geslaagd')).toBeInTheDocument();
      expect(screen.getByText('Mislukt')).toBeInTheDocument();
      expect(screen.queryByText('Success')).not.toBeInTheDocument();
    });

    it('reports the value when a label is clicked', async () => {
      const onClick = renderFilter();
      fireEvent.click(screen.getByTestId('selector'));

      fireEvent.click(await screen.findByText('Geslaagd'));

      expect(onClick).toHaveBeenCalledWith('Success');
    });

    it('shows the label of the current value once closed', () => {
      renderWithTheme(
        <Filter
          title="Status"
          data={['Success', 'Fail']}
          renderLabel={renderLabel}
          current="Fail"
          onClick={jest.fn()}
        />,
      );

      expect(screen.getByText('Mislukt')).toBeInTheDocument();
      expect(screen.queryByText('Fail')).not.toBeInTheDocument();
    });

    it('searches on the label, because that is what the user reads', async () => {
      renderFilter();
      fireEvent.click(screen.getByTestId('selector'));
      const input = await screen.findByLabelText('Search Status');

      fireEvent.change(input, { target: { value: 'gesl' } });

      expect(screen.getByText('Geslaagd')).toBeInTheDocument();
      expect(screen.queryByText('Mislukt')).not.toBeInTheDocument();
    });

    it('still searches on the value, so existing habits keep working', async () => {
      renderFilter();
      fireEvent.click(screen.getByTestId('selector'));
      const input = await screen.findByLabelText('Search Status');

      fireEvent.change(input, { target: { value: 'fail' } });

      expect(screen.getByText('Mislukt')).toBeInTheDocument();
      expect(screen.queryByText('Geslaagd')).not.toBeInTheDocument();
    });

    it('searches labels carrying characters the old input filter stripped', async () => {
      renderWithTheme(
        <Filter
          title="Status"
          data={['Success']}
          renderLabel={value =>
            value === 'Success' ? 'Sucesso concluído' : 'Todos'
          }
          current={undefined}
          onClick={jest.fn()}
        />,
      );
      fireEvent.click(screen.getByTestId('selector'));
      const input = await screen.findByLabelText('Search Status');

      fireEvent.change(input, { target: { value: 'concluído' } });

      // The input value is the assertion that pins the removal: the old
      // sanitiser truncated this to "conclu", which still matched the option,
      // so asserting only on the list passed either way.
      expect(input).toHaveValue('concluído');
      expect(screen.getByText('Sucesso concluído')).toBeInTheDocument();
      expect(screen.queryByText('Todos')).not.toBeInTheDocument();
    });
  });

  it('survives a null-ish entry in data while searching', () => {
    // `data: string[]` is unchecked at runtime: a caller building its list
    // from optional API fields can hand this a hole, as the Coin filter did
    // before it started filtering at the source. Searching must not throw.
    renderWithTheme(
      <Filter
        title="Coin"
        data={['KLV', undefined as unknown as string, 'KFI']}
        current={undefined}
        onClick={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId('selector'));

    expect(() => {
      fireEvent.change(screen.getByLabelText('Search Coin'), {
        target: { value: 'kf' },
      });
    }).not.toThrow();
    expect(screen.getByText('KFI')).toBeInTheDocument();
  });

  it('shows the given not-found text, and falls back to the title otherwise', async () => {
    const { rerender } = renderWithTheme(
      <Filter
        title="Coin"
        data={['KLV']}
        current={undefined}
        onClick={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId('selector'));
    fireEvent.change(await screen.findByLabelText('Search Coin'), {
      target: { value: 'zzz' },
    });
    expect(screen.getByText('Coin not found!')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <Filter
          title="Coin"
          notFoundLabel="No match found"
          data={['KLV']}
          current={undefined}
          onClick={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('No match found')).toBeInTheDocument();
    expect(screen.queryByText('Coin not found!')).not.toBeInTheDocument();
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
