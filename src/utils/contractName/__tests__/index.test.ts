import { safeContractName } from '../index';

describe('safeContractName', () => {
  it('passes an ordinary name through', () => {
    expect(safeContractName('Bitcoin.me')).toBe('Bitcoin.me');
  });

  it('returns empty for a truthy non-string from the network', () => {
    // The API types promise a string; the payload does not. A number here
    // used to reach .replace mid-render and take the surface down.
    expect(safeContractName(42 as unknown as string)).toBe('');
    expect(safeContractName({} as unknown as string)).toBe('');
  });

  it('still refuses a name shaped like an address', () => {
    expect(safeContractName('klv1qqqqqqqqqqqqqpgqevil')).toBe('');
  });
});
