import { useMulticontract } from '@/contexts/contract/multicontract';
import { useExtension } from '@/contexts/extension';
import { ICollectionList } from '@/types';
import { assetTriggerTypes } from '@/utils/contracts';
import { deepCopyObject } from '@/utils/objectFunctions';
import { IAssetTrigger } from '@klever/sdk-web';
import { TFunction, useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../FormInput/styles';
import { KDASelect } from '../KDASelect';
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
  const { t } = useTranslation('transactions');
  const { handleSubmit, watch, reset } = useFormContext<IAssetTrigger>();
  const { walletAddress } = useExtension();
  const triggerType = watch('triggerType');

  const { metadata, setMetadata, queue } = useMulticontract();

  const collection = queue[formKey].collection;

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
          title={t('AssetTrigger.Asset Trigger Type')}
          type="dropdown"
          zIndex={4}
          options={assetTriggerTypes}
          required
        />
      </FormSection>
      <KDASelect required assetTriggerType={triggerType} />
      {triggerType !== undefined &&
        collection &&
        getAssetTriggerForm(
          triggerType,
          collection,
          walletAddress,
          metadataProps,
          t,
        )}
    </FormBody>
  );
};

const getAssetTriggerForm = (
  triggerType: number,
  collection: ICollectionList,
  walletAddress: string,
  { metadata, setMetadata }: IMetadataOptions,
  t: TFunction,
) => {
  switch (triggerType) {
    case 0:
      return (
        <FormSection>
          <FormInput
            name="receiver"
            title={t('ConfigITO.Receiver')}
            required
            dynamicInitialValue={walletAddress}
            tooltip={tooltip.receiver}
          />
          <FormInput name="amount" title={t('Amount')} type="number" required />
        </FormSection>
      );
    case 1:
      return (
        <FormSection>
          <FormInput name="amount" title={t('Amount')} type="number" required />
        </FormSection>
      );
    case 2:
      return (
        <FormSection>
          <FormInput
            name="receiver"
            title={t('ConfigITO.Receiver')}
            required
            dynamicInitialValue={walletAddress}
            tooltip={tooltip.receiver}
          />
          <FormInput name="amount" title={t('Amount')} type="number" required />
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
            title={t('ConfigITO.Receiver')}
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
            title={t('ConfigITO.Receiver')}
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
            title={t('AssetTrigger.MIME')
              .toLowerCase()
              .replace(/\b\w/g, char => char.toUpperCase())}
            tooltip={tooltip.updateMetadata.mime}
          />
          <FormInput
            name="receiver"
            title={t('AssetTrigger.NFT Holder Address')}
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
            title={t('CreateValidator.Logo')}
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
            title={t('ConfigITO.Receiver')}
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
            title={t('AssetTrigger.Admin Address')}
            dynamicInitialValue={walletAddress}
            required
          />
          <FormInput
            name="kdaPool.quotient"
            title={t('AssetTrigger.KDA/KLV Quotient')}
            type="number"
            required
            tooltip={tooltip.updateKdaPool.quotient}
          />
          <FormInput
            name="kdaPool.active"
            title={t('AssetTrigger.Active')}
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
  const { t } = useTranslation('transactions');
  const { t: commonT } = useTranslation('common');
  return (
    <FormSection>
      <SectionTitle>
        <span>{t('AssetTrigger.Role')}</span>
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
        title={t('Address')}
        span={2}
        tooltip={tooltip.role.address}
      />
      <FormInput
        name={`role.hasRoleMint`}
        title={t('AssetTrigger.HasRoleMint')}
        type="checkbox"
        toggleOptions={[
          `${commonT('Statements.No')}`,
          `${commonT('Statements.Yes')}`,
        ]}
        tooltip={tooltip.role.hasRoleMint}
      />
      <FormInput
        name={`role.hasRoleSetITOPrices`}
        title={t('AssetTrigger.HasRoleSetITOPrices')}
        type="checkbox"
        toggleOptions={[
          `${commonT('Statements.No')}`,
          `${commonT('Statements.Yes')}`,
        ]}
        tooltip={tooltip.role.hasRoleSetITOPrices}
      />
    </FormSection>
  );
};

export default AssetTrigger;
