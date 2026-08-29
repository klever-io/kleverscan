import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';

// Pinned: a bare toLocaleString() follows the reader's browser locale, and a
// Dutch browser would print 21.597 beside English labels.
export const NUMBER_LOCALE = 'en-US';

/**
 * A compact KLV amount for list surfaces. One definition: three files in
 * BlocksList each carried a copy and they had already drifted (one took
 * `number`, one added a non-breaking space). `nbsp` binds amount and unit
 * into one token for surfaces that wrap, such as the mobile card rows.
 */
export const klvAmount = (
  amount: number | undefined,
  options?: { nbsp?: boolean },
): string =>
  `${formatAmount((amount || 0) / 10 ** KLV_PRECISION)}${
    options?.nbsp ? '\u00A0' : ' '
  }KLV`;

/**
 * Percent formatting policy shared by the data-list pages (holders, assets):
 * one decimal from 10% up, two below that, and a "<0.01%" floor so dust
 * shares never round to a fake 0%.
 */
export const formatShare = (part: number, total: number): string => {
  if (!Number.isFinite(total) || !Number.isFinite(part)) return '--';
  if (total <= 0 || part < 0) return '--';
  const pct = Math.min(Math.max((part / total) * 100, 0), 100);
  if (pct === 0) return '0%';
  if (pct < 0.01) return '<0.01%';
  if (pct < 10) return `${pct.toFixed(2)}%`;
  if (pct < 100 && Number(pct.toFixed(1)) >= 100) return '>99.9%';
  const rounded = pct.toFixed(1);
  return rounded.endsWith('.0') ? `${Math.round(pct)}%` : `${rounded}%`;
};

/**
 * Human-readable amount for tooltips and full-value figures, where compact
 * notation lies. Divides by 10^precision through string math, because float
 * division rounds the last decimal on 16-digit raw supplies.
 *
 * A string input is the exact digit twin the parse boundary injects for
 * values past 2^53 (#679): those digits feed the walk directly and the
 * result is genuinely exact. A number input is exact only up to what a
 * double can carry, which is why callers prefer the string when present.
 *
 * `trimFraction: false` keeps the fraction at full precision, matching the
 * fixed-decimals presentation of `toLocaleFixed` for figures shown in body
 * text rather than tooltips.
 */
const exactDigitsOf = (raw: number | string): string | undefined => {
  if (typeof raw === 'string') {
    // Digits only: anything else did not come from the parse boundary.
    return /^\d+$/.test(raw) ? raw : undefined;
  }
  if (!Number.isFinite(raw) || raw < 0) return undefined;
  // BigInt rather than toString(): a double at or above 1e21 stringifies to
  // exponent form, which the digit walk below cannot read.
  return BigInt(Math.trunc(raw)).toString();
};

export const exactAmount = (
  raw: number | string,
  precision: number,
  { trimFraction = true }: { trimFraction?: boolean } = {},
): string => {
  const rawString = exactDigitsOf(raw);
  if (rawString === undefined) return '--';
  const padded = rawString.padStart(precision + 1, '0');
  const whole = precision > 0 ? padded.slice(0, -precision) : padded;
  const fraction = precision > 0 ? padded.slice(-precision) : '';

  let grouped = '';
  for (let index = 0; index < whole.length; index++) {
    grouped += whole[index];
    const remaining = whole.length - index - 1;
    if (remaining > 0 && remaining % 3 === 0) grouped += ',';
  }

  if (!trimFraction) {
    return fraction ? `${grouped}.${fraction}` : grouped;
  }

  let fractionEnd = fraction.length;
  while (fractionEnd > 0 && fraction[fractionEnd - 1] === '0') fractionEnd--;
  const trimmedFraction = fraction.slice(0, fractionEnd);

  return trimmedFraction ? `${grouped}.${trimmedFraction}` : grouped;
};
