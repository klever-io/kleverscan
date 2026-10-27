import { capitalizeError } from '../errorMessage';

/** The wallet SDK wraps the node's own prefix, so six call sites get both. */
const DEV_PREFIXES =
  /(?:failed to build transaction:\s*|validation error:\s*)+/gi;

/** The nonce suffix matters: this frontend builds NFT ids as COLLECTION/nonce.
 * `have` is printed with %v from an int64, so it can carry a minus sign. */
const INSUFFICIENT_FUNDS =
  /insufficient funds.*?kda:\s*([A-Za-z0-9-]+(?:\/\d+)?),\s*wanted\s*(-?\d+),\s*have\s*(-?\d+)/i;

/** Scrubbed unconditionally, so redaction survives a format the parser misses. */
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
 * is 0.000251, not 251. */
const formatShortfall = (
  wanted: string,
  have: string,
  precision: number,
): string => {
  const missing = Math.max(Number(wanted) - Number(have), 0);
  return (missing / 10 ** precision).toFixed(precision);
};

/** toFixed throws a RangeError outside 0-100, and this runs inside a catch
 * block, so an out-of-range precision would leave the user with no toast. */
const isUsablePrecision = (precision?: number): precision is number =>
  precision !== undefined &&
  Number.isFinite(precision) &&
  precision >= 0 &&
  precision <= 100;

/** Capitalizing waits until the prefixes are off, so the real message leads. */
const toMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const { message } = error as { message: unknown };
    if (typeof message === 'string' && message.trim() !== '') return message;
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
): string => {
  const raw = toMessage(error);

  const funds = raw.match(INSUFFICIENT_FUNDS);
  if (funds) {
    const [, kda, wanted, have] = funds;
    if (!isUsablePrecision(precision) || (asset && asset !== kda)) {
      return `Not enough ${kda}`;
    }
    return `Not enough ${kda}, need ${formatShortfall(wanted, have, precision)} more`;
  }

  const rule = RULES.find(({ match }) => match.test(raw));
  if (rule) return rule.message;

  const text = raw.replace(DEV_PREFIXES, '').replace(ADDRESS, 'your account');
  return capitalizeError(text) || 'Transaction failed, please try again';
};
