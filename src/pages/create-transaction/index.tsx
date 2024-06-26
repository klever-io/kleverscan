import { PropsWithChildren } from 'react';
import { WarningIcon } from '@/assets/calendar';
import { Transactions as Icon } from '@/assets/title-icons';
import MultiContract from '@/components/Contract/MultiContract';
import { ContainerQueueMobile } from '@/components/Contract/MultiContract/styles';
import {
  Container as ContainerContract,
  CreateTxContainer,
} from '@/components/Contract/styles';
import AdvancedOptions from '@/components/Form/AdvancedOptions';
import Title from '@/components/Layout/Title';
import WarningModal from '@/components/Modals/Warning';
import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import { Header } from '@/styles/common';
import {
  Container,
  CreateTxCard,
  CreateTxCardContainer,
  QueueItemContainer,
  QueueOutContainer,
  WarningContainer,
  WarningText,
} from '@/views/create-transaction';
import Link from 'next/link';
import React, { useEffect } from 'react';

export const warningMessage = `You don't have enough currency. Please check the amount of your transaction as well as the fee cost.`;

const CreateTransaction: React.FC<PropsWithChildren> = () => {
  const [isAccountEmpty, setIsAccountEmpty] = React.useState<boolean>(false);
  const { extensionInstalled, connectExtension, walletAddress } =
    useExtension();

  const { isTablet } = useMobile();

  const { getAssets } = useContract();

  const {
    isMultiContract,
    queue,
    selectedId,
    showMultiContracts,
    setShowMultiContracts,
  } = useMulticontract();

  useEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  useEffect(() => {
    const isAccountEmpty = async () => {
      const assetsList = await getAssets();
      if (
        !assetsList.find(
          item => item.label === 'KLV' && item.balance && item.balance > 0,
        )
      ) {
        setIsAccountEmpty(true);
      } else {
        setIsAccountEmpty(false);
      }
    };
    walletAddress && isAccountEmpty();
  }, [walletAddress]);

  return (
    <Container>
      {extensionInstalled === false && (
        <WarningContainer>
          <WarningIcon />
          <WarningText>
            Your wallet is not connected. You can preview the transaction, but
            you will not be able to send it.
            <p>
              To send transactions{' '}
              <a
                href="https://chromewebstore.google.com/detail/klever-wallet/ifclboecfhkjbpmhgehodcjpciihhmif"
                target="_blank"
                rel="noreferrer nofollow"
              >
                download the Klever Extension
              </a>{' '}
              if you are in a desktop.
            </p>
            <p>
              Or enter this page via{' '}
              <a
                href="https://www.klever.io/"
                target="_blank"
                rel="noreferrer nofollow"
              >
                the Klever Wallet App internal browser
              </a>{' '}
              if you are in a mobile device.
            </p>
          </WarningText>
        </WarningContainer>
      )}
      {extensionInstalled && isAccountEmpty && (
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
              <Link href="/transactions">Transactions</Link> page.
            </span>
          </div>
        </CreateTxCard>
      </CreateTxCardContainer>

      <ContainerContract>
        <CreateTxContainer isMultiContract={isMultiContract}>
          {isMultiContract && <MultiContract />}
          {isTablet && isMultiContract && (
            <ContainerQueueMobile
              onClick={() => setShowMultiContracts(!showMultiContracts)}
            >
              Queue ( {queue.length} )
            </ContainerQueueMobile>
          )}
          <QueueOutContainer>
            {queue.map(item => {
              return (
                <QueueItemContainer
                  key={item.elementId}
                  visible={item.elementId === selectedId}
                >
                  {item.ref}
                </QueueItemContainer>
              );
            })}
          </QueueOutContainer>
        </CreateTxContainer>
        <AdvancedOptions />
      </ContainerContract>
      <WarningModal message={warningMessage} />
    </Container>
  );
};

export default CreateTransaction;
