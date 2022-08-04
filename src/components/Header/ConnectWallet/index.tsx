import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import {
  ConnectButton,
  ConnectContainer,
  CopyContainer,
  LogoutContainer,
  LogoutIcon,
  MenuTransaction,
  MobileStyledTransfer,
  StyledTransfer,
} from './styles';

import { BiTransfer } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { doIf, parseAddress } from '../../../utils';

import Copy from '@/components/Copy';
import { useRouter } from 'next/router';
import { MobileNavbarItem } from '..';
import { DropdownContainer, DropdownItem } from '../styles';
import { useDidUpdateEffect } from '@/utils/hooks';
import IconTooltip from '@/components/IconTooltip';

interface IConnectWalletProps {
  handleMenu?: () => void;
}

const ConnectWallet: React.FC<IConnectWalletProps> = ({ handleMenu }) => {
  const router = useRouter();

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        await doIf(
          () => setExtensionInstalled(true),
          () => handleLogout(),
          () => window.kleverWeb !== undefined,
        );
      }
    };
    init();
  }, []);

  useDidUpdateEffect(() => {
    if (extensionInstalled) {
      handleConnect(true);
    }
  }, [extensionInstalled]);

  const handleLogout = () => {
    if (router.pathname.includes('/create-transaction')) {
      window.innerWidth < 1025 && handleMenu && handleMenu();
      router.push('/');
    }
  };

  const handleConnect = async (silent?: boolean) => {
    if (!walletAddress) {
      window.kleverWeb.provider = {
        api:
          process.env.DEFAULT_API_HOST ||
          'https://api.testnet.klever.finance/v1.0',
        node:
          process.env.DEFAULT_NODE_HOST ||
          'https://node.testnet.klever.finance',
      };

      try {
        setLoading(true);
        await window.kleverWeb.initialize();
        setLoading(false);

        const address: string = await window.kleverWeb.getWalletAddress();

        if (address.startsWith('klv') && address.length === 62) {
          setWalletAddress(address);
        } else {
          !silent &&
            toast.error(
              'Invalid wallet address, please switch to a klv wallet',
            );
        }
      } catch (e) {
        setLoading(false);
        !silent && toast.error(String(e).split(':')[1]);
      }
    }
  };

  const getCreateTransactionButton = () => {
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
  };

  return (
    <>
      {extensionInstalled && (
        <ConnectContainer>
          <ConnectButton
            onClick={() => handleConnect()}
            key={String(extensionInstalled)}
          >
            {loading ? (
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
          {getCreateTransactionButton()}
          <CopyContainer>
            {walletAddress && (
              <Copy info="Wallet Address" data={walletAddress} />
            )}
          </CopyContainer>
        </ConnectContainer>
      )}
    </>
  );
};

export default ConnectWallet;
