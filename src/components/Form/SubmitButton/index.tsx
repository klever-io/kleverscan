import { PropsWithChildren } from 'react';
import Tooltip from '@/components/Tooltip';
import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { useExtension } from '@/contexts/extension';
import { FlexSpan } from '@/styles/common';
import {
  ButtonContainer,
  FeeContainer,
  HiddenSubmitButton,
  SubmitContainer,
} from '../styles';

const SubmitButton: React.FC<PropsWithChildren> = () => {
  const { txLoading, submitForms } = useContract();
  const { isMultiContract, processFeesMsgs, kdaFeePoolIsFetching } =
    useMulticontract();

  const { extensionInstalled, connectExtension } = useExtension();

  const { totalFeesMsg, totalKappFeesMsg, totalBandwidthFeesMsg } =
    processFeesMsgs();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (extensionInstalled) {
      await connectExtension();
    }
    submitForms();
  };

  return !isMultiContract ? (
    <SubmitContainer>
      <ButtonContainer
        submit={!txLoading}
        type="submit"
        disabled={txLoading}
        onClick={handleSubmit}
      >
        Create Transaction
      </ButtonContainer>
      <FeeContainer>
        <FlexSpan>
          <span>Estimated Fees: </span>
          {kdaFeePoolIsFetching ? (
            'Calculating conversion...'
          ) : (
            <>
              <span>{totalFeesMsg}</span>
              <Tooltip
                msg={`${totalKappFeesMsg} (KApp Fee) + ${totalBandwidthFeesMsg} (Bandwidth Fee)`}
              />
            </>
          )}
        </FlexSpan>
      </FeeContainer>
    </SubmitContainer>
  ) : (
    <HiddenSubmitButton type="submit" disabled={false} />
  );
};

export default SubmitButton;
