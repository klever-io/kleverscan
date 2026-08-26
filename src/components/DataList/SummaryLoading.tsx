import Skeleton from '@/components/Skeleton';
import React from 'react';
import { SummaryCard, SummarySkeletonRow } from './styles';

interface ISummaryLoadingProps {
  /** Names the card for assistive tech while its content is still unknown. */
  label: string;
  tiles: number;
  /** Strips that end in a distribution bar reserve its height too. */
  bar?: boolean;
  /** Lets a page add its own spacing without the loaded card and this one
   * drifting apart, which would jump the page once the figures arrive. */
  className?: string;
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
  className,
}) => (
  <SummaryCard aria-label={label} className={className}>
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
