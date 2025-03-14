import { PropsWithChildren } from 'react';
import { AccountDetailsModal } from '@/components/AccountDetailsModal';
import Tour from '@/components/Tour';
import { useExtension } from '@/contexts/extension';
import { useScroll } from '@/utils/hooks';
import { parseAddress } from '@/utils/parseValues';
import Image from 'next/legacy/image';
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

const ConnectWallet: React.FC<PropsWithChildren<IConnectWallet>> = ({
  clickConnection,
}) => {
  const router = useRouter();
  const autoConnectWallet = router.query?.autoconnect;
  const { isDeviceMobileCheck } = useMobile();
  const [openUserInfos, setOpenUserInfos] = useState(false);
  const {
    walletAddress,
    extensionLoading,
    searchingExtension,
    extensionInstalled,
    connectExtension,
    openDrawer,
    setOpenDrawer,
  } = useExtension();

  const downloadK5 = 'https://onelink.to/455hxv';
  const K5Kleverscan =
    'klever-wallet://dp/browser?link=https://kleverscan.org/?autoconnect=true';

  const handleClick = () => {
    const deviceIsMobile = isDeviceMobileCheck();
    if (deviceIsMobile) {
      goToK5();
      setTimeout(() => {
        GoDownloadWallet();
      }, 1000);
    } else {
      setOpenDrawer(true);
    }
  };

  const goToK5 = () => {
    window.location.href = K5Kleverscan;
  };

  const GoDownloadWallet = () => {
    window.location.href = downloadK5;
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
          <ConnectButton onClick={handleClick} $searching={searchingExtension}>
            <Image
              src="/Wallet.svg"
              alt="Wallet"
              loader={({ src, width }) => `${src}?w=${width}`}
              width={25}
              height={25}
            />
            <span>Connect Wallet</span>
          </ConnectButton>
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
