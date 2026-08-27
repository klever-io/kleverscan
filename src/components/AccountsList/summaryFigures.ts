/** The figures a daily-creations series yields for the summary tiles. */
export interface ISummaryFigures {
  today: number | undefined;
  yesterday: number | undefined;
  change: number | undefined;
  windowTotal: number | undefined;
  /** Days that actually carried a figure; the window label counts these. */
  countedDays: number;
}

/**
 * Derives the tile figures from a positional series, newest entry first.
 *
 * A hole is undefined, which is not the same as a day on which nothing
 * happened: position is what makes an entry today or yesterday, so holes are
 * kept and the tiles leave a missing figure out rather than printing a zero.
 * The total sums only the days that carried a figure, and `countedDays`
 * counts those same days, so the total and its label describe one set.
 */
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
