import { buildUrlQuery, getHost } from '@/services/api';
import { Service } from '@/types/index';

const queryOf = (host: string): string => host.split('?')[1] ?? '';

describe('buildUrlQuery', () => {
  it('leaves a value that needs no escaping alone', () => {
    expect(buildUrlQuery({ asset: 'KLV', page: 1, limit: 10 })).toBe(
      'asset=KLV&page=1&limit=10',
    );
  });

  it('escapes a value that would otherwise add a parameter of its own', () => {
    // Next hands `router.query` over already decoded, so this is what a link
    // carrying ?x=%26asset%3DKFI reaches the sink as. Interpolated raw it put a
    // second `asset` ahead of the real one, and the proxy resolves a repeated
    // parameter first-wins.
    const query = buildUrlQuery({ x: '&asset=KFI', asset: 'KLV' });

    expect(query).toBe('x=%26asset%3DKFI&asset=KLV');
    expect(query).not.toContain('&asset=KFI');
  });

  it('escapes a value that would otherwise truncate the query', () => {
    // A `#` made the browser treat the rest of the URL as a fragment and send
    // none of it, so every parameter written after this one silently vanished.
    const query = buildUrlQuery({ x: '1#', asset: 'KLV', page: 1 });

    expect(query).toBe('x=1%23&asset=KLV&page=1');
    expect(query.split('#')).toHaveLength(1);
  });

  it('keeps a label the app itself writes to the URL in one piece', () => {
    // The asset page writes its card name to `router.query` and spreads it into
    // the request, so this fired without anyone crafting a link.
    expect(buildUrlQuery({ card: 'Staking & Royalties' })).toBe(
      'card=Staking%20%26%20Royalties',
    );
  });

  it('escapes the key as well as the value', () => {
    expect(buildUrlQuery({ 'a&b': 'c' })).toBe('a%26b=c');
  });

  it('escapes the slash in the nonce form of an asset id', () => {
    // The NFT page asks for `KID-36W3/1`. The proxy reads %2F exactly as it
    // reads a bare slash, so encoding it costs nothing.
    expect(buildUrlQuery({ asset: 'KID-36W3/1' })).toBe('asset=KID-36W3%2F1');
  });

  it('still joins an array on a comma, as the template literal did', () => {
    // A repeated URL param arrives as an array. The comma now travels as %2C,
    // which the proxy accepts identically.
    expect(buildUrlQuery({ asset: ['KLV', 'KFI'] })).toBe('asset=KLV%2CKFI');
  });

  it('coerces booleans, numbers and undefined the way it always did', () => {
    expect(buildUrlQuery({ hidden: false, page: 2, missing: undefined })).toBe(
      'hidden=false&page=2&missing=undefined',
    );
  });

  it('produces an empty string for an empty query', () => {
    expect(buildUrlQuery({})).toBe('');
  });
});

describe('getHost', () => {
  it('appends the escaped query to the route', () => {
    const host = getHost(
      'transaction/list',
      { x: '&asset=KFI', asset: 'KLV', page: 1 },
      Service.PROXY,
      'v1.0',
    );

    expect(host).toContain('/transaction/list?');
    expect(queryOf(host)).toBe('x=%26asset%3DKFI&asset=KLV&page=1');
  });

  it('omits the question mark when there is no query', () => {
    // Asserted from the route onwards rather than over the whole string: the
    // host comes from the environment, so a configured host carrying its own
    // query would fail this for a reason that has nothing to do with the sink.
    const host = getHost('assets/KLV', undefined, Service.PROXY, 'v1.0');

    expect(host.slice(host.indexOf('/assets/KLV'))).toBe('/assets/KLV');
  });
});
