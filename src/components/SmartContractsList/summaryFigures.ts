import { formatShare } from '@/components/DataList/format';
import { HotContracts } from '@/types/smart-contract';
import { safeContractName } from '@/utils/contractName';

export interface IContractShare {
  address: string;
  name?: string;
  count: number;
}

export interface ITopContracts {
  /** The sum over the returned contracts, the floor the share denominator
   *  is clamped to in shareModel. */
  total: number;
  segments: IContractShare[];
}

/**
 * The busiest contracts and their share of each other.
 *
 * That sum is not the share denominator: `shareModel` divides by all
 * successful contract activity chain-wide, and uses this total only as the
 * floor it clamps that denominator up to.
 *
 * The counts are all-time. The endpoint accepts an `epoch` parameter that
 * narrows it to one six-hour window, but the frontend does not send one, so
 * there is no time filter at all.
 *
 * Returns undefined when nothing usable arrived, so the bar is left out rather
 * than drawn empty.
 */
export const topContracts = (
  statistics: HotContracts[] | undefined,
  limit = 5,
): ITopContracts | undefined => {
  if (!Array.isArray(statistics) || statistics.length === 0) return undefined;

  const usable = statistics
    .filter(
      entry =>
        entry &&
        typeof entry.address === 'string' &&
        entry.address !== '' &&
        typeof entry.count === 'number' &&
        Number.isFinite(entry.count) &&
        entry.count > 0,
    )
    .map(entry => ({
      address: entry.address,
      name: entry.name || undefined,
      count: entry.count,
    }));

  if (usable.length === 0) return undefined;

  // Sorted here rather than trusted from the API: the bar's segments are drawn
  // in order and a single out-of-order entry reads as a rendering fault.
  const sorted = [...usable].sort((a, b) => b.count - a.count);
  const segments = sorted.slice(0, Math.max(1, limit));
  const total = segments.reduce((sum, entry) => sum + entry.count, 0);

  if (total <= 0) return undefined;

  return { total, segments };
};

export interface IShareModel {
  /** The denominator: every successful contract transaction, chain-wide. */
  total: number;
  segments: IContractShare[];
  /** What the drawn segments leave of the total: every other contract. */
  other: number;
}

/**
 * The share figures, divided by ALL contract activity rather than by the
 * segments' own sum. A share against the sum of the five busiest read as a
 * market share it never was.
 *
 * The denominator is clamped up to the segment sum: the two figures come from
 * different endpoints read moments apart, and a denominator that lags below
 * its own parts would draw a bar wider than itself and shares above 100%.
 *
 * Undefined when the denominator did not arrive, so the shares are left out
 * rather than silently recomputed against the wrong base.
 */
export const shareModel = (
  top: ITopContracts | undefined,
  allSuccessful: number | undefined,
): IShareModel | undefined => {
  if (!top) return undefined;
  if (
    typeof allSuccessful !== 'number' ||
    !Number.isFinite(allSuccessful) ||
    allSuccessful <= 0
  ) {
    return undefined;
  }

  const total = Math.max(allSuccessful, top.total);
  return { total, segments: top.segments, other: total - top.total };
};

/** Cycles the distinct hues; the caller keeps its muted colour for the Other
 *  remainder outside this cycle. */
export const segmentColor = (
  index: number,
  palette: readonly string[],
): string => palette[index % palette.length];

/**
 * The share bar's accessible label: every drawn segment with its share, then
 * the Other remainder when there is one, as one string. Names pass
 * safeContractName with the full address as fallback, the same rule the legend
 * draws by.
 */
export const shareBarLabel = (
  model: IShareModel | undefined,
  otherLabel: string,
): string =>
  model
    ? [
        ...model.segments.map(
          segment =>
            `${segment.name ? safeContractName(segment.name) || segment.address : segment.address} ${formatShare(segment.count, model.total)}`,
        ),
        // Only when there is a remainder to name. Summary draws the Other
        // segment and its legend entry under the same condition, and a label
        // that announces "Other contracts 0%" describes a band nobody sees.
        // Reached whenever the segments are the whole chain: a network with
        // five or fewer contracts leaves the denominator equal to their sum.
        ...(model.other > 0
          ? [`${otherLabel} ${formatShare(model.other, model.total)}`]
          : []),
      ].join(', ')
    : '';
