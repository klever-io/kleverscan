import { AccountDetailsModal } from '@/components/AccountDetailsModal';
import Tour from '@/components/Tour';
import { useExtension } from '@/contexts/extension';
import { useScroll } from '@/utils/hooks';
import { parseAddress } from '@/utils/parseValues';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import WalletHelp from '../WalletHelp';
import {
  BackgroundHelper,
  BackGroundUserInfo,
  BlackSpan,
  ConnectButton,
  ConnectContainer,
  ConnectedWallet,
  GraySpan,
} from './styles';
import { useRouter } from 'next/router';
import { useMobile } from '@/contexts/mobile';

interface IConnectWallet {
  clickConnection: () => void;
}

const ConnectWallet: React.FC<IConnectWallet> = ({ clickConnection }) => {
  const router = useRouter();
  const autoConnectWallet = router.query?.autoconnect;
  const { isDeviceMobileCheck } = useMobile();
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
    if (isDeviceMobileCheck()) {
      window.location.href = 'https://k5.link/dl/HiIT';
      return;
    }
    setOpenDrawer(true);
  };

  const connectAndOpen = () => {
    if (!walletAddress) {
      connectExtension();
    } else {
      setOpenUserInfos(!openUserInfos);
    }
  };

  const closeMenu = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    if (autoConnectWallet === 'true') {
      connectAndOpen();
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = openDrawer ? 'hidden' : 'visible';
  }, [openDrawer]);

  useScroll(openUserInfos, () => setOpenUserInfos(false));

  return (
    <>
      {!extensionInstalled && (
        <>
          <ConnectContainer>
            <ConnectButton onClick={handleClick}>
              <Image
                src="/Wallet.svg"
                alt="Wallet"
                loader={({ src, width }) => `${src}?w=${width}`}
                width={25}
                height={25}
              />
              <span>Connect Wallet</span>
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
          <ConnectButton
            onClick={() => connectAndOpen()}
            key={String(extensionInstalled)}
            walletAddress={!!walletAddress}
            $loading={extensionLoading}
          >
            {extensionLoading ? (
              <span style={{ zIndex: 2 }}>Waiting Extension...</span>
            ) : (
              <>
                {walletAddress && (
                  <ConnectedWallet
                    onClick={() => setOpenUserInfos(!openUserInfos)}
                  >
                    <GraySpan>Connected Wallet</GraySpan>
                    <BlackSpan>{parseAddress(walletAddress, 12)}</BlackSpan>
                  </ConnectedWallet>
                )}
                {!walletAddress && (
                  <>
                    <Image
                      width={25}
                      height={25}
                      src="/Wallet.svg"
                      alt="Wallet"
                      loader={({ src, width }) => `${src}?w=${width}`}
                    />

                    <span>Connect Wallet</span>
                  </>
                )}
              </>
            )}
          </ConnectButton>
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
