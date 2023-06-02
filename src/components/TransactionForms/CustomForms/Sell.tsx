import { useContract } from '@/contexts/contract';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import { FormSection } from '../../Form/styles';
import FormInput from '../FormInput';
import { FormBody } from '../styles';
import { parseDates } from './utils';

type FormData = {
  marketType: number;
  marketplaceId: string;
  currencyId: string;
  price: number;
  reservePrice: number;
  endTime: string;
  assetId: string;
};

const parseSell = (data: FormData) => {
  data.marketType = data.marketType ? 1 : 0;

  parseDates(data);
};

const Sell: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { handleSubmit, watch } = useFormContext<FormData>();
  const { useKDASelect } = useContract();
  const marketType = watch('marketType');

  const [_, KDASelect] = useKDASelect();

  const onSubmit = async (data: FormData) => {
    parseSell(data);
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <KDASelect />
      <FormSection>
        <FormInput
          name="marketType"
          title="Market Type"
          type="checkbox"
          toggleOptions={['Instant Sell', 'Auction']}
          tooltip="Instant Sell: Sell the asset for a fixed price. Auction: Sell the asset to the highest bidder."
        />
        <FormInput
          name="marketplaceId"
          title="Marketplace ID"
          tooltip="The ID of the marketplace to sell the asset on."
          required
        />
        <FormInput
          name="currencyId"
          title="Currency ID"
          tooltip="The ID of the currency to sell the asset for."
          required
        />
        <FormInput
          name="price"
          title="Price"
          type="number"
          tooltip={
            marketType
              ? 'The price which the item can be instantly bought for.'
              : 'The price to sell the asset for.'
          }
        />
        {marketType && (
          <FormInput
            name="reservePrice"
            title="Reserve Price"
            type="number"
            tooltip="The minimum auction price for the asset."
          />
        )}
        <FormInput
          name="endTime"
          title="End Time"
          type="datetime-local"
          tooltip="Expiration sell date"
          required
        />
      </FormSection>
    </FormBody>
  );
};

export default Sell;
