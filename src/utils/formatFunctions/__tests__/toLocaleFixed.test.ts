import { toLocaleFixed } from '../index';

describe('toLocaleFixed', () => {
  // Number.prototype is global, so a spy left behind by a failing assertion
  // would follow every later test in the run. restoreMocks is not enabled in
  // this repo's jest config, so the restore has to be unconditional.
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('asks for en-US rather than for whatever locale the runtime defaults to', () => {
    // Asserted on the argument, not on the output, because the output alone
    // proves nothing: on an en-US machine a runtime-default implementation
    // produces exactly the same string, so a value-only test would pass in CI
    // while the bug it guards was still there.
    //
    // What it guards: the server renders with its own locale and the browser
    // with the reader's. When those disagree on the decimal separator, React
    // discards the server-rendered tree and rebuilds it. That was visible on
    // every block page from a browser set to a comma-decimal locale.
    const spy = jest.spyOn(Number.prototype, 'toLocaleString');

    toLocaleFixed(1, 6);

    expect(spy).toHaveBeenCalledWith('en-US', { minimumFractionDigits: 6 });
  });

  it('returns a string even when handed nothing, so template literals stay clean', () => {
    // The signature promises a string. Before this it could return undefined,
    // which a template literal renders as the word "undefined" beside the
    // ticker; several call sites interpolate this.
    expect(toLocaleFixed(undefined as unknown as number, 2)).toBe('');
    expect(`${toLocaleFixed(undefined as unknown as number, 2)} KLV`).toBe(
      ' KLV',
    );
  });

  it('pads to the requested precision and groups thousands', () => {
    expect(toLocaleFixed(1, 6)).toBe('1.000000');
    expect(toLocaleFixed(0, 6)).toBe('0.000000');
    expect(toLocaleFixed(1234.5, 2)).toBe('1,234.50');
    expect(toLocaleFixed(8.14, 6)).toBe('8.140000');
  });
});
