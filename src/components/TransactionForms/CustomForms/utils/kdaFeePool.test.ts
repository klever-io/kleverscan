import { getKDAFeePoolHelperText } from './kdaFeePool';

describe('getKDAFeePoolHelperText', () => {
  it('should return helper text for a positive integer quotient', () => {
    const result = getKDAFeePoolHelperText(2, 'TIKTOK-TSE0');
    expect(result).toBe(
      'If a fee costs 10 KLV, users will pay 20 TIKTOK-TSE0',
    );
  });

  it('should return helper text for a decimal quotient', () => {
    const result = getKDAFeePoolHelperText(0.5, 'USDT-23V8');
    expect(result).toBe('If a fee costs 10 KLV, users will pay 5 USDT-23V8');
  });

  it('should return helper text for a string quotient', () => {
    const result = getKDAFeePoolHelperText('3', 'KDA');
    expect(result).toBe('If a fee costs 10 KLV, users will pay 30 KDA');
  });

  it('should return undefined for zero quotient', () => {
    expect(getKDAFeePoolHelperText(0, 'KDA')).toBeUndefined();
  });

  it('should return undefined for negative quotient', () => {
    expect(getKDAFeePoolHelperText(-1, 'KDA')).toBeUndefined();
  });

  it('should return undefined for empty string', () => {
    expect(getKDAFeePoolHelperText('', 'KDA')).toBeUndefined();
  });

  it('should return undefined for null', () => {
    expect(getKDAFeePoolHelperText(null, 'KDA')).toBeUndefined();
  });

  it('should return undefined for undefined', () => {
    expect(getKDAFeePoolHelperText(undefined, 'KDA')).toBeUndefined();
  });

  it('should return undefined for NaN input', () => {
    expect(getKDAFeePoolHelperText('abc', 'KDA')).toBeUndefined();
  });

  it('should return undefined for Infinity', () => {
    expect(getKDAFeePoolHelperText(Infinity, 'KDA')).toBeUndefined();
  });

  it('should handle small decimal quotients without floating point artifacts', () => {
    const result = getKDAFeePoolHelperText(0.02, 'TIKTOK-TSE0');
    expect(result).toContain('If a fee costs 10 KLV, users will pay');
    expect(result).toContain('TIKTOK-TSE0');
    expect(result).not.toContain('0.20000000000000001');
  });
});
