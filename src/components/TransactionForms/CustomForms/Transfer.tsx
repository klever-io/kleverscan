import { PropsWithChildren } from 'react';
import { useMulticontract } from '@/contexts/contract/multicontract';
import {
  calculateTransferFixedFee,
  calculateTransterPercentageFee,
} from '@/utils/create-transaction/fees-calculation.ts';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { KDASelect } from '../KDASelect';
import { FormBody, FormSection, RoyaltiesContainer } from '../styles';

type FormData = {
  receiver: string;
  amount: number;
  kda: string;
};

const Transfer: React.FC<PropsWithChildren<IContractProps>> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit, watch } = useFormContext<FormData>();
  const { setSelectedRoyaltiesFees, queue } = useMulticontract();
  const amount = watch('amount');

  const collection = queue[formKey].collection;

  useEffect(() => {
    if (collection?.royalties?.transferPercentage) {
      setSelectedRoyaltiesFees(
        calculateTransterPercentageFee(amount, collection),
      );
    } else if (collection?.royalties?.transferFixed) {
      setSelectedRoyaltiesFees(calculateTransferFixedFee(collection));
    }
  }, [amount, collection]);

  const transferParse = (data: FormData) => {
    if (collection?.isNFT) {
      data['amount'] = 1;
    }
  };

  const onSubmit = async (data: FormData) => {
    transferParse(data);
    await handleFormSubmit(data);
  };

  const getTransferRoyaltyFee = (): number => {
    if (collection?.isNFT) {
      return calculateTransferFixedFee(collection);
    } else {
      return calculateTransterPercentageFee(amount, collection);
    }
  };

  const getKdaRoyalty = (): string => {
    if (collection?.isNFT) {
      return 'KLV';
    }
    return collection?.value || '';
  };

  const getRoyaltyPrecision = (): number => {
    if (collection?.isNFT) {
      return KLV_PRECISION;
    }
    return collection?.precision || 0;
  };

  const transferRoyalties = getTransferRoyaltyFee();
  const kdaRoyalty = getKdaRoyalty();
  const royaltyPrecision = getRoyaltyPrecision();

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <KDASelect validateFields={['amount']} />
      <FormSection>
        {!collection?.isNFT && (
          <FormInput
            name="amount"
            title="Amount"
            type="number"
            required
            precision={collection?.precision}
          />
        )}
        <FormInput name="receiver" title="Receiver Address" required />
      </FormSection>
      {transferRoyalties > 0 && (
        <RoyaltiesContainer>
          Royalties:{' '}
          {`${toLocaleFixed(
            transferRoyalties,
            royaltyPrecision,
          )} ${kdaRoyalty}`}
        </RoyaltiesContainer>
      )}
    </FormBody>
  );
};

export default Transfer;
