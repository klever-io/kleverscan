import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import React, { useEffect, useRef, useState } from 'react';
import ModalContract from '../Contract/ModalContract';
import { BackgroundHelper } from '../Header/ConnectWallet/styles';
import WalletHelp from '../Header/WalletHelp';
import { Button, Container, Content } from './styles';

interface IShortCutContract {
  title: string;
  type: string;
}

const CreateTxShortcut: React.FC = () => {
  const [contractType, setContractType] = useState('');
  const [openModalTransactions, setOpenModalTransactions] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const [valueContract, setValueContract] = useState('');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const { extensionInstalled, connectExtension } = useExtension();
  const { isMobile } = useMobile();

  const shortCutContract: IShortCutContract[] = [
    { title: 'Transfer', type: 'TransferContract' },
    { title: 'Create Asset', type: 'CreateAssetContract' },
    { title: 'Create ITO', type: 'ConfigITOContract' },
    { title: 'Freeze', type: 'FreezeContract' },
    { title: 'Vote', type: 'VoteContract' },
  ];

  const modalOptions = {
    contractType,
    setContractType,
    setOpenModal: setOpenModalTransactions,
    openModal: openModalTransactions,
    title: titleModal,
    setValueContract,
  };

  const closeMenu = () => {
    setOpenDrawer(false);
  };

  const handleClick = (contract: IShortCutContract) => {
    if (!extensionInstalled) {
      setOpenDrawer(true);
      return;
    }
    setContractType(contract.type);
    setOpenModalTransactions(valueContract === '--' ? false : true);
    setTitleModal(`${contract.title} Contract`);
  };

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        left: contentRef?.current?.scrollWidth,
        behavior: 'instant',
      } as any);
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollLeft = 0;
        }
      }, 300);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = openDrawer ? 'hidden' : 'visible';
  }, [openDrawer]);

  return (
    <Container>
      <h3>Quick Transaction</h3>

      <Content ref={contentRef}>
        {shortCutContract.map(contract => (
          <Button
            onClick={() => handleClick(contract)}
            key={JSON.stringify(contract)}
          >
            <span>{contract.title}</span>
          </Button>
        ))}
        {extensionInstalled && <ModalContract {...modalOptions} />}
      </Content>
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
    </Container>
  );
};

export default CreateTxShortcut;
