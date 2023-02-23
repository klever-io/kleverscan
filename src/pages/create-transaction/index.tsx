import { WarningIcon } from '@/assets/calendar';
import { Transactions as Icon } from '@/assets/title-icons';
import MultiContract from '@/components/Contract/MultiContract';
import { ContainerQueueMobile } from '@/components/Contract/MultiContract/styles';
import Select from '@/components/Contract/Select';
import {
  Container as ContainerContract,
  CreateTxContainer,
} from '@/components/Contract/styles';
import {
  getType,
  parseValues,
  precisionParse,
} from '@/components/Contract/utils';
import Title from '@/components/Layout/Title';
import { proposalsMessages } from '@/components/Tabs/NetworkParams/proposalMessages';
import { IFormsData, useContract } from '@/contexts/contract';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import { ICollectionList, IParamList } from '@/types/index';
import { INetworkParam, IProposalsResponse } from '@/types/proposals';
import { contractOptions } from '@/utils/contracts';
import formSection from '@/utils/formSections';
import { useDidUpdateEffect } from '@/utils/hooks';
import { Header } from '@/views/assets';
import {
  Container,
  CreateTxCard,
  CreateTxCardContainer,
  QueueItemContainer,
  QueueOutContainer,
  WarningContainer,
  WarningText,
} from '@/views/create-transaction';
import { core } from '@klever/sdk';
import { GetServerSideProps } from 'next';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

interface IContract {
  assets?: any;
  proposals?: any;
  paramsList?: any;
}

let buyKey = 0;

