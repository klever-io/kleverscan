import { IRowSection, ITransaction } from '@/types';
import { getTransactionColumns } from '@/components/TransactionsList/columns';
import { render } from '@testing-library/react';
import React from 'react';

/**
 * Why this suite sits in `src/__tests__` rather than beside the module it
 * covers: every file under `src/pages` is a route to Next, so a spec there is
 * loaded as a page during `next build` and its module-scope `jest.mock` calls
 * fail the build with "jest is not defined". This is the suite for
 * `useTransactionRowSections`, which lives in `pages/transactions/index.tsx`
 * and therefore cannot carry its own spec.
 */

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/** Recorded per namespace so the assertion can name the translator it means. */
const mockTranslators: Record<string, jest.Mock> = {};

jest.mock('next/router', () => ({
  useRouter: () => ({
    isReady: true,
    pathname: '/transactions',
    query: {},
  }),
}));

/**
 * The one subtree that reaches an ESM dependency Jest cannot transform:
 * ExplorerLink → LinkWithDropdown → contractModal → Contract → ConfirmPayload
 * → react-syntax-highlighter. Cutting it here is what makes this module
 * importable at all, which is why the page wiring had no test before.
 */
jest.mock('@/components/Modals/ConfirmPayload', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string) => `${value.slice(0, 6)}...`,
}));

jest.mock('@/utils/contracts', () => ({
  contractTypes: () => 'TransferContractType',
  filteredSections: () => [<span key="amount">1 KLV</span>],
  getLabelForTableField: () => ['Amount'],
}));

/**
 * Namespace-faithful, and it resolves against the real English bundles the way
 * the sibling list suites do, so a key nobody added fails here instead of
 * rendering "transactions:Table.NotApplicable" at a reader.
 *
 * `Date.Elapsed_Time` carries a sentinel because the real English value cannot
 * distinguish the bug: it is "ago", the same string formatDate falls back to
 * when no translator arrives, and getAge's unit fallback ("day", "hour") is
 * likewise identical to the en bundle. Without the sentinel this suite would
 * pass whether or not the translator is forwarded.
 */
jest.mock('next-i18next', () => {
  const commonActual = jest.requireActual(
    '../../public/locales/en/common.json',
  );
  const bundles: Record<string, unknown> = {
    transactions: jest.requireActual(
      '../../public/locales/en/transactions.json',
    ),
    common: {
      ...commonActual,
      Date: { ...commonActual.Date, Elapsed_Time: 'mock-ago' },
    },
  };

  const resolve = (bundle: unknown, path: string): unknown =>
    path
      .split('.')
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === 'object'
            ? (node as Record<string, unknown>)[part]
            : undefined,
        bundle,
      );

  return {
    serverSideTranslations: async () => ({ _nextI18Next: {} }),
    useTranslation: (ns: string | string[] = 'transactions') => {
      const first = Array.isArray(ns) ? ns[0] : ns;
      const translate = jest.fn((key: string): string => {
        const [space, path] = key.includes(':') ? key.split(':') : [first, key];
        const value = resolve(bundles[space], path);
        if (typeof value === 'string') return value;
        throw new Error(`missing ${space} locale key: ${key}`);
      });
      // The suite reads the last translator any namespace produced, which is
      // the one the assertion below names.
      mockTranslators[first] = translate;
      return { t: translate };
    },
  };
});

// The installed testing-library still calls the removed ReactDOM.render; every
// component suite in this repo carries the same createRoot shim.
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

import {
  transactionRowSections,
  useTransactionRowSections,
} from '@/pages/transactions';

const SENDER = 'klv1sendersendersendersender';
const RECEIVER = 'klv1receiverreceiverreceiver';

const transfer = (): ITransaction =>
  ({
    hash: 'abc123def456',
    blockNum: 4242,
    timestamp: 1700000000000,
    sender: SENDER,
    receipts: [],
    contract: [
      {
        type: 0,
        parameter: { amount: 1_000_000, assetId: 'KLV', toAddress: RECEIVER },
      },
    ],
    kAppFee: 1_000_000,
    bandwidthFee: 500_000,
    status: 'success',
    precision: 6,
  }) as unknown as ITransaction;

type RowBuilder = (props: ITransaction) => IRowSection[];

/**
 * Runs the hook and hands back the row builder it returns. The installed
 * @testing-library/react is 12.1.4, which predates `renderHook`, so the hook
 * is read off a throwaway component instead.
 */
const renderRowSectionsHook = (): RowBuilder => {
  // Held on an object because TypeScript does not track assignments made
  // inside the probe component's closure.
  const captured: { builder: RowBuilder | null } = { builder: null };
  const Probe: React.FC = () => {
    captured.builder = useTransactionRowSections();
    return null;
  };
  render(<Probe />);
  if (!captured.builder) throw new Error('the hook did not return a builder');
  return captured.builder;
};

describe('useTransactionRowSections', () => {
  beforeEach(() => {
    Object.keys(mockTranslators).forEach(key => delete mockTranslators[key]);
  });

  /**
   * The page-side half of the #709 fix, and the one line in the PR no test
   * executed: drop the `commonT` argument and every row silently returns to
   * the hardcoded English "ago", with nothing failing.
   *
   * Verified red before green — removing `commonT` from the
   * `transactionRowSections` call in `pages/transactions/index.tsx` fails this
   * suite, restoring it passes.
   */
  it('hands the common translator down to the row builder', () => {
    const buildRowSections = renderRowSectionsHook();

    buildRowSections(transfer());

    expect(mockTranslators.common).toHaveBeenCalledWith('Date.Elapsed_Time');
  });

  /**
   * Reads the string the age column would actually show, both ways: through
   * the hook's builder (translator forwarded) and straight from the builder
   * (no translator). The English bundle is what makes the pair meaningful —
   * `Date.Elapsed_Time` is "ago" and the fallback is "ago", so only the
   * sentinel tells the two apart.
   */
  const ageTextOf = (sections: IRowSection[]): string => {
    const ageIndex = getTransactionColumns({ showInOut: false }).findIndex(
      column => column.key === 'age',
    );
    expect(ageIndex).toBeGreaterThanOrEqual(0);

    const cell = sections[ageIndex].element(transfer()) as React.ReactElement<{
      Component: () => React.ReactElement<{ children?: React.ReactNode }>;
    }>;
    return String(cell.props.Component().props.children);
  };

  it('shows the translated age when the hook builds the row', () => {
    const buildRowSections = renderRowSectionsHook();

    expect(ageTextOf(buildRowSections(transfer()))).toContain('mock-ago');
  });

  it('shows the hardcoded English age when no translator reaches the builder', () => {
    const ageText = ageTextOf(transactionRowSections(transfer()));

    expect(ageText).toContain('ago');
    expect(ageText).not.toContain('mock-ago');
  });
});
