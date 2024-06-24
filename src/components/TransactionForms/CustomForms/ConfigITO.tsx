import { useMulticontract } from '@/contexts/contract/multicontract';
import { useExtension } from '@/contexts/extension';
import { IAsset, ICollectionList } from '@/types';
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
import { Pack, PackInfo, WhitelistInfo } from './utils/types';
import { useDebounce, useFetchPartial } from '@/utils/hooks';

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

export const parseConfigITO = (data: ConfigITOData, isNFT?: boolean): void => {
  parsePackInfo(data, isNFT);
  parseWhitelistInfo(data);
  parseDates(data);
};

const ConfigITO: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { handleSubmit, watch } = useFormContext<ConfigITOData>();

  const { walletAddress } = useExtension();

  const { queue } = useMulticontract();

  const collection = queue[formKey].collection;

  const onSubmit = async (data: ConfigITOData) => {
    const dataCopy = JSON.parse(JSON.stringify(data));
    try {
      parseConfigITO(dataCopy, collection?.isNFT);
      await handleFormSubmit(dataCopy);
    } catch (e: any) {
      toast.error(e.message);
      console.error(e);
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
      {collection && (
        <>
          <MainSection {...sectionProps} />
          <WhitelistConfigSection {...sectionProps} />
          <WhitelistSection />
          <PackInfoSection collection={collection} />
        </>
      )}
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
        dynamicInitialValue={2}
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

export const PackInfoSection: React.FC<{
  top?: number;
  collection?: ICollectionList;
}> = ({ top, collection }) => {
  const { control, watch, trigger } = useFormContext();
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

  const [filterAssets, fetchPartialAsset, loading, setLoading] =
    useFetchPartial<IAsset>('assets', 'assets/list', 'assetId', {
      type: 'Fungible',
    });
  const [assetInput, setAssetInput] = useState<string>('');
  const [currency, setCurrency] = useState<IAsset>();
  const debouncedAssetInput = useDebounce(assetInput, 500);
  useEffect(() => {
    if (debouncedAssetInput) {
      setLoading(true);
      fetchPartialAsset(debouncedAssetInput);
    }
  }, [debouncedAssetInput]);

  useEffect(() => {
    trigger('packInfo');
  }, [currency]);

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
              type="dropdown"
              options={filterAssets.map(asset => ({
                value: asset.assetId,
                label: asset.assetId,
                asset: asset,
              }))}
              onInputChange={value => {
                setAssetInput(value);
              }}
              customOnChange={value => {
                setCurrency(value.asset);
              }}
              loading={loading}
              required
            />
            {currency && (
              <PackSection
                packInfoIndex={index}
                asset={collection}
                currency={currency}
              />
            )}
          </FormSection>
        );
      })}
      <ButtonContainer type="button" onClick={() => appendPackInfo({})}>
        {fields.length > 0 ? 'Add Packs in another currency' : 'Add Pack Info'}
      </ButtonContainer>
    </FormSection>
  );
};

const PackSection = ({
  packInfoIndex,
  asset,
  currency,
}: {
  packInfoIndex: number;
  asset?: ICollectionList;
  currency?: IAsset;
}) => {
  const { control, getValues, setValue, watch } = useFormContext();

  const fieldArray = useFieldArray({
    control,
    name: `packInfo[${packInfoIndex}].packs`,
  });

  const { fields, replace, update, append: appendPack } = fieldArray;

  const packType = watch(`packInfo[${packInfoIndex}].packType`);
  const isSinglePack = packType === 0;
  const lastPack = (fields &&
    fields?.length &&
    fields[fields?.length - 2]) as unknown as Pack;

  const renderPackItems = () => {
    if (asset?.isNFT) {
      return fields.map((field, index) => (
        <NFTPackItems
          key={field.id}
          packInfoIndex={packInfoIndex}
          packIndex={index}
          fieldArray={fieldArray}
          currency={currency}
        />
      ));
    } else {
      return (
        <>
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
            <SinglePackItem
              packInfoIndex={packInfoIndex}
              fieldArray={fieldArray}
              currency={currency}
              asset={asset}
            />
          ) : (
            <FungibleMultiPackItems
              packInfoIndex={packInfoIndex}
              fieldArray={fieldArray}
              currency={currency}
              asset={asset}
            />
          )}
        </>
      );
    }
  };

  return (
    <FormSection inner>
      <SectionTitle>
        <span>Packs</span>
      </SectionTitle>

      {renderPackItems()}

      <ButtonContainer
        type="button"
        onClick={() => {
          const updatedFields = (
            getValues(`packInfo[${packInfoIndex}].packs`) as unknown as Pack[]
          ).map((field, index) => {
            if (index === fields.length - 1) {
              return { amount: (lastPack?.amount || 0) * 10, price: 0 };
            }
            return {
              amount: field.amount,
              price: field.price,
            };
          });

          const newFields = [
            ...updatedFields,
            { amount: (lastPack?.amount || 0) * 10, price: 0 },
          ];

          replace(JSON.parse(JSON.stringify(newFields)));
        }}
      >
        Add Pack
      </ButtonContainer>
    </FormSection>
  );
};

