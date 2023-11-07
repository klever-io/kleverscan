import { useExtension } from '@/contexts/extension';
import { ICollectionList } from '@/types';
import { useKDASelect } from '@/utils/hooks/contract';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { IContractProps } from '.';
import FormInput from '../FormInput';
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

  const [collection, KDASelect] = useKDASelect({
    validateFields: ['maxAmount', 'defaultLimitPerAddress'],
  });

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
      <KDASelect required />
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
  return (
    <FormSection>
      <FormInput
        name="receiverAddress"
        title="Receiver Address"
        span={2}
        dynamicInitialValue={walletAddress}
        tooltip={tooltip.receiverAddress}
        required
      />
      <FormInput
        name="startTime"
        title="Start Time"
        type="datetime-local"
        tooltip={tooltip.startTime}
      />
      <FormInput
        name="endTime"
        title="End Time"
        type="datetime-local"
        tooltip={tooltip.endTime}
      />
      <FormInput
        name="maxAmount"
        title="Max Amount"
        type="number"
        tooltip={tooltip.maxAmount}
        precision={collection?.isNFT ? 0 : collection?.precision}
      />
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
};

const WhitelistConfigSection: React.FC<ISectionProps> = ({
  walletAddress,
  collection,
}) => {
  return (
    <FormSection>
      <SectionTitle>
        <span>Whitelist Settings</span>
      </SectionTitle>
      <FormInput
        name="whitelistStartTime"
        title="Whitelist Start Time"
        type="datetime-local"
        tooltip={tooltip.whitelistStartTime}
      />
      <FormInput
        name="whitelistEndTime"
        title="Whitelist End Time"
        type="datetime-local"
        tooltip={tooltip.whitelistEndTime}
      />
      <FormInput
        name="defaultLimitPerAddress"
        title="Default Limit Per Address"
        type="number"
        tooltip={tooltip.defaultLimitPerAddress}
        precision={collection?.isNFT ? 0 : collection?.precision}
      />
      <FormInput
        name="whitelistStatus"
        title="Whitelist Status"
        type="dropdown"
        options={statusOptions}
        defaultValue={0}
        tooltip={tooltip.whitelistStatus}
      />
    </FormSection>
  );
};

export const WhitelistSection: React.FC = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'whitelistInfo',
  });
  return (
    <FormSection>
      <SectionTitle>
        <span>Whitelist</span>
      </SectionTitle>
      {fields.map((field, index) => (
        <FormSection key={field.id} inner>
          <SectionTitle>
            <HiTrash onClick={() => remove(index)} />
            Whitelisted Address {index + 1}
          </SectionTitle>
          <FormInput
            name={`whitelistInfo[${index}].address`}
            title={`Address`}
            span={2}
            tooltip={tooltip.whitelistInfo.address}
          />
          <FormInput
            name={`whitelistInfo[${index}].limit`}
            title={`Limit`}
            type="number"
            span={2}
            tooltip={tooltip.whitelistInfo.limit}
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => append({})}>
        Add Address
      </ButtonContainer>
    </FormSection>
  );
};

export const PackInfoSection: React.FC = () => {
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
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      default:
        return `${num}th`;
    }
  };

  return (
    <FormSection>
      <SectionTitle>
        <span>Pack Info</span>
      </SectionTitle>
      {fields.map((field, index) => {
        const currencyId = watch(`packInfo[${index}].currencyId`);

        return (
          <FormSection key={field.id} inner>
            <SectionTitle>
              <HiTrash onClick={() => removePackInfo(index)} />
              Pack Info for {getOrder(index + 1)} Currency{' '}
              {currencyId ? `(${currencyId})` : ''}
            </SectionTitle>
            <FormInput
              name={`packInfo[${index}].currencyId`}
              title="Pack Currency ID"
              span={2}
              tooltip={tooltip.packInfo.packCurrency}
            />
            <PackSection packInfoIndex={index} />
          </FormSection>
        );
      })}
      <ButtonContainer type="button" onClick={() => appendPackInfo({})}>
        {fields.length > 0 ? 'Add Packs in another currency' : 'Add Pack Info'}
      </ButtonContainer>
    </FormSection>
  );
};

const PackSection = ({ packInfoIndex }: { packInfoIndex: number }) => {
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
        <span>Packs</span>
      </SectionTitle>
      {fields.map((field, index) => (
        <FormSection key={field.id} inner>
          <SectionTitle>
            <HiTrash onClick={() => removePack(index)} />
            Pack {index + 1}
          </SectionTitle>
          <FormInput
            name={`packInfo[${packInfoIndex}].packs[${index}].amount`}
            title={`Amount`}
            type="number"
            tooltip={tooltip.packInfo.packItem.amount}
            required
          />
          <FormInput
            name={`packInfo[${packInfoIndex}].packs[${index}].price`}
            title={`Price`}
            type="number"
            tooltip={tooltip.packInfo.packItem.price}
            required
          />
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => appendPack({})}>
        Add Pack
      </ButtonContainer>
    </FormSection>
  );
};

export default ConfigITO;
