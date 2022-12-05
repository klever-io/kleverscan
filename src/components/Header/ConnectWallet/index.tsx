import Copy from '@/components/Copy';
import IconTooltip from '@/components/IconTooltip';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { QRCodeSVG } from 'qrcode.react';
import React, { useCallback, useEffect, useState } from 'react';
import { MobileNavbarItem } from '..';
import { parseAddress } from '../../../utils';
import OptionsContainer from '../OptionsContainer';
import WalletHelp from '../WalletHelp';
import {
  BackgroundHelper,
  ButtonAndCopy,
  ConnectButton,
  ConnectContainer,
  CopyContainer,
  MobileStyledTransfer,
  NavBarOptionsContainer,
  NavBarOptionsItems,
  QRCodeContainer,
  QRCodeContent,
  StyledTransfer,
} from './styles';

interface IConnectWallet {
  clickConnection: () => void;
}
const ConnectWallet: React.FC<IConnectWallet> = ({ clickConnection }) => {
  const router = useRouter();
  const [displayQr, setDisplayQr] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const {
    walletAddress,
    extensionLoading,
    extensionInstalled,
    connectExtension,
  } = useExtension();

  const { handleMenu } = useMobile();

  const getCreateTransactionButton = useCallback(() => {
    if (extensionInstalled && walletAddress && typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        const createTransactionProps = {
          name: 'Create Transaction',
          pathTo: '/create-transaction',
          Icon: MobileStyledTransfer,
          onClick: handleMenu,
        };
        return <MobileNavbarItem {...createTransactionProps} />;
      } else if (window.innerWidth >= 768) {
        const handleNavigate = () => {
          router.push('/create-transaction');
        };
        const iconTooltipProps = {
          Icon: StyledTransfer,
          handleClick: handleNavigate,
          tooltip: 'Create Transaction',
        };
        return <IconTooltip {...iconTooltipProps} />;
      }
    }
  }, [extensionInstalled, walletAddress, router, handleMenu]);

  const renderOptionsWithConnection = () => {
    if (window.innerWidth < 768) {
      return getCreateTransactionButton();
    }
    return (
      <NavBarOptionsItems>
        {getCreateTransactionButton()}
        <NavBarOptionsContainer>
          <CopyContainer>
            {walletAddress && (
              <Copy info="Wallet Address" data={walletAddress} />
            )}
          </CopyContainer>
          <OptionsContainer isConnected={!!walletAddress} />
        </NavBarOptionsContainer>
      </NavBarOptionsItems>
    );
  };
  const handleClick = () => {
    setOpenDrawer(true);
  };
  const closeMenu = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    document.body.style.overflow = openDrawer ? 'hidden' : 'visible';
  }, [openDrawer]);
  return (
    <>
      {!extensionInstalled && (
        <ConnectContainer>
          <ConnectButton onClick={handleClick}>
            How to connect Wallet
          </ConnectButton>
        </ConnectContainer>
      )}

      <BackgroundHelper
        onClick={closeMenu}
        onTouchStart={closeMenu}
        opened={openDrawer}
      />
      <WalletHelp
        closeDrawer={() => setOpenDrawer(false)}
        opened={openDrawer}
        clickConnectionMobile={clickConnection}
      />

      {extensionInstalled && (
        <ConnectContainer>
          <ButtonAndCopy
            onMouseOver={() => {
              if (walletAddress) {
                setDisplayQr(true);
              }
            }}
            onMouseOut={() => setDisplayQr(false)}
          >
            <ConnectButton
              onClick={() => connectExtension()}
              key={String(extensionInstalled)}
            >
              {extensionLoading ? (
                <span> Loading... </span>
              ) : (
                <>
                  {walletAddress && (
                    <Link href={`/account/${walletAddress}`}>
                      <a>
                        <span>{parseAddress(walletAddress, 25)}</span>
                      </a>
                    </Link>
                  )}
                  {!walletAddress && <span>Connect your wallet</span>}
                </>
              )}
            </ConnectButton>
            {window.innerWidth < 768 && (
              <CopyContainer>
                {walletAddress && (
                  <Copy info="Wallet Address" data={walletAddress} />
                )}
              </CopyContainer>
            )}
          </ButtonAndCopy>
          {renderOptionsWithConnection()}
        </ConnectContainer>
      )}
      {displayQr && walletAddress && (
        <QRCodeContainer>
          <QRCodeContent>
            <div>
              <QRCodeSVG value={walletAddress} size={100}></QRCodeSVG>
            </div>
          </QRCodeContent>
        </QRCodeContainer>
      )}
    </>
  );
};

export default ConnectWallet;
