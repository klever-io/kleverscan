import { capitalizeError } from '../errorMessage';

/**
 * The node answers a rejected build with a `validation error: ...` string that
 * is written for a chain developer: it carries debug flags, the sender address
 * and amounts in chain units. Showing it raw is what users saw before this
 * module existed.
 */
const VALIDATION_PREFIX = /^validation error:\s*/i;

/**
 * Matches the funds error, which names the asset and the amount it is short of.
 * Both are worth keeping; the address and the `have` side are not.
 */
const INSUFFICIENT_FUNDS =
  /insufficient funds.*?kda:\s*([A-Za-z0-9-]+),\s*wanted\s*(\d+)/i;

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

/** Narrows the thrown value to a string without capitalizing it: the prefix is
 * stripped first, so capitalizing has to wait until the real message is bare. */
const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const mapTransactionError = (
  error: unknown,
  precision?: number,
): string => {
  const raw = toMessage(error);

  const funds = raw.match(INSUFFICIENT_FUNDS);
  if (funds) {
    const [, kda, wanted] = funds;
    if (precision === undefined || !Number.isFinite(precision)) {
      return `Not enough ${kda} to pay the fee`;
    }
    return `Not enough ${kda}, need ${formatShortfall(wanted, precision)}`;
  }

  const rule = RULES.find(({ match }) => match.test(raw));
  if (rule) return rule.message;

  return capitalizeError(raw.replace(VALIDATION_PREFIX, '')) || raw;
};
