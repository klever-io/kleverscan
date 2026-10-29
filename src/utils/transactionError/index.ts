import { capitalizeError } from '../errorMessage';
import { KLV_PRECISION } from '../globalVariables';

/** The wallet SDK wraps the node's own prefix, one wrapper per step. Listed
 * rather than matched loosely: the node sends its own "failed to ..." messages,
 * and a pattern wide enough for the wrappers eats those too. */
const DEV_PREFIXES =
  /(?:failed to (?:build transaction|sign transaction|broadcast transactions):\s*|validation error:\s*)+/gi;

/** The SDK substitutes this when the extension rejects with a non-Error, so it
 * is a placeholder for "no message", not a message. */
const SDK_PLACEHOLDER = /^unknown error$/i;

/** The nonce suffix matters: this frontend builds NFT ids as COLLECTION/nonce.
 * `have` is printed with %v from an int64, so it can carry a minus sign. */
const INSUFFICIENT_FUNDS =
  /insufficient funds.*?kda:\s*([A-Za-z0-9-]+(?:\/\d+)?),\s*wanted\s*(-?\d+),\s*have\s*(-?\d+)/i;

/** Scrubbed unconditionally, so redaction survives a format the parser misses.
 * The replacement names no owner: an unmapped error can carry a contract or a
 * receiver, and calling those "your account" states something untrue. */
const ADDRESS = /klv1[a-z0-9]{20,}/gi;

interface IErrorRule {
  match: RegExp;
  message: string;
}

const RULES: IErrorRule[] = [
  {
    match: /asset pool amount error/i,
    message: 'Fee too small to pay with this KDA',
  },
  { match: /asset pool not found/i, message: 'No fee pool for this KDA' },
  {
    match: /asset pool out of funds/i,
    message: 'Fee pool is empty for this KDA',
  },
  {
    match: /lowerNonceInTx|veryHighNonceInTx/i,
    message: 'Transaction out of sync with the network, please retry',
  },
  { match: /invalid receiver address/i, message: 'Invalid receiver address' },
  {
    match: /invalid address length for sender/i,
    message: 'Invalid sender address',
  },
  { match: /invalid value provided/i, message: 'Invalid amount' },
  { match: /invalid signature threshold/i, message: 'Not enough signatures' },
  {
    match: /no contract permission/i,
    message: 'No permission for this contract',
  },
];

/** The node prints the full fee and the full balance, so the amount still
 * missing is the difference. The chain counts in units: 251 at precision 6
 * is 0.000251, not 251. Both sides come off an int64, so the subtraction and
 * the decimal shift stay on BigInt: Number loses the last digits above 2^53
 * and would report a one-unit shortfall as zero. */
const formatShortfall = (
  wanted: string,
  have: string,
  precision: number,
): string => {
  const missing = BigInt(wanted) - BigInt(have);
  if (missing <= BigInt(0)) return '';

  const digits = missing.toString().padStart(precision + 1, '0');
  const whole = digits.slice(0, digits.length - precision);
  return precision === 0
    ? whole
    : `${whole}.${digits.slice(digits.length - precision)}`;
};

/** A precision that is not a whole number in 0-100 shifts the decimal point to
 * a nonsense place, so the toast names the asset without an amount instead. */
const isUsablePrecision = (precision?: number): precision is number =>
  precision !== undefined &&
  Number.isInteger(precision) &&
  precision >= 0 &&
  precision <= 100;

/** Capitalizing waits until the prefixes are off, so the real message leads. */
const toMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  // The api layer and the status poller both hand back the whole response,
  // which carries the reason in `error` rather than in `message`.
  if (typeof error === 'object' && error !== null) {
    const { message, error: field } = error as {
      message?: unknown;
      error?: unknown;
    };
    for (const value of [message, field]) {
      if (typeof value === 'string' && value.trim() !== '') return value;
    }
  }
  return typeof error === 'number' || typeof error === 'boolean'
    ? String(error)
    : '';
};

/**
 * `asset` is the KDA the precision belongs to. The node names the short asset
 * itself, which is not always the fee asset, and scaling by another asset's
 * precision prints a confident number that is wrong by orders of magnitude.
 */
export const mapTransactionError = (
  error: unknown,
  precision?: number,
  asset?: string,
  fallback = 'Transaction failed, please try again',
): string => {
  const raw = toMessage(error);

  const funds = raw.match(INSUFFICIENT_FUNDS);
  if (funds) {
    const [, kda, wanted, have] = funds;
    // KLV's precision is fixed, so the default fee path needs no caller to
    // supply it; every other asset still has to match the one passed in.
    const isKlv = kda === 'KLV';
    const scale = isKlv ? KLV_PRECISION : precision;
    const shortfall =
      isUsablePrecision(scale) && (isKlv || !asset || asset === kda)
        ? formatShortfall(wanted, have, scale)
        : '';
    return shortfall
      ? `Not enough ${kda}, need ${shortfall} more`
      : `Not enough ${kda}`;
  }

  const rule = RULES.find(({ match }) => match.test(raw));
  if (rule) return rule.message;

  const text = raw.replace(DEV_PREFIXES, '').replace(ADDRESS, 'the address');
  if (SDK_PLACEHOLDER.test(text.trim())) return fallback;
  return capitalizeError(text) || fallback;
};
