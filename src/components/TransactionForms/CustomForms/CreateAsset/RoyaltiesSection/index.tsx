import FormInput from '@/components/TransactionForms/FormInput';
import {
  FormSection,
  SectionTitle,
} from '@/components/TransactionForms/styles';
import { useExtension } from '@/contexts/extension';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { PropsWithChildren } from 'react';
import { ISectionProps } from '..';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../../../FormInput/styles';
import { percentageProps } from '../../utils';
import { assetsTooltip as tooltip } from '../../utils/tooltips';
import { SplitRoyaltiesSection } from '../SplitRoyaltiesSection';
import { TransferPercentageSection } from '../TransferPercentageSection';

export const RoyaltiesSection: React.FC<PropsWithChildren<ISectionProps>> = (
  props
) => {
  const { isFungible } = props;
  const { walletAddress } = useExtension();
  let precision = 8;
  if (props?.precision !== undefined) {
    precision = props.precision;
  }

  return (
    <FormSection>
      <SectionTitle>
        <span>Royalties</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.royalties.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>
      <FormInput
        paddingTop={2}
        name="royalties.address"
        title="Address"
        span={2}
        tooltip={tooltip.royalties.address}
        dynamicInitialValue={walletAddress}
        required
      />
      {!isFungible && (
        <FormInput
          name="royalties.transferFixed"
          title="Transfer Fixed"
          type="number"
          precision={KLV_PRECISION}
          tooltip={tooltip.royalties.transferFixed}
        />
      )}
      {!isFungible && (
        <FormInput
          name="royalties.marketPercentage"
          title="Market Percentage"
          type="number"
          {...percentageProps}
          tooltip={tooltip.royalties.marketPercentage}
        />
      )}
      {!isFungible && (
        <FormInput
          name="royalties.marketFixed"
          title="Market Fixed"
          type="number"
          precision={KLV_PRECISION}
          tooltip={tooltip.royalties.marketFixed}
        />
      )}
      <FormInput
        name="royalties.itoPercentage"
        title="ITO Percentage"
        type="number"
        {...percentageProps}
        tooltip={tooltip.royalties.itoPercentage}
      />
      <FormInput
        name="royalties.itoFixed"
        title="ITO Fixed"
        type="number"
        precision={KLV_PRECISION}
        tooltip={tooltip.royalties.itoFixed}
      />

      {isFungible && <TransferPercentageSection precision={precision} />}
      <SplitRoyaltiesSection {...props} />
    </FormSection>
  );
};
