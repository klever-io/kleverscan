import { summaryFigures } from '../summaryFigures';

describe('summaryFigures', () => {
  it('reads today and yesterday by position and sums the window', () => {
    const figures = summaryFigures([10, 9, 4, 82, 12, 8, 8]);

    expect(figures.today).toBe(10);
    expect(figures.yesterday).toBe(9);
    expect(figures.change).toBe(1);
    expect(figures.windowTotal).toBe(133);
    expect(figures.countedDays).toBe(7);
  });

  it('keeps a hole a hole instead of counting it as zero', () => {
    // Position is what makes an entry yesterday; collapsing holes would
    // promote an older day into that slot.
    const figures = summaryFigures([10, undefined, 4]);

    expect(figures.yesterday).toBeUndefined();
    expect(figures.change).toBeUndefined();
    expect(figures.windowTotal).toBe(14);
    expect(figures.countedDays).toBe(2);
  });

  it('reports a negative change with its sign intact', () => {
    expect(summaryFigures([3, 9]).change).toBe(-6);
  });

  it('yields no window total for a series of nothing but holes', () => {
    const figures = summaryFigures([undefined, undefined]);

    expect(figures.windowTotal).toBeUndefined();
    expect(figures.today).toBeUndefined();
    expect(figures.countedDays).toBe(0);
  });

  it('yields nothing at all for an empty series', () => {
    const figures = summaryFigures([]);

    expect(figures.today).toBeUndefined();
    expect(figures.windowTotal).toBeUndefined();
    expect(figures.countedDays).toBe(0);
  });
});
