import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { getAsset } from '@/services/requests/asset';
import { calculateITOBuyFixedFee } from '@/utils/create-transaction/fees-calculation.ts';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { FormBody, FormSection, RoyaltiesContainer } from '../styles';

type FormData = {
  buyType: number;
  id: string;
  currencyId: string;
  amount: number;
};

const parseBuy = (data: FormData) => {
  data.buyType = data.buyType ? 1 : 0;
  data.currencyId = data.currencyId.toUpperCase();
  data.id = data.id.toUpperCase();
};

const Buy: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { t } = useTranslation('transactions');
  const { handleSubmit, watch } = useFormContext<FormData>();
  const {} = useContract();
  const buyType = watch('buyType');
  const id = watch('id');
  const { setSelectedRoyaltiesFees } = useMulticontract();
  const [ITOFixedFee, setITOFixedFee] = useState(0);

  const onSubmit = async (data: FormData) => {
    parseBuy(data);
    await handleFormSubmit(data);
  };

  const idIsAsset = (input: string | undefined) => {
    if (typeof input !== 'string') {
      return false;
    }
    if (input.length >= 8 && input.length <= 15) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    (async function () {
      if (idIsAsset(id)) {
        const res = await getAsset(id);
        if (!res.error || res.error === '') {
          const asset = res.data?.asset;
          if (asset) {
            setSelectedRoyaltiesFees(calculateITOBuyFixedFee(asset));
            setITOFixedFee(calculateITOBuyFixedFee(asset));
          }
        }
      } else {
        setSelectedRoyaltiesFees(0);
      }
    })();
  }, [id]);

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="buyType"
          title={t('Buy.Buy Type')}
          type="checkbox"
          toggleOptions={['ITO Buy', 'Market Buy']}
        />
        <FormInput
          name="id"
          title={buyType ? `${t('Buy.Order Id')}` : `${t('Buy.ITO Asset ID')}`}
          required
        />
        <FormInput name="currencyId" title={t('Buy.Currency Id')} required />
        <FormInput
          name="amount"
          title={buyType ? `${t('Buy.Price')}` : `${t('Amount')}`}
          type="number"
          required
        />
      </FormSection>
      {ITOFixedFee > 0 && (
        <RoyaltiesContainer>
          Royalties: {`${toLocaleFixed(ITOFixedFee, KLV_PRECISION)} KLV`}
        </RoyaltiesContainer>
      )}
    </FormBody>
  );
};

export default Buy;
