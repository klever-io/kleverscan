export interface ISummaryFigures {
  today: number | undefined;
  yesterday: number | undefined;
  change: number | undefined;
}

// Positional, newest first: entry 0 is the window ending now, entry 1 the one
// before it. A hole (undefined) is not a zero, and holes stay holes because
// position is what makes an entry today or yesterday; the tiles leave a
// missing figure out rather than printing a zero.
export const summaryFigures = (
  series: (number | undefined)[],
): ISummaryFigures => {
  const today = series[0];
  const yesterday = series[1];
  return {
    today,
    yesterday,
    change:
      today !== undefined && yesterday !== undefined
        ? today - yesterday
        : undefined,
  };
};
