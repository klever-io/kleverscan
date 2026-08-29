import { shareModel, topContracts, windowVariation } from '../summaryFigures';

describe('windowVariation', () => {
  it('reports growth as a rate', () => {
    expect(windowVariation({ current: 120, previous: 100 })).toBeCloseTo(0.2);
  });

  it('reports a fall as a negative rate', () => {
    expect(windowVariation({ current: 80, previous: 100 })).toBeCloseTo(-0.2);
  });

  // The inverse of the guard's purpose: it exists to avoid printing a change
  // the data cannot support, so each of these must come back undefined rather
  // than as a number the tile would happily render.
  it('has no rate without a previous window', () => {
    expect(windowVariation({ current: 120, previous: 0 })).toBeUndefined();
  });

  it('has no rate for a negative previous window', () => {
    expect(windowVariation({ current: 120, previous: -5 })).toBeUndefined();
  });

  it('has no rate for a non-finite figure', () => {
    expect(
      windowVariation({ current: Infinity, previous: 100 }),
    ).toBeUndefined();
    expect(windowVariation({ current: NaN, previous: 100 })).toBeUndefined();
    expect(windowVariation({ current: 10, previous: NaN })).toBeUndefined();
  });

  it('has no rate at all without a pair', () => {
    expect(windowVariation(undefined)).toBeUndefined();
  });

  it('reports zero change as zero, not as absent', () => {
    // The one case that must NOT be undefined: an unchanged window is a fact.
    expect(windowVariation({ current: 100, previous: 100 })).toBe(0);
  });
});

describe('topContracts', () => {
  const entry = (address: string, count: number, name?: string) => ({
    address,
    name: name ?? '',
    ownerAddress: 'klv1owner',
    count,
  });

  it('sums the segments it keeps', () => {
    const result = topContracts([entry('a', 60), entry('b', 40)]);
    expect(result?.total).toBe(100);
    expect(result?.segments).toHaveLength(2);
  });

  it('sorts by count rather than trusting the order it was given', () => {
    // The bar draws its segments in order; one out-of-order entry reads as a
    // rendering fault rather than as data.
    const result = topContracts([entry('a', 10), entry('b', 90)]);
    expect(result?.segments.map(s => s.address)).toEqual(['b', 'a']);
  });

  it('keeps only the requested number of segments', () => {
    const result = topContracts(
      [entry('a', 5), entry('b', 4), entry('c', 3)],
      2,
    );
    expect(result?.segments).toHaveLength(2);
    // The total is the sum of what is DRAWN, so the shares add up to 100%.
    expect(result?.total).toBe(9);
  });

  it('drops entries the chain cannot have meant', () => {
    const result = topContracts([
      entry('a', 10),
      entry('', 99),
      entry('c', 0),
      entry('d', -5),
      entry('e', NaN),
      entry('f', Infinity),
    ]);
    expect(result?.segments.map(s => s.address)).toEqual(['a']);
  });

  it('turns an empty name into no name rather than an empty label', () => {
    const result = topContracts([entry('a', 10, '')]);
    expect(result?.segments[0].name).toBeUndefined();
  });

  // The inverse: every path that must yield no bar at all, because drawing an
  // empty or zero-width bar states a distribution that was never measured.
  it('has nothing to draw without statistics', () => {
    expect(topContracts(undefined)).toBeUndefined();
    expect(topContracts([])).toBeUndefined();
  });

  it('has nothing to draw when every entry is unusable', () => {
    expect(topContracts([entry('', 5), entry('c', 0)])).toBeUndefined();
  });

  it('has nothing to draw for a non-array', () => {
    expect(
      topContracts({ length: 1 } as unknown as Parameters<
        typeof topContracts
      >[0]),
    ).toBeUndefined();
  });

  it('never returns fewer than one segment for a positive limit', () => {
    // A zero or negative limit would otherwise slice to an empty list while
    // still reporting a total, and the bar would draw nothing inside itself.
    const result = topContracts([entry('a', 10)], 0);
    expect(result?.segments).toHaveLength(1);
  });
});

describe('shareModel', () => {
  const top = {
    total: 300,
    segments: [
      { address: 'a', name: 'A', count: 200 },
      { address: 'b', name: undefined, count: 100 },
    ],
  };

  it('divides by the chain-wide total and names the remainder', () => {
    const model = shareModel(top, 1000);
    expect(model).toEqual({ total: 1000, segments: top.segments, other: 700 });
  });

  it('clamps a denominator that lags below its own parts', () => {
    // The two figures come from different endpoints read moments apart; a
    // lagging total would draw a bar wider than itself and shares over 100%.
    const model = shareModel(top, 250);
    expect(model?.total).toBe(300);
    expect(model?.other).toBe(0);
  });

  // The inverse of the guard: every unusable denominator must yield nothing,
  // because a share silently recomputed against the segment sum is exactly
  // the inconsistency this model exists to prevent.
  it.each([
    ['no denominator', undefined],
    ['a zero denominator', 0],
    ['a negative denominator', -5],
    ['a non-finite denominator', Infinity],
    ['a NaN denominator', NaN],
    ['a string denominator', '1000' as unknown as number],
  ])('yields no shares for %s', (_label, all) => {
    expect(shareModel(top, all as number | undefined)).toBeUndefined();
  });

  it('yields nothing without segments to share', () => {
    expect(shareModel(undefined, 1000)).toBeUndefined();
  });
});
