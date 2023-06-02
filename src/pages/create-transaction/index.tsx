import { WarningIcon } from '@/assets/calendar';
import { Transactions as Icon } from '@/assets/title-icons';
import MultiContract from '@/components/Contract/MultiContract';
import { ContainerQueueMobile } from '@/components/Contract/MultiContract/styles';
import Select from '@/components/Contract/Select';
import {
  Container as ContainerContract,
  CreateTxContainer,
} from '@/components/Contract/styles';
import AdvancedOptions from '@/components/Form/AdvancedOptions';
import Title from '@/components/Layout/Title';
import { useContract } from '@/contexts/contract';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
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
import React, { useEffect } from 'react';

const CreateTransaction: React.FC = () => {
  const [isAccountEmpty, setIsAccountEmpty] = React.useState<boolean>(false);
  const { extensionInstalled, connectExtension } = useExtension();

  const { isTablet } = useMobile();

  const {
    contractType,
    setContractType,
    isMultiContract,
    queue,
    setQueue,
    selectedIndex,
    setSelectedIndex,
    showMultiContracts,
    setShowMultiContracts,
    isMultisig,
    contractOptions,
    getAssets,
  } = useContract();

  useEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  const handleOption = (selectedOption: any) => {
    setContractType(selectedOption.value);
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

  useEffect(() => {
    const isAccountEmpty = async () => {
      const assetsList = await getAssets();
      if (
        !assetsList.find(
          item => item.label === 'KLV' && item.balance && item.balance > 0,
        )
      ) {
        setIsAccountEmpty(true);
      }
    };
    isAccountEmpty();
  }, []);

  const multiContractProps = {
    editContract,
    removeContractQueue,
  };

  return (
    <Container>
      {isAccountEmpty && (
        <WarningContainer>
          <WarningIcon />
          <WarningText>
            Your KLV balance{' '}
            {process.env.DEFAULT_API_HOST?.includes('testnet') && '(testnet)'}{' '}
            {process.env.DEFAULT_API_HOST?.includes('devnet') && '(devnet)'} is
            zero. You can preview the transaction, but you will not be able to
            send it.
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
          selectedValue={contractOptions.find(
            item => item.value === contractType,
          )}
          onChange={contractType => {
            handleOption(contractType);
            isMultisig.current = false;
          }}
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
                    key={JSON.stringify(item.ref)}
                    visible={item.elementIndex === selectedIndex}
                  >
                    {item.ref}
                  </QueueItemContainer>
                );
              })}
            </QueueOutContainer>
          </CreateTxContainer>
        )}
        <AdvancedOptions />
      </ContainerContract>
    </Container>
  );
};

export default CreateTransaction;