const NFTPackItems = ({
  packInfoIndex,
  packIndex,
  fieldArray,
  currency,
  asset,
}: any) => {
  const { control, setValue } = useFormContext();
  const { fields, remove: removePack, replace } = fieldArray;

  const lastPack = packIndex === fields?.length - 1;

  useEffect(() => {
    if (fields.length < 2) {
      replace([
        { amount: 1, price: 0 },
        { amount: 10, price: 0 },
      ]);
    }
  }, []);

  return (
    <FormSection inner>
      <SectionTitle>
        {fields.length > 2 && <HiTrash onClick={() => removePack(packIndex)} />}
        Pack {packIndex + 1}
      </SectionTitle>
      <FormInput
        name={`packInfo[${packInfoIndex}].packs[${packIndex}].amount`}
        title={`Amount`}
        type="number"
        tooltip={tooltip.packInfo.packItem.amount}
        precision={0}
        required
      />
      <FormInput
        name={`packInfo[${packInfoIndex}].packs[${packIndex}].price`}
        title={`Price`}
        type="number"
        tooltip={tooltip.packInfo.packItem.price}
        precision={currency?.precision}
        required
      />
    </FormSection>
  );
};

const FungibleMultiPackItems = ({
  packInfoIndex,
  fieldArray,
  currency,
  asset,
}: any) => {
  const { control, setValue, trigger } = useFormContext();
  const { fields, remove: removePack, replace } = fieldArray;

  useEffect(() => {
    if (fields.length < 2) {
      replace([
        { amount: 100, price: 0 },
        { amount: 0, price: 0 },
      ]);
    }
  }, []);

  return fields.map((field: any, index: number) => {
    const lastPack = index === fields?.length - 1;

    return (
      <FormSection inner key={field.id}>
        <SectionTitle>
          {fields.length > 2 && <HiTrash onClick={() => removePack(index)} />}
          Pack {index + 1}
        </SectionTitle>
        <PackRange>
          <FormInput
            name={
              index === 0
                ? `packInfo[${packInfoIndex}].firstAmount`
                : `packInfo[${packInfoIndex}].packs[${index - 1}].amount`
            }
            title={`From`}
            type="number"
            tooltip={tooltip.packInfo.packItem.amount}
            value={index === 0 ? 0 : undefined}
            precision={asset?.precision}
            disabled={index === 0}
            required={index !== 0}
          />
          <span>to</span>
          <FormInput
            name={`packInfo[${packInfoIndex}].packs[${index}].amount`}
            title={`To`}
            type={index === fields.length - 1 ? 'text' : 'number'}
            tooltip={tooltip.packInfo.packItem.amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const target = e.target;
              const value = Number(target.value);

              if (!value || isNaN(value)) {
                return;
              }

              setValue(
                `packInfo[${packInfoIndex}].packs[${index}].amount`,
                value,
              );

              trigger('packInfo');
            }}
            dynamicInitialValue={lastPack ? 'Infinity' : fields[index].amount}
            required={!lastPack}
            precision={asset?.precision}
            disabled={lastPack}
          />
        </PackRange>
        <FormInput
          name={`packInfo[${packInfoIndex}].packs[${index}].price`}
          title={`Price`}
          type="number"
          tooltip={tooltip.packInfo.packItem.price}
          precision={currency?.precision}
          required
        />
      </FormSection>
    );
  });
};

const SinglePackItem = ({
  packInfoIndex,
  fieldArray,
  currency,
  asset,
}: any) => {
  const { control, setValue } = useFormContext();
  const { fields, remove: removePack, replace } = fieldArray;

  useEffect(() => {
    replace([{ amount: 100, price: 0 }]);
  }, []);

  return (
    <FormSection inner>
      <SectionTitle>Pack {1}</SectionTitle>
      <FormInput
        name={`packInfo[${packInfoIndex}].packs[0].amount`}
        title={`Amount`}
        type="number"
        tooltip={tooltip.packInfo.packItem.amount}
        precision={asset?.precision}
        required
      />
      <FormInput
        name={`packInfo[${packInfoIndex}].packs[0].price`}
        title={`Price`}
        type="number"
        tooltip={tooltip.packInfo.packItem.price}
        precision={currency?.precision}
        required
      />
    </FormSection>
  );
};

export default ConfigITO;
