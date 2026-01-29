import { useContract } from '@/contexts/contract';
import { useFees } from '@/contexts/contract/fees';
import { IQueue, useMulticontract } from '@/contexts/contract/multicontract';
import { Card } from '@/styles/common';
import { setQueryAndRouter } from '@/utils';
import { useForceUpdate } from '@/utils/hooks';
import * as clipboard from 'clipboard-polyfill';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { AiOutlineClear } from 'react-icons/ai';
import { FiShare2 } from 'react-icons/fi';
import { IoOpenOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Copy from '../Copy';
import { Button } from '../CreateTxShortCut/styles';
import MetadataOptions from '../Form/Metadata';
import SubmitButton from '../Form/SubmitButton';
import { InlineLoader } from '../Loader';
import { Loader } from '../Loader/styles';
import ConfirmPayload from '../Modals/ConfirmPayload';
import { RenderContract } from '../TransactionForms/CustomForms';
import Select from './Select';
import {
  CardContainer,
  CloseIcon,
  Container,
  ExtraOptionContainer,
  FormActions,
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

export const HashComponent: React.FC<
  PropsWithChildren<IHashComponentProps>
> = ({ hash, setHash }) => {
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
        <Link
          href={`/transaction/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Hash:{hash}
          <IoOpenOutline />
        </Link>
      ) : (
        <InlineLoader color="white" />
      )}
      <IconsContainer>
        {!loading && <Copy data={hash ? hash : ''} color="white" />}
        <CloseIcon onClick={() => setHash(null)} />
      </IconsContainer>
    </ExtraOptionContainer>
  );
};

const Contract: React.FC<PropsWithChildren<IContract>> = ({
  elementId = 0,
  defaultValues = null,
}) => {
  const {
    txLoading: loading,
    txHash,
    setTxHash,
    handleSubmit,
    isMultisig,
    contractOptions,
    payload,
  } = useContract();

  const {
    setSelectedContractAndQuery,
    queue,
    isMultiContract,
    clearQuery,
    isModal,
  } = useMulticontract();
  const { getKappFee } = useFees();
  const router = useRouter();
  const forceUpdate = useForceUpdate();

  const currentContract = queue.find(
    (item: IQueue) => item.elementId === elementId,
  ) as IQueue;

  const kappFee = getKappFee(currentContract?.contractType);

  const formMethods = useForm({
    mode: 'all',
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      formMethods.reset(defaultValues);
    }
  }, [defaultValues]);

  useEffect(() => {
    if (loading) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'unset';
    }
  }, [loading]);

  useEffect(() => {
    if (!isMultiContract && router.isReady && !router.query) {
      setQueryAndRouter(
        {
          contract: currentContract?.contractType,
          contractDetails: JSON.stringify(formMethods.getValues()),
        },
        router,
      );
    }
  }, [isMultiContract, router.isReady]);

  const handleFormSubmit = async (data: any) => {
    await handleSubmit(
      data,
      currentContract?.metadata || '',
      currentContract?.contractType,
      queue.length,
    );
  };

  const handleClear = () => {
    formMethods.reset({});
    clearQuery();
    forceUpdate();
  };

  const changeHandler = (contractType: any) => {
    setSelectedContractAndQuery(contractType.value);
    formMethods.reset({});

    isMultisig.current = false;
  };

  const handleShare = async () => {
    const query = new URLSearchParams({
      contract: currentContract?.contractType,
      contractDetails: JSON.stringify(formMethods.getValues()),
    }).toString();

    const url = `${window.location.origin}/create-transaction?${query}`;

    try {
      if (navigator.share)
        await navigator.share({
          url,
        });
      else {
        await clipboard.writeText(url);
        toast.info('Contract link copied to clipboard');
      }
    } catch (e) {
      console.warn(e);
    }
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
      {!isModal && (
        <Select
          options={contractOptions}
          selectedValue={contractOptions.find(
            item => item.value === currentContract?.contractType,
          )}
          onChange={changeHandler}
          isDisabled={true}
          title={'Contract'}
          zIndex={5}
          isModal={false}
        />
      )}

      <FormProvider {...formMethods}>
        {loading &&
          ReactDOM.createPortal(
            <LoadingBackground>
              <Loader />
            </LoadingBackground>,
            window.document.body,
          )}
        {payload && <ConfirmPayload />}
        {txHash && <HashComponent {...hashProps} />}

        {contractsDescription[
          currentContract?.contractType as keyof typeof contractsDescription
        ] && (
          <CardContainer>
            <Card>
              <div>
                <span>
                  {
                    contractsDescription[
                      currentContract?.contractType as keyof typeof contractsDescription
                    ]
                  }
                </span>
                <span>KApp Fee: {kappFee} KLV</span>
              </div>
            </Card>
          </CardContainer>
        )}

        <RenderContract
          contractName={currentContract?.contractType}
          contractProps={formProps}
        />

        <FormActions>
          <Button onClick={handleClear}>
            <AiOutlineClear />
            Clear Contract
          </Button>
          <Button onClick={handleShare}>
            <FiShare2 />
            Share Contract
          </Button>
        </FormActions>

        <MetadataOptions />
        <SubmitButton />
      </FormProvider>
    </Container>
  );
};

export default Contract;
