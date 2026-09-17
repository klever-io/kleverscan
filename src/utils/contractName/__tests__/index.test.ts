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

  // One representative per class DECEPTIVE names, including the four that
  // survived the first cut (U+1160, U+00AD, U+034F, U+17B4): each spliced
  // into a real name must clean away without a trace.
  it.each([
    ['bidi override U+202E', '\u202E'],
    ['zero width space U+200B', '\u200B'],
    ['word joiner U+2060', '\u2060'],
    ['invisible plus U+2064', '\u2064'],
    ['hangul choseong filler U+115F', '\u115F'],
    ['hangul jungseong filler U+1160', '\u1160'],
    ['hangul filler U+3164', '\u3164'],
    ['halfwidth hangul filler U+FFA0', '\uFFA0'],
    ['soft hyphen U+00AD', '\u00AD'],
    ['combining grapheme joiner U+034F', '\u034F'],
    ['khmer inherent aq U+17B4', '\u17B4'],
    ['mongolian vowel separator U+180E', '\u180E'],
    ['variation selector U+FE0F', '\uFE0F'],
    ['tag block character', '\uDB40\uDC41'],
    ['variation selector supplement', '\uDB40\uDD00'],
  ])('strips %s out of a name', (_label, invisible) => {
    expect(safeContractName(`Klever${invisible}Swap`)).toBe('KleverSwap');
  });

  it('returns empty for a name made only of invisibles, so the address fallback fires', () => {
    // Truthy-but-blank was the trap: every caller does `shown || address`,
    // and a surviving invisible beat the address it should have yielded to.
    expect(safeContractName('\u1160\u00AD\u034F\u17B4')).toBe('');
  });

  it('truncates past 32 characters with an ellipsis', () => {
    expect(safeContractName('A'.repeat(40))).toBe('A'.repeat(32) + '\u2026');
  });

  it('leaves real names in other scripts alone', () => {
    expect(safeContractName('caf\u00E9 \uD55C\uAD6D\uC5B4')).toBe(
      'caf\u00E9 \uD55C\uAD6D\uC5B4',
    );
  });
});
