import Tooltip from '@/components/Tooltip';
import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { FlexSpan } from '@/styles/common';
import {
  ButtonContainer,
  FeeContainer,
  HiddenSubmitButton,
  SubmitContainer,
} from '../styles';

const SubmitButton: React.FC = () => {
  const { txLoading, submitForms } = useContract();
  const { isMultiContract, processFeesMsgs, kdaFeePoolIsFetching } =
    useMulticontract();

  const { totalFeesMsg, totalKappFeesMsg, totalBandwidthFeesMsg } =
    processFeesMsgs();

  return !isMultiContract ? (
    <SubmitContainer>
      <ButtonContainer
        submit={!txLoading}
        type="submit"
        disabled={txLoading}
        onClick={submitForms}
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
