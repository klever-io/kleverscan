import FormInput from '@/components/TransactionForms/FormInput';
import {
  FormSection,
  SectionTitle,
} from '@/components/TransactionForms/styles';
import { PropsWithChildren, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../../../FormInput/styles';
import { percentageProps } from '../../utils';
import { assetsTooltip as tooltip } from '../../utils/tooltips';

interface IStakingSectionProps {
  assetTrigger?: boolean;
  isFPR?: boolean;
}

export const StakingSection: React.FC<PropsWithChildren<
  IStakingSectionProps
>> = ({ assetTrigger = false, isFPR: isFPRProp }) => {
  const { watch, setValue } = useFormContext();
  const isFPR = watch('staking.interestType');

  useEffect(() => {
    if (assetTrigger) {
      setValue('staking.interestType', Number(isFPRProp));
    }
  }, [assetTrigger, isFPRProp, setValue]);

  return (
    <FormSection inner>
      <SectionTitle>
        <span>Staking</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.staking.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>
      {!assetTrigger && (
        <FormInput
          name="staking.interestType"
          title="Interest Type"
          type="checkbox"
          toggleOptions={['APR', 'FPR']}
        />
      )}
      {!isFPR && !isFPRProp && (
        <FormInput
          name="staking.apr"
          title="APR"
          type="number"
          {...percentageProps}
          max={undefined}
          tooltip={tooltip.staking.apr}
        />
      )}
      <FormInput
        name="staking.minEpochsToClaim"
        title="Minimum Epochs to Claim"
        type="number"
        precision={0}
        tooltip={tooltip.staking.minEpochsToClaim}
      />
      <FormInput
        name="staking.minEpochsToUnstake"
        title="Minimum Epochs to Unstake"
        type="number"
        precision={0}
        tooltip={tooltip.staking.minEpochsToUnstake}
      />
      <FormInput
        name="staking.minEpochsToWithdraw"
        title="Minimum Epochs to Withdraw"
        type="number"
        precision={0}
        tooltip={tooltip.staking.minEpochsToWithdraw}
      />
    </FormSection>
  );
};
