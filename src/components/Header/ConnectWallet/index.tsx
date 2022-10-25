import Copy from '@/components/Copy';
import IconTooltip from '@/components/IconTooltip';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { QRCodeSVG } from 'qrcode.react';
import React, { useCallback, useState } from 'react';
import { MobileNavbarItem } from '..';
import { parseAddress } from '../../../utils';
import {
  ButtonAndCopy,
  ConnectButton,
  ConnectContainer,
  CopyContainer,
  MobileStyledTransfer,
  QRCodeContainer,
  QRCodeContent,
  StyledTransfer,
} from './styles';

const ConnectWallet: React.FC = () => {
  const router = useRouter();
  const [displayQr, setDisplayQr] = useState(false);

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

  return (
    <>
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
            <CopyContainer>
              {walletAddress && (
                <Copy info="Wallet Address" data={walletAddress} />
              )}
            </CopyContainer>
          </ButtonAndCopy>
          {getCreateTransactionButton()}
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
