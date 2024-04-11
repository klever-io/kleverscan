import { AccountDetailsModal } from '@/components/AccountDetailsModal';
import Tour from '@/components/Tour';
import { useWallet, WalletProvider } from '@/contexts/wallet';
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

interface IConnectWallet {
  clickConnection: () => void;
}

const ConnectWallet: React.FC<IConnectWallet> = ({ clickConnection }) => {
  const [openUserInfos, setOpenUserInfos] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);

  const { availableProviders, provider, connectProvider } = useWallet();
  const hasProvider = availableProviders.length > 0;

  const handleClick = () => {
    setIsTutorialOpen(true);
  };
  const closeMenu = () => {
    setIsTutorialOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isTutorialOpen ? 'hidden' : 'visible';
  }, [isTutorialOpen]);

  useScroll(openUserInfos, () => setOpenUserInfos(false));

  const connectAndOpen = () => {
    if (!provider?.getAddress()) {
      setIsProviderModalOpen(true);
    } else {
      setOpenUserInfos(!openUserInfos);
    }
  };

  const connectToProvider = (provider: WalletProvider) => async () => {
    setIsProviderModalOpen(false);
    await connectProvider(provider);
  };

  return (
    <>
      {!hasProvider && (
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
              <span>Connect wallet</span>
            </ConnectButton>
          </ConnectContainer>
          <BackgroundHelper
            onClick={closeMenu}
            onTouchStart={closeMenu}
            opened={isTutorialOpen}
          />
          <WalletHelp
            closeDrawer={() => setIsTutorialOpen(false)}
            opened={isTutorialOpen}
            clickConnectionMobile={clickConnection}
          />
        </>
      )}

      {hasProvider && (
        <Tour
          guideName="connectWallet"
          side="bottom"
          tourTooltip="Now that you connected your wallet, click here to see more options"
          condition={!!provider?.getAddress()}
        >
          <ConnectButton
            onClick={() => connectAndOpen()}
            key={String(hasProvider)}
            walletAddress={!!provider?.getAddress()}
            $loading={provider?.isLoading}
          >
            {provider?.isLoading ? (
              <span style={{ zIndex: 2 }}>Waiting Extension...</span>
            ) : (
              <>
                {!!provider?.getAddress() && (
                  <ConnectedWallet
                    onClick={() => setOpenUserInfos(!openUserInfos)}
                  >
                    <GraySpan>Connected Wallet</GraySpan>
                    <BlackSpan>
                      {parseAddress(provider?.getAddress(), 12)}
                    </BlackSpan>
                  </ConnectedWallet>
                )}
                {!provider?.getAddress() && (
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
      {!!provider?.getAddress() &&
        ReactDOM.createPortal(
          <AccountDetailsModal
            openUserInfos={openUserInfos}
            setOpenUserInfos={setOpenUserInfos}
          />,
          window.document.body,
        )}
      {!!provider?.getAddress() &&
        ReactDOM.createPortal(
          <BackGroundUserInfo
            isOpen={openUserInfos}
            onClick={() => setOpenUserInfos(false)}
            onTouchStart={() => setOpenUserInfos(false)}
          />,
          window.document.body,
        )}
      {isProviderModalOpen &&
        ReactDOM.createPortal(
          <div
            style={{
              // TODO POC styles, create a better modal with the design team
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={e => {
              e.preventDefault();
              if (e.target === e.currentTarget) {
                setIsProviderModalOpen(false);
              }
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '20px',
                zIndex: 8,
              }}
            >
              <h4>Available providers:</h4>
              {availableProviders.map(provider => {
                return (
                  <button
                    style={{
                      backgroundColor: '#aa33b5',
                      color: 'white',
                      padding: '8px',
                      marginTop: '16px',
                    }}
                    key={provider.getProviderName()}
                    onClick={connectToProvider(provider)}
                  >
                    Connect to {provider.getProviderName()}
                  </button>
                );
              })}
            </div>
          </div>,
          window.document.body,
        )}
    </>
  );
};

export default ConnectWallet;
