import { summaryFigures } from '../summaryFigures';

describe('summaryFigures', () => {
  it('reads the two windows by position and reports the change', () => {
    const figures = summaryFigures([10, 9]);

    expect(figures.today).toBe(10);
    expect(figures.yesterday).toBe(9);
    expect(figures.change).toBe(1);
  });

  it('keeps a hole a hole instead of counting it as zero', () => {
    // Position is what makes an entry the previous window; collapsing holes
    // would promote an older figure into that slot.
    const figures = summaryFigures([10, undefined]);

    expect(figures.yesterday).toBeUndefined();
    expect(figures.change).toBeUndefined();
    expect(figures.today).toBe(10);
  });

  it('reports a negative change with its sign intact', () => {
    expect(summaryFigures([3, 9]).change).toBe(-6);
  });

  it('keeps a zero change apart from no change at all', () => {
    // Two equal windows is a real answer; undefined means one is missing.
    expect(summaryFigures([9, 9]).change).toBe(0);
  });

  it('yields nothing when both windows are holes', () => {
    const figures = summaryFigures([undefined, undefined]);

    expect(figures.today).toBeUndefined();
    expect(figures.change).toBeUndefined();
  });

  it('yields nothing at all for an empty series', () => {
    const figures = summaryFigures([]);

    expect(figures.today).toBeUndefined();
    expect(figures.yesterday).toBeUndefined();
    expect(figures.change).toBeUndefined();
  });
});
