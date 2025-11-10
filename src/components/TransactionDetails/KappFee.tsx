import React from 'react';
import { KappFeeSpan, KappFeeFailedTx } from '@/views/transactions/detail';
import { toLocaleFixed } from '@/utils/formatFunctions';

interface Props {
  status?: string;
  kAppFee?: number;
  transactionKAppFee?: number;
}

const KappFee: React.FC<Props> = ({ status, kAppFee }) => {
  if (status === 'fail') {
    return (
      <KappFeeSpan>
        <KappFeeFailedTx>
          {toLocaleFixed((kAppFee ?? 0) / 1000000, 6)}
        </KappFeeFailedTx>
        <span>Value not charged on failed transactions</span>
      </KappFeeSpan>
    );
  }

  return (
    <span>
      <p>{toLocaleFixed((kAppFee ?? 0) / 1000000, 6)}</p>
    </span>
  );
};

export default KappFee;
