import FormInput from '@/components/TransactionForms/FormInput';
import {
  FormSection,
  SectionTitle,
} from '@/components/TransactionForms/styles';
import { PropsWithChildren } from 'react';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../../../FormInput/styles';
import { assetsTooltip as tooltip } from '../../utils/tooltips';
import { ISectionProps } from '../index';

export const PropertiesSection: React.FC<PropsWithChildren<ISectionProps>> = ({
  isNFT,
  isSFT,
}) => {
  const requireMint = isNFT || isSFT;
  return (
    <FormSection>
      <SectionTitle>
        <span>Properties</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.properties.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>

      <FormInput
        name="properties.canFreeze"
        title="Freeze"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canFreeze}
      />
      <FormInput
        name="properties.canWipe"
        title="Wipe"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={false}
        tooltip={tooltip.properties.canWipe}
      />
      <FormInput
        name="properties.canPause"
        title="Pause"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canPause}
      />
      <FormInput
        name="properties.canMint"
        title="Mint"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={true}
        tooltip={
          tooltip.properties.canMint +
          (requireMint ? tooltip.properties.canMintRequired : '')
        }
        disabled={requireMint}
      />
      <FormInput
        name="properties.canBurn"
        title="Burn"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canBurn}
      />
      <FormInput
        name="properties.canChangeOwner"
        title="Change Owner"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canChangeOwner}
      />
      <FormInput
        name="properties.canAddRoles"
        title="Add Roles"
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        dynamicInitialValue={true}
        tooltip={tooltip.properties.canAddRoles}
      />
    </FormSection>
  );
};
