import { signatureList } from '../signatures';

describe('signatureList', () => {
  it('keeps one string as one signature', () => {
    expect(signatureList('abcd')).toEqual(['abcd']);
  });

  it('keeps a list of signatures', () => {
    expect(signatureList(['one', 'two'])).toEqual(['one', 'two']);
  });

  it('drops empty values', () => {
    expect(signatureList(['', 'kept'])).toEqual(['kept']);
    expect(signatureList('')).toEqual([]);
    expect(signatureList(undefined)).toEqual([]);
  });
});
