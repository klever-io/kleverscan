import { PlusWhite, SendWhite } from '@/assets/icons';
import { useContractModal } from '@/contexts/contractModal';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import React, { useEffect, useRef, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { BackgroundHelper } from '../Header/ConnectWallet/styles';
import WalletHelp from '../Header/WalletHelp';
import {
  Container,
  CreateTxHeader,
  InteractionButtonsContainer,
  ShortCutDropdown,
} from './styles';

interface IShortCutContract {
  title: string;
  type: string;
  Icon: any;
}

const CreateTxShortcut: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const { extensionInstalled, connectExtension } = useExtension();
  const { isMobile } = useMobile();

  const { getInteractionsButtons } = useContractModal();

  const closeMenu = () => {
    setOpenDrawer(false);
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

  const ButtonIcons = [SendWhite, PlusWhite, PlusWhite, PlusWhite, PlusWhite];

  const interactionButtonsFactory = getInteractionsButtons([
    {
      title: 'Transfer',
      contractType: 'TransferContract',
    },
    {
      title: 'Create Asset',
      contractType: 'CreateAssetContract',
    },
    {
      title: 'Create ITO',
      contractType: 'ConfigITOContract',
    },
    {
      title: 'Freeze',
      contractType: 'FreezeContract',
    },
    {
      title: 'Vote',
      contractType: 'VoteContract',
    },
  ]);

  const interactionButtons = interactionButtonsFactory.map((Button, index) => {
    const ButtonIcon = ButtonIcons[index];
    return <Button key={JSON.stringify(Button)}>{<ButtonIcon />}</Button>;
  });

  const MobileVersion: React.FC = () => {
    return (
      <>
        <Container onClick={handleDropDown}>
          <CreateTxHeader>
            <h3>Create Transaction</h3>

            <RiArrowDownSLine
              style={{
                transform: openDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 1s ease-in-out',
              }}
            />
          </CreateTxHeader>

          <ShortCutDropdown isOpen={openDropdown}>
            {interactionButtons}
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
      </>
    );
  };

  return isMobile ? (
    <MobileVersion />
  ) : (
    <>
      <Container>
        <InteractionButtonsContainer>
          <h3>Create Transaction</h3>

          {interactionButtons}
        </InteractionButtonsContainer>

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
    </>
  );
};

export default CreateTxShortcut;
