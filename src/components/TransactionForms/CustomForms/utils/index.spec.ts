import { encodeAddress, encodeBigNumber, twosComplement } from '.';

describe('utils', () => {
  it('should return 2 complement of number 1', () => {
    const value = 1;
    const bitsSize = 16;
    expect(twosComplement(value, bitsSize)).toBe('ffff');
  });

  it('should return 2 complement of number 2', () => {
    const value = 2;
    const bitsSize = 64;
    expect(twosComplement(value, bitsSize)).toBe('fffffffffffffffe');
  });
  it('should return 2 complement of number 10', () => {
    const value = 10;
    const bitsSize = 64;
    expect(twosComplement(value, bitsSize)).toBe('fffffffffffffff6');
  });
  it('should encode BigInt negative correctly', () => {
    const value = -1;
    expect(encodeBigNumber(value)).toBe('00000001ff');
  });
  it('should encode BigInt positive correctly', () => {
    const value = 1;
    expect(encodeBigNumber(value)).toBe('0000000101');
  });
  it('should encode BigInt positive and larger than half max correctly', () => {
    const value = 255;
    expect(encodeBigNumber(value)).toBe('0000000200ff');
  });
});

describe('encodeAddress', () => {
  it('should encode address correctly', () => {
    const address =
      'klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5';
    const encoded = encodeAddress(address);
    expect(encoded).toBe(
      '485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde',
    );
  });
});
