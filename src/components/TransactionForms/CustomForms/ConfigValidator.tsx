import { PropsWithChildren } from 'react';
import { useContract } from '@/contexts/contract';
import { KLV_PRECISION, PERCENTAGE_PRECISION } from '@/utils/globalVariables';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { FormBody, FormSection } from '../styles';
import { parseURIs, percentageProps } from './utils';
import { validatorTooltips as tooltip } from './utils/tooltips';
import { URIsSection } from './CreateAsset/URIsSection';

type FormData = {
  name: string;
  rewardAddress: string;
  blsPublicKey: string;
  canDelegate: boolean;
  commission: number;
  maxDelegationAmount: number;
  logo: string;
  uris: {
    [key: string]: string;
  };
};

const ConfigValidator: React.FC<PropsWithChildren<IContractProps>> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit } = useFormContext<FormData>();
  const {} = useContract();

  const onSubmit = async (data: FormData) => {
    parseURIs(data);
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput name="name" title="Validator Name" span={2} />
        <FormInput name="blsPublicKey" title="BLS Public Key" required />
        <FormInput
          name="rewardAddress"
          title="Reward Address"
          tooltip={tooltip.rewardAddress}
        />
        <FormInput
          name="canDelegate"
          title="Can Delegate"
          type="checkbox"
          toggleOptions={['No', 'Yes']}
          tooltip={tooltip.canDelegate}
        />
        <FormInput
          name="commission"
          title="Commission"
          type="number"
          {...percentageProps}
          tooltip={tooltip.commission}
          precision={PERCENTAGE_PRECISION}
        />
        <FormInput
          name="maxDelegationAmount"
          title="Max Delegation Amount"
          type="number"
          tooltip={tooltip.maxDelegationAmount}
          precision={KLV_PRECISION}
        />
        <FormInput name="logo" title="Logo" tooltip={tooltip.logo} />
      </FormSection>
      <URIsSection tooltip={tooltip.URIs} />
    </FormBody>
  );
};

export default ConfigValidator;
