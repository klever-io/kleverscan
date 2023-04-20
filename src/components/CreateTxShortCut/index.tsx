import { PlusWhite, SendWhite } from '@/assets/icons';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import React, { useEffect, useRef, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import ModalContract from '../Contract/ModalContract';
import { BackgroundHelper } from '../Header/ConnectWallet/styles';
import WalletHelp from '../Header/WalletHelp';
import { Button, Container, ShortCutDropdown } from './styles';

interface IShortCutContract {
  title: string;
  type: string;
  Icon: any;
}

const CreateTxShortcut: React.FC = () => {
  const [contractType, setContractType] = useState('');
  const [openModalTransactions, setOpenModalTransactions] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const [valueContract, setValueContract] = useState('');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const { extensionInstalled, connectExtension } = useExtension();
  const { isMobile } = useMobile();

  const shortCutContract: IShortCutContract[] = [
    { title: 'Transfer', type: 'TransferContract', Icon: SendWhite },
    { title: 'Create Asset', type: 'CreateAssetContract', Icon: PlusWhite },
    { title: 'Create ITO', type: 'ConfigITOContract', Icon: PlusWhite },
    { title: 'Freeze', type: 'FreezeContract', Icon: PlusWhite },
    { title: 'Vote', type: 'VoteContract', Icon: PlusWhite },
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

  const handleClick = (contract: IShortCutContract, e: any) => {
    e.stopPropagation();

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

  const handleDropDown = (e: any) => {
    e.stopPropagation();
    setOpenDropdown(!openDropdown);
  };

  const MobileVersion: React.FC = () => {
    return (
      <>
        <Container onClick={handleDropDown}>
          <div>
            <h3>Create Transaction</h3>

            <RiArrowDownSLine />
          </div>

          <ShortCutDropdown isOpen={openDropdown}>
            {shortCutContract.map(contract => (
              <Button
                onClick={e => handleClick(contract, e)}
                key={JSON.stringify(contract)}
                isMobile={isMobile}
              >
                <contract.Icon />
                {contract.title}
              </Button>
            ))}
          </ShortCutDropdown>
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
        {extensionInstalled && <ModalContract {...modalOptions} />}
      </>
    );
  };

  return isMobile ? (
    <MobileVersion />
  ) : (
    <>
      <Container>
        <div>
          <h3>Create Transaction</h3>

          {isMobile && <RiArrowDownSLine />}
          {!isMobile &&
            shortCutContract.map(contract => (
              <Button
                onClick={e => handleClick(contract, e)}
                key={JSON.stringify(contract)}
              >
                <contract.Icon />
                {contract.title}
              </Button>
            ))}
        </div>

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
      {extensionInstalled && <ModalContract {...modalOptions} />}
    </>
  );
};

export default CreateTxShortcut;
