import { PropsWithChildren } from 'react';
import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { getAsset } from '@/services/requests/asset';
import { calculateITOBuyFixedFee } from '@/utils/create-transaction/fees-calculation.ts';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { FormBody, FormSection, RoyaltiesContainer } from '../styles';
import { getNetwork } from '@/utils/networkFunctions';

type FormData = {
  buyType: number;
  id: string;
  currencyId: string;
  currencyAmount: number;
  amount: number;
};

const parseBuy = (data: FormData) => {
  data.buyType = data.buyType ? 1 : 0;
  data.currencyId = data.currencyId.toUpperCase();
  data.id = data.id.toUpperCase();
};

const Buy: React.FC<PropsWithChildren<IContractProps>> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit, watch } = useFormContext<FormData>();
  const buyType = watch('buyType');
  const id = watch('id');
  const { setSelectedRoyaltiesFees } = useMulticontract();
  const [ITOFixedFee, setITOFixedFee] = useState(0);
  const network = getNetwork();

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
          title="Buy Type"
          type="checkbox"
          toggleOptions={['ITO Buy', 'Market Buy']}
        />
        <FormInput
          name="id"
          title={buyType ? 'Order ID' : 'ITO Asset ID'}
          required
        />
        <FormInput name="currencyId" title="Currency ID" required />
        <FormInput
          name="amount"
          title={buyType ? 'Price' : 'Amount'}
          type="number"
          required
        />
        {!buyType && network !== 'Mainnet' && (
          <FormInput
            name="currencyAmount"
            title={'Currency Amount'}
            type="number"
            required
          />
        )}
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
