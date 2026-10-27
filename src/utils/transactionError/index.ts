import { capitalizeError } from '../errorMessage';

/**
 * Developer-facing prefixes. The node writes `validation error: ...`, and the
 * wallet SDK wraps that again as `Failed to build transaction: ...`, so six of
 * the call sites receive both.
 */
const DEV_PREFIXES =
  /(?:failed to build transaction:\s*|validation error:\s*)+/gi;

/**
 * Matches the funds error, which names the asset and the amount it is short of.
 * Both are worth keeping; the `have` side is not.
 */
const INSUFFICIENT_FUNDS =
  /insufficient funds.*?kda:\s*([A-Za-z0-9-]+(?:\/\d+)?),\s*wanted\s*(\d+)/i;

/** Bech32 account address. Scrubbed from any message that reaches the user,
 * so redaction survives a node format this parser does not recognise. */
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

/**
 * Renders `wanted` as a token amount. The node counts in chain units, so
 * without the asset's precision the number would be off by orders of
 * magnitude: 251 units of a precision 6 asset is 0.000251, not 251.
 */
const formatShortfall = (units: string, precision: number): string =>
  (Number(units) / 10 ** precision).toFixed(precision);

/** toFixed throws a RangeError outside 0-100, and this runs inside a catch
 * block, so an out-of-range precision would leave the user with no toast. */
const isUsablePrecision = (precision?: number): precision is number =>
  precision !== undefined &&
  Number.isFinite(precision) &&
  precision >= 0 &&
  precision <= 100;

/** Narrows the thrown value to a string without capitalizing it: the prefix is
 * stripped first, so capitalizing has to wait until the real message is bare. */
const toMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
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
    const [, kda, wanted] = funds;
    if (!isUsablePrecision(precision) || (asset && asset !== kda)) {
      return `Not enough ${kda}`;
    }
    return `Not enough ${kda}, need ${formatShortfall(wanted, precision)}`;
  }

  const rule = RULES.find(({ match }) => match.test(raw));
  if (rule) return rule.message;

  const text = raw.replace(DEV_PREFIXES, '').replace(ADDRESS, 'your account');
  return capitalizeError(text) || 'Transaction failed, please try again';
};
