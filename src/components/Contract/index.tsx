import { useContract } from '@/contexts/contract';
import { useFees } from '@/contexts/contract/fees';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { Card } from '@/styles/common';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { IoOpenOutline } from 'react-icons/io5';
import ConfirmPayload from '../ConfirmPayload';
import Copy from '../Copy';
import MetadataOptions from '../Form/Metadata';
import SubmitButton from '../Form/SubmitButton';
import { InlineLoader } from '../Loader';
import { Loader } from '../Loader/styles';
import { RenderContract } from '../TransactionForms/CustomForms';
import Select from './Select';
import {
  CardContainer,
  CloseIcon,
  Container,
  ExtraOptionContainer,
  IconsContainer,
  LoadingBackground,
} from './styles';
import { contractsDescription } from './utils';

export interface IContract {
  modalContractType?: { value: string };
  elementId?: number;
  defaultValues?: any;
}

export interface IHashComponentProps {
  hash: string | null;
  setHash: React.Dispatch<React.SetStateAction<string | null>>;
}

export const HashComponent: React.FC<IHashComponentProps> = ({
  hash,
  setHash,
}) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await new Promise(resolve =>
        setTimeout(resolve, 2000 + Math.random() * 1000),
      );

      setLoading(false);
    })();
  }, [hash]);

  return (
    <ExtraOptionContainer>
      {!loading ? (
        <Link href={`/transaction/${hash}`}>
          <a target="_blank" rel="noopener noreferrer">
            Hash: {hash}
            <IoOpenOutline />
          </a>
        </Link>
      ) : (
        <InlineLoader />
      )}
      <IconsContainer>
        {!loading && <Copy data={hash ? hash : ''} />}
        <CloseIcon onClick={() => setHash(null)} />
      </IconsContainer>
    </ExtraOptionContainer>
  );
};

const Contract: React.FC<IContract> = ({
  modalContractType,
  elementId = 0,
  defaultValues = null,
}) => {
  const {
    txLoading: loading,
    txHash,
    setTxHash,
    handleSubmit,
    openModal: openConfirmModal,
    isMultisig,
    contractOptions,
  } = useContract();

  const { metadata, setSelectedContractType, selectedContractType, queue } =
    useMulticontract();
  const { getKappFee } = useFees();

  const [contractType, setContractType] =
    React.useState<string>(selectedContractType);

  const kappFee = getKappFee(contractType);

  const formMethods = useForm({
    mode: 'all',
    defaultValues,
  });

  useEffect(() => {
    if (loading) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'unset';
    }
  }, [loading]);

  useEffect(() => {
    if (modalContractType) {
      setTxHash(null);
      setContractType(modalContractType.value);

      return () => {
        setContractType('');
      };
    }
  }, [modalContractType?.value]);

  useEffect(() => {
    setSelectedContractType(contractType);

    return () => {
      formMethods.reset({});
    };
  }, [contractType]);

  const handleFormSubmit = async (data: any) => {
    await handleSubmit(
      data,
      queue.find(item => item.elementId === elementId)?.metadata || '',
      contractType,
      queue.length,
    );
  };

  const formProps = {
    formKey: elementId,
    handleFormSubmit,
  };

  const hashProps = {
    hash: txHash,
    setHash: setTxHash,
  };

  return (
    <Container>
      <Select
        options={contractOptions}
        selectedValue={contractOptions.find(
          item => item.value === contractType,
        )}
        onChange={contractType => {
          setContractType(contractType.value);

          isMultisig.current = false;
        }}
        isDisabled={true}
        title={'Contract'}
        zIndex={5}
        isModal={false}
      />

      <FormProvider {...formMethods}>
        {loading &&
          ReactDOM.createPortal(
            <LoadingBackground>
              <Loader />
            </LoadingBackground>,
            window.document.body,
          )}
        {openConfirmModal && <ConfirmPayload />}
        {txHash && <HashComponent {...hashProps} />}

        {contractsDescription[contractType] && (
          <CardContainer>
            <Card>
              <div>
                <span>{contractsDescription[contractType]}</span>
                <span>KApp Fee: {kappFee} KLV</span>
              </div>
            </Card>
          </CardContainer>
        )}

        <RenderContract contractName={contractType} contractProps={formProps} />

        <MetadataOptions />
        <SubmitButton />
      </FormProvider>
    </Container>
  );
};

export default Contract;
