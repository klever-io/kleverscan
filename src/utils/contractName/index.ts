/**
 * The longest name a list cell will draw. A name is set by whoever owns the
 * account, through SetAccountName, so it is untrusted text of any length: a
 * 200 character one was measured to widen the page from 800px to 1838px and
 * put the whole table behind a horizontal scrollbar. Real names on mainnet
 * reach 32 characters ("Hardlock5 Certification Registry"), which is where
 * this sits.
 */
const NAME_LIMIT = 32;

/**
 * Characters that let a name lie about itself rather than merely be ugly:
 * the bidi overrides and isolates, which paint text right to left so a
 * reversed string reads as a well known domain, plus the zero-width marks
 * and the control blocks. \s does not cover any of them.
 *
 * Enumerated rather than taken by Unicode category: \p{Cf} would say this in
 * one term, but it needs the u flag and this project compiles to es5. The
 * three Hangul fillers are not formatting characters at all, they draw as a
 * blank glyph, which is the same lie by another route. The trailing
 * alternation is the tag block, which lives outside the BMP and so arrives
 * here as a surrogate pair.
 */
const DECEPTIVE =
  /[\u0000-\u001F\u007F-\u009F\u061C\u115F\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\u3164\uE000-\uF8FF\uFE00-\uFE0F\uFEFF\uFFA0\uFFF9-\uFFFB]|\uDB40[\uDC00-\uDC7F]/g;

/**
 * A name shaped like a wallet address, which no honest name needs to be.
 *
 * Matched as a prefix rather than as the whole string. A reader sees the
 * first 32 characters, so a name that is an address with one disqualifying
 * character past that point passed a whole-string test and was then drawn as
 * a plain address once the tail was cut away.
 */
const LOOKS_LIKE_AN_ADDRESS = /^klv1[0-9a-z]{6,}/i;

/**
 * What of a name is safe to draw. Returns an empty string for a name that
 * survives none of this, and the caller keeps the address.
 *
 * The name stands where an address would, so it is often the only identifier a
 * reader sees. That makes impersonation the risk worth spending code on: a
 * name that reads as an address, or one that reverses itself into somebody
 * else's brand, would be a lie in the one field the reader trusts.
 *
 * Cut first, then judge. Judging the whole name and drawing a shortened one
 * asks the question about a string the reader never sees.
 *
 * Shared by the transactions list and the smart-contracts list. One copy on
 * purpose: two copies of an impersonation defence drift, and the weaker copy
 * is the one an attacker gets to pick.
 */
export const safeContractName = (name: string): string => {
  // The type is a promise the network does not keep: a truthy non-string here
  // reaches .replace mid-render and would take the whole surface down.
  if (typeof name !== 'string') return '';

  const cleaned = name.replace(DECEPTIVE, '').replace(/\s+/g, ' ').trim();
  const shown =
    cleaned.length > NAME_LIMIT
      ? `${cleaned.slice(0, NAME_LIMIT)}\u2026`
      : cleaned;

  if (!shown || LOOKS_LIKE_AN_ADDRESS.test(shown)) return '';

  return shown;
};
