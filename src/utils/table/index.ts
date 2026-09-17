/** A page or size parameter as a positive integer, whatever the URL carried:
 *  `Number('Infinity')` is truthy, so a plain `|| fallback` let it through to
 *  the API and to `Array(limit)`, which throws RangeError. */
export const normalizePageParam = (
  value: unknown,
  fallback: number,
  max = Number.MAX_SAFE_INTEGER,
): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(Math.max(1, Math.floor(parsed)), max);
};

export const checkIfRightAligned = (
  spanCount: number,
  span: number,
): boolean => {
  if (span !== 2 && spanCount % 2 === 0) {
    return true;
  }
  return false;
};

export const updateSpanCount = (spanCount: number, span: number): number => {
  spanCount += span || 1;
  if (span === -1) {
    spanCount += 1;
  }
  return spanCount;
};

export const processRowSectionsLayout = (
  spanCount: number,
  span: number,
): [number, boolean] => {
  const updatedSpanCount = updateSpanCount(spanCount, span);
  const isRightAligned = checkIfRightAligned(updatedSpanCount, span);
  return [updatedSpanCount, isRightAligned];
};
