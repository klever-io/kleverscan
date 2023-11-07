import { useMulticontract } from '@/contexts/contract/multicontract';
import { useExtension } from '@/contexts/extension';
import { ICollectionList } from '@/types';
import { assetTriggerTypes } from '@/utils/contracts';
import { useKDASelect } from '@/utils/hooks/contract';
import { deepCopyObject } from '@/utils/objectFunctions';
import { IAssetTrigger } from '@klever/sdk-web';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../FormInput/styles';
import { FormBody, FormSection, SectionTitle } from '../styles';
import { RoyaltiesSection, StakingSection, URIsSection } from './CreateAsset';
import {
  parseKDAFeePool,
  parseSplitRoyalties,
  parseStaking,
  parseURIs,
} from './utils';
import { assetTriggerTooltips as tooltip } from './utils/tooltips';

export interface IMetadataOptions {
  metadata: string;
  setMetadata: (metadata: string) => void;
}

const parseMetadata = (data: any) => {
  if (data.data !== '') {
    delete data.data;
  }
};

const parseAssetTrigger = (data: IAssetTrigger) => {
  parseSplitRoyalties(data);
  parseURIs(data);
  parseStaking(data);
  parseKDAFeePool(data);
  parseMetadata(data);
};

const AssetTrigger: React.FC<IContractProps> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit, watch, reset } = useFormContext<IAssetTrigger>();
  const { walletAddress } = useExtension();
  const triggerType = watch('triggerType');
  const [collection, KDASelect] = useKDASelect({
    assetTriggerType: triggerType,
  });

  const { metadata, setMetadata } = useMulticontract();

  const metadataProps = {
    metadata,
    setMetadata,
  };

  const onSubmit = async (data: IAssetTrigger) => {
    const dataDeepCopy = deepCopyObject(data);
    parseAssetTrigger(dataDeepCopy);
    await handleFormSubmit(dataDeepCopy);
  };

  useEffect(() => {
    reset({
      triggerType,
    });
  }, [triggerType]);

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="triggerType"
          title="Asset Trigger Type"
          type="dropdown"
          zIndex={4}
          options={assetTriggerTypes}
          required
        />
      </FormSection>
      <KDASelect required />
      {triggerType !== undefined &&
        collection &&
        getAssetTriggerForm(
          triggerType,
          collection,
          walletAddress,
          metadataProps,
        )}
    </FormBody>
  );
};

const getAssetTriggerForm = (
  triggerType: number,
  collection: ICollectionList,
  walletAddress: string,
  { metadata, setMetadata }: IMetadataOptions,
) => {
  switch (triggerType) {
    case 0:
      return (
        <FormSection>
          <FormInput
            name="receiver"
            title="Receiver"
            required
            dynamicInitialValue={walletAddress}
            tooltip={tooltip.receiver}
          />
          <FormInput name="amount" title="Amount" type="number" required />
        </FormSection>
      );
    case 1:
      return (
        <FormSection>
          <FormInput name="amount" title="Amount" type="number" required />
        </FormSection>
      );
    case 2:
      return (
        <FormSection>
          <FormInput
            name="receiver"
            title="Receiver"
            required
            dynamicInitialValue={walletAddress}
            tooltip={tooltip.receiver}
          />
          <FormInput name="amount" title="Amount" type="number" required />
        </FormSection>
      );
    case 3:
      return null;
    case 4:
      return null;
    case 5:
      return (
        <FormSection>
          <FormInput
            name="receiver"
            title="Receiver"
            required
            dynamicInitialValue={walletAddress}
            tooltip={tooltip.receiver}
          />
        </FormSection>
      );
    case 6:
      return <AddRoleSection />;
    case 7:
      return (
        <FormSection>
          <FormInput
            name="receiver"
            title="Receiver"
            required
            dynamicInitialValue={walletAddress}
            tooltip={tooltip.receiver}
          />
        </FormSection>
      );
    case 8:
      return (
        <FormSection>
          <FormInput
            name="mime"
            title="Mime"
            tooltip={tooltip.updateMetadata.mime}
          />
          <FormInput
            name="receiver"
            title="NFT Holder Address"
            required
            dynamicInitialValue={walletAddress}
            tooltip={tooltip.receiver}
          />
          <FormInput
            title="Data"
            type="textarea"
            value={metadata}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setMetadata(e.target.value)
            }
            required
            span={2}
            tooltip={tooltip.updateMetadata.data}
          />
        </FormSection>
      );
    case 9:
      return null;
    case 10:
      return (
        <FormSection>
          <FormInput
            name="logo"
            title="Logo"
            tooltip={tooltip.updateLogo.logo}
          />
        </FormSection>
      );
    case 11:
      return <URIsSection />;
    case 12:
      return (
        <FormSection>
          <FormInput
            name="receiver"
            title="Receiver"
            required
            dynamicInitialValue={walletAddress}
            tooltip={tooltip.receiver}
          />
        </FormSection>
      );
    case 13:
      return (
        <StakingSection
          assetTrigger
          isFPR={(collection as any)?.staking?.interestType === 'FPRI'}
        />
      );
    case 14:
      return (
        <RoyaltiesSection
          isNFT={collection.isNFT}
          precision={collection.precision}
        />
      );
    case 15:
      return (
        <FormSection>
          <FormInput
            name="kdaPool.adminAddress"
            title="Admin Address"
            dynamicInitialValue={walletAddress}
            required
          />
          <FormInput
            name="kdaPool.quotient"
            title="KDA/KLV Quotient"
            type="number"
            required
            tooltip={tooltip.updateKdaPool.quotient}
          />
          <FormInput
            name="kdaPool.active"
            title="Active"
            type="checkbox"
            toggleOptions={['No', 'Yes']}
            dynamicInitialValue={true}
            bool
            tooltip={tooltip.updateKdaPool.active}
          />
        </FormSection>
      );
    case 16:
      return null;
    case 17:
      return null;
    default:
      return null;
  }
};

export const AddRoleSection: React.FC = () => {
  return (
    <FormSection>
      <SectionTitle>
        <span>Role</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.role.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>
      <FormInput
        paddingTop={2}
        name={`role.address`}
        title={`Address`}
        span={2}
        tooltip={tooltip.role.address}
      />
      <FormInput
        name={`role.hasRoleMint`}
        title={`Has Role Mint`}
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        tooltip={tooltip.role.hasRoleMint}
      />
      <FormInput
        name={`role.hasRoleSetITOPrices`}
        title={`Has Role Set ITO Prices`}
        type="checkbox"
        toggleOptions={['No', 'Yes']}
        tooltip={tooltip.role.hasRoleSetITOPrices}
      />
    </FormSection>
  );
};

export default AssetTrigger;