const CreateTransaction: React.FC<IContract> = ({ proposals, paramsList }) => {
  const { extensionInstalled, connectExtension } = useExtension();

  const { isTablet } = useMobile();
  const {
    contractType,
    setContractType,
    setFormSections,
    ownerAddress,
    claimType,
    claimLabel,
    ITOBuy,
    buyLabel,
    setBuyLabel,
    isMultiContract,
    queue,
    setQueue,
    selectedIndex,
    setSelectedIndex,
    formsData,
    setFormsData,
    tokenChosen,
    selectedBucket,
    assetsList,
    setProposals,
    setParamsList,
    getAssets,
    showMultiContracts,
    setShowMultiContracts,
    setTxHash,
    setTxLoading,
    isMultisig,
    setIsMultisig,
    setShowPayload,
    formSections,
    resetForms,
  } = useContract();

  useEffect(() => {
    setProposals(proposals);
    setParamsList(paramsList);
    return () => {
      setContractType('');
    };
  }, []);

  useDidUpdateEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  const defineBuyContract = (label: string) => {
    buyKey += 1;
    setFormSections([
      ...formSection({
        contract: 'BuyContract',
        address: ownerAddress,
        buyLabel: label,
      }),
    ]);
  };

  useEffect(() => {
    if (ITOBuy) {
      setBuyLabel('ITO Asset ID');
      defineBuyContract('ITO Asset ID');
    } else {
      setBuyLabel('Order ID');
      defineBuyContract('Order ID');
    }
  }, [ITOBuy]);

  const handleOption = (selectedOption: any) => {
    setContractType(selectedOption.value);

    switch (selectedOption.value) {
      case 'ProposalContract':
        setFormSections([
          ...formSection({
            contract: selectedOption.value,
            address: ownerAddress,
            paramsList,
          }),
        ]);
        break;

      case 'ClaimContract':
        setFormSections([
          ...formSection({
            contract: selectedOption.value,
            address: ownerAddress,
            claimLabel,
          }),
        ]);
        break;

      case 'BuyContract':
        defineBuyContract(buyLabel);
        break;

      default:
        setFormSections([
          ...formSection({
            contract: selectedOption.value,
            address: ownerAddress,
          }),
        ]);
        break;
    }
  };

  const editContract = (elementIndex: any) => {
    setSelectedIndex(elementIndex);

    if (isTablet && showMultiContracts) {
      setShowMultiContracts(false);
    }
  };

  const removeContractQueue = (contractIndex: number, e: any) => {
    e.stopPropagation();

    if (queue.length > 1) {
      const newItems = queue.filter(
        item => item.elementIndex !== contractIndex,
      );

      setQueue(newItems);
      if (contractIndex === selectedIndex) {
        setSelectedIndex(queue[0].elementIndex);
      }
    }
  };

  const broadcastQueue = async () => {
    const allForms = document.querySelectorAll('form');
    allForms.forEach((form: HTMLFormElement) => {
      form.requestSubmit();
    });
  };

  useDidUpdateEffect(() => {
    const submitForm = async () => {
      setTxLoading(true);
      try {
        const parseFormsData = formsData.map(
          async ({
            data,
            contractType,
            typeAssetTrigger,
            collection,
            proposalId,
            binaryOperations,
            depositType,
            withdrawType,
            assetID,
            itoTriggerType,
            isNFT,
            metadata,
          }: IFormsData) => {
            const parsedvalues = parseValues(
              data,
              contractType,
              typeAssetTrigger,
              claimType,
              assetID,
              collection,
              selectedBucket,
              proposalId,
              tokenChosen,
              ITOBuy,
              binaryOperations,
              depositType,
              withdrawType,
              itoTriggerType,
              isNFT,
            );

            const parsedPayload = await precisionParse(
              parsedvalues,
              contractType,
            );

            return {
              type: getType(contractType),
              payload: parsedPayload,
              metadata,
            };
          },
        );

        const parsedFormsData: any = await Promise.all(parseFormsData);
        const parsedMetadata: string[] = [];
        const parsedData = await parsedFormsData.map((data: any) => {
          if (data.metadata) {
            parsedMetadata.push(
              Buffer.from(data.metadata, 'utf-8').toString('base64'),
            );
          }
          delete data.metadata;
          return data;
        });

        const buildTxs = await core.buildTransaction(
          parsedData,
          parsedMetadata,
        );
        const signedTxs = await window.kleverWeb.signTransaction(buildTxs);
        if (isMultisig) {
          const blob = new Blob([JSON.stringify(signedTxs)], {
            type: 'application/json',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${contractType} - Nonce: ${signedTxs.RawData.Nonce}.json`;
          link.click();
          window.URL.revokeObjectURL(url);
          toast.success(
            'Transaction built and signed, send the file to the co-owner(s)',
          );
        } else {
          const response = await core.broadcastTransactions([signedTxs]);
          setTxHash(response.data.txsHashes[0]);
          toast.success('Transaction broadcast successfully');
          if (response.data.txsHashes[0]) {
            resetForms();
            document.querySelector('form')?.reset();
          }
        }
      } catch (e: any) {
        setFormsData([]);
        toast.error(e?.message ? e.message : e);
        console.warn(`%c ${e}`, 'color: red');
      } finally {
        setTxLoading(false);
      }
    };

    if (formsData.length === queue.length) {
      submitForm();
    }
  }, [formsData]);

  const multiContractProps = {
    broadcastQueue,
    editContract,
    removeContractQueue,
  };

  return (
    <Container>
      {assetsList &&
        !assetsList.find(
          (item: ICollectionList) =>
            item.label === 'KLV' && item.balance && item.balance > 0,
        ) && (
          <WarningContainer>
            <WarningIcon />
            <WarningText>
              Your KLV balance{' '}
              {process.env.DEFAULT_API_HOST?.includes('testnet') && '(testnet)'}{' '}
              {process.env.DEFAULT_API_HOST?.includes('devnet') && '(devnet)'}{' '}
              is zero. You can preview the transaction, but you will not be able
              to send it.
            </WarningText>
          </WarningContainer>
        )}
      <Header>
        <Title Icon={Icon} title={'Create Transaction'} />
      </Header>

      <CreateTxCardContainer>
        <CreateTxCard>
          <div>
            <span>
              Select a contract type, fill in the form fields and click on the
              &quot;Create Transaction&quot; button. A Klever Extension window
              will appear and you will fill in your wallet password. At the end,
              the hash of your transaction will be generated. You can view your
              transaction details on the{' '}
              <a href="https://kleverscan.org/transactions/">Transactions</a>{' '}
              page.
            </span>
          </div>
        </CreateTxCard>
      </CreateTxCardContainer>

      <ContainerContract>
        <Select
          options={contractOptions}
          onChange={contractType => {
            handleOption(contractType);
            setIsMultisig(false);
            setShowPayload(false);
          }}
          getAssets={getAssets}
          isDisabled={true}
          title={'Contract'}
          zIndex={5}
          isModal={false}
        />

        {contractType && (
          <CreateTxContainer isMultiContract={isMultiContract}>
            {isMultiContract && <MultiContract {...multiContractProps} />}
            {isTablet && isMultiContract && (
              <ContainerQueueMobile
                onClick={() => setShowMultiContracts(!showMultiContracts)}
              >
                Queue ( {queue.length} )
              </ContainerQueueMobile>
            )}
            <QueueOutContainer>
              {queue.map((item, index) => {
                return (
                  <QueueItemContainer
                    key={JSON.stringify([...formSections, { itemKey: index }])}
                    visible={item.elementIndex === selectedIndex}
                  >
                    {item.ref}
                  </QueueItemContainer>
                );
              })}
            </QueueOutContainer>
          </CreateTxContainer>
        )}
      </ContainerContract>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const proposalResponse: IProposalsResponse = await api.get({
    route: 'proposals/list',
  });

  const { data } = await api.get({ route: 'network/network-parameters' });

  let networkParams = {} as INetworkParam[];
  const paramsList = [] as IParamList[];

  if (data) {
    networkParams = Object.keys(proposalsMessages).map((key, index) => {
      return {
        number: index,
        parameter: proposalsMessages[key] ? proposalsMessages[key] : '',
        currentValue: data.parameters[key].value,
      };
    });
  }

  networkParams.length &&
    networkParams?.forEach((param: INetworkParam) => {
      paramsList.push({
        value: param.number,
        label: `${param.parameter}: ${param.currentValue}`,
        currentValue: param.currentValue,
      });
    });

  const proposals: any = [];

  const descriptionProposal = (item: any) => {
    if (item.description !== '') {
      if (item.description.length < 40) {
        return `${item.proposalId}: ${item.description}`;
      }
      return `${item.proposalId}: ${item.description.substring(0, 40)}...`;
    }

    return String(item.proposalId);
  };

  proposalResponse?.data?.proposals
    .filter(proposal => proposal.proposalStatus === 'ActiveProposal')
    .forEach((item: any) => {
      proposals.push({
        label: descriptionProposal(item),
        value: item.proposalId,
      });
    });

  proposals.sort((a: any, b: any) => (a.value > b.value ? 1 : -1));

  const props: any = {
    proposals: proposals,
    paramsList: paramsList,
  };

  return { props };
};

export default CreateTransaction;
