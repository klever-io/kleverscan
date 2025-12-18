import { parseRoles } from '@/components/Wizard/utils';
import { getNetwork } from '@/utils/networkFunctions';
import { isKVMAvailable } from '@/utils/kvm';
import { ICreateAsset } from '@klever/sdk-web';
import React, { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '..';
import FormInput from '../../FormInput';
import { FormBody, FormSection } from '../../styles';
import {
  parseProperties,
  parseSplitRoyalties,
  parseStaking,
  parseStringToNumberSupply,
  parseTickerName,
  parseURIs,
} from '../utils';
import { BasicInfoSection } from './BasicInfoSection';
import { PropertiesSection } from './PropertiesSection';
import { RolesSection } from './RolesSection';
import { RoyaltiesSection } from './RoyaltiesSection';
import { StakingSection } from './StakingSection';
import { URIsSection } from './URIsSection';

export interface ISectionProps {
  isNFT?: boolean;
  isFungible?: boolean;
  isSFT?: boolean;
  precision?: number;
}

export const parseCreateAsset = (data: ICreateAsset) => {
  const dataCopy = JSON.parse(JSON.stringify(data));
  parseTickerName(dataCopy);
  parseSplitRoyalties(dataCopy);
  parseURIs(dataCopy);
  parseStaking(dataCopy);
  parseProperties(dataCopy);
  parseRoles(dataCopy);
  parseStringToNumberSupply(dataCopy);
  return dataCopy;
};

export const CreateAsset: React.FC<PropsWithChildren<IContractProps>> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit, watch } = useFormContext<ICreateAsset>();

  const type = watch('type');

  const network = getNetwork();

  const assetTypes = [
    {
      label: 'Fungible',
      value: 0,
    },
    {
      label: 'Non Fungible',
      value: 1,
    },
    ...(isKVMAvailable(network)
      ? [
          {
            label: 'Semi Fungible',
            value: 2,
          },
        ]
      : []),
  ];

  const isFungible = type === 0;
  const isNFT = type === 1;
  const isSFT = type === 2;

  const precision = watch('precision');

  const onSubmit = async (data: ICreateAsset) => {
    const dataCopy = parseCreateAsset(data);
    await handleFormSubmit(dataCopy);
  };

  const sectionProps = { isNFT, isFungible, isSFT, precision };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="type"
          title="Asset Type"
          type="dropdown"
          options={assetTypes}
          defaultValue={0}
          required={true}
        />
      </FormSection>
      <BasicInfoSection {...sectionProps} />
      <URIsSection />
      <RoyaltiesSection {...sectionProps} />
      {isFungible && <StakingSection />}
      <RolesSection />
      <PropertiesSection {...sectionProps} />
    </FormBody>
  );
};
