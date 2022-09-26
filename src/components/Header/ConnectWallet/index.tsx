import Copy from '@/components/Copy';
import IconTooltip from '@/components/IconTooltip';
import { useExtension } from 'contexts/extension';
import { useMobile } from 'contexts/mobile';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { MobileNavbarItem } from '..';
import { parseAddress } from '../../../utils';
import {
  ButtonAndCopy,
  ConnectButton,
  ConnectContainer,
  CopyContainer,
  MobileStyledTransfer,
  StyledTransfer,
} from './styles';

const ConnectWallet: React.FC = () => {
  const router = useRouter();

  const {
    walletAddress,
    extensionLoading,
    extensionInstalled,
    connectExtension,
  } = useExtension();

  const { handleMenu } = useMobile();

  const getCreateTransactionButton = useCallback(() => {
    if (extensionInstalled && walletAddress && typeof window !== 'undefined') {
      if (window.innerWidth < 1025) {
        const createTransactionProps = {
          name: 'Create Transaction',
          pathTo: '/create-transaction',
          Icon: MobileStyledTransfer,
          onClick: handleMenu,
        };
        return <MobileNavbarItem {...createTransactionProps} />;
      } else if (window.innerWidth >= 1025) {
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
          <ButtonAndCopy>
            <ConnectButton
              onClick={() => connectExtension()}
              key={String(extensionInstalled)}
            >
              {extensionLoading ? (
                <span> Loading... </span>
              ) : (
                <>
                  {walletAddress && (
                    <span>{parseAddress(walletAddress, 25)}</span>
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
    </>
  );
};

export default ConnectWallet;
