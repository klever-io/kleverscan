jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, options?: { defaultValue?: string }) =>
      `t:${options?.defaultValue ?? ''}`,
  }),
}));

import { VALIDATOR_COLUMNS } from '../columns';
import { useValidatorHeaders } from '../useValidatorHeaders';

describe('useValidatorHeaders', () => {
  // Callable outside React because its only hook is the mocked translation;
  // everything else is a map over the static column table.
  it('returns one translated heading per column, in column order', () => {
    expect(useValidatorHeaders()).toEqual(
      VALIDATOR_COLUMNS.map(column => `t:${column.header}`),
    );
  });
});
