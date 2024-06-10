import { useMulticontract } from '@/contexts/contract/multicontract';
import { useExtension } from '@/contexts/extension';
import { ICollectionList } from '@/types';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
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
  PackRange,
  SectionTitle,
} from '../styles';
import {
  parseDates,
  parsePackInfo,
  parseWhitelistInfo,
  removeWrapper,
} from './utils';
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

export const WhitelistSection: React.FC<{ top?: number }> = ({ top }) => {
  const { control, getValues } = useFormContext();
  const router = useRouter();
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
        <FormSection key={field.id} inner top={top}>
          <SectionTitle>
            <HiTrash
              onClick={() =>
                removeWrapper({ index, remove, getValues, router })
              }
            />
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

export const PackInfoSection: React.FC<{ top?: number }> = ({ top }) => {
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
          <FormSection key={field.id} inner top={top}>
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
  const { control, getValues, setValue, watch } = useFormContext();

  const fieldArray = useFieldArray({
    control,
    name: `packInfo[${packInfoIndex}].packs`,
  });

  const { fields, append: appendPack } = fieldArray;

  useEffect(() => {
    if (fields.length === 0) {
      appendPack({});
    }
  }, []);

  const packType = watch(`packInfo[${packInfoIndex}].packType`);
  const isSinglePack = packType === 0;

  return (
    <FormSection inner>
      <SectionTitle>
        <span>Packs</span>
      </SectionTitle>

      <FormInput
        title="Pack Value"
        name={`packInfo[${packInfoIndex}].packType`}
        type="dropdown"
        options={[
          { label: 'Fixed', value: 0 },
          { label: 'Variable', value: 1 },
        ]}
        dynamicInitialValue={1}
        span={2}
      />
      {isSinglePack ? (
        <SinglePackItem packInfoIndex={packInfoIndex} fieldArray={fieldArray} />
      ) : (
        fields.map((field, index) => (
          <MultiPackItem
            key={field.id}
            packInfoIndex={packInfoIndex}
            packIndex={index}
            fieldArray={fieldArray}
          />
        ))
      )}

      <ButtonContainer type="button" onClick={() => appendPack({})}>
        Add Pack
      </ButtonContainer>
    </FormSection>
  );
};

const MultiPackItem = ({ packInfoIndex, packIndex, fieldArray }: any) => {
  const { control, setValue } = useFormContext();
  const { fields, remove: removePack } = fieldArray;

  const lastPack = packIndex === fields.length - 1;

  return (
    <FormSection inner>
      <SectionTitle>
        <HiTrash onClick={() => removePack(packIndex)} />
        Pack {packIndex + 1}
      </SectionTitle>
      <PackRange>
        <FormInput
          name={`packInfo[${packInfoIndex}].packs[${packIndex - 1}].amount`}
          title={`From`}
          type="number"
          tooltip={tooltip.packInfo.packItem.amount}
          dynamicInitialValue={packIndex === 0 ? '0' : undefined}
          disabled={packIndex === 0}
          required
        />
        <span>to</span>
        <FormInput
          name={`packInfo[${packInfoIndex}].packs[${packIndex}].amount`}
          title={`To`}
          type="number"
          tooltip={tooltip.packInfo.packItem.amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setValue(
              `packInfo[${packInfoIndex}].packs[${packIndex}].amount`,
              Number(value),
            );
          }}
          required={!lastPack}
        />
      </PackRange>
      <FormInput
        name={`packInfo[${packInfoIndex}].packs[${packIndex}].price`}
        title={`Price`}
        type="number"
        tooltip={tooltip.packInfo.packItem.price}
        required
      />
    </FormSection>
  );
};

const SinglePackItem = ({ packInfoIndex, fieldArray }: any) => {
  const { control, setValue } = useFormContext();
  const { fields, remove: removePack, replace } = fieldArray;

  useEffect(() => {
    if (fields.length > 0) {
      replace([{ amount: 0, price: 0 }]);
    }
  }, []);

  return (
    <FormSection inner>
      <SectionTitle>
        <HiTrash onClick={() => removePack(0)} />
        Pack {0 + 1}
      </SectionTitle>
      <FormInput
        name={`packInfo[${packInfoIndex}].packs[0].amount`}
        title={`Amount`}
        type="number"
        tooltip={tooltip.packInfo.packItem.amount}
        required
      />
      <FormInput
        name={`packInfo[${packInfoIndex}].packs[0].price`}
        title={`Price`}
        type="number"
        tooltip={tooltip.packInfo.packItem.price}
        required
      />
    </FormSection>
  );
};

export default ConfigITO;
