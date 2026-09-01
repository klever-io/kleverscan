import Table, { ITable } from '@/components/Table';
import { useRouter } from 'next/router';
import React from 'react';
import { rowLayoutMinWidth, showsInOut } from './columns';
import { TransactionsTableWrapper } from './styles';

/**
 * The transactions list, wherever it appears: the page itself, the account
 * tab, the asset tab and the two nonce views.
 *
 * It exists to hand one number to two places that cannot see each other. The
 * row only fits from `rowLayoutMinWidth` up, and below it the list renders as
 * cards; JS decides that (`cardBreakpoint`) and CSS lays it out (the wrapper's
 * media queries). Passed separately at five call sites, one of them would
 * eventually carry a different number from the other, and the symptom is a
 * loading state shaped like a table above rows shaped like cards.
 */
const TransactionsTable = <TCard,>(
  props: ITable<TCard>,
): React.ReactElement => {
  const router = useRouter();
  const rowMinWidth = rowLayoutMinWidth(showsInOut(router));

  return (
    <TransactionsTableWrapper $rowLayoutMin={rowMinWidth}>
      <Table {...props} cardBreakpoint={rowMinWidth} />
    </TransactionsTableWrapper>
  );
};

export default TransactionsTable;
