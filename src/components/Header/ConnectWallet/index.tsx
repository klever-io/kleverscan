import { AccountDetailsModal } from '@/components/AccountDetailsModal';
import Tour from '@/components/Tour';
import { useExtension } from '@/contexts/extension';
import { useScroll } from '@/utils/hooks';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { BiWalletAlt } from 'react-icons/bi';
import WalletHelp from '../WalletHelp';
import {
  BackgroundHelper,
  BackGroundUserInfo,
  ConnectButton,
  ConnectContainer,
} from './styles';

interface IConnectWallet {
  clickConnection: () => void;
}

const ConnectWallet: React.FC<IConnectWallet> = ({ clickConnection }) => {
  const [openUserInfos, setOpenUserInfos] = useState(false);
  const {
    walletAddress,
    extensionLoading,
    extensionInstalled,
    connectExtension,
    openDrawer,
    setOpenDrawer,
  } = useExtension();

  const handleClick = () => {
    setOpenDrawer(true);
  };
  const closeMenu = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    document.body.style.overflow = openDrawer ? 'hidden' : 'visible';
  }, [openDrawer]);

  useScroll(openUserInfos, () => setOpenUserInfos(false));

  const connectAndOpen = () => {
    if (!walletAddress) {
      connectExtension();
    } else {
      setOpenUserInfos(!openUserInfos);
    }
  };

  return (
    <>
      {!extensionInstalled && (
        <>
          <ConnectContainer>
            <ConnectButton onClick={handleClick}>
              <BiWalletAlt size={'1.2em'} />
              <span>Klever Extension</span>
            </ConnectButton>
          </ConnectContainer>
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
        </>
      )}

      {extensionInstalled && (
        <Tour
          guideName="connectWallet"
          side="bottom"
          tourTooltip="Now that you connected your wallet, click here to see more options"
          condition={!!walletAddress}
        >
          <ConnectContainer
            onClick={() => connectAndOpen()}
            key={String(extensionInstalled)}
          >
            <ConnectButton>
              {extensionLoading ? (
                <span> Loading... </span>
              ) : (
                <>
                  {walletAddress && (
                    <div onClick={() => setOpenUserInfos(!openUserInfos)}>
                      <AiOutlineUser size={'1.3em'} />
                      <span>Show Wallet</span>
                    </div>
                  )}
                  {!walletAddress && (
                    <>
                      <BiWalletAlt size={'1.2em'} />
                      <span>Connect</span>
                    </>
                  )}
                </>
              )}
            </ConnectButton>
          </ConnectContainer>
        </Tour>
      )}
      {walletAddress &&
        ReactDOM.createPortal(
          <AccountDetailsModal
            openUserInfos={openUserInfos}
            setOpenUserInfos={setOpenUserInfos}
          />,
          window.document.body,
        )}
      {walletAddress &&
        ReactDOM.createPortal(
          <BackGroundUserInfo
            isOpen={openUserInfos}
            onClick={() => setOpenUserInfos(false)}
            onTouchStart={() => setOpenUserInfos(false)}
          />,
          window.document.body,
        )}
    </>
  );
};

export default ConnectWallet;
