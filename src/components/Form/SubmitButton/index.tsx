import Tooltip from '@/components/Tooltip';
import { useContract } from '@/contexts/contract';
import { useFees } from '@/contexts/contract/fees';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { BASE_TX_SIZE, KLV_PRECISION } from '@/utils/globalVariables';
import {
  ButtonContainer,
  FeeContainer,
  HiddenSubmitButton,
  SubmitContainer,
} from '../styles';

const SubmitButton: React.FC = () => {
  const { txLoading, submitForms } = useContract();
  const { metadata } = useMulticontract();
  const { isMultiContract, selectedContractType } = useMulticontract();

  const { getKappFee, bandwidthFeeMultiplier } = useFees();
  const kappFee = getKappFee(selectedContractType);

  const metadataSize = metadata?.length || 0;

  const bandwidthFee = (BASE_TX_SIZE + metadataSize) * bandwidthFeeMultiplier;
  const totalFee = kappFee + bandwidthFee;

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
        <span>Estimated Fees: {totalFee.toFixed(KLV_PRECISION)} KLV</span>
        <Tooltip
          msg={`${kappFee.toFixed(
            KLV_PRECISION,
          )} KLV (KApp Fee) + ${bandwidthFee.toFixed(
            KLV_PRECISION,
          )} KLV (Bandwidth Fee)`}
        />
      </FeeContainer>
    </SubmitContainer>
  ) : (
    <HiddenSubmitButton type="submit" disabled={false} />
  );
};

export default SubmitButton;
