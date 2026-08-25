import { IAsset, IBalance } from '@/types';
import { VOID_ADDRESS } from '@/utils/globalVariables';

export type MedalTier = 'gold' | 'silver' | 'bronze';

const MEDAL_TIERS: MedalTier[] = ['gold', 'silver', 'bronze'];

export const isVoidAddress = (address: string): boolean =>
  address === VOID_ADDRESS;

export { formatShare } from '@/components/DataList/format';

export type ConcentrationTone = 'high' | 'moderate' | 'low';

export interface IConcentrationLevel {
  label: string;
  tone: ConcentrationTone;
}

/**
 * Verdict on the top-10 share of the net supply. Wording stays descriptive
 * ("Very high"), never advisory ("risky"): exchange cold wallets are not
 * detectable here and would inflate any stronger claim.
 *
 * Returns a translation key rather than a sentence: this module is not a
 * component and cannot reach the translator, so the call site resolves it.
 */
export const concentrationLevel = (top10Share: number): IConcentrationLevel => {
  if (top10Share >= 0.7)
    return { label: 'assets:Holders.Concentration.VeryHigh', tone: 'high' };
  if (top10Share >= 0.4)
    return { label: 'assets:Holders.Concentration.High', tone: 'high' };
  if (top10Share >= 0.15)
    return { label: 'assets:Holders.Concentration.Moderate', tone: 'moderate' };
  return { label: 'assets:Holders.Concentration.Low', tone: 'low' };
};

export type DistributionSegmentKey =
  | 'largest'
  | 'ranks2to10'
  | 'ranks11to50'
  | 'rest'
  | 'burned';

export interface IDistributionSegment {
  key: DistributionSegmentKey;
  label: string;
  amount: number;
  share: number;
}

export interface IHoldersSummary {
  totalHolders?: number;
  grossSupply: number;
  netSupply: number;
  voidAmount?: number;
  /** Basis for the concentration verdict only; never shown as a number. */
  top10ShareNet?: number;
  top10Amount: number;
  /** Combined balance of every non-void holder in the top 50. */
  top50Amount: number;
  medalRanks: number[];
  segments: IDistributionSegment[];
}

const sumTotal = (holders: IBalance[]): number =>
  holders.reduce((acc, holder) => acc + holder.totalBalance, 0);

/**
 * Amount parked on the burn address. Newer API builds report it directly;
 * otherwise the void row in the top-50 fetch is the only source.
 */
const resolveVoidAmount = (
  asset: Pick<IAsset, 'voidedSupply'>,
  topHolders: IBalance[],
): number | undefined => {
  if (typeof asset.voidedSupply === 'number') return asset.voidedSupply;
  return topHolders.find(holder => isVoidAddress(holder.address))?.totalBalance;
};

/** Supply excluding the burn address, falling back as the API allows. */
const resolveNetSupply = (
  asset: Pick<IAsset, 'netCirculatingSupply'>,
  grossSupply: number,
  voidAmount?: number,
): number => {
  if (typeof asset.netCirculatingSupply === 'number') {
    return asset.netCirculatingSupply;
  }
  if (voidAmount === undefined) return grossSupply;
  return Math.max(grossSupply - voidAmount, 0);
};

/**
 * Distribution of the whole supply: the largest holder, the rest of the top
 * ten, the rest of the top fifty, everyone the fetch did not reach, and the
 * burned remainder. Empty buckets are dropped rather than drawn as slivers.
 */
const buildSegments = (
  nonVoid: IBalance[],
  grossSupply: number,
  voidAmount?: number,
): IDistributionSegment[] => {
  const largestHolder = nonVoid[0];
  if (grossSupply <= 0 || !largestHolder) return [];

  const nonVoidTotal = sumTotal(nonVoid);
  const candidates: [DistributionSegmentKey, string, number][] = [
    ['largest', 'assets:Holders.Segments.Largest', largestHolder.totalBalance],
    [
      'ranks2to10',
      'assets:Holders.Segments.Ranks2to10',
      sumTotal(nonVoid.slice(1, 10)),
    ],
    [
      'ranks11to50',
      'assets:Holders.Segments.Ranks11to50',
      sumTotal(nonVoid.slice(10)),
    ],
    [
      'rest',
      'assets:Holders.Segments.Rest',
      Math.max(grossSupply - nonVoidTotal - (voidAmount ?? 0), 0),
    ],
    ['burned', 'assets:Holders.Segments.Burned', voidAmount ?? 0],
  ];

  return candidates
    .filter(([, , amount]) => amount > 0)
    .map(([key, label, amount]) => ({
      key,
      label,
      amount,
      share: Math.min(amount / grossSupply, 1),
    }));
};

