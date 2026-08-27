import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';

// Shared between the desktop row and the mobile card, so the two cannot
// disagree on the divisor.
export const klvAmount = (raw: number): string =>
  formatAmount(raw / 10 ** KLV_PRECISION);
