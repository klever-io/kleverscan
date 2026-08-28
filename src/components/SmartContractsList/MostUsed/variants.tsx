import { NUMBER_LOCALE, formatShare } from '@/components/DataList/format';
import { ShareTrack } from '@/components/DataList/styles';
import { IContractShare } from '@/components/SmartContractsList/summaryFigures';
import { safeContractName } from '@/utils/contractName';
import { parseAddress } from '@/utils/parseValues';
import React from 'react';
import {
  CardAddress,
  CardCount,
  CardCountLabel,
  CardName,
  CardRank,
  CardTopRow,
  ContractCard,
  PodiumRow,
  RankedList,
  RankedRow,
  RowBar,
  RowCount,
  RowName,
  RowRank,
} from './styles';

/**
 * The variants of the most-used section, kept in one file so that choosing one
 * means deleting the others and nothing else.
 *
 * TEMPORARY. Only the chosen variant survives; this file and the `?carousel=`
 * switch that reaches it must not reach the pull request.
 */

export type MostUsedVariant = 'cards' | 'bars' | 'ranked' | 'featured';

export const VARIANTS: MostUsedVariant[] = [
  'cards',
  'bars',
  'ranked',
  'featured',
];

export const isVariant = (value: unknown): value is MostUsedVariant =>
  typeof value === 'string' && VARIANTS.includes(value as MostUsedVariant);

interface IVariantProps {
  segments: IContractShare[];
  total: number;
  /** Already translated, e.g. "Transactions". */
  countLabel: string;
}

interface IRankedProps extends IVariantProps {
  /** Rank of the first row, so a continued list does not restart at 1. */
  startRank?: number;
  /** The count the bars are scaled against, so a continued list keeps the
   *  scale of the group it continues. */
  scaleTo?: number;
}

/** A contract's display name, or its shortened address when it has none or
 *  when the name it carries is not safe to draw. */
const label = (segment: IContractShare, chars = 14): string => {
  const shown = segment.name ? safeContractName(segment.name) : '';
  return shown || parseAddress(segment.address, chars);
};

const Card: React.FC<{
  segment: IContractShare;
  rank: number;
  countLabel: string;
  share?: string;
}> = ({ segment, rank, countLabel, share }) => (
  <ContractCard
    href={`/smart-contract/${segment.address}`}
    title={`${label(segment, 60)} · ${segment.address}`}
  >
    <CardTopRow>
      <CardRank>{rank}</CardRank>
      <CardCountLabel>{share ?? countLabel}</CardCountLabel>
    </CardTopRow>
    <div>
      <CardName>{label(segment)}</CardName>
      <CardAddress>{parseAddress(segment.address, 10)}</CardAddress>
    </div>
    <CardCount>{segment.count.toLocaleString(NUMBER_LOCALE)}</CardCount>
  </ContractCard>
);

/** A: the card as it was, with the theme and typography faults fixed. */
export const CardsVariant: React.FC<IVariantProps> = ({
  segments,
  countLabel,
}) => (
  <>
    {segments.map((segment, index) => (
      <Card
        key={segment.address}
        segment={segment}
        rank={index + 1}
        countLabel={countLabel}
      />
    ))}
  </>
);

/** B: the same card, with each contract's share of the ten shown instead of
 *  the bare word "transactions". */
export const BarsVariant: React.FC<IVariantProps> = ({
  segments,
  total,
  countLabel,
}) => (
  <>
    {segments.map((segment, index) => (
      <Card
        key={segment.address}
        segment={segment}
        rank={index + 1}
        countLabel={countLabel}
        share={formatShare(segment.count, total)}
      />
    ))}
  </>
);

/** C: every contract in one screen, no horizontal scrolling. */
export const RankedVariant: React.FC<IRankedProps> = ({
  segments,
  total,
  startRank = 1,
  scaleTo,
}) => {
  const leader = scaleTo ?? segments[0]?.count ?? 0;
  return (
    <RankedList>
      {segments.map((segment, index) => (
        <li key={segment.address}>
          <RankedRow
            href={`/smart-contract/${segment.address}`}
            title={`${label(segment, 60)} · ${segment.address}`}
          >
            <RowRank>{startRank + index}</RowRank>
            <RowName>{label(segment, 20)}</RowName>
            {/* Scaled against the leader, not the sum: against the sum the
                tenth contract's bar is a two-pixel stub that says nothing. */}
            <ShareTrack $fluid>
              <RowBar
                $delay={index * 40}
                style={{
                  width:
                    leader > 0 ? `${(segment.count / leader) * 100}%` : '0%',
                }}
              />
            </ShareTrack>
            <RowCount>
              {segment.count.toLocaleString(NUMBER_LOCALE)}
              {total > 0 ? ` · ${formatShare(segment.count, total)}` : ''}
            </RowCount>
          </RankedRow>
        </li>
      ))}
    </RankedList>
  );
};

/** D: the podium as cards, the rest as rows underneath. */
export const FeaturedVariant: React.FC<IVariantProps> = props => {
  const { segments } = props;
  return (
    <>
      <PodiumRow>
        {segments.slice(0, 3).map((segment, index) => (
          <Card
            key={segment.address}
            segment={segment}
            rank={index + 1}
            countLabel={props.countLabel}
            share={formatShare(segment.count, props.total)}
          />
        ))}
      </PodiumRow>
      <RankedVariant
        {...props}
        segments={segments.slice(3)}
        startRank={4}
        scaleTo={segments[0]?.count}
      />
    </>
  );
};
