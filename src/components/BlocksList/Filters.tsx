import DateFilter from '@/components/DateFilter';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import React from 'react';
import AutoUpdate from './AutoUpdate';

interface IBlocksFiltersProps {
  interval: number;
  onIntervalChange: (interval: number) => void;
}

/**
 * The controls above the list: a date range and the auto update switch.
 *
 * `DateFilter` writes `startdate` and `enddate` as epoch milliseconds and
 * resets the page, which is exactly what `block/list` documents and what
 * `blockListCall` forwards. The shared `FilterContainer` spans both columns of
 * the row below the tablet width, so the two stack there rather than squeezing
 * into half of a 390px screen.
 */
const BlocksFilters: React.FC<IBlocksFiltersProps> = ({
  interval,
  onIntervalChange,
}) => (
  <FilterContainer>
    <DateFilter />
    <AutoUpdate interval={interval} onChange={onIntervalChange} />
  </FilterContainer>
);

export default BlocksFilters;