/**
 * Summary metrics from one top-50 fetch. Every displayed share measures
 * against the gross circulating supply, the same denominator as the table
 * rows, so the same wallet never shows two different percentages on one
 * screen; burned supply appears as its own distribution segment instead.
 * Only the concentration verdict (a label, never a number) is judged against
 * the net supply, because concentration is about what still exists.
 */
export const computeHoldersSummary = (
  asset: Pick<
    IAsset,
    'circulatingSupply' | 'voidedSupply' | 'netCirculatingSupply'
  >,
  topHolders: IBalance[],
  totalRecords?: number,
): IHoldersSummary => {
  const grossSupply = asset.circulatingSupply;
  const voidAmount = resolveVoidAmount(asset, topHolders);
  const netSupply = resolveNetSupply(asset, grossSupply, voidAmount);

  const nonVoid = topHolders.filter(
    holder => !isVoidAddress(holder.address) && holder.totalBalance > 0,
  );
  const top10Amount = sumTotal(nonVoid.slice(0, 10));
  const nonVoidTotal = sumTotal(nonVoid);
  const hasNet = netSupply > 0;

  return {
    totalHolders: totalRecords,
    grossSupply,
    netSupply,
    voidAmount,
    top10Amount,
    top50Amount: nonVoidTotal,
    top10ShareNet:
      hasNet && nonVoid.length > 0
        ? Math.min(top10Amount / netSupply, 1)
        : undefined,
    medalRanks: nonVoid.slice(0, 3).map(holder => holder.rank),
    segments: buildSegments(nonVoid, grossSupply, voidAmount),
  };
};

/**
 * Medal rules: only under the Total Balance sort, never on the void row, and
 * assigned to the top 3 real holders (so when void is rank 1, medals shift to
 * ranks 2, 3 and 4). Without top-50 data the plain top 3 gets them.
 */
export const getMedalTier = (
  rank: number,
  isVoidRow: boolean,
  sortedByTotal: boolean,
  medalRanks: number[],
): MedalTier | undefined => {
  if (!sortedByTotal || isVoidRow) return undefined;
  if (medalRanks.length > 0) {
    const index = medalRanks.indexOf(rank);
    return index >= 0 ? MEDAL_TIERS[index] : undefined;
  }
  return rank >= 1 && rank <= 3 ? MEDAL_TIERS[rank - 1] : undefined;
};

export interface IRowBarModel {
  /** 0..1 fill of the track: the holder's share of the total supply. */
  fillRatio: number;
  /** 0..1 share of the fill that is liquid (sellable right now). */
  liquidFraction: number;
}

/**
 * Per-row bar model. The track is the whole supply, so the fill matches the
 * percentage printed above it: a bar that looks half full means half the
 * supply. Scaling to the largest holder instead would make the top row look
 * full at any share, contradicting its own number.
 */
export const buildRowBar = (
  holder: Pick<IBalance, 'balance' | 'frozenBalance' | 'totalBalance'>,
  grossSupply: number,
): IRowBarModel | undefined => {
  if (!Number.isFinite(grossSupply) || grossSupply <= 0) return undefined;
  if (!Number.isFinite(holder.totalBalance) || holder.totalBalance <= 0) {
    return undefined;
  }
  const share = holder.totalBalance / grossSupply;
  return {
    fillRatio: Math.min(share, 1),
    liquidFraction:
      holder.balance > 0
        ? Math.min(holder.balance / holder.totalBalance, 1)
        : 0,
  };
};
