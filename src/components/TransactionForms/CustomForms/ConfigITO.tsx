import { useMulticontract } from '@/contexts/contract/multicontract';
import { useExtension } from '@/contexts/extension';
import { ICollectionList } from '@/types';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { KDASelect } from '../KDASelect';
import {
  ButtonContainer,
  FormBody,
  FormSection,
  SectionTitle,
} from '../styles';
import { parseDates, parsePackInfo, parseWhitelistInfo } from './utils';
import { ITOTooltips as tooltip } from './utils/tooltips';
import { PackInfo, WhitelistInfo } from './utils/types';

export type ConfigITOData = {
  receiverAddress: string;
  kda: string;
  maxAmount: number;
  status: number;
  packInfo: PackInfo;
  defaultLimitPerAddress: number;
  whitelistStatus: number;
  whitelistInfo: WhitelistInfo;
  whitelistStartTime: number;
  whitelistEndTime: number;
  startTime?: number;
  endTime: number;
  startTimeStartNow?: boolean;
};

interface ISectionProps {
  walletAddress?: string;
  collection?: ICollectionList;
}

export const statusOptions = [
  {
    label: 'ActiveITO (1)',
    value: 1,
  },
  {
    label: 'PausedITO (2)',
    value: 2,
  },
];

export const parseConfigITO = (data: ConfigITOData): void => {
  parsePackInfo(data);
  parseWhitelistInfo(data);
  parseDates(data);
};

const ConfigITO: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { handleSubmit, watch } = useFormContext<ConfigITOData>();

  const { walletAddress } = useExtension();

  const { queue } = useMulticontract();

  const collection = queue[formKey].collection;

  const onSubmit = async (data: ConfigITOData) => {
    try {
      parseConfigITO(data);
      await handleFormSubmit(data);
    } catch (e: any) {
      toast.error(e.message);
      return;
    }
  };

  const sectionProps = { walletAddress, collection };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <KDASelect
        required
        validateFields={['maxAmount', 'defaultLimitPerAddress']}
      />
      <MainSection {...sectionProps} />
      <WhitelistConfigSection {...sectionProps} />
      <WhitelistSection />
      <PackInfoSection />
    </FormBody>
  );
};

const MainSection: React.FC<ISectionProps> = ({
  walletAddress,
  collection,
}) => {
  const { t } = useTranslation('transactions');
  return (
    <FormSection>
      <FormInput
        name="receiverAddress"
        title={t('ITOTrigger.Receiver Address')}
        span={2}
        dynamicInitialValue={walletAddress}
        tooltip={tooltip.receiverAddress}
        required
      />
      <FormInput
        name="startTime"
        title={t('Buy.Start Time')}
        type="datetime-local"
        tooltip={tooltip.startTime}
      />
      <FormInput
        name="endTime"
        title={t('Buy.End Time')}
        type="datetime-local"
        tooltip={tooltip.endTime}
      />
      <FormInput
        name="maxAmount"
        title={t('ConfigITO.Max Amount')}
        type="number"
        tooltip={tooltip.maxAmount}
        precision={collection?.isNFT ? 0 : collection?.precision}
      />
      <FormInput
        name="status"
        title={t('ConfigITO.Status')}
        type="dropdown"
        options={statusOptions}
        tooltip={tooltip.status}
        required
      />
    </FormSection>
  );
};

const WhitelistConfigSection: React.FC<ISectionProps> = ({
  walletAddress,
  collection,
}) => {
  const { t } = useTranslation('transactions');
  return (
    <FormSection>
      <SectionTitle>
        <span>{t('ConfigITO.Whitelist Settings')}</span>
      </SectionTitle>
      <FormInput
        name="whitelistStartTime"
        title={t('ConfigITO.Whitelist Start Time')}
        type="datetime-local"
        tooltip={tooltip.whitelistStartTime}
      />
      <FormInput
        name="whitelistEndTime"
        title={t('ConfigITO.Whitelist End Time')}
        type="datetime-local"
        tooltip={tooltip.whitelistEndTime}
      />
      <FormInput
        name="defaultLimitPerAddress"
        title={t('ConfigITO.Default Limit Per Address')}
        type="number"
        tooltip={tooltip.defaultLimitPerAddress}
        precision={collection?.isNFT ? 0 : collection?.precision}
      />
      <FormInput
        name="whitelistStatus"
        title={t('ConfigITO.Whitelist Status')}
        type="dropdown"
        options={statusOptions}
        defaultValue={0}
        tooltip={tooltip.whitelistStatus}
      />
    </FormSection>
  );
};

