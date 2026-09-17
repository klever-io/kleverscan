import theme from '@/styles/theme';
import { SmartContractsList } from '@/types/smart-contract';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

// `@/utils/parseValues` reaches `@/pages/transactions` and from there an ESM
// chain Jest cannot transform; the factory means the real module never loads.
// Documented blocker, same shim as every other suite in this repo.
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string) => `${String(value).slice(0, 10)}...`,
}));

// The cells render React and open their own queries. This suite is about the
// layout contract: how many sections, which spans and widths, and whether the
// header-string probe is survivable. MobileCard's suite renders the card
// variants; ContractCell's own rendering is a named gap, covered nowhere yet.
jest.mock('../cells', () => ({
  ContractCell: () => null,
  DeployerCell: () => null,
}));

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// Same react-dom shim as MobileCard.test: the pinned testing-library release
// calls the legacy ReactDOM.render, which React 19 no longer ships.
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

import { CONTRACT_COLUMNS } from '../columns';
import { COLUMN_LAYOUT, contractRowSections } from '../rows';

const contract = (
  overrides: Partial<SmartContractsList> = {},
): SmartContractsList => ({
  name: 'Bitcoin.me',
  contractAddress: 'klv1contract',
  deployer: 'klv1deployer',
  deployTxHash: 'deadbeef',
  timestamp: 1768498496,
  upgrades: [],
  totalTransactions: 42,
  ...overrides,
});

describe('contractRowSections', () => {
  it('builds one section per column, in order', () => {
    const sections = contractRowSections(contract());
    expect(sections).toHaveLength(CONTRACT_COLUMNS.length);
    sections.forEach((section, index) => {
      expect(section.span).toBe(CONTRACT_COLUMNS[index].span ?? 1);
      expect(section.width).toBe(CONTRACT_COLUMNS[index].width);
    });
  });

  it('gives every section an element', () => {
    contractRowSections(contract()).forEach(section => {
      expect(typeof section.element).toBe('function');
    });
  });

  // The shared Table calls rowSections with the header STRING to read column
  // widths, twice per header cell on every render. A builder that dereferences
  // its argument crashes the page while rendering its own header, which is how
  // the Pools tab went down once.
  it('answers the header-string probe with the layout only', () => {
    expect(contractRowSections('Contract')).toBe(COLUMN_LAYOUT);
  });

  it.each([
    ['a header string', 'Deployer'],
    ['an empty string', ''],
    ['null', null],
    ['undefined', undefined],
    ['a number', 7],
  ])('survives %s without throwing', (_label, value) => {
    expect(() =>
      contractRowSections(value as unknown as SmartContractsList),
    ).not.toThrow();
  });

  it('keeps the probe layout aligned with the real one', () => {
    // The two are built from the same source, so a column added without a cell
    // is a compile error rather than a header sitting above the wrong values.
    const real = contractRowSections(contract());
    expect(COLUMN_LAYOUT.map(s => [s.span, s.width])).toEqual(
      real.map(s => [s.span, s.width]),
    );
  });

  it.each([
    ['no upgrades', []],
    ['one upgrade', [{ upgradeTxHash: 'a', upgrader: 'b', timestamp: 1 }]],
  ])('builds a row with %s', (_label, upgrades) => {
    expect(() =>
      contractRowSections(
        contract({ upgrades: upgrades as SmartContractsList['upgrades'] }),
      ),
    ).not.toThrow();
  });

  // The field three declarations in this repo typed as string[] until now, so
  // a shape it was never checked against is exactly what a row has to survive.
  // Asserting the drawn dash rather than the absence of a throw: 'two'.length
  // is 3 and ({ length: 3 }).length is 3, so a not.toThrow passed with the
  // guard mutated away while the column showed a count the chain never had.
  const renderUpgradesCell = (upgrades: unknown) => {
    const sections = contractRowSections(
      contract({ upgrades: upgrades as SmartContractsList['upgrades'] }),
    );
    const index = CONTRACT_COLUMNS.findIndex(
      column => column.key === 'upgrades',
    );
    const Upgrades = sections[index].element as React.FC;
    return render(
      <ThemeProvider theme={theme}>
        <Upgrades />
      </ThemeProvider>,
    );
  };

  it.each([
    ['a missing upgrades field', undefined],
    ['a null upgrades field', null],
    ['an object where an array belongs', { length: 3 }],
    ['a string', 'two'],
  ])('draws the dash, not a count, for %s', (_label, upgrades) => {
    renderUpgradesCell(upgrades);
    expect(screen.getByText('- -')).toBeTruthy();
    expect(screen.queryByText('3')).toBeNull();
  });

  it('still counts a real upgrades array', () => {
    renderUpgradesCell([{ a: 1 }, { a: 2 }]);
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.queryByText('- -')).toBeNull();
  });

  it('builds a row for a contract with no name', () => {
    // Roughly nine in ten contracts arrive unnamed at larger page sizes.
    expect(() =>
      contractRowSections(contract({ name: undefined })),
    ).not.toThrow();
  });

  it('builds a row for a contract with no transactions', () => {
    expect(() =>
      contractRowSections(
        contract({
          totalTransactions: undefined as unknown as number,
        }),
      ),
    ).not.toThrow();
  });

  it('defaults the deferred flag, so a caller that forgets it still builds', () => {
    expect(() => contractRowSections(contract())).not.toThrow();
  });
});
