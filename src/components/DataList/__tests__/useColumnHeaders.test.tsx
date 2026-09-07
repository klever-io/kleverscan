/** Captures the namespace the hook loads, which is the failure this guard is
 *  for: a caller-supplied namespace that missed the bundle's spelling fell
 *  back to English silently. The namespace comes off the keys now. */
const loaded: string[][] = [];
jest.mock('next-i18next', () => ({
  useTranslation: (ns: string[]) => {
    loaded.push(ns);
    return {
      t: (key: string, options?: { defaultValue?: string }) =>
        key === 'smartContracts:Table.Contract'
          ? 'Contrato'
          : (options?.defaultValue ?? key),
    };
  },
}));

import { useColumnHeaders } from '../useColumnHeaders';

describe('useColumnHeaders', () => {
  beforeEach(() => loaded.splice(0));

  it('loads the namespace the keys themselves carry', () => {
    useColumnHeaders([
      { header: 'Contract', i18nKey: 'smartContracts:Table.Contract' },
    ]);
    expect(loaded).toEqual([['smartContracts']]);
  });

  it('translates through the key and falls back to the header literal', () => {
    expect(
      useColumnHeaders([
        { header: 'Contract', i18nKey: 'smartContracts:Table.Contract' },
        { header: 'Missing', i18nKey: 'smartContracts:Table.Nope' },
      ]),
    ).toEqual(['Contrato', 'Missing']);
  });
});