export const WhitelistSection: React.FC<{ top?: number }> = ({ top }) => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'whitelistInfo',
  });
  return (
    <FormSection>
      <SectionTitle>
        <span>{t('ConfigITO.Whitelist')}</span>
      </SectionTitle>
      {fields.map((field, index) => (
        <FormSection key={field.id} inner top={top}>
          <SectionTitle>
            <HiTrash onClick={() => remove(index)} />
            {t('ConfigITO.Whitelisted Address')} {index + 1}
          </SectionTitle>
          <FormInput
            name={`whitelistInfo[${index}].address`}
            title={t('Address')}
            span={2}
            tooltip={tooltip.whitelistInfo.address}
          />
          <FormInput
            name={`whitelistInfo[${index}].limit`}
            title={t('Limit')}
            type="number"
            span={2}
            tooltip={tooltip.whitelistInfo.limit}
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        {t('ConfigITO.Add Address')}
      </ButtonContainer>
    </FormSection>
  );
};

export const PackInfoSection: React.FC<{ top?: number }> = ({ top }) => {
  const { t } = useTranslation('transactions');
  const { t: commonT } = useTranslation('common');
  const { control, watch } = useFormContext();
  const {
    fields,
    append: appendPackInfo,
    remove: removePackInfo,
  } = useFieldArray({
    control,
    name: 'packInfo',
  });

  const getOrder = (num: number) => {
    switch (num) {
      case 1:
        return commonT('Order.1st');
      case 2:
        return commonT('Order.2nd');
      case 3:
        return commonT('Order.3rd');
      default:
        return commonT('Order.th', { num });
    }
  };

  return (
    <FormSection>
      <SectionTitle>
        <span>{t('ITOTrigger.Pack Info')}</span>
      </SectionTitle>
      {fields.map((field, index) => {
        const currencyId = watch(`packInfo[${index}].currencyId`);

        return (
          <FormSection key={field.id} inner top={top}>
            <SectionTitle>
              <HiTrash onClick={() => removePackInfo(index)} />
              {t('ITOTrigger.Pack Info for')} {getOrder(index + 1)} Currency{' '}
              {currencyId ? `(${currencyId})` : ''}
            </SectionTitle>
            <FormInput
              name={`packInfo[${index}].currencyId`}
              title={t('ITOTrigger.Pack Currency ID')}
              span={2}
              tooltip={tooltip.packInfo.packCurrency}
            />
            <PackSection packInfoIndex={index} />
          </FormSection>
        );
      })}
      <ButtonContainer type="button" onClick={() => appendPackInfo({})}>
        {fields.length > 0
          ? `${t('ITOTrigger.Add Packs in another currency')}`
          : `${t('ITOTrigger.Add Pack Info')}`}
      </ButtonContainer>
    </FormSection>
  );
};

const PackSection = ({ packInfoIndex }: { packInfoIndex: number }) => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext();
  const {
    fields,
    append: appendPack,
    remove: removePack,
  } = useFieldArray({
    control,
    name: `packInfo[${packInfoIndex}].packs`,
  });
  return (
    <FormSection inner>
      <SectionTitle>
        <span>{t('ConfigITO.Packs')}</span>
      </SectionTitle>
      {fields.map((field, index) => (
        <FormSection key={field.id} inner>
          <SectionTitle>
            <HiTrash onClick={() => removePack(index)} />
            {t('ConfigITO.Pack')} {index + 1}
          </SectionTitle>
          <FormInput
            name={`packInfo[${packInfoIndex}].packs[${index}].amount`}
            title={t('Amount')}
            type="number"
            tooltip={tooltip.packInfo.packItem.amount}
            required
          />
          <FormInput
            name={`packInfo[${packInfoIndex}].packs[${index}].price`}
            title={t('Buy.Price')}
            type="number"
            tooltip={tooltip.packInfo.packItem.price}
            required
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => appendPack({})}>
        {t('ConfigITO.Add Pack')}
      </ButtonContainer>
    </FormSection>
  );
};

export default ConfigITO;
