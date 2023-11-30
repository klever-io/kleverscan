import { useMulticontract } from '@/contexts/contract/multicontract';
import { calculateMarketBuyFixedFee } from '@/utils/create-transaction/fees-calculation.ts';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { KDASelect } from '../KDASelect';
import { FormBody, FormSection, RoyaltiesContainer } from '../styles';
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
  data.currencyId = data.currencyId.toUpperCase();
  parseDates(data);
};

const Sell: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { t } = useTranslation('transactions');
  const { handleSubmit, watch } = useFormContext<FormData>();
  const marketType = watch('marketType');
  const { setSelectedRoyaltiesFees, queue } = useMulticontract();

  const collection = queue[formKey].collection;

  const onSubmit = async (data: FormData) => {
    parseSell(data);
    await handleFormSubmit(data);
  };

  const getMarketBuyFixedFee = () => {
    if (!collection) {
      return 0;
    }
    const marketBuyFixedFee = calculateMarketBuyFixedFee(collection);
    return marketBuyFixedFee;
  };

  const marketBuyFixedFee = getMarketBuyFixedFee();

  useEffect(() => {
    if (marketBuyFixedFee) {
      setSelectedRoyaltiesFees(marketBuyFixedFee);
    }
  }, [collection]);

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <KDASelect />
      <FormSection>
        <FormInput
          name="marketType"
          title={t('Buy.Market Type')}
          type="checkbox"
          toggleOptions={['Instant Sell', 'Auction']}
          tooltip="Instant Sell: Sell the asset for a fixed price. Auction: Sell the asset to the highest bidder."
        />
        <FormInput
          name="marketplaceId"
          title={t('DelegateUndelegate.Marketplace ID')}
          tooltip="The ID of the marketplace to sell the asset on."
          required
        />
        <FormInput
          name="currencyId"
          title={t('Buy.Currency Id')}
          tooltip="The ID of the currency to sell the asset for."
          required
        />
        <FormInput
          name="price"
          title={t('Buy.Price')}
          type="number"
          tooltip={
            marketType
              ? 'The price which the item can be instantly bought for.'
              : 'The price to sell the asset for.'
          }
          required={marketType ? false : true}
        />
        {marketType && (
          <FormInput
            name="reservePrice"
            title={t('Buy.Reserve Price')}
            type="number"
            tooltip="The minimum auction price for the asset."
          />
        )}
        <FormInput
          name="endTime"
          title={t('Buy.End Time')}
          type="datetime-local"
          tooltip="Expiration sell date"
          required
        />
      </FormSection>
      {marketBuyFixedFee > 0 && (
        <RoyaltiesContainer>
          Royalties: {`${toLocaleFixed(marketBuyFixedFee, KLV_PRECISION)} KLV`}
        </RoyaltiesContainer>
      )}
    </FormBody>
  );
};

export default Sell;
