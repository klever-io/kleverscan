import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import React, { useEffect, useState } from 'react';
import ModalContract, { IModalContract } from '../Contract/ModalContract';
import { BackgroundHelper } from '../Header/ConnectWallet/styles';
import WalletHelp from '../Header/WalletHelp';
import { Title } from '../InputGlobal/HomeInput/styles';
import { Carousel } from './Carousel';
import { CardItem, Container, IconSquarePlus, TitleContainer } from './styles';

interface IShortCutContract {
  title: string;
  type: string;
}

const QuickAccess: React.FC = () => {
  const [contractType, setContractType] = useState('');
  const [openModalTransactions, setOpenModalTransactions] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const [valueContract, setValueContract] = useState('');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const { extensionInstalled, connectExtension } = useExtension();
  const { isMobile } = useMobile();

  const quickAccessContract: IShortCutContract[] = [
    { title: 'Transfer', type: 'TransferContract' },
    { title: 'Create Asset', type: 'CreateAssetContract' },
    { title: 'Create ITO', type: 'ConfigITOContract' },
    { title: 'Freeze', type: 'FreezeContract' },
    { title: 'Vote', type: 'VoteContract' },
  ];

  const modalOptions: IModalContract = {
    contractType,
    setOpenModal: setOpenModalTransactions,
    title: titleModal,
  };

  const closeMenu = () => {
    setOpenDrawer(false);
  };

  const handleClick = (contract: IShortCutContract, e: any) => {
    if (!extensionInstalled) {
      setOpenDrawer(true);
      return;
    }
    setContractType(contract.type);
    setOpenModalTransactions(valueContract === '--' ? false : true);
    setTitleModal(`${contract.title} Contract`);
  };

  useEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  return (
    <Container>
      <TitleContainer>
        <Title>Quick access</Title>
        <small>Interact with the blockchain through Explorer</small>
      </TitleContainer>
      <Carousel>
        {quickAccessContract.map(contract => (
          <CardItem
            key={JSON.stringify(contract.title)}
            onClick={e => handleClick(contract, e)}
          >
            <IconSquarePlus />
            <p>{contract.title}</p>
          </CardItem>
        ))}
      </Carousel>
      <BackgroundHelper
        onClick={closeMenu}
        onTouchStart={closeMenu}
        opened={openDrawer}
      />
      <WalletHelp
        closeDrawer={() => setOpenDrawer(false)}
        opened={openDrawer}
        clickConnectionMobile={() => {
          openDrawer;
        }}
      />
      {extensionInstalled && openModalTransactions && (
        <ModalContract {...modalOptions} />
      )}
    </Container>
  );
};

export default QuickAccess;
