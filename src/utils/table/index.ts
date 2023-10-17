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
