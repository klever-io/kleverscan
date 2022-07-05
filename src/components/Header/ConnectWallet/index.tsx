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
} from '../styles';

import { BiTransfer } from 'react-icons/bi';
import { parseAddress } from '../../../utils';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';

const ConnectWallet: React.FC = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.kleverchainUrls = {
        api:
          process.env.DEFAULT_API_HOST ||
          'https://api.testnet.klever.finance/v1.0',
        node:
          process.env.DEFAULT_NODE_HOST ||
          'https://node.testnet.klever.finance',
      };

      if (sessionStorage.getItem('walletAddress')) {
        setWalletAddress(sessionStorage.getItem('walletAddress'));
      }

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

      Promise.race([interval, timeout]);

      return () => {
        clearInterval(interval);
      };
    }
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
    <ConnectContainer>
      <ConnectButton onClick={handleConnect} key={String(extensionInstalled)}>
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
            {!walletAddress && extensionInstalled && (
              <span>Connect your wallet</span>
            )}
            {!walletAddress && !extensionInstalled && (
              <span>Download Klever Extension</span>
            )}
          </>
        )}
      </ConnectButton>
      <LogoutContainer>
        {walletAddress && (
          <LogoutIcon size={24} onClick={() => handleLogout()} />
        )}
      </LogoutContainer>
    </ConnectContainer>
  );
};

export default ConnectWallet;
