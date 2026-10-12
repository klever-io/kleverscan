import { PropsWithChildren, useEffect, useRef } from 'react';
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

  const {
    extensionInstalled,
    connectExtension,
    walletAddress,
    extensionLoading,
  } = useExtension();

  const { totalFeesMsg, totalKappFeesMsg, totalBandwidthFeesMsg } =
    processFeesMsgs();

  // The click handler's submitForms still sees the address from before
  // connect() resolves. Hold the submit until a later render has the address.
  const awaitingConnect = useRef(false);

  useEffect(() => {
    if (!awaitingConnect.current || extensionLoading) return;
    awaitingConnect.current = false;
    if (walletAddress !== '') {
      submitForms();
    }
  }, [extensionLoading, walletAddress, submitForms]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (extensionInstalled && walletAddress === '') {
      awaitingConnect.current = true;
      await connectExtension();
      return;
    }
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
