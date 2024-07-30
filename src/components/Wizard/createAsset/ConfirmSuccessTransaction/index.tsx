import { WizardTxSuccess } from '@/assets/icons';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import {
  HashContainer,
  WizardRightArrowSVG,
  WizardTxSuccessComponent,
} from '../styles';

export const ConfirmSuccessTransaction: React.FC<
  PropsWithChildren<{ txHash: string }>
> = ({ txHash }) => {
  return (
    <WizardTxSuccessComponent>
      <WizardTxSuccess />
      <span>Transaction Sent</span>
      <span>When confirmed on the blockchain, your token will be created.</span>
      <span>The token contract is generated after this confirmation.</span>
      <Link href={`/transaction/${txHash}`} target="blank" rel="noreferrer">
        <HashContainer>
          <div>
            <span>Transaction details</span>
            <span>
              Transaction Hash:
              {txHash}
            </span>
          </div>
          <WizardRightArrowSVG />
        </HashContainer>
      </Link>
    </WizardTxSuccessComponent>
  );
};
