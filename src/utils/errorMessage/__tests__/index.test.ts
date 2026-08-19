import { capitalizeError } from '../index';

describe('capitalizeError', () => {
  it('capitalizes a string error from an API error body', () => {
    expect(capitalizeError('fetch timeout')).toBe('Fetch timeout');
  });

  it('reads the message of an Error, which a transport failure yields', () => {
    expect(capitalizeError(new Error('network request failed'))).toBe(
      'Network request failed',
    );
  });

  it('reads the message of a TypeError, which fetch throws when offline', () => {
    expect(capitalizeError(new TypeError('failed to fetch'))).toBe(
      'Failed to fetch',
    );
  });

  it('leaves an already capitalized message unchanged', () => {
    expect(capitalizeError('Internal error')).toBe('Internal error');
  });

  it('returns an empty string for an empty message', () => {
    expect(capitalizeError('')).toBe('');
  });

  it('stringifies a value that is neither a string nor an Error', () => {
    expect(capitalizeError(404)).toBe('404');
  });
});
