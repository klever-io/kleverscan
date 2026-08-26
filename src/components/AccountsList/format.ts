import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';

/**
 * A raw KLV amount as the list shows it.
 *
 * Shared between the desktop row and the mobile card, which is the whole point:
 * the two render the same balances, and a divisor written out at each call site
 * is how they end up disagreeing when one of them is touched.
 */
export const klvAmount = (raw: number): string =>
  formatAmount(raw / 10 ** KLV_PRECISION);
