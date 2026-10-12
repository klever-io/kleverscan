import { render, screen } from '@testing-library/react';
import React from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// RTL 12 renders through the legacy `react-dom` entry, which React 19 removed.
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

import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (address: string, maxLen: number) =>
    address.length > maxLen
      ? `${address.slice(0, maxLen / 2)}...${address.slice(-(maxLen / 2))}`
      : address,
}));

import { IBlockValidatorRow } from '../row';
import ValidatorsMobileCard from '../MobileCard';

const draw = (item: IBlockValidatorRow, index = 0) =>
  render(
    <ThemeProvider theme={theme}>
      <ValidatorsMobileCard item={item} index={index} />
    </ThemeProvider>,
  );

const hrefs = (container: HTMLElement): string[] =>
  [...container.querySelectorAll('a')].map(anchor => anchor.getAttribute('href') ?? '');

describe('ValidatorsMobileCard', () => {
  it('links the name and the full key, and marks the block leader', () => {
    const { container } = draw(
      {
        blsKey: 'aa',
        name: 'Alpha',
        ownerAddress: 'klv1alpha',
        leader: true,
      },
      2,
    );
    expect(screen.getByTestId('table-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('validator-link')).toHaveTextContent('Alpha');
    expect(screen.getByTestId('validator-link')).toHaveAttribute(
      'title',
      'Alpha',
    );
    expect(screen.getByTestId('block-leader')).toHaveTextContent('Leader');
    expect(hrefs(container)).toEqual([
      '/validator/klv1alpha',
      '/validator/klv1alpha',
    ]);
    expect(screen.getByTitle('aa')).toHaveTextContent('aa');
    expect(screen.getByRole('button', { name: 'Copy BLS key' })).toBeInTheDocument();
  });

  it('shortens an empty name to the owner and hides the badge', () => {
    draw({
      blsKey: 'ee',
      name: '',
      ownerAddress: 'klv1delta00000000ZZ',
      leader: false,
    });
    const link = screen.getByTestId('validator-link');
    expect(link).toHaveTextContent('klv1delt...000000ZZ');
    expect(link).toHaveAttribute('title', 'klv1delta00000000ZZ');
    expect(screen.queryByTestId('block-leader')).not.toBeInTheDocument();
  });

  it('keeps a long unknown key on one line', () => {
    const key = `aa${'b'.repeat(80)}`;
    draw({ blsKey: key });
    const keyNode = screen.getByText(key);
    const nameNode = screen.getByText('Unknown');
    expect(getComputedStyle(keyNode).whiteSpace).toBe('nowrap');
    expect(getComputedStyle(keyNode).textOverflow).toBe('clip');
    expect(getComputedStyle(nameNode).whiteSpace).toBe('nowrap');
    expect(keyNode).toHaveAttribute('title', key);
  });

  it('shows Unknown and no link when the directory does not know the key', () => {
    const { container } = draw({ blsKey: 'zz' });
    expect(screen.getByText('Unknown')).toHaveAttribute('title', 'zz');
    expect(screen.getByText('zz')).toHaveAttribute('title', 'zz');
    expect(container.querySelector('a')).toBeNull();
    expect(screen.queryByTestId('block-leader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('validator-link')).not.toBeInTheDocument();
  });
});
