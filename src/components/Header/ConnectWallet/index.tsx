import React, { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import {
  ConnectButton,
  ConnectContainer,
  DropdownContainer,
  DropdownItem,
  ItemTransaction,
  LogoutContainer,
  LogoutIcon,
  MenuTransaction,
  CopyContainer,
} from '../styles';

import { BiTransfer } from 'react-icons/bi';
import { parseAddress } from '../../../utils';
import { toast } from 'react-toastify';

import Copy from '@/components/Copy';

const ConnectWallet: React.FC = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        window.kleverchainUrls = {
          api:
            process.env.DEFAULT_API_HOST ||
            'https://api.testnet.klever.finance/v1.0',
          node:
            process.env.DEFAULT_NODE_HOST ||
            'https://node.testnet.klever.finance',
        };

        setExtensionInstalled(window.klever !== undefined);

        const interval = setInterval(() => {
          if (window.klever !== undefined) {
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
              if (window?.klever?.active !== undefined) {
                if (window?.klever?.active === false) {
                  window.klever.initialize();
                  clearInterval(interval);
                  resolve(true);
                }
                if (window?.klever?.active === true) {
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

  const preventEvent = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('walletAddress');
    sessionStorage.removeItem('privateKey');
    window.location.reload();
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
    if (window.klever !== undefined) {
      if (!window.klever.active) {
        setLoading(true);
        await window.klever.initialize();
        setLoading(false);

        let interval: any;
        const intervalPromise = new Promise(resolve => {
          interval = setInterval(() => {
            if (window.klever.getWalletAddress() !== '?') {
              resolve(clearInterval(interval));
            }
            window.klever.getWalletAddress();
          }, 100);
        });

        const timeout = new Promise(resolve => {
          setTimeout(() => {
            resolve(clearInterval(interval));
          }, 2000);
        });

        await Promise.race([intervalPromise, timeout]);

        clearInterval(interval);

        const address: string = window.klever.getWalletAddress();

        if (address.substring(0, 3) === 'klv') {
          sessionStorage.setItem('walletAddress', address);

          setWalletAddress(address);
        } else {
          toast.error("Please change your extension's network to kleverchain");
        }
      } else if (window.klever.active) {
        const address: string = window.klever.getWalletAddress();

        if (address.substring(0, 3) === 'klv') {
          sessionStorage.setItem('walletAddress', address);

          setWalletAddress(address);
        } else {
          toast.error("Please change your extension's network to kleverchain");
        }
      }
    }
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
                  <ItemTransaction selected={false}>
                    <span>{parseAddress(walletAddress, 25)}</span>
                    <DropdownContainer>
                      <MenuTransaction>
                        <DropdownDesktop key={'CreateTransaction'} />
                      </MenuTransaction>
                    </DropdownContainer>
                  </ItemTransaction>
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
