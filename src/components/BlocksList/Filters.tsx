import DateFilter from '@/components/DateFilter';
import { CompactFilterBar } from '@/components/DataList/styles';
import React from 'react';

/**
 * The date range above the list. `DateFilter` writes `startdate` and `enddate`
 * as epoch milliseconds and resets the page, which is exactly what
 * `block/list` documents and what `blockListCall` forwards.
 */
const BlocksFilters: React.FC = () => (
  <CompactFilterBar>
    <DateFilter />
  </CompactFilterBar>
);

export default BlocksFilters;
