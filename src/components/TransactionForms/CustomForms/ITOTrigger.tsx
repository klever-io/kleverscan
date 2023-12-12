import { useMulticontract } from '@/contexts/contract/multicontract';
import { useExtension } from '@/contexts/extension';
import { ICollectionList } from '@/types';
import { ITOTriggerTypes } from '@/utils/contracts';
import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { TFunction } from 'react-i18next';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { KDASelect } from '../KDASelect';
import { FormBody, FormSection } from '../styles';
import {
  ConfigITOData,
  PackInfoSection,
  parseConfigITO,
  statusOptions,
  WhitelistSection,
} from './ConfigITO';
import { ITOTooltips as tooltip } from './utils/tooltips';

interface ITOTriggerData extends ConfigITOData {
  triggerType: number;
}

const ITOTrigger: React.FC<IContractProps> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { t } = useTranslation('transactions');
  const { handleSubmit, watch, reset } = useFormContext<ITOTriggerData>();
  const { walletAddress } = useExtension();

  const { queue } = useMulticontract();

  const collection = queue[formKey].collection;

  const triggerType = watch('triggerType');

  const onSubmit = async (data: ITOTriggerData) => {
    parseConfigITO(data);
    await handleFormSubmit(data);
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
          title={t('ITOTrigger.ITO Trigger Type')}
          type="dropdown"
          zIndex={4}
          options={ITOTriggerTypes}
          required
        />
      </FormSection>
      {triggerType !== undefined && <KDASelect />}
      {triggerType !== undefined &&
        collection &&
        getITOTriggerForm(triggerType, walletAddress, collection, t)}
    </FormBody>
  );
};

const getITOTriggerForm = (
  triggerType: number,
  walletAddress: string,
  collection: ICollectionList,
  t: TFunction<'transactions', undefined>,
) => {
  switch (triggerType) {
    case 0:
      return <PackInfoSection top={2} />;
    case 1:
      return (
        <FormSection>
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
    case 2:
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
        </FormSection>
      );
    case 3:
      return (
        <FormSection>
          <FormInput
            name="maxAmount"
            title={t('ConfigITO.Max Amount')}
            type="number"
            precision={collection?.isNFT ? 0 : collection?.precision}
            tooltip={tooltip.maxAmount}
            required
          />
        </FormSection>
      );
    case 4:
      return (
        <FormSection>
          <FormInput
            name="defaultLimitPerAddress"
            title={t('ConfigITO.Default Limit Per Address')}
            type="number"
            precision={collection?.isNFT ? 0 : collection?.precision}
            tooltip={tooltip.defaultLimitPerAddress}
            required
          />
        </FormSection>
      );
    case 5:
      return (
        <FormSection>
          <FormInput
            name="startTime"
            title={t('Buy.Start Time')}
            type="datetime-local"
            tooltip={tooltip.startTime}
            required
          />
          <FormInput
            name="endTime"
            title={t('Buy.End Time')}
            type="datetime-local"
            tooltip={tooltip.endTime}
            required
          />
        </FormSection>
      );
    case 6:
      return (
        <FormSection>
          <FormInput
            name="whitelistStatus"
            title={t('ConfigITO.Whitelist Status')}
            type="dropdown"
            options={statusOptions}
            tooltip={tooltip.whitelistStatus}
            required
          />
        </FormSection>
      );
    case 7:
      return <WhitelistSection top={2.5} />;
    case 8:
      return <WhitelistSection top={2.5} />;
    case 9:
      return (
        <FormSection>
          <FormInput
            name="whitelistStartTime"
            title={t('ConfigITO.Whitelist Start Time')}
            type="datetime-local"
            tooltip={tooltip.whitelistStartTime}
            required
          />
          <FormInput
            name="whitelistEndTime"
            title={t('ConfigITO.Whitelist End Time')}
            type="datetime-local"
            tooltip={tooltip.whitelistEndTime}
            required
          />
        </FormSection>
      );
    default:
      return null;
  }
};

export default ITOTrigger;
