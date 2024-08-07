import { useContract } from '@/contexts/contract';
import { useExtension } from '@/contexts/extension';
import { KLV_PRECISION } from '@/utils/globalVariables';
import React, { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { FormBody, FormSection } from '../styles';
import { URIsSection } from './CreateAsset/URIsSection';
import { parseURIs, percentageProps } from './utils';
import { validatorTooltips as tooltip } from './utils/tooltips';

type FormData = {
  name: string;
  address: string;
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

const CreateValidator: React.FC<PropsWithChildren<IContractProps>> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { walletAddress } = useExtension();
  const { handleSubmit } = useFormContext<FormData>();
  const {} = useContract();

  const onSubmit = async (data: FormData) => {
    parseURIs(data);
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput name="name" title="Validator Name" required />
        <FormInput
          name="ownerAddress"
          title="Owner Address"
          dynamicInitialValue={walletAddress}
          required
        />
        <FormInput name="blsPublicKey" title="BLS Public Key" required />
        <FormInput
          name="rewardAddress"
          title="Reward Address"
          tooltip={tooltip.rewardAddress}
          required
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

export default CreateValidator;
