import { useContract } from '@/contexts/contract';
import { Card } from '@/styles/common';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { IoOpenOutline } from 'react-icons/io5';
import ConfirmPayload from '../ConfirmPayload';
import Copy from '../Copy';
import MetadataOptions from '../Form/Metadata';
import { InlineLoader } from '../Loader';
import { Loader } from '../Loader/styles';
import { getContract } from '../TransactionForms/CustomForms';
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
  elementIndex?: number;
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
  elementIndex = 0,
  defaultValues = null,
}) => {
  const {
    contractType,
    setContractType,
    txLoading: loading,
    txHash,
    setTxHash,
    handleSubmit,
    openModal: openConfirmModal,
  } = useContract();

  const [metadata, setMetadata] = useState<string>('');

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

  const handleFormSubmit = async (data: any) => {
    await handleSubmit(data, metadata);
  };

  const metadataProps = {
    metadata,
    setMetadata,
  };

  const formProps = {
    formKey: elementIndex,
    handleFormSubmit,
    ...metadataProps,
  };

  const hashProps = {
    hash: txHash,
    setHash: setTxHash,
  };

  return (
    <Container>
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
              </div>
            </Card>
          </CardContainer>
        )}

        {getContract(contractType, formProps)}
        <MetadataOptions {...metadataProps} />
      </FormProvider>
    </Container>
  );
};

export default Contract;
