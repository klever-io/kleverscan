/**
 * Percent formatting policy shared by the data-list pages (holders, assets):
 * one decimal from 10% up, two below that, and a "<0.01%" floor so dust
 * shares never round to a fake 0%.
 */
export const formatShare = (part: number, total: number): string => {
  if (!Number.isFinite(total) || !Number.isFinite(part)) return '--';
  if (total <= 0 || part < 0) return '--';
  const pct = Math.min(Math.max((part / total) * 100, 0), 100);
  if (pct === 0) return '0%';
  if (pct < 0.01) return '<0.01%';
  if (pct < 10) return `${pct.toFixed(2)}%`;
  if (pct < 100 && Number(pct.toFixed(1)) >= 100) return '>99.9%';
  const rounded = pct.toFixed(1);
  return rounded.endsWith('.0') ? `${Math.round(pct)}%` : `${rounded}%`;
};

/**
 * Exact human-readable amount for tooltips, where compact notation lies.
 * Divides by 10^precision through string math: float division would round
 * the last decimal on 16-digit raw supplies.
 */
export const exactAmount = (raw: number, precision: number): string => {
  if (!Number.isFinite(raw) || raw < 0) return '--';
  const rawString = Math.trunc(raw).toString();
  if (rawString.includes('e')) {
    return (raw / 10 ** precision).toLocaleString('en-US', {
      maximumFractionDigits: precision,
    });
  }
  const padded = rawString.padStart(precision + 1, '0');
  const whole = precision > 0 ? padded.slice(0, -precision) : padded;
  const fraction = precision > 0 ? padded.slice(-precision) : '';

  let grouped = '';
  for (let index = 0; index < whole.length; index++) {
    grouped += whole[index];
    const remaining = whole.length - index - 1;
    if (remaining > 0 && remaining % 3 === 0) grouped += ',';
  }

  let fractionEnd = fraction.length;
  while (fractionEnd > 0 && fraction[fractionEnd - 1] === '0') fractionEnd--;
  const trimmedFraction = fraction.slice(0, fractionEnd);

  return trimmedFraction ? `${grouped}.${trimmedFraction}` : grouped;
};
