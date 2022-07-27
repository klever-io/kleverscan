import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import {
  ConnectButton,
  ConnectContainer,
  CopyContainer,
  LogoutContainer,
  LogoutIcon,
  MenuTransaction,
  StyledTransfer,
} from './styles';

import { BiTransfer } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { parseAddress } from '../../../utils';

import Copy from '@/components/Copy';
import { useRouter } from 'next/router';
import { MobileNavbarItem } from '..';
import { DropdownContainer, DropdownItem } from '../styles';

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
        setExtensionInstalled(window.kleverWeb !== undefined);

        const interval = setInterval(() => {
          if (window.kleverWeb !== undefined) {
            window.kleverWeb.provider = {
              api:
                process.env.DEFAULT_API_HOST ||
                'https://api.testnet.klever.finance/v1.0',
              node:
                process.env.DEFAULT_NODE_HOST ||
                'https://node.testnet.klever.finance',
            };
            setExtensionInstalled(true);
            clearInterval(interval);
          }
        }, 100);

        const timeout = new Promise(resolve => {
          setTimeout(() => {
            resolve(clearInterval(interval));
          }, 5000);
        });

        await Promise.race([interval, timeout]);

        if (sessionStorage.getItem('walletAddress')) {
          setWalletAddress(sessionStorage.getItem('walletAddress'));

          let interval: any;
          const intervalPromise = new Promise(resolve => {
            interval = setInterval(() => {
              if (window?.kleverWeb?.active !== undefined) {
                if (window?.kleverWeb?.active === false) {
                  window.kleverWeb.initialize();
                  clearInterval(interval);
                  resolve(true);
                }
                if (window?.kleverWeb?.active === true) {
                  clearInterval(interval);
                  resolve(true);
                }
              }
            }, 100);
          });

          const timeout = new Promise(resolve => {
            setTimeout(() => {
              clearInterval(interval);
              resolve(false);
            }, 10000);
          });

          await Promise.race([intervalPromise, timeout]);
        }

        return () => {
          clearInterval(interval);
        };
      }
    };
    init();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('walletAddress');
    setWalletAddress('');

    if (router.pathname.includes('/create-transaction')) {
      handleMenu && handleMenu();
      router.push('/');
    }
  };

  const DropdownDesktop = () => {
    return (
      <DropdownItem>
        <Link href={'/create-transaction'}>
          <a>
            <BiTransfer size={20} />
            <span>Create Transaction</span>
          </a>
        </Link>
      </DropdownItem>
    );
  };

  const handleConnect = async () => {
    if (window.kleverWeb !== undefined) {
      if (!window.kleverWeb.active) {
        setLoading(true);
        await window.kleverWeb.initialize();
        setLoading(false);

        let interval: any;
        const intervalPromise = new Promise(resolve => {
          interval = setInterval(() => {
            if (window.kleverWeb.getWalletAddress() !== '?') {
              resolve(clearInterval(interval));
            }
            window.kleverWeb.getWalletAddress();
          }, 100);
        });

        const timeout = new Promise(resolve => {
          setTimeout(() => {
            resolve(clearInterval(interval));
          }, 2000);
        });

        await Promise.race([intervalPromise, timeout]);

        clearInterval(interval);

        const address: string = window.kleverWeb.getWalletAddress();

        if (address.substring(0, 3) === 'klv') {
          sessionStorage.setItem('walletAddress', address);

          setWalletAddress(address);
        } else {
          toast.error("Please change your extension's network to kleverchain");
        }
      } else if (window.kleverWeb.active) {
        const address: string = window.kleverWeb.getWalletAddress();

        if (address.substring(0, 3) === 'klv') {
          sessionStorage.setItem('walletAddress', address);

          setWalletAddress(address);
        } else {
          toast.error("Please change your extension's network to kleverchain");
        }
      }
    }
  };

  const createTransactionProps = {
    name: 'Create Transaction',
    pathTo: '/create-transaction',
    Icon: StyledTransfer,
    onClick: handleMenu,
  };

  return (
    <>
      {extensionInstalled && (
        <ConnectContainer>
          <ConnectButton
            onClick={handleConnect}
            key={String(extensionInstalled)}
          >
            {loading ? (
              <span> Loading... </span>
            ) : (
              <>
                {walletAddress && (
                  <>
                    <span>{parseAddress(walletAddress, 25)}</span>
                    <DropdownContainer>
                      <MenuTransaction>
                        <DropdownDesktop key={'CreateTransaction'} />
                      </MenuTransaction>
                    </DropdownContainer>
                  </>
                )}
                {!walletAddress && <span>Connect your wallet</span>}
              </>
            )}
          </ConnectButton>
          {extensionInstalled &&
            walletAddress &&
            typeof window !== 'undefined' &&
            window.innerWidth < 1025 && (
              <MobileNavbarItem {...createTransactionProps} />
            )}
          <CopyContainer>
            {walletAddress && (
              <Copy info="Wallet Address" data={walletAddress} />
            )}
          </CopyContainer>
          <LogoutContainer>
            {walletAddress && (
              <LogoutIcon size={24} onClick={() => handleLogout()} />
            )}
          </LogoutContainer>
        </ConnectContainer>
      )}
    </>
  );
};

export default ConnectWallet;
