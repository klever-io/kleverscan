export interface ISummaryFigures {
  today: number | undefined;
  yesterday: number | undefined;
  change: number | undefined;
  windowTotal: number | undefined;
  /** Days that actually carried a figure; the window label counts these. */
  countedDays: number;
}

// Positional, newest first. A hole (undefined) is not a zero day, and holes
// stay holes because position is what makes an entry today or yesterday; the
// tiles leave a missing figure out rather than printing a zero.
export const summaryFigures = (
  series: (number | undefined)[],
): ISummaryFigures => {
  const today = series[0];
  const yesterday = series[1];
  const counted = series.filter(
    (count): count is number => count !== undefined,
  );
  return {
    today,
    yesterday,
    change:
      today !== undefined && yesterday !== undefined
        ? today - yesterday
        : undefined,
    windowTotal: counted.length
      ? counted.reduce((sum, count) => sum + count, 0)
      : undefined,
    countedDays: counted.length,
  };
};
