import Skeleton from '@/components/Skeleton';
import React from 'react';
import { SummaryCard, SummarySkeletonRow } from './styles';

interface ISummaryLoadingProps {
  /** Names the card for assistive tech while its content is still unknown. */
  label: string;
  tiles: number;
  /** Strips that end in a distribution bar reserve its height too. */
  bar?: boolean;
}

/**
 * Loading shape for a summary strip. Shared so the three strips reserve the
 * same space, which is what keeps the content below them from jumping once
 * the real figures arrive.
 */
const SummaryLoading: React.FC<ISummaryLoadingProps> = ({
  label,
  tiles,
  bar,
}) => (
  <SummaryCard aria-label={label}>
    <SummarySkeletonRow>
      {Array.from({ length: tiles }, (_, index) => (
        <Skeleton key={index} width={150} height={56} />
      ))}
    </SummarySkeletonRow>
    {bar && (
      <Skeleton
        width="100%"
        height={8}
        containerCustomStyles={{ marginTop: 16 }}
      />
    )}
  </SummaryCard>
);

export default SummaryLoading;
