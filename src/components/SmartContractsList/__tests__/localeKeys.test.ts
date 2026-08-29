import enSmartContracts from '../../../../public/locales/en/smartContracts.json';
import ptSmartContracts from '../../../../public/locales/pt-BR/smartContracts.json';
import { CONTRACT_COLUMNS } from '../columns';

const lookup = (bundle: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === 'object'
          ? (node as Record<string, unknown>)[part]
          : undefined,
      bundle,
    );

/**
 * Every key the page asks for, listed here rather than scraped from the
 * source: a scrape would silently pass the day a `t()` call is renamed.
 */
const USED_KEYS = [
  'Titles.MostUsed',
  'List.SummaryAria',
  'List.ContractsDeployed',
  'List.ContractTransactions',
  'List.Last24h',
  'List.MostUsed',
  'List.LeaderTransactions',
  'List.BarCaption',
  'List.MostUsedNote',
  'List.NoStatistics',
  'List.DeployerCountTitle',
  'List.FilteredByDeployer',
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

  it('no longer carries the keys of the components this page replaced', () => {
    // Cards.* fed the mobile card that drew white on white; Titles.Daily and
    // Titles.Transactions fed the chart the summary replaced.
    expect(lookup(enSmartContracts, 'Cards')).toBeUndefined();
    expect(lookup(enSmartContracts, 'Titles.Daily')).toBeUndefined();
    expect(lookup(enSmartContracts, 'Titles.Transactions')).toBeUndefined();
  });
});
