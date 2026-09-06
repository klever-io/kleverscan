import { buildChartSeries } from '@/services/requests/home/chartSeries';

const DAY_MS = 24 * 60 * 60 * 1000;
const START = Date.UTC(2026, 7, 20, 12);

/** `count` consecutive days, each carrying `value` transactions. */
const points = (count: number, value: number) =>
  Array.from({ length: count }, (_, index) => ({
    key: START + index * DAY_MS,
    doc_count: value,
  }));

const month = (name: string) => name;

describe('buildChartSeries', () => {
  it('splits the series into the two stretches the legend names', () => {
    // Oldest first, so the older half is the previous period.
    const series = [...points(2, 10), ...points(2, 30)].map((point, index) => ({
      ...point,
      key: START + index * DAY_MS,
    }));

    const { pairs, total, previousTotal } = buildChartSeries(series, month);

    expect(pairs).toHaveLength(2);
    expect(total).toBe(60);
    expect(previousTotal).toBe(20);
  });

  it('pairs each day with its counterpart a period earlier', () => {
    const series = [
      { key: START, doc_count: 1 },
      { key: START + DAY_MS, doc_count: 2 },
      { key: START + 2 * DAY_MS, doc_count: 3 },
      { key: START + 3 * DAY_MS, doc_count: 4 },
    ];

    const { pairs } = buildChartSeries(series, month);

    expect(pairs.map(pair => [pair.valuePast, pair.valueNow])).toEqual([
      [1, 3],
      [2, 4],
    ]);
  });

  it('answers nothing when a dropped point leaves the stretches uneven', () => {
    // A key of 0 is falsy and is dropped, which would pair every remaining day
    // against the wrong counterpart and leave the newest one without a partner.
    const series = [
      { key: 0, doc_count: 5 },
      { key: START, doc_count: 1 },
      { key: START + DAY_MS, doc_count: 2 },
      { key: START + 2 * DAY_MS, doc_count: 3 },
    ];

    expect(buildChartSeries(series, month)).toEqual({
      pairs: [],
      total: 0,
      previousTotal: 0,
    });
  });

  it('answers nothing for an empty series', () => {
    expect(buildChartSeries([], month).pairs).toEqual([]);
  });

  it('keeps a genuine zero, which a quiet day really is', () => {
    const series = [
      { key: START, doc_count: 0 },
      { key: START + DAY_MS, doc_count: 0 },
    ];

    const { pairs, total, previousTotal } = buildChartSeries(series, month);

    expect(pairs).toHaveLength(1);
    expect(total).toBe(0);
    expect(previousTotal).toBe(0);
  });

  it('drops a point whose count is not a number', () => {
    // NaN would spread through both sums and print as NaN on the card.
    const series = [
      { key: START, doc_count: 1 },
      { key: START + DAY_MS, doc_count: Number.NaN },
      { key: START + 2 * DAY_MS, doc_count: 3 },
      { key: START + 3 * DAY_MS, doc_count: 4 },
    ];

    // Three usable points is an odd length, so the whole series is refused
    // rather than paired wrongly.
    expect(buildChartSeries(series, month).pairs).toEqual([]);
  });

  it('labels hourly points by clock time, the same on both stretches', () => {
    // Buckets a day apart end at the same minute, so one label names both,
    // where a day label would repeat 24 times over.
    const hour = 60 * 60 * 1000;
    const series = [
      { key: START, doc_count: 1 },
      { key: START + 24 * hour, doc_count: 2 },
    ];

    const { pairs } = buildChartSeries(series, month, { hourly: true });

    expect(pairs[0].datePast).toMatch(/^\d{2}:\d{2}$/);
    expect(pairs[0].dateNow).toBe(pairs[0].datePast);
  });

  it('labels in UTC, whatever zone the viewer is in', () => {
    // Every other timestamp the explorer prints is UTC. Half past eleven at
    // night is already the next day in any zone east of it, which is where a
    // label from the viewer's clock would name the wrong day and hour.
    const late = Date.UTC(2026, 7, 20, 23, 30);
    const series = [
      { key: late, doc_count: 1 },
      { key: late + DAY_MS, doc_count: 2 },
    ];

    const daily = buildChartSeries(series, month);
    const hourly = buildChartSeries(series, month, { hourly: true });

    expect(daily.pairs[0].datePast).toBe('20 Aug');
    expect(daily.pairs[0].dateNow).toBe('21 Aug');
    expect(hourly.pairs[0].datePast).toBe('23:30');
  });

  it('renders the month through the translator it was handed', () => {
    const series = [
      { key: START, doc_count: 1 },
      { key: START + DAY_MS, doc_count: 2 },
    ];

    const { pairs } = buildChartSeries(series, name => `<${name}>`);

    expect(pairs[0].datePast).toMatch(/^\d{2} <\w+>$/);
  });
});
