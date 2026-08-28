jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, options?: { defaultValue?: string }) =>
      `t:${options?.defaultValue ?? ''}`,
  }),
}));

import { BLOCK_COLUMNS } from '../columns';
import { useBlockHeaders } from '../useBlockHeaders';

describe('useBlockHeaders', () => {
  // Callable outside React because its only hook is the mocked translation;
  // everything else is a map over the static column table.
  it('returns one translated heading per column, in column order', () => {
    expect(useBlockHeaders()).toEqual(
      BLOCK_COLUMNS.map(column => `t:${column.header}`),
    );
  });
});
