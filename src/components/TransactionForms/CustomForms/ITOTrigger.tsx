import { useContract } from '@/contexts/contract';
import { ICollectionList } from '@/types';
import { ITOTriggerTypes } from '@/utils/contracts';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import { FormSection } from '../../Form/styles';
import FormInput from '../FormInput';
import { FormBody } from '../styles';
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
  const { handleSubmit, watch } = useFormContext<ITOTriggerData>();
  const { getOwnerAddress, useKDASelect } = useContract();
  const [collection, KDASelect] = useKDASelect();

  const triggerType = watch('triggerType');
  const walletAddress = getOwnerAddress();

  const onSubmit = async (data: ITOTriggerData) => {
    parseConfigITO(data);
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="triggerType"
          title="ITO Trigger Type"
          type="dropdown"
          zIndex={4}
          options={ITOTriggerTypes}
          required
        />
      </FormSection>
      {triggerType !== undefined && <KDASelect />}
      {triggerType !== undefined &&
        collection &&
        getITOTriggerForm(triggerType, walletAddress, collection)}
    </FormBody>
  );
};

const getITOTriggerForm = (
  triggerType: number,
  walletAddress: string,
  collection: ICollectionList,
) => {
  switch (triggerType) {
    case 0:
      return <PackInfoSection />;
    case 1:
      return (
        <FormSection>
          <FormInput
            name="status"
            title="Status"
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
            title="Receiver Address"
            span={2}
            defaultValue={walletAddress}
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
            title="Max Amount"
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
            title="Default Limit Per Address"
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
            title="Start Time"
            type="datetime-local"
            tooltip={tooltip.startTime}
            required
          />
          <FormInput
            name="endTime"
            title="End Time"
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
            title="Whitelist Status"
            type="dropdown"
            options={statusOptions}
            tooltip={tooltip.whitelistStatus}
            required
          />
        </FormSection>
      );
    case 7:
      return <WhitelistSection />;
    case 8:
      return <WhitelistSection />;
    case 9:
      return (
        <FormSection>
          <FormInput
            name="whitelistStartTime"
            title="Whitelist Start Time"
            type="datetime-local"
            tooltip={tooltip.whitelistStartTime}
            required
          />
          <FormInput
            name="whitelistEndTime"
            title="Whitelist End Time"
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