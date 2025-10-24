import FormInput from '@/components/TransactionForms/FormInput';
import {
  FormSection,
  SectionTitle,
} from '@/components/TransactionForms/styles';
import { getNetwork } from '@/utils/networkFunctions';
import { isKVMAvailable } from '@/utils/kvm';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../../../FormInput/styles';
import { ButtonContainer } from '../../../styles';
import { removeWrapper } from '../../utils';
import { assetsTooltip as tooltip } from '../../utils/tooltips';

export const RolesSection: React.FC<PropsWithChildren> = () => {
  const { control, getValues } = useFormContext();
  const router = useRouter();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roles',
  });

  const network = getNetwork();

  return (
    <FormSection>
      <SectionTitle>
        <span>Roles</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.roles.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>
      {fields.map((field, index) => (
        <FormSection key={field.id} inner>
          <SectionTitle>
            <HiTrash
              onClick={() =>
                removeWrapper({ index, remove, getValues, router })
              }
            />
            Role {index + 1}
          </SectionTitle>
          <FormInput
            name={`roles[${index}].address`}
            title={`Address`}
            span={2}
            tooltip={tooltip.roles.address}
          />
          <FormInput
            name={`roles[${index}].hasRoleMint`}
            title={`Has Role Mint`}
            type="checkbox"
            toggleOptions={['No', 'Yes']}
            tooltip={tooltip.roles.hasRoleMint}
          />
          <FormInput
            name={`roles[${index}].hasRoleSetITOPrices`}
            title={`Has Role Set ITO Prices`}
            type="checkbox"
            toggleOptions={['No', 'Yes']}
            tooltip={tooltip.roles.hasRoleSetITOPrices}
          />
          <FormInput
            name={`role.hasRoleDeposit`}
            title={`Has Role Deposit`}
            type="checkbox"
            toggleOptions={['No', 'Yes']}
            tooltip={tooltip.roles.hasRoleDeposit}
          />
          {isKVMAvailable(network) && (
            <FormInput
              name={`role.hasRoleTransfer`}
              title={`Has Role Transfer`}
              type="checkbox"
              toggleOptions={['No', 'Yes']}
              tooltip={tooltip.roles.hasRoleTransfer}
            />
          )}
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        Add Role
      </ButtonContainer>
    </FormSection>
  );
};
