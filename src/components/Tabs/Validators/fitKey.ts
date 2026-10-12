import { parseAddress } from '@/utils/parseValues';

/**
 * Shortens a key in the middle until the measured text fits maxWidth.
 * Width 0 means the cell has not been laid out yet, so the key stays whole.
 */
export const middleFit = (
  value: string,
  maxWidth: number,
  measure: (text: string) => number,
): string => {
  if (maxWidth <= 0 || measure(value) <= maxWidth) {
    return value;
  }

  let low = 4;
  let high = value.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (measure(parseAddress(value, mid)) <= maxWidth) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  return parseAddress(value, low);
};
