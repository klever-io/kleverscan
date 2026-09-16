import enSmartContracts from '../../../../public/locales/en/smartContracts.json';
import ptSmartContracts from '../../../../public/locales/pt-BR/smartContracts.json';
import { bundleFor, lookup, present, readKeys } from '@/utils/localeKeys';
import { CONTRACT_COLUMNS } from '../columns';

/**
 * A hand-list AND a scrape, because they fail differently: the list catches a
 * bundle key going missing for a call site someone remembered to record, the
 * scrape catches the call site nobody recorded (a new `t()` on the page is
 * unguarded by a hand-list until someone extends it).
 */
const USED_KEYS = [
  'Titles.MostUsed',
  'List.SummaryAria',
  'List.ContractsDeployed',
  'List.ContractTransactions',
  'List.Last24h',
  'List.MostUsed',
  'List.LeaderTransactions',
  'List.OtherContracts',
  'List.MostUsedNote',
  'List.MostUsedLoading',
  'List.NoStatistics',
  'List.DeployerCountTitle',
  'List.DeployedByShort',
  'List.TransactionsShort',
  'List.ClearFilter',
  'Filters.SortBy',
  'Filters.Order',
  'Filters.SortTransactions',
  'Filters.SortDeployed',
  'Filters.OrderDesc',
  'Filters.OrderAsc',
  'Common.CopyAddress',
  'Common.AddressCopied',
  'Common.OpenContract',
  'Common.OpenInNewTab',
];

describe('smartContracts locale bundle', () => {
  it.each(CONTRACT_COLUMNS)(
    'carries the heading for the $key column',
    column => {
      const path = column.i18nKey.split(':')[1];
      expect(typeof lookup(enSmartContracts, path)).toBe('string');
    },
  );

  it.each(USED_KEYS)('carries %s', path => {
    expect(typeof lookup(enSmartContracts, path)).toBe('string');
  });

  it('keeps pt-BR in step, so a future translation pass has every slot', () => {
    // pt-BR is not an active locale, but the file exists and drifting key sets
    // are what makes turning one on expensive later.
    const missing = [
      ...CONTRACT_COLUMNS.map(column => column.i18nKey.split(':')[1]),
      ...USED_KEYS,
    ].filter(path => typeof lookup(ptSmartContracts, path) !== 'string');
    expect(missing).toEqual([]);
  });

  const sources = [
    'src/components/SmartContractsList/Summary.tsx',
    'src/components/SmartContractsList/MostUsed/index.tsx',
    'src/components/SmartContractsList/Filters.tsx',
    'src/components/SmartContractsList/ActiveFilter.tsx',
    'src/components/SmartContractsList/cells.tsx',
    'src/components/SmartContractsList/columns.ts',
  ] as const;

  it.each(sources)('%s asks for keys that exist in the bundle', file => {
    const { keys } = readKeys(file, 'smartContracts');
    expect(keys.length).toBeGreaterThan(0);

    const bundle = bundleFor('en', 'smartContracts');
    expect(keys.filter(key => !present(bundle, key))).toEqual([]);
  });

  it('no longer carries the keys of the components this page replaced', () => {
    // Cards.* fed the mobile card that drew white on white; Titles.Daily and
    // Titles.Transactions fed the chart the summary replaced.
    expect(lookup(enSmartContracts, 'Cards')).toBeUndefined();
    expect(lookup(enSmartContracts, 'Titles.Daily')).toBeUndefined();
    expect(lookup(enSmartContracts, 'Titles.Transactions')).toBeUndefined();
  });
});
